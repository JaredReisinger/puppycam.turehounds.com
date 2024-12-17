<script lang="ts">
  import { state } from '$lib/news.svelte';
  import { shortFmt, longFmt } from '$lib/datetime.js';
</script>

<div class="prose prose-sm md:prose-base lg:prose-lg">
  <h1>News and updates</h1>

  <div class="mt-[-1.5em] meta">
    <!-- <div>
      Most-recent news from {state.lastModified?.toLocaleString(shortFmt) ??
        '...'}.
    </div> -->
    <div>
      Last checked for updates at {state.lastChecked?.toLocaleString(
        shortFmt
      ) ?? '...'}.
    </div>
  </div>

  {#each state.data as item}
    <h3>
      {item.when.toLocaleString(longFmt)}
      <span class="meta">({item.when.toRelative()})</span>
    </h3>

    {@html item?.html}
  {/each}
</div>

<style lang="postcss">
</style>
