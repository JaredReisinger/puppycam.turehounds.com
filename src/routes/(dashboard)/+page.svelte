<script lang="ts">
  import { dev } from '$app/environment';
  import type { Snapshot } from './$types';

  import Nav from '$lib/Nav.svelte';
  import VideoYouTube from '$lib/VideoYouTube.svelte';
  import PuppyDetails from '$lib/PuppyDetails.svelte';
  import PuppyWeather from '$lib/PuppyWeather.svelte';
  import LatestNews from '$lib/LatestNews.svelte';

  import { state as puppyState } from '$lib/puppy-data.svelte.js';

  import { puppycam1_youtube } from '$lib/video-streams.js';

  let showVideoOverride: boolean | undefined = $state(undefined);
  let showFutureOverride: boolean | undefined = $state(undefined);
  let showExtraNews: boolean | undefined = $state(undefined);

  let kioskMode = $state(false);
  let letterboxed = $state(false);

  let future = $derived(puppyState.data.future);
  let showFuture = $derived(showFutureOverride ?? false);
  let showVideo = $derived(showVideoOverride ?? !future);

  export const snapshot: Snapshot<[boolean, boolean]> = {
    capture: () => [kioskMode, letterboxed],
    restore: (value) => {
      [kioskMode, letterboxed] = value;
    },
  };
</script>

{#if !kioskMode}
  <Nav />
{/if}

<div
  class={`${kioskMode ? 'w-screen h-screen overflow-hidden relative' : 'w-full flex flex-col xl:flex-row'}`}
>

  <!-- VIDEO SECTION -->

  <div class={`${kioskMode ? 'absolute w-screen h-screen' : 'w-full'}`}>
    {#if showVideo}
      <!-- <VideoFramed title="Eye in the Sky" videoId="jqbAk2MNMd" /> -->
      <VideoYouTube
        videoId={puppycam1_youtube}
        controls={false}
        autoplay
        kioskMode={kioskMode && !letterboxed}
      />
    {:else}
      <div
        class={`${kioskMode ? 'w-screen h-screen' : 'w-full aspect-[16/9]'} bg-gray-500 flex flex-wrap justify-around content-around text-white text-xl`}
      >
        <div class="p-5 text-center italic">
          No video available until after puppies have been born!
        </div>
      </div>
    {/if}
  </div>

  <!-- SIDEBAR -->

  <!-- we *could invert in kiosk mode, if that would help -->
  <div
    class={`${kioskMode ? 'absolute top-0 right-0 max-h-[75%] zzz-m-5 overflow-auto bg-white/80 backdrop-blur-md zzz-rounded-lg' : ''}`}
  >
    <div class="p-5 flex flex-wrap xl:max-w-[25rem] gap-4 justify-stretch">
      {#if dev}
        <div class="w-full flex flex-wrap gap-x-12 gap-y-1 order-first">
          <label class="text-nowrap"
            ><input
              type="checkbox"
              class="mr-2 btn-toggle"
              bind:checked={showVideoOverride}
            />show video</label
          >
          <label class="text-nowrap"
            ><input
              type="checkbox"
              class="mr-2 btn-toggle"
              bind:checked={showFutureOverride}
            />show future</label
          >
          <label class="text-nowrap"
            ><input
              type="checkbox"
              class="mr-2 btn-toggle"
              bind:checked={showExtraNews}
            />extra news</label
          >
        </div>
      {/if}

      <div class="w-full flex flex-wrap gap-x-12 gap-y-1 order-first pb-2 border-b border-gray-300">
        <label class="text-nowrap"
          ><input
            type="checkbox"
            class="mr-2 btn-toggle"
            bind:checked={kioskMode}
          />kiosk mode</label
        >
        {#if kioskMode}
          <label class="text-nowrap"
            ><input
              type="checkbox"
              class="mr-2 btn-toggle"
              bind:checked={letterboxed}
            />letterboxed</label
          >
        {/if}
      </div>

      <div class="">
        <PuppyDetails {showFuture} />
        <a href="about#puppy-details" class="meta what">what?!</a>
      </div>

      <div class="">
        <PuppyWeather title="Current puppy weather" />
        <a href="about#puppy-weather" class="meta what">what?!</a>
      </div>

      <div class="w-[33vw] grow" class:order-first={future}>
        {#if showExtraNews}
          <div class="prose">
            <p>
              Showing extra news to make it long and force scrolling. Lorem
              ipsum dolor sic amet, forescore and twenty years ago our
              forefathers brought forth onto this continent a new nation. Lorem
              ipsum dolor sic amet, forescore and twenty years ago our
              forefathers brought forth onto this continent a new nation.
            </p>
            <p>
              Lorem ipsum dolor sic amet, forescore and twenty years ago our
              forefathers brought forth onto this continent a new nation. Lorem
              ipsum dolor sic amet, forescore and twenty years ago our
              forefathers brought forth onto this continent a new nation.
            </p>
          </div>
        {/if}
        <LatestNews />
        <a href="about#news" class="meta what">what?!</a>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .what {
    @apply mt-2 underline decoration-dotted hover:decoration-solid hover:text-sky-400;
  }
</style>
