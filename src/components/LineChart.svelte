<script context="module" lang="ts">
  export interface DataPoint {
    date: Date;
    value: number;
  }

  export interface Series {
    color: string;
    label: string;
    points: DataPoint[];
  }
</script>

<script lang="ts">
  import { extent, max } from "d3-array";
  import { scaleTime, scaleLinear } from "d3-scale";
  import type { ScaleTime, ScaleLinear } from "d3-scale";
  import { timeDay } from "d3-time";
  import { line, symbol, curveCatmullRom } from "d3-shape";
  import type { Line, Symbol } from "d3-shape";

  import Axis from "./Axis.svelte";

  export let data: Series[] = undefined;
  export let minXMax: Date;
  export let minYMax: number;

  let height = 400;
  const margin = 40;

  let width: number;
  let xScale: ScaleTime = undefined;
  let yScale: ScaleLinear;
  let lineGenerator: Line;
  let symbolGenerator: Symbol;

  // use golden rule for height?
  $: height = width * 0.6;

  // should the incoming data be x/y instead of date/value?

  $: {
    // all the series need to be examined for min/max
    // console.log("data:", data);
    const allPoints = data.map(({ points }) => points).flat();
	// console.log("allPoints:", allPoints);
	
	// Add bogus points to force the scale domain, if provided...
	if (minXMax) {
		allPoints.push({ date: minXMax, value: allPoints[0].value});
	}

	if (minYMax) {
		allPoints.push({date: allPoints[0].date, value: minYMax});
	}

    xScale = scaleTime()
      .domain(extent(allPoints, ({ date }) => date))
      .range([margin, width - margin])
      .nice(timeDay.every(1));
	// I thought we'd want a custom tickFormat, but with a "nice" range, I think
	// we're okay.

    yScale = scaleLinear()
      .domain([0, max(allPoints, ({ value }) => +value)])
      .range([height - margin, margin]);

    lineGenerator = line()
      .x(({ date }) => xScale(date))
      .y(({ value }) => yScale(+value))
      .curve(curveCatmullRom);

    symbolGenerator = symbol().size(32);
  }
</script>

<div bind:clientWidth={width}>
  {#if width}
    <svg {width} {height}>
      <Axis {width} {height} {margin} scale={xScale} position="bottom" />
      <Axis {width} {height} {margin} scale={yScale} position="left" />
      {#each data as series}
        <path
          d={lineGenerator(series.points)}
          stroke={series.color}
          stroke-width="3"
          stroke-linecap="round"
          fill="none"
        />
        {#each series.points as point}
          <g transform="translate({xScale(point.date)}, {yScale(point.value)})">
            <path d={symbolGenerator()} fill={series.color} />
          </g>
        {/each}
      {/each}
    </svg>
  {/if}
</div>
