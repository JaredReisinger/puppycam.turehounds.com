<script module lang="ts">
  // export type TickFormatter = (value: number, index: number) => string;
</script>

<script lang="ts">
  import { select /* , selectAll */ } from 'd3-selection';
  import { axisBottom, axisLeft } from 'd3-axis';
  import type { Axis, AxisDomain, AxisScale } from 'd3-axis';

  /*export*/ type TickFormatter = (value: number) => string;

  // export let width: number = undefined;
  // export let height: number | undefined = undefined;
  // export let margin: number; // = undefined;
  // export let position: 'bottom' | 'left'; // string;// = undefined;
  // export let scale: AxisScale<AxisDomain>; // = undefined;
  // export let tickFormatter: TickFormatter | undefined = undefined;

  let {
    height = 0,
    margin = 0,
    position,
    scale,
    tickFormatter = undefined,
  }: {
    height: number;
    margin: number;
    position: 'bottom' | 'left';
    scale: AxisScale<AxisDomain>;
    tickFormatter?: TickFormatter;
  } = $props();

  let transform = $state('');
  let g: SVGElement;

  $effect(() => {
    select(g).selectAll('*').remove();

    let axis: Axis<AxisDomain>;
    switch (position) {
      case 'bottom':
        axis = axisBottom(scale).tickSizeOuter(0);
        transform = `translate(0, ${(height ?? 0) - margin})`;
        break;
      case 'left':
        axis = axisLeft(scale).tickSizeOuter(0);
        transform = `translate(${margin}, 0)`;
    }

    if (tickFormatter) {
      axis.tickFormat((val: AxisDomain): string => {
        if (typeof val === 'object' && 'valueOf' in val) {
          val = val.valueOf();
        }

        if (typeof val === 'number') {
          return tickFormatter(val);
        }

        return val as string;
      });
    }

    // @ts-expect-error axis mismatch, but it's not!
    select(g).call(axis).style('font-family', 'inherit');
  });
</script>

<g class="axis" bind:this={g} {transform} />
