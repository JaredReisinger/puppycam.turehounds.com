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

  // To calculate the "target growth", we start from the "average birth" and
  // double the weight over the course of 1 week.
  let dogs: DogInfo[] = $derived(puppyState.data.dogs);

  let allSeries: Series[] = $derived(
    dogs.map((dog) => ({
      collar: dog.collar,
      label: properName(dog),
      points: dog.weights.map(
        ([date, weight]) =>
          ({
            date: date.toJSDate(),
            value: gramsToOunces(weight) * ounceMultiplier,
          }) as DataPoint
      ),
    }))
  );
  // To calculate the "target growth", we start from the "average birth" and
  // double the weight over the course of 1 week.
  const unknownPoint = { date: new Date(), value: 0 };

  let averageBirthPoint: DataPoint = $derived(
    allSeries?.length > 0
      ? {
          date: DateTime.fromMillis(
            mean(allSeries, (s) => s.points[0].date.valueOf())!
          ).toJSDate(),
          value: mean(allSeries, (s) => s.points[0].value)!,
        }
      : unknownPoint
  );

  let averageDoublePoint: DataPoint = $derived(
    allSeries?.length > 0
      ? {
          date: DateTime.fromJSDate(averageBirthPoint.date)
            .plus({ weeks: 1 })
            .toJSDate(),
          value: averageBirthPoint.value * 2,
        }
      : unknownPoint
  );

  let flatPoints: DataPoint[] = $derived(
    allSeries?.length > 0
      ? [
          ...allSeries.map(({ points }) => points).flat(),
          averageBirthPoint,
          averageDoublePoint,
        ]
      : []
  );

  // TODO: come up with a useful "rect"?  I suspect the margin should *not* be
  // a part of it, since that conflates the meaning of "width", etc.

  // TODO: Rather than a complex object, maybe flatten these values out to make
  // calculating the derived values easier?  That would be more evident the
  // interactions between them.

  const chartMargin = 60;
  let chartWidth = $state(0); // bound to HTML client width
  let chartHeight = $derived(chartWidth * 0.6); // golden ratio
  const chartLeft = 40;
  // const chartTop = 40;
  let chartRight = $derived(chartWidth - chartMargin);
  let chartBottom = $derived(chartHeight - chartMargin);

  const legendMargin = 10;
  const legendLineHeight = 20;
  const legendWidth = 150;
  let legendHeight = $derived((dogs.length + 2) * legendLineHeight);
  let legendRight = $derived(chartRight - legendMargin);
  let legendBottom = $derived(chartBottom - legendMargin);
  let legendLeft = $derived(legendRight - legendWidth);
  let legendTop = $derived(legendBottom - legendHeight);

  let xScale: ScaleTime<number, number> = $derived(
    scaleTime()
      .domain(extent(flatPoints, ({ date }) => date) as [Date, Date])
      .range([chartMargin, chartWidth - chartMargin])
      // timeDay.every() *ought* to be correct...
      .nice(timeDay.every(1) as unknown as CountableTimeInterval)
  );

  let yScale: ScaleLinear<number, number> = $derived(
    scaleLinear()
      .domain([0, max(flatPoints, ({ value }) => +value)] as [number, number])
      .range([chartHeight - chartMargin, chartMargin])
      .nice()
  );

  let lineGenerator: Line<DataPoint> = $derived(
    line<DataPoint>()
      .x(({ date }) => xScale(date))
      .y(({ value }) => yScale(+value))
      .curve(curveCatmullRom)
  );

  const symbolGenerator: Symbol<unknown, DataPoint> = symbol().size(32);
</script>

<div bind:clientWidth={chartWidth}>
  {#if chartWidth > 0}
    <svg width={chartWidth} height={chartHeight}>
      <text
        class="title"
        transform="translate({(chartLeft + chartRight) / 2},20)"
        >Puppy weights over time</text
      >

      {#if xScale}
        <Axis
          height={chartHeight}
          margin={chartMargin}
          scale={xScale as AxisScale<AxisDomain>}
          position="bottom"
        />
      {/if}
      {#if yScale}
        <Axis
          height={chartHeight}
          margin={chartMargin}
          scale={yScale as AxisScale<AxisDomain>}
          position="left"
          tickFormatter={(value) =>
            formatPoundsOunces(value / ounceMultiplier / 16)}
        />

        <!-- <text
          class="axis-label-left"
          transform="translate(10,{(chartTop + chartBottom) / 2}) rotate(-90)"
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
          class="line stroke-current {series.collar}"
        />
        {#each series.points as point}
          <g transform="translate({xScale(point.date)}, {yScale(point.value)})">
            <path
              d={symbolGenerator()}
              class="point fill-current {series.collar}"
            />
          </g>
        {/each}
      {/each}

      <!-- legend, bottom-right, only with width >= 450 -->
      {#if (chartRight ?? 0) - chartLeft >= 450}
        <g class="legend" transform="translate({legendLeft}, {legendTop})">
          <rect
            class="border"
            x="0"
            y="0"
            width={(legendRight ?? 0) - (legendLeft ?? 0)}
            height={(legendBottom ?? 0) - (legendTop ?? 0)}
          />
          <!-- inner margin! -->
          <g transform="translate({legendMargin}, {legendMargin * 1.5})">
            {#each allSeries as series, i}
              <!-- svelte-ignore component_name_lowercase -->
              <line
                x1="0"
                y1={i * legendLineHeight}
                x2="30"
                y2={i * legendLineHeight}
                class="line stroke-current {series.collar}"
              />
              <g transform="translate(15, {i * legendLineHeight})">
                <path
                  d={symbolGenerator()}
                  class="point fill-current {series.collar}"
                />
              </g>

              <text x="40" y={i * legendLineHeight} class="fill-{series.collar}"
                >{series.label}</text
              >
            {/each}

            <!-- svelte-ignore component_name_lowercase -->
            <line
              x1="0"
              y1={(dogs.length + 0.5) * legendLineHeight}
              x2="30"
              y2={(dogs.length + 0.5) * legendLineHeight}
              class="target"
            />
            <text
              x="40"
              y={(dogs.length + 0.5) * legendLineHeight}
              class="target-label">target growth</text
            >
          </g>
        </g>
      {/if}

      <!-- margin... -->
      <!-- <rect
        x={chartLeft}
        y={chartTop}
        width={chartRight - chartLeft}
        height={chartBottom - chartTop}
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
