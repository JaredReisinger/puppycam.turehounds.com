<script lang="ts">
  import { extent, max, mean } from "d3-array";
  import { scaleTime, scaleLinear } from "d3-scale";
  import type { ScaleTime, ScaleLinear } from "d3-scale";
  import { timeDay } from "d3-time";
  import { line, symbol, curveCatmullRom } from "d3-shape";
  import type { Line, Symbol } from "d3-shape";

  import { DateTime } from "luxon";

  import Axis from "./Axis.svelte";

  import { store as dataStore } from "./puppy-data.js";
  import {
    formatPoundsOunces,
    gramsToOunces,
    properName,
  } from "./puppy-data-utils.js";
  import type { DogInfo } from "./puppy-data-utils.js";

  // I orginally tried to create a "LineChart" component, but there's so much
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
  let dogs: DogInfo[] = [];
  let allSeries: Series[] = [];
  // To calculate the "target growth", we start from the "average birth" and
  // double the weight over the course of 1 week.
  let averageBirthPoint: DataPoint;
  let averageDoublePoint: DataPoint;

  let flatPoints: DataPoint[];

  // For the purposes of "nice looking" charts, we want a fundamental unit which
  // is a "nicely formatted" value... we use 1/8oz as that minimum, so the raw
  // value for the y axis is "eighth of an ounce". (We need an axis tick
  // formatter as well!)
  const ounceMultiplier = 1;
  $: {
    dogs = $dataStore.puppyData ? $dataStore.puppyData.dogs : [];

    allSeries = dogs.map((dog) => ({
      collar: dog.collar,
      label: properName(dog),
      points: dog.weights.map(
        ([date, weight]) =>
          ({
            date: date.toJSDate(),
            value: gramsToOunces(weight) * ounceMultiplier,
          } as DataPoint)
      ),
    }));

    if (allSeries.length > 0) {
      averageBirthPoint = {
        date: DateTime.fromMillis(
          mean(allSeries, (s) => s.points[0].date.valueOf())
        ).toJSDate(),
        value: mean(allSeries, (s) => s.points[0].value),
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
  }

  // TODO: come up with a useful "rect"?  I suspect the margin should *not* be
  // a part of it, since that conflates the meaning of "width", etc.

  const chart = {
    margin: 50,

    width: undefined,
    height: undefined,

    // computed inner values
    left: 40,
    top: 40,
    right: undefined,
    bottom: undefined,
  };

  const legend = {
    margin: 10,
    lineHeight: 20,

    width: 150,
    height: undefined,

    // computed inner values
    left: undefined,
    top: undefined,
    right: undefined,
    bottom: undefined,
  };

  // use golden rule for height?
  $: chart.height = chart.width * 0.6;

  // bounds...
  //   $: chart.left = chart.margin;
  //   $: chart.top = chart.margin;
  $: chart.right = chart.width - chart.margin;
  $: chart.bottom = chart.height - chart.margin;

  $: legend.height = (dogs.length + 2) * legend.lineHeight;
  $: legend.right = chart.right - legend.margin;
  $: legend.bottom = chart.bottom - legend.margin;
  $: legend.left = legend.right - legend.width;
  $: legend.top = legend.bottom - legend.height;

  let xScale: ScaleTime<number, number>;
  let yScale: ScaleLinear<number, number>;
  let lineGenerator: Line<DataPoint>;
  let symbolGenerator: Symbol<unknown, DataPoint>;

  // should the incoming data be x/y instead of date/value?
  $: {
    if (flatPoints.length > 0) {
      xScale = scaleTime()
        .domain(extent(flatPoints, ({ date }) => date))
        .range([chart.margin, chart.width - chart.margin])
        .nice(timeDay.every(1));

      yScale = scaleLinear()
        .domain([0, max(flatPoints, ({ value }) => +value)])
        .range([chart.height - chart.margin, chart.margin])
        .nice();

      lineGenerator = line<DataPoint>()
        .x(({ date }) => xScale(date))
        .y(({ value }) => yScale(+value))
        .curve(curveCatmullRom);

      // This doesn't need to be recalculated!
      symbolGenerator = symbol().size(32);
    }
  }
</script>

<div bind:clientWidth={chart.width}>
  {#if chart.width}
    <svg width={chart.width} height={chart.height}>
      <text
        class="title"
        transform="translate({(chart.left + chart.right) / 2},20)"
        >Puppy weights over time</text
      >

      {#if xScale}
        <Axis
          height={chart.height}
          margin={chart.margin}
          scale={xScale}
          position="bottom"
        />
      {/if}
      {#if yScale}
        <Axis
          height={chart.height}
          margin={chart.margin}
          scale={yScale}
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
      {#if chart.right - chart.left >= 450}
        <g class="legend" transform="translate({legend.left}, {legend.top})">
          <rect
            class="border"
            x="0"
            y="0"
            width={legend.right - legend.left}
            height={legend.bottom - legend.top}
          />
          <!-- inner margin! -->
          <g transform="translate({legend.margin}, {legend.margin * 1.5})">
            {#each allSeries as series, i}
              <!-- svelte-ignore component-name-lowercase -->
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

            <!-- svelte-ignore component-name-lowercase -->
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

<style type="scss">
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
