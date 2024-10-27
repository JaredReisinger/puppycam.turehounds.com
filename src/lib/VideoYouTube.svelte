<script lang="ts">
  let {
    videoId,
    magicSiCode,
    autoplay = false,
    controls = true,
  }: {
    // see https://developers.google.com/youtube/player_parameters for params
    videoId: string;
    magicSiCode?: string; // not documented, unused?; use as si={magicSiCode}
    autoplay?: boolean;
    controls?: boolean; // controls=0 or absent (controls=1 okay too?)
  } = $props();

  // build the URL from the parts...
  let videoUrlParams = $derived([
    // We *can* hide params with default values...
    ...(magicSiCode ? [['si', magicSiCode]] : []),
    ['controls', controls ? '1' : '0'],
    ['autoplay', autoplay ? '1' : '0'],
  ]);

  let videoQuerystring = $derived(
    videoUrlParams.map(([name, value]) => `${name}=${value}`).join('&')
  );

  let videoUrl = $derived(
    `https://www.youtube.com/embed/${videoId}?${videoQuerystring}`
  );
</script>

<!-- let parent decide size! -->
<div class="relative w-full h-full">
  <div
    class="absolute m-2 px-1 bg-sky-400 text-white text-sm tracking-wider rounded z-50"
  >
    LIVE
  </div>

  <iframe
    class="w-full h-full"
    src={videoUrl}
    title="need a title here"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

<style lang="postcss">
</style>
