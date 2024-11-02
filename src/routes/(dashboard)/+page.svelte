<script lang="ts">
  import { dev } from '$app/environment';
  import { page } from '$app/stores';
  import type { Snapshot } from './$types';

  import Nav from '$lib/Nav.svelte';
  import VideoYouTube from '$lib/VideoYouTube.svelte';
  import PuppyDetails from '$lib/PuppyDetails.svelte';
  import PuppyWeather from '$lib/PuppyWeather.svelte';
  import LatestNews from '$lib/LatestNews.svelte';

  import { state as puppyState } from '$lib/puppy-data.svelte.js';
  import { puppycam1_youtube } from '$lib/video-streams.js';

  let devVideoOverride: boolean | undefined = $state(undefined);
  let devFutureOverride: boolean | undefined = $state(undefined);
  let devExtraNews: boolean | undefined = $state(undefined);

  let kioskMode = $state(false);
  let letterboxed = $state(false);
  let showInfo = $state(false);

  // a couple of magic flags
  let flags = $derived.by(() => {
    const devFlags = $page.url.searchParams.get('dev')?.split('|') ?? [];
    return {
      dev: dev && !devFlags.includes('false'),
      video: devFlags.includes('video'),
    };
  });

  let future = $derived(puppyState.data.future);
  let showFuture = $derived(devFutureOverride ?? false);
  let showVideo = $derived(devVideoOverride ?? (flags.video || !future));

  export const snapshot: Snapshot<[boolean, boolean, boolean]> = {
    capture: () => [kioskMode, letterboxed, showInfo],
    restore: (value) => {
      [kioskMode, letterboxed, showInfo] = value;
    },
  };
</script>

{#if !kioskMode}
  <Nav />
{/if}

<div
  class={`${kioskMode ? 'w-screen h-screen overflow-hidden relative' : 'w-full flex flex-col xl:flex-row'}`}
>
  <!--
    VIDEO SECTION
  -->
  <div class="w-full h-full">
    <div class="video-parent" class:kiosk={kioskMode} class:letterboxed>
      {#if showVideo}
        <!-- <VideoFramed title="Eye in the Sky" videoId="jqbAk2MNMd" /> -->
        <VideoYouTube videoId={puppycam1_youtube} controls={false} autoplay />
      {:else}
        <!-- This has to act like YouTube and always 16:9 the inner part -->
        <div class="w-full h-full bg-black">
          <div
            class="max-w-full max-h-full aspect-[16/9] mx-auto my-auto bg-gray-500 flex flex-wrap justify-around content-around text-white text-xl"
          >
            <div class="p-5 text-center italic">
              No video available until after puppies have been born!
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- SIDEBAR -->
  <!-- we *could invert in kiosk mode, if that would help -->
  <div
    class={`${kioskMode ? 'absolute top-0 right-0 max-h-[75%] overflow-y-auto bg-white/30 rounded-bl-lg backdrop-blur-md' : ''}`}
  >
    <div
      class={`p-5 flex flex-col flex-wrap gap-4 ${kioskMode ? 'w-[27rem] min-h-full' : 'xl:w-[27rem] xl:min-h-full'}`}
    >
      {#if flags.dev}
        <div class="w-full flex flex-wrap gap-x-12 gap-y-1 order-first smaller">
          <label class="text-nowrap"
            ><input
              type="checkbox"
              class="mr-2 btn-toggle"
              bind:checked={devVideoOverride}
            />show video</label
          >
          <label class="text-nowrap"
            ><input
              type="checkbox"
              class="mr-2 btn-toggle"
              bind:checked={devFutureOverride}
            />show future</label
          >
          <label class="text-nowrap"
            ><input
              type="checkbox"
              class="mr-2 btn-toggle"
              bind:checked={devExtraNews}
            />extra news</label
          >
        </div>
      {/if}

      <div
        class={`xl:flex w-full flex-wrap gap-x-12 gap-y-1 order-first smaller border-black/25 ${kioskMode ? 'flex' : 'hidden justify-end pr-12'} ${!kioskMode || showInfo ? 'pb-2 border-b' : ''}`}
      >
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

          <label class="text-nowrap"
            ><input
              type="checkbox"
              class="mr-2 btn-toggle"
              bind:checked={showInfo}
            />show info</label
          >
        {/if}
      </div>

      {#if !kioskMode || showInfo}
        <div
          class="xl:grow flex flex-wrap gap-4 xl:min-h-full xl:items-center"
          class:w-full={kioskMode}
        >
          <div>
            <PuppyDetails {showFuture} />
            <a href="about#puppy-details" class="meta what">what?!</a>
          </div>

          <div>
            <PuppyWeather title="Current puppy weather" />
            <a href="about#puppy-weather" class="meta what">what?!</a>
          </div>

          <div
            class="w-[33vw] xl:w-full min-w-96 grow"
            class:order-first={future}
          >
            {#if devExtraNews}
              <div class="prose">
                <p>
                  Showing extra news to make it long and force scrolling. Lorem
                  ipsum dolor sic amet, forescore and twenty years ago our
                  forefathers brought forth onto this continent a new nation.
                  Lorem ipsum dolor sic amet, forescore and twenty years ago our
                  forefathers brought forth onto this continent a new nation.
                </p>
                <p>
                  Lorem ipsum dolor sic amet, forescore and twenty years ago our
                  forefathers brought forth onto this continent a new nation.
                  Lorem ipsum dolor sic amet, forescore and twenty years ago our
                  forefathers brought forth onto this continent a new nation.
                </p>
              </div>
            {/if}
            <LatestNews />
            <a href="about#news" class="meta what">what?!</a>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .video-parent {
    @apply w-full aspect-[16/9];

    &.kiosk {
      @apply absolute w-screen h-screen;

      &:not(.letterboxed) {
        @apply left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%];
      }
    }
  }

  /* oversize video parent in kiosk mode */
  @media (min-aspect-ratio: 16/9) {
    .video-parent.kiosk:not(.letterboxed) {
      /* height = 100 * (9 / 16) = 56.25 */
      height: 56.25vw;
    }
  }

  @media (max-aspect-ratio: 16/9) {
    .video-parent.kiosk:not(.letterboxed) {
      /* width = 100 / (9 / 16) = 177.777777 */
      width: 177.78vh;
    }
  }

  .what {
    @apply mt-2 underline decoration-dotted hover:decoration-solid hover:text-sky-400;
  }
</style>
