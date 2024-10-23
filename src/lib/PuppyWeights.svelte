<script lang="ts">
  import { extent, max, mean } from 'd3-array';
  import { scaleTime, scaleLinear } from 'd3-scale';
  import type { ScaleTime, ScaleLinear } from 'd3-scale';
  import { timeDay } from 'd3-time';
  import type { CountableTimeInterval } from 'd3-time';
  import { line, symbol, curveCatmullRom } from 'd3-shape';
  import type { Line, Symbol } from 'd3-shape';

  import { DateTime } from 'luxon';

  import Axis from './Axis.svelte';

  import { state as puppyState } from './puppy-data.svelte.js';
  import {
    formatPoundsOunces,
    gramsToOunces,
    properName,
  } from './puppy-data-utils.js';
  import type { DogInfo } from './puppy-data-utils.js';
  import type { AxisDomain, AxisScale } from 'd3-axis';

  // I originally tried to create a "LineChart" component, but there's so much
  // styling specific to *this* chart that it makes more sense to do this as a
  // one-off.  (This jives with the whole point of D3, frankly.)

  interface DataPoint {
    date: Date;
    value: number;
  }

  interface Series {
    collar: string;
    label: string;
    points: DataPoint[];
  }

  // To calculate the "target growth", we start from the "average birth" and
  // double the weight over the course of 1 week.
  let dogs: DogInfo[] = $state([]);
  let allSeries: Series[] = $state([]);
  // To calculate the "target growth", we start from the "average birth" and
  // double the weight over the course of 1 week.
  let averageBirthPoint: DataPoint = $state({ date: new Date(), value: 0 });
  let averageDoublePoint: DataPoint = $state({ date: new Date(), value: 0 });

  let flatPoints: DataPoint[] = $state([]);

  // For the purposes of "nice looking" charts, we want a fundamental unit which
  // is a "nicely formatted" value... we use 1/8oz as that minimum, so the raw
  // value for the y axis is "eighth of an ounce". (We need an axis tick
  // formatter as well!)
  //
  // Note: this really needs to change over time... when the puppies were small,
  // we used '8' (as described above, to get 1/8oz => 1).  As they got bigger,
  // we switched to '1' for a "1oz" fundamental unit.  Now that they are 4-5
  // pounds,we want a tick every 1/2 pound (8oz), so we want a 1/8 multiplier.
  const ounceMultiplier = 1 / 8;
  $effect(() => {
    dogs = puppyState.data.dogs;

    allSeries = dogs.map((dog) => ({
      collar: dog.collar,
      label: properName(dog),
      points: dog.weights.map(
        ([date, weight]) =>
          ({
            date: date.toJSDate(),
            value: gramsToOunces(weight) * ounceMultiplier,
          }) as DataPoint
      ),
    }));

    if (allSeries.length > 0) {
      averageBirthPoint = {
        date: DateTime.fromMillis(
          mean(allSeries, (s) => s.points[0].date.valueOf())!
        ).toJSDate(),
        value: mean(allSeries, (s) => s.points[0].value)!,
      };

      averageDoublePoint = {
        date: DateTime.fromJSDate(averageBirthPoint.date)
          .plus({ weeks: 1 })
          .toJSDate(),
        value: averageBirthPoint.value * 2,
      };

      // In order to calculate the full chart extents, we need a flattened version
      // of the points.
      flatPoints = allSeries.map(({ points }) => points).flat();

      // We also include the "target growth" points...
      flatPoints.push(averageBirthPoint, averageDoublePoint);
    } else {
      flatPoints = [];
    }
  });

  // TODO: come up with a useful "rect"?  I suspect the margin should *not* be
  // a part of it, since that conflates the meaning of "width", etc.

  const chart: {
    margin: number;
    width: number | undefined;
    height: number | undefined;
    left: number;
    top: number;
    right: number | undefined;
    bottom: number | undefined;
  } = $state({
    margin: 60,

    width: undefined,
    height: undefined,

    // computed inner values
    left: 40,
    top: 40,
    right: undefined,
    bottom: undefined,
  });

  const legend: {
    margin: number;
    lineHeight: number;
    width: number | undefined;
    height: number | undefined;
    left: number | undefined;
    top: number | undefined;
    right: number | undefined;
    bottom: number | undefined;
  } = $state({
    margin: 10,
    lineHeight: 20,

    width: 150,
    height: undefined,

    // computed inner values
    left: undefined,
    top: undefined,
    right: undefined,
    bottom: undefined,
  });

  // TODO: There *must* be a better way to do this!
  $effect(() => {
    // use golden rule for height?
    chart.height = (chart.width ?? 0) * 0.6;

    // bounds...
    //   chart.left = chart.margin;
    //   chart.top = chart.margin;
    chart.right = (chart.width ?? 0) - chart.margin;
    chart.bottom = (chart.height ?? 0) - chart.margin;

    legend.height = (dogs.length + 2) * legend.lineHeight;
    legend.right = (chart.right ?? 0) - legend.margin;
    legend.bottom = (chart.bottom ?? 0) - legend.margin;
    legend.left = (legend.right ?? 0) - (legend.width ?? 0);
    legend.top = (legend.bottom ?? 0) - (legend.height ?? 0);
  });

  let xScale: ScaleTime<number, number> =  $derived(scaleTime()
        .domain(extent(flatPoints, ({ date }) => date) as [Date, Date])
        .range([chart.margin, (chart.width ?? 0) - chart.margin])
        // timeDay.every() *ought* to be correct...
        .nice(timeDay.every(1) as unknown as CountableTimeInterval));

  let yScale: ScaleLinear<number, number> = $derived(scaleLinear()
        .domain([0, max(flatPoints, ({ value }) => +value)] as [number, number])
        .range([(chart.height ?? 0) - chart.margin, chart.margin])
        .nice());

  let lineGenerator: Line<DataPoint> = $derived(line<DataPoint>()
        .x(({ date }) => xScale(date))
        .y(({ value }) => yScale(+value))
        .curve(curveCatmullRom));

  let symbolGenerator: Symbol<unknown, DataPoint> = symbol().size(32);

  // should the incoming data be x/y instead of date/value?
  // $: {
  //   if (flatPoints.length > 0) {
  //     xScale = scaleTime()
  //       .domain(extent(flatPoints, ({ date }) => date) as [Date, Date])
  //       .range([chart.margin, (chart.width ?? 0) - chart.margin])
  //       // timeDay.every() *ought* to be correct...
  //       .nice(timeDay.every(1) as unknown as CountableTimeInterval);

  //     yScale = scaleLinear()
  //       .domain([0, max(flatPoints, ({ value }) => +value)] as [number, number])
  //       .range([(chart.height ?? 0) - chart.margin, chart.margin])
  //       .nice();

  //     lineGenerator = line<DataPoint>()
  //       .x(({ date }) => xScale(date))
  //       .y(({ value }) => yScale(+value))
  //       .curve(curveCatmullRom);

  //     // This doesn't need to be recalculated!
  //     symbolGenerator = symbol().size(32);
  //   }
  // }
