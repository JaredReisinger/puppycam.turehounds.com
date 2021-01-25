<script lang="ts">
  // import { onMount } from "svelte";
  import Hls from "hls.js";

  export let src: string;

  // export let title: string;
  // export let videoId: string;

  // export let dummy = process.env.NODE_ENV === "development";
  // uncomment to force on/off
  // dummy = true;
  // export let dummy = false;
  // dummy = false;

  // get camera info (JSON)
  //  * https://video.nest.com/api/dropcam/cameras.get_by_public_token?token=dAYyHiFXJU&_=1611358588737
  //  * https://video.nest.com/api/dropcam/cameras.get_by_public_token?token=jqbAk2MNMd&_=1611358588945
  //
  // The "nonce" (or whatever) at the end seems entirely unneeded... hitting
  //  * https://video.nest.com/api/dropcam/cameras.get_by_public_token?token=dAYyHiFXJU
  // seems to work just fine.

  // placeholder image
  //  * https://nexusapi-us1.camera.home.nest.com/get_image?uuid=3ed3fea78dfc4f86968ab2ae9f616443&width=540&public=dAYyHiFXJU
  //  * https://nexusapi-us1.camera.home.nest.com/get_image?uuid=9c06bf22fa9047559a39ced47953a9ec&width=540&public=jqbAk2MNMd
  //
  // https://nexusapi-us1.camera.home.nest.com/get_image?uuid={uuid}&width=540&public={videoId}

  // live stream:
  //  * https://stream-ue1-charlie.dropcam.com/nexus_aac/3ed3fea78dfc4f86968ab2ae9f616443/playlist.m3u8?public=dAYyHiFXJU
  //  * https://stream-ue1-bravo.dropcam.com/nexus_aac/9c06bf22fa9047559a39ced47953a9ec/playlist.m3u8?public=jqbAk2MNMd
  //
  // {host}/nexus_aac/{guid}/playlist.m3u8?public={videoId}

  // NO: now use last line (chunklist) from that playlist..."chunklist_w21391397.m3u8?public=dAYyHiFXJU":
  // * https://stream-ue1-charlie.dropcam.com/nexus_aac/3ed3fea78dfc4f86968ab2ae9f616443/chunklist_w21391397.m3u8?public=dAYyHiFXJU

  let video;

  // let placeholderImage: string;
  // let liveVideoFeed: string;
  // let mounted = false;

  // onMount(() => {
  //   (async () => {
  //     ({ placeholderImage, liveVideoFeed } = await getCameraUrls(videoId));
  //   })();

  //   mounted = true;
  //   console.log("mounted...");

  //   return () => {
  //     mounted = false;
  //   };
  // });

  // // Ideally we'd bootstrap up from a Nest shared camera ID (token) to the M3U8
  // // playlist url.  Unfortunately, Next/Google doesn't return the proper CORS
  // // headers to allow this to be done programatically (in a browser, at any
  // // rate).  For the record, this is the flow that *would* happen.
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

  // const videoSrc =
  //   "https://stream-ue1-charlie.dropcam.com/nexus_aac/3ed3fea78dfc4f86968ab2ae9f616443/chunklist_w21391397.m3u8?public=dAYyHiFXJU";

  $: {
    // console.log("got videoControl?", video, title, videoId, dummy);
    // console.log(Hls);
    if (video && Hls) {
      console.log("time to load the source?", {
        hls: Hls.isSupported(),
        native1: video.canPlayType("application/vnd.apple.mpegurl"),
        native2: video.canPlayType("application/x-mpegURL"),
        native3: video.canPlayType("video/mp4"),
      });

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      } else if (
        video.canPlayType("application/x-mpegURL") ||
        video.canPlayType("application/vnd.apple.mpegurl")
      ) {
        video.src = src;
        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
      } else {
        console.log("cannot play");
      }
    }
  }
</script>

<div class="wrapper fill-parent">
  <div class="live">LIVE</div>
  <!-- svelte-ignore a11y-media-has-caption -->
  <video bind:this={video} controls class="fill-parent" />
</div>

<style type="scss">
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
    border: 0.25em solid white;
  }
</style>
