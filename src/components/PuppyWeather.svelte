<script lang="ts">
    import { onMount } from "svelte";
    import { DateTime } from "luxon";

    export let title: string = undefined;

    // try fetching from puppycam-sensor!
    const sensorApi = "https://puppycam-sensor.spudnoggin.com/sensor";

    let observed: DateTime;
    let temperature: number;
    let humidity: number;

    const dateFmt = { ...DateTime.DATETIME_SHORT, timeZoneName: "short" };

    async function updateWeather() {
        const sample = await (await fetch(sensorApi)).json();

        observed = DateTime.fromISO(sample.observed).toLocaleString(dateFmt);
        temperature = sample.temperature;
        humidity = sample.humidity;
    }

    onMount(() => {
        updateWeather();
        const interval = setInterval(updateWeather, 30 * 1000);
        return () => {
            clearInterval(interval);
        };
    });
</script>

<style>
    .weather {
        max-width: 14em;
        display: flex;
        justify-content: space-evenly;
        margin: 1em 0;
        font-size: 120%;
        font-weight: bold;
    }

    /* .temperature,
	.humidity {
		font-weight: bold;
	} */

    .temperature::after {
        content: "°F";
    }

    .humidity::after {
        content: "% RH";
    }

    .observed {
        font-size: 80%;
        font-style: italic;
        color: hsl(0, 0%, 50%);
    }

    .observed::before {
        content: "as of ";
    }
</style>

{#if observed}
    {#if title}
        <h3>{title}</h3>
    {/if}

    <div class="weather">
        <div class="temperature">{temperature}</div>
        <div class="humidity">{humidity}</div>
    </div>
    <div class="observed">{observed}</div>
{/if}