</script>

<div bind:clientWidth={chart.width}>
  {#if chart.width}
    <svg width={chart.width} height={chart.height}>
      <text
        class="title"
        transform="translate({(chart.left + (chart.right ?? 0)) / 2},20)"
        >Puppy weights over time</text
      >

      {#if xScale}
        <Axis
          height={chart.height}
          margin={chart.margin}
          scale={xScale as AxisScale<AxisDomain>}
          position="bottom"
        />
      {/if}
      {#if yScale}
        <Axis
          height={chart.height}
          margin={chart.margin}
          scale={yScale as AxisScale<AxisDomain>}
          position="left"
          tickFormatter={(value) =>
            formatPoundsOunces(value / ounceMultiplier / 16)}
        />

        <!-- <text
          class="axis-label-left"
          transform="translate(10,{(chart.top + chart.bottom) / 2}) rotate(-90)"
          >weight (pounds, ounces)</text
        > -->
      {/if}

      <!-- include the target growth line... -->
      {#if averageBirthPoint && averageDoublePoint}
        <path
          d={lineGenerator([averageBirthPoint, averageDoublePoint])}
          class="target"
        />
      {/if}
      {#each allSeries as series}
        <path
          d={lineGenerator(series.points)}
          class="line stroke-{series.collar}"
        />
        {#each series.points as point}
          <g transform="translate({xScale(point.date)}, {yScale(point.value)})">
            <path d={symbolGenerator()} class="point fill-{series.collar}" />
          </g>
        {/each}
      {/each}

      <!-- legend, bottom-right, only with width >= 450 -->
      {#if (chart.right ?? 0) - chart.left >= 450}
        <g class="legend" transform="translate({legend.left}, {legend.top})">
          <rect
            class="border"
            x="0"
            y="0"
            width={(legend.right ?? 0) - (legend.left ?? 0)}
            height={(legend.bottom ?? 0) - (legend.top ?? 0)}
          />
          <!-- inner margin! -->
          <g transform="translate({legend.margin}, {legend.margin * 1.5})">
            {#each allSeries as series, i}
              <!-- svelte-ignore component_name_lowercase -->
              <line
                x1="0"
                y1={i * legend.lineHeight}
                x2="30"
                y2={i * legend.lineHeight}
                class="line stroke-{series.collar}"
              />
              <g transform="translate(15, {i * legend.lineHeight})">
                <path
                  d={symbolGenerator()}
                  class="point fill-{series.collar}"
                />
              </g>

              <text
                x="40"
                y={i * legend.lineHeight}
                class="fill-{series.collar}">{series.label}</text
              >
            {/each}

            <!-- svelte-ignore component_name_lowercase -->
            <line
              x1="0"
              y1={(dogs.length + 0.5) * legend.lineHeight}
              x2="30"
              y2={(dogs.length + 0.5) * legend.lineHeight}
              class="target"
            />
            <text
              x="40"
              y={(dogs.length + 0.5) * legend.lineHeight}
              class="target-label">target growth</text
            >
          </g>
        </g>
      {/if}

      <!-- margin... -->
      <!-- <rect
        x={chart.left}
        y={chart.top}
        width={chart.right - chart.left}
        height={chart.bottom - chart.top}
      /> -->
    </svg>
  {/if}
</div>

<style lang="postcss">
  .title {
    font-size: 16px;
    font-weight: 600;
    text-anchor: middle;
  }

  .axis-label-left {
    font-size: 12px;
    font-weight: 600;
    text-anchor: middle;
  }

  .target {
    stroke-width: 1;
    fill: none;
    stroke: hsl(0, 0%, 80%);
    stroke-dasharray: 1em 0.5em;
  }

  .target-label {
    font-style: italic;
  }

  .line {
    stroke-width: 2.5;
    fill: none;
  }

  .legend {
    font-size: 12px;
    dominant-baseline: middle;
  }

  .border {
    stroke: hsl(0, 0%, 80%);
    fill: none;
  }
</style>
