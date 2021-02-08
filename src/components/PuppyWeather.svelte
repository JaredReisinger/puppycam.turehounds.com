<script lang="ts">
  import { onMount } from "svelte";
  import { DateTime } from "luxon";

  export let title: string = "Current puppy weather";

  // try fetching from puppycam-sensor!
  const sensorApi = "https://puppycam-sensor.spudnoggin.com/sensor";

  let sample: any;
  let observed: string;
  let observedRel: string;
  let temperature: number;
  let humidity: number;
  let checkDate: string;

  const dateFmt = { ...DateTime.DATETIME_SHORT, timeZoneName: "short" };

  async function updateWeather() {
    checkDate = DateTime.local().toLocaleString(dateFmt);

    try {
      const response = await fetch(sensorApi);
      sample = await response.json();

      temperature = sample.temperature;
      humidity = sample.humidity;
      updateTimes();
    } catch (err) {
      console.log("unable to fetch... no weather data");
    }
  }

  function updateTimes() {
    if (sample) {
      const obs = DateTime.fromISO(sample.observed);
      observed = obs.toLocaleString(dateFmt);
      observedRel = obs.toRelative({ unit: "seconds" });
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

{#if observed}
  {#if title}
    <h3>{title}</h3>
  {/if}

  <div class="weather">
    <div class="temperature">{temperature}</div>
    <div class="humidity">{humidity}</div>
  </div>
  <div class="note">Weather measured at {observed} ({observedRel})</div>
  <p class="note">
    Checked for updates at {checkDate}.
  </p>
{/if}

<style type="scss">
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
    content: "°F";
  }

  .humidity::after {
    content: "% RH";
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
