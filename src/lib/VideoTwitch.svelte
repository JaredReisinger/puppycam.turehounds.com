<script lang="ts">
  let {
    parent,
    channel,
    video,
    collection,
    // allowfullscreen,
    autoplay = true,
    muted = true,
    // debug = false,
  }: {
    // see https://dev.twitch.tv/docs/embed/video-and-clips/#non-interactive-inline-frames-for-live-streams-and-vods
    parent: string;
    channel?: string;
    video?: string;
    collection?: string;
    // allowfullscreen?: boolean;
    autoplay?: boolean;
    muted?: boolean;
    // debug?: boolean;
  } = $props();

  // build the URL from the parts...
  let params = $derived(
    Object.entries({parent, channel, video, collection, autoplay, muted}).map(([k, v]) => {
      if (v === undefined) {
        return undefined;
      }
      if (typeof v === 'boolean') {
        return [k, v ? 'true': 'false'];
      }
      return [k, v];
    }).filter(x => x !== undefined)
  );

  let videoQuerystring = $derived(
    params.map(([name, value]) => `${name}=${value}`).join('&')
  );

  // https://player.twitch.tv/?<channel, video, or collection>&parent=streamernews.example.com
  let videoUrl = $derived(
    `https://player.twitch.tv/?${videoQuerystring}`
  );

  // $inspect(parent, channel, params, videoQuerystring, videoUrl);
</script>

<!-- let parent decide size! -->
<div class="relative w-full h-full">
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
