<script lang="ts">
    export let title: string;
    export let videoId: string;

    let dummy = process.env.NODE_ENV === 'development';
    // uncomment to force on/off
    // dummy = true;
    // dummy = false;
</script>

<style>
	.fill-parent {
		width: 100%;
		height: 100%;
	}
	.dummy {
		background-color: hsl(0, 100%, 50%, 0.2);
	}
</style>

{#if dummy}
    <div class="fill-parent dummy">{title}</div>
{:else}
    <iframe
        title="{title}"
        type="text/html"
        class="fill-parent"
        frameborder="0"
        src="https://video.nest.com/embedded/live/{videoId}?autoplay=1"
        allowfullscreen />
{/if}
