<script lang="ts">
  import { state } from '$lib/news.svelte.js';
  import { shortFmt } from '$lib/datetime.js';

  let { title }: { title?: string } = $props();

  let item = $derived(state.data.length > 0 ? state.data[0] : undefined);
</script>

<div class="prose">
  {#if title}<h3>{title}</h3>{/if}

  {#each item?.paragraphs ?? [] as paragraph}
    <p>{@html paragraph}</p>
  {/each}

  <p><a href="/news">Read more…</a></p>

  <div class="meta not-prose">
    <div>
      News from {item?.when?.toLocaleString(shortFmt) ?? '...'}
      ({item?.when?.toRelative() ?? '...'})
    </div>
    <div>
      Last checked: {state.lastChecked?.toLocaleString(shortFmt) ??
        '...'}
    </div>
  </div>
</div>

<style lang="postcss">
</style>
