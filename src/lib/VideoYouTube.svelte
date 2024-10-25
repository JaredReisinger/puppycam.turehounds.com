<script lang="ts">
  let {
    videoId,
    magicSiCode,
    autoplay = false,
    controls = true,
    debug = false,
  }: {
    // see https://developers.google.com/youtube/player_parameters for params
    videoId: string;
    magicSiCode?: string; // not documented, unused?; use as si={magicSiCode}
    autoplay?: boolean;
    controls?: boolean; // controls=0 or absent (controls=1 okay too?)
    debug?: boolean;
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

  // $effect(() => {
  //   log(`video URL params: ${JSON.stringify(videoUrlParams)}`);
  // });

  // $effect(() => {
  //   log(`video querystring: ${videoQuerystring}`);
  // });

  // $effect(() => {
  //   log(`video URL (final): ${videoUrl}`);
  // });

  let logMsgs: string[] = $state([]);

  function log(msg: string) {
    const length = logMsgs.push(msg);
    if (length > 10) {
      logMsgs = logMsgs.slice(-10);
    }
    logMsgs = logMsgs;
  }
</script>

<div class="relative w-full aspect-[16/9]">
  <div
    class="absolute m-2 px-1 bg-sky-400 text-white text-sm tracking-wider rounded z-50"
  >
    LIVE
  </div>

  <iframe
    class="absolute aspect-video w-full h-full left-0 top-0 right-0 bottom-0"
    src={videoUrl}
    title="need a title here"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

{#if debug && logMsgs.length > 0}
  <div class="debug">
    {#each logMsgs as msg, index (index)}
      <div>{msg}</div>
    {/each}
  </div>
{/if}

<style lang="postcss">
  /* video {
    display: block;
  } */

  .debug {
    background-color: hsl(0, 0%, 90%);
    padding: 1em 0.5em 0.5em;
    font-size: 70%;

    div {
      margin-bottom: 0.25em;
    }
  }
</style>
