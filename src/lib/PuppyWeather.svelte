<script lang="ts">
  import { onMount } from 'svelte';
  import { DateTime } from 'luxon';

  export let title: string = 'Current puppy weather';

  // try fetching from puppycam-sensor!
  // TODO: update to https://sensor.turehounds.com/sensors
  const sensorApi = 'https://puppycam-sensor.spudnoggin.com/sensor';

  let sample: any;
  let observed: string;
  let observedRel: string | null;
  let temperature: number;
  let humidity: number;
  let checkDate: string;

  const dateFmt = {
    ...DateTime.DATETIME_SHORT,
    timeZoneName: 'short',
  } as const;

  async function updateWeather() {
    checkDate = DateTime.local().toLocaleString(dateFmt);

    try {
      const response = await fetch(sensorApi);
      sample = await response.json();

      temperature = sample.temperature;
      humidity = sample.humidity;
      updateTimes();
    } catch (err) {
      console.log('unable to fetch... no weather data');
    }
  }

  function updateTimes() {
    if (sample) {
      const obs = DateTime.fromISO(sample.observed);
      observed = obs.toLocaleString(dateFmt);
      observedRel = obs.toRelative({ unit: 'seconds' });
    }
  }

  onMount(() => {
    updateWeather();
    const interval = setInterval(updateWeather, 30 * 1000);
    const interval2 = setInterval(updateTimes, 1 * 1000);
    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  });
</script>

<div>
  {#if observed}
    {#if title}
      <h3>{title}</h3>
    {/if}

    <div class="weather">
      <div class="temperature">{temperature}</div>
      <div class="humidity">{humidity}</div>
    </div>
    <div class="meta">
    <div>Measured: {observed}</div>
    <!-- <div>({observedRel})</div> -->
    <div>Last checked: {checkDate}</div>
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
