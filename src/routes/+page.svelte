<script lang="ts">
  import VideoYouTube from '$lib/VideoYouTube.svelte';
  import PuppyDetails from '$lib/PuppyDetails.svelte';
  import PuppyWeather from '$lib/PuppyWeather.svelte';
  import LatestNews from '$lib/LatestNews.svelte';

  import {state as puppyState} from '$lib/puppy-data.svelte.js';

  const showVideoOverride = undefined;
  const showFutureOverride = undefined;

  let future = $derived(puppyState.data.future);
  let showFuture = $derived(showFutureOverride ?? false);
  let showVideo = $derived(showVideoOverride ?? !future);
</script>

<div class="w-full flex flex-col xl:flex-row gap-4">
  <div class="w-full">
    <div
      class={`aspect-[16/9] bg-zinc-500 ${
        showVideo ? '' : 'flex flex-wrap justify-around content-around'
      }`}
    >
      {#if showVideo}
        <!-- <VideoFramed title="Eye in the Sky" videoId="jqbAk2MNMd" /> -->
        <VideoYouTube videoId="i3bGrW4hRxc" controls={false} autoplay />
      {:else}
        <div class="text-white text-xl">
          No video available until puppies have been born!
        </div>
      {/if}
    </div>
  </div>

  <div
    class="flex flex-wrap zflex-col zlg:flex-row zxl:flex-col xl:max-w-[25rem] gap-4 justify-stretch"
  >
    <div class="">
      <PuppyDetails {showFuture} />
      <a href="about#puppy-details" class="meta what">what?!</a>
    </div>

    <div class="">
      <PuppyWeather title="Current puppy weather" />
      <a href="about#puppy-weather" class="meta what">what?!</a>
    </div>

    <div class="w-[33vw] grow" class:order-first={future}>
      <LatestNews />
      <a href="about#news" class="meta what">what?!</a>
    </div>
  </div>
</div>

<style lang="postcss">
  .what {
    @apply mt-2 underline decoration-dotted hover:decoration-solid hover:text-sky-400;
  }
</style>
