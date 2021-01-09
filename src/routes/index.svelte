<script lang="ts">
	import { onMount } from "svelte";
	import { DateTime } from "luxon";

	// let dummy = true;
	let dummy = false;

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
	/* * {
		border: 1px solid red;
	} */

	.aspect-root {
		/* ensures a 16:9 aspect ratio */
		width: min(100vw - 10rem, (100vh - 10rem) * 1.77778);
		height: min(100vh - 10rem, (100vw - 10rem) / 1.77778);
		position: relative;
	}

	.aspect-child {
		position: absolute;
		width: 30%;
		height: 30%;
		/* bottom: 5%; */
		top: 0;
		right: 0;
		margin: 0.5em;
		border: 0.5em solid white;
	}

	.fill-parent {
		width: 100%;
		height: 100%;
	}
	.dummy {
		background-color: hsl(0, 100%, 50%, 0.2);
	}

	.layout {
		display: flex;
	}

	.details {
		padding: 0.5em 1em;
		flex: auto;
	}

	.details > *:first-child {
		margin-top: 0;
	}

	th {
		text-align: left;
	}

	.blue {
		color: hsl(220, 80%, 50%);
	}
	.red {
		color: hsl(0, 80%, 50%);
	}
	.yellow {
		color: hsl(60, 80%, 45%);
	}
	.white {
		color: hsl(0, 0%, 50%);
	}
	.green {
		color: hsl(100, 80%, 30%);
	}
	.brown {
		color: hsl(50, 80%, 30%);
	}

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

	@media (max-width: 1024px) {
		.layout {
			display: block;
		}

		.aspect-root {
			/* ensures a 16:9 aspect ratio */
			width: min(100vw - 1rem, (100vh - 5rem) * 1.77778);
			height: min(100vh - 5rem, (100vw - 1rem) / 1.77778);
			margin-bottom: 2rem;
		}
		.aspect-child {
			margin: 0.25em;
			border-width: 0.25em;
		}

		.details {
			padding: 0;
		}
	}
</style>

<svelte:head>
	<title>Ture Hounds PuppyCam!</title>
</svelte:head>

<!-- <h1>Video?</h1> -->

<!-- <p>Let's see if this works...</p> -->

<div class="layout">
	<div class="aspect-root">
		{#if dummy}
			<div class="fill-parent dummy">DUMMY</div>
		{:else}
			<iframe
				title="Eye in the Sky"
				type="text/html"
				class="fill-parent"
				frameborder="0"
				src="https://video.nest.com/embedded/live/jqbAk2MNMd?autoplay=1"
				allowfullscreen />
		{/if}
		<div class="aspect-child">
			{#if dummy}
				<div class="fill-parent dummy">CHILD</div>
			{:else}
				<iframe
					title="PuppyCam 2"
					type="text/html"
					class="fill-parent"
					frameborder="0"
					src="https://video.nest.com/embedded/live/dAYyHiFXJU?autoplay=1"
					allowfullscreen />
			{/if}
		</div>
	</div>

	<div class="details">
		<h3>The puppies</h3>
		<table>
			<thead>
				<tr>
					<th>color</th>
					<th>sex</th>
					<th>weight</th>
				</tr>
			</thead>
			<tbody>
				<tr class="blue">
					<td>Blue</td>
					<td>???</td>
					<td>???</td>
				</tr>
				<tr class="red">
					<td>Red</td>
					<td>???</td>
					<td>???</td>
				</tr>
				<tr class="yellow">
					<td>Yellow</td>
					<td>???</td>
					<td>???</td>
				</tr>
				<tr class="white">
					<td>White</td>
					<td>???</td>
					<td>???</td>
				</tr>
				<tr class="green">
					<td>Green</td>
					<td>???</td>
					<td>???</td>
				</tr>
				<tr class="brown">
					<td>Brown</td>
					<td>???</td>
					<td>???</td>
				</tr>
			</tbody>
		</table>

		{#if observed}
			<h3>Current puppy weather</h3>
			<div class="weather">
				<div class="temperature">{temperature}</div>
				<div class="humidity">{humidity}</div>
			</div>
			<div class="observed">{observed}</div>
		{/if}
	</div>
</div>
