<script type="ts">
  import Video2 from "../components/Video2.svelte";

  // get camera info (JSON)
  //  * https://video.nest.com/api/dropcam/cameras.get_by_public_token?token=dAYyHiFXJU&_=1611358588737
  //  * https://video.nest.com/api/dropcam/cameras.get_by_public_token?token=jqbAk2MNMd&_=1611358588945
  //
  // The "nonce" (or whatever) at the end seems entirely unneeded... hitting
  //  * https://video.nest.com/api/dropcam/cameras.get_by_public_token?token=dAYyHiFXJU
  //  * https://video.nest.com/api/dropcam/cameras.get_by_public_token?token=jqbAk2MNMd
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
</script>

<h1>TEST PAGE</h1>

<p>This is a test page for a non-iframe-based streaming video player.</p>

<div class="test">
  <Video2
    publicId="dAYyHiFXJU"
    uuid="3ed3fea78dfc4f86968ab2ae9f616443"
    streamHost="stream-ue1-charlie.dropcam.com"
    debug
  />
</div>

<div class="test">
  <Video2
    publicId="jqbAk2MNMd"
    uuid="9c06bf22fa9047559a39ced47953a9ec"
    streamHost="stream-ue1-bravo.dropcam.com"
    debug
  />
</div>

<style lang="scss">
  .test {
    max-width: 50em;
    margin-bottom: 2em;
  }
</style>
