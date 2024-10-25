<script lang="ts">
  import { state } from '$lib/news.svelte.js';
  import { shortFmt } from '$lib/datetime.js';

  let { title = 'Latest news' }: { title: string } = $props();

  let item = $derived(state.data.length > 0 ? state.data[0] : undefined);
</script>

<h3>{title}</h3>
{#each item?.paragraphs ?? [] as paragraph}
  <p>{@html paragraph}</p>
{/each}

<p><a href="/news">Read more…</a></p>

<div class="meta">
  <div>
    News from {item?.when?.toLocaleString(shortFmt) ?? '...'}
    ({item?.when?.toRelative() ?? '...'}).
  </div>
  <div>
    Checked for updates at {state.lastChecked?.toLocaleString(shortFmt) ??
      '...'}.
  </div>
</div>

<style lang="postcss">
</style>
