<script lang="ts">
  import { select /* , selectAll */ } from "d3-selection";
  import { axisBottom, axisLeft } from "d3-axis";
  import type { Scale } from "d3-scale";

  export let width: number = undefined;
  export let height: number = undefined;
  export let margin: number = undefined;
  export let position: string = undefined;
  export let scale: Scale = undefined;

  let transform;
  let g;

  $: {
    select(g).selectAll("*").remove();
    let axis;
    switch (position) {
      case "bottom":
        axis = axisBottom(scale).tickSizeOuter(0);
        transform = `translate(0, ${height - margin})`;
        break;
      case "left":
        axis = axisLeft(scale).tickSizeOuter(0);
        transform = `translate(${margin}, 0)`;
    }
    select(g).call(axis).style("font-family", "inherit");
  }
</script>

<g class="axis" bind:this={g} {transform} />
