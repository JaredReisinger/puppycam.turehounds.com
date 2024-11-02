<script lang="ts">
  import VideoNest from '$lib/VideoNest.svelte';
  import VideoYouTube from '$lib/VideoYouTube.svelte';

  import { puppycam1_youtube, nestcamOffice } from '$lib/video-streams.js';
</script>

<h1>TEST PAGE</h1>

<p>This is a test page for a streaming video player.</p>

<div class="test">
  <!-- magicSiCode="xx-Q49iE4slkokun" -->
  <VideoYouTube videoId={puppycam1_youtube} controls={false} autoplay />
</div>

<div class="test">
  <VideoNest publicId={nestcamOffice} debug />
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

<style lang="postcss">
  .test {
    @apply max-w-[50em] mb-8 aspect-[16/9];
  }
</style>
