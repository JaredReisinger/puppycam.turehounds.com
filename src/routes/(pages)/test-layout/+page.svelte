<script lang="ts">
  import VideoYouTube from '$lib/VideoYouTube.svelte';
  import PuppyDetails from '$lib/PuppyDetails.svelte';
  import PuppyWeather from '$lib/PuppyWeather.svelte';
  import LatestNews from '$lib/LatestNews.svelte';

  import { puppycam1_youtube } from '$lib/video-streams.js'

</script>

<div class="w-full flex flex-col xl:flex-row gap-4">
  <div class="w-full">
    <div class="aspect-[16/9]">
      <!-- <VideoFramed title="Eye in the Sky" videoId="jqbAk2MNMd" /> -->
      <VideoYouTube videoId={puppycam1_youtube} controls={false} autoplay />
    </div>
  </div>

  <div
    class="flex flex-wrap zflex-col zlg:flex-row zxl:flex-col xl:max-w-[25rem] gap-4 justify-stretch"
  >
    <div class="">
      <PuppyDetails showFuture />
      <a href="about#puppy-details" class="meta what">what?!</a>
    </div>

    <div class="">
      <PuppyWeather title="Current puppy weather" />
      <a href="about#puppy-weather" class="meta what">what?!</a>
    </div>

    <div class="w-[33vw] grow">
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
