<script lang="ts">
  import { DateTime } from 'luxon';
  import { state } from '$lib/news.svelte';

  const shortFmt = {
    ...DateTime.DATETIME_SHORT,
    timeZoneName: 'short',
  } as const;
  const longFmt = { ...DateTime.DATETIME_HUGE, timeZoneName: 'short' } as const;
</script>

<div class="prose prose-sm md:prose-base lg:prose-lg prose-zinc">
  <h1>News and updates</h1>

  <div class="mt-[-1.5em] text-xs md:text-sm lg:text-base italic text-zinc-400">
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
      <span class="text-xs md:text-sm lg:text-base font-normal text-zinc-400 italic"
        >({item.when.toRelative()})</span
      >
    </h3>
    {#each item.paragraphs as paragraph}
      <p>{@html paragraph}</p>
    {/each}
  {/each}
</div>

<style lang="postcss">
  /*.note {
    margin: 0;
    font-size: 80%;
    font-style: italic;
    font-weight: 400;
    color: hsl(0, 0%, 50%);
  }*/

  h1 + .note {
    margin-top: -1em;
  }
</style>
