<script lang="ts">
  import { onMount } from 'svelte';
  import { DateTime, Duration } from 'luxon';

  import { shortFmt } from '$lib/datetime.js';
  import { state as weatherState } from '$lib/weather.svelte.js';

  let { title = 'Current puppy weather' }: { title: string } = $props();

  let { temperature, humidity, observed } = $derived(weatherState.data);

  // handle stale temperature observations... we only care after 5 minutes

  let now = $state(DateTime.local());

  function updateNow() {
    now = DateTime.local();
  }

  onMount(() => {
    const timer = setInterval(updateNow, Duration.fromISO('PT5M').toMillis());
    return () => {
      clearInterval(timer);
    };
  });

  // Sadly, Duration.toHuman() and DateTime.toRelative() are *completely*
  // different sets of behavior.  We use `now` only to force the recalculation.
  let elapsed = $derived(
    observed &&
      observed.plus({ minutes: 5 }).toMillis() <= now.toMillis() &&
      observed.toRelative()
  );
</script>

<div>
  {#if title}
    <h3>{title}</h3>
  {/if}

  {#if observed}
    <div class="weather">
      <div class="temperature">{temperature?.toFixed(1)}</div>
      <div class="humidity">{humidity?.toFixed(1)}</div>
    </div>
    <div class="meta">
      <div>
        Measured: {observed.toLocaleString(shortFmt)}
        {#if elapsed}
          ({elapsed})
        {/if}
      </div>
      <div>
        Last checked: {weatherState.lastChecked?.toLocaleString(shortFmt) ??
          '...'}
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .weather {
    max-width: 14em;
    display: flex;
    justify-content: space-evenly;
    margin: 1em 0;
    font-size: 120%;
    font-weight: 600;
  }

  /*.temperature,
  .humidity {
    font-weight: bold;
  }*/

  .temperature::after {
    content: '°F';
  }

  .humidity::after {
    content: '% RH';
  }

  /*.observed {
    font-size: 80%;
    font-style: italic;
    font-weight: 400;
    color: hsl(0, 0%, 50%);
  }

  h3 .observed {
    font-size: 70%;
  }*/
</style>
