<script lang="ts">
  import { state as news } from '$lib/news.svelte.js';
  import { shortFmt } from '$lib/datetime.js';

  let { title }: { title?: string } = $props();

  let item = $derived(news.data.length > 0 ? news.data[0] : undefined);
</script>

<div class="prose">
  {#if title}<h3>{title}</h3>{/if}

  {@html item?.html}

  <p><a href="/news">Read more…</a></p>

  <div class="meta not-prose">
    <div>
      News from {item?.when?.toLocaleString(shortFmt) ?? '...'}
      ({item?.when?.toRelative() ?? '...'})
    </div>
    <div>
      Last checked: {news.lastChecked?.toLocaleString(shortFmt) ?? '...'}
    </div>
  </div>
</div>

<style lang="postcss">
</style>
