<script lang="ts">
	// import tureHoundsLogo from "images/ture-hounds-logo.png";
	// let dummy = true;
	let dummy = false;
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
					src="https://video.nest.com/embedded/live/jqbAk2MNMd?autoplay=1"
					allowfullscreen />
			{/if}
		</div>
	</div>

	<div class="details">
		<h1>Details...</h1>
		<p>Here’s where some details would go…</p>
		<p>Blue, Red, Yellow, White, Green...</p>
		<p>
			Current puppy weather:<br />
			&nbsp;&nbsp;&nbsp;temperature:
			<b>XX&deg;F</b><br />
			&nbsp;&nbsp;&nbsp;humidity:
			<b>XX%</b>
		</p>
	</div>
</div>
