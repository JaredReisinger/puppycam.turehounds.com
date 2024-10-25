<script lang="ts">
  import Hls from "hls.js";

  export let publicId: string;
  export let uuid: string;
  export let streamHost: string;

  export let debug = false;

  $: src = `https://${streamHost}/nexus_aac/${uuid}/chunklist_w21391397.m3u8?public=${publicId}`;
  $: poster = `https://nexusapi-us1.camera.home.nest.com/get_image?uuid=${uuid}&width=540&public=${publicId}`;

  $: {
    log(`using src ${src}`);
    log(`using poster ${poster}`);
  }

  let video: HTMLVideoElement;
  let logMsgs: string[] = [];

  function log(msg: string) {
    const length = logMsgs.push(msg);
    if (length > 10) {
      logMsgs = logMsgs.slice(-10);
    }
    logMsgs = logMsgs;
  }

  // // Ideally we'd bootstrap up from *only* a Nest shared camera ID (token,
  // // here called publicId) to the M3U8 playlist url.  Unfortunately,
  // // Next/Google doesn't return the proper CORS headers to allow this to be
  // //  done programatically (in a browser, at any rate).  For the record, this
  // // is the flow that *would* happen.
  // async function getCameraUrls(nestCameraId: string) {
  //   console.log("getting stream for", nestCameraId);
  //   const res = await fetch(
  //     `https://video.nest.com/api/dropcam/cameras.get_by_public_token?token=${nestCameraId}`
  //   );
  //   console.log(res);
  //   const info = await res.json();
  //   const feed = info.items[0];
  //   const cameraUuid = feed.uuid;
  //   const streamHost = feed.live_stream_host;
  //   const imageHost = feed.nexus_api_nest_domain_host;

  //   const placeholderImage = `https://${imageHost}/get_image?uuid=${cameraUuid}&public=${nestCameraId}`;
  //   const liveVideoFeed = `https://${streamHost}/nexus_aac/${cameraUuid}/playlist.m3u8?public=${nestCameraId}}`;

  //   return { placeholderImage, liveVideoFeed };
  // }

  $: {
    if (video && Hls) {
      const canPlayNative =
        video.canPlayType("application/x-mpegURL") ||
        video.canPlayType("application/vnd.apple.mpegurl");

      log(`canPlayNative? ${JSON.stringify(canPlayNative)}`);
      log(`HLS? ${JSON.stringify(Hls.isSupported())}`);

      if (canPlayNative) {
        log("native supported, nothing else to do");
        // video.src = src;
        // video.addEventListener("loadedmetadata", () => {
        //   log("native loaded metadata, playing!");
        //   video.play();
        // });
      } else if (Hls.isSupported()) {
        log("hls is supported, using that in lieu of native");
        const hls = new Hls();

        // The loadSource() line seems necessary, even if the <video> element
        // already has the src listed... this is perhaps an hls.js thing?
        hls.loadSource(src);
        hls.attachMedia(video);

        // start playing as soon as the manifest is parsed
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          log("hls manifest parsed, playing!");
          video.play();
        });
      } else {
        log("cannot play at all");
      }
    }
  }
</script>

<div class="wrapper fill-parent">
  <div class="live">LIVE</div>
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    bind:this={video}
    class="fill-parent"
    controls
    preload="auto"
    autoplay
    playsinline
    {src}
    {poster}
  >
    <p>Sorry, your browser does not support embedded videos.</p>
  </video>
</div>

{#if debug}
  <div class="debug">
    {#each logMsgs as msg}
      <div>{msg}</div>
    {/each}
  </div>
{/if}

<style lang="postcss">
  .fill-parent {
    width: 100%;
    /* height: 100%; */
  }

  .wrapper {
    position: relative;
  }

  .live {
    position: absolute;
    z-index: 100;
    background-color: hsl(200, 100%, 50%);
    color: white;
    font-size: 80%;
    /* font-weight: 600; */
    letter-spacing: 0.025em;
    margin: 0.75em;
    padding: 0 0.5em;
    border-radius: 0.25em;
  }

  video {
    display: block;
  }

  .debug {
    background-color: hsl(0, 0%, 90%);
    padding: 1em 0.5em 0.5em;
    font-size: 70%;

    div {
      margin-bottom: 0.25em;
    }
  }
</style>
