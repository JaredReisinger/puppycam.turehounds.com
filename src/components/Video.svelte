<script lang="ts">
  export let title: string;
  export let videoId: string;

  export let dummy = process.env.NODE_ENV === "development";
  // uncomment to force on/off
  // dummy = true;
  // export let dummy = false;
</script>

{#if dummy}
  <div class="fill-parent dummy">{title}</div>
{:else}
  <iframe
    {title}
    type="text/html"
    class="fill-parent"
    frameborder="0"
    src="https://video.nest.com/embedded/live/{videoId}?autoplay=1"
    allowfullscreen
  />
{/if}

<style type="scss">
  .fill-parent {
    width: 100%;
    height: 100%;
  }
  .dummy {
    background-color: hsl(0, 100%, 90%);
  }
</style>
