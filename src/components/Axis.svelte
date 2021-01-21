<script context="module" lang="ts">
  export type TickFormatter = (value: number) => string;
</script>

<script lang="ts">
  import { select /* , selectAll */ } from "d3-selection";
  import { axisBottom, axisLeft } from "d3-axis";
  import type { Axis, AxisDomain, AxisScale } from "d3-axis";

  // export let width: number = undefined;
  export let height: number = undefined;
  export let margin: number = undefined;
  export let position: string = undefined;
  export let scale: AxisScale<AxisDomain> = undefined;
  export let tickFormatter: TickFormatter = undefined;

  let transform;
  let g;

  $: {
    select(g).selectAll("*").remove();

    let axis: Axis<AxisDomain>;
    switch (position) {
      case "bottom":
        axis = axisBottom(scale).tickSizeOuter(0);
        transform = `translate(0, ${height - margin})`;
        break;
      case "left":
        axis = axisLeft(scale).tickSizeOuter(0);
        transform = `translate(${margin}, 0)`;
    }

    if (tickFormatter) {
      axis.tickFormat(tickFormatter);
    }

    select(g).call(axis).style("font-family", "inherit");
  }
</script>

<g class="axis" bind:this={g} {transform} />
