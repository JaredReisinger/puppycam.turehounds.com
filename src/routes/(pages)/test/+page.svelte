<script lang="ts">
  import { PUBLIC_TWITCH_PARENT } from '$env/static/public';

  // import VideoNest from '$lib/VideoNest.svelte';
  // import VideoYouTube from '$lib/VideoYouTube.svelte';
  import VideoTwitch from '$lib/VideoTwitch.svelte';

  // import { puppycam1_youtube, nestcamOffice } from '$lib/video-streams.js';
</script>

<h1>TEST PAGE</h1>

<p>This is a test page for a streaming video player.</p>

<!-- <div class="test">
  <VideoYouTube videoId={puppycam1_youtube} controls={false} autoplay />
</div> -->

<!-- <div class="test">
  <VideoNest publicId={nestcamOffice} debug />
</div> -->

<div class="test">
  <VideoTwitch parent={PUBLIC_TWITCH_PARENT} channel="turehounds" />
</div>

<!--
<div class="test">
  <VideoNest
    publicId="jqbAk2MNMd"
    uuid="9c06bf22fa9047559a39ced47953a9ec"
    streamHost="stream-ue1-bravo.dropcam.com"
    debug
  />
</div> -->

<div>
  <p>Also, here is some collar colors:</p>
  <ul>
    <li class="text-collar-blue">blue</li>
    <li class="text-collar-red">red</li>
    <li class="text-collar-yellow">yellow</li>
    <li class="text-collar-white">white</li>
    <li class="text-collar-green">green</li>
    <li class="text-collar-pink">pink</li>
    <li class="text-collar-purple">purple</li>
  </ul>
</div>

<style lang="postcss">
  @reference "../../../app.css";

  .test {
    @apply max-w-[50em] mb-8 aspect-[16/9];
  }
</style>
