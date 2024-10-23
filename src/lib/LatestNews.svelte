<script lang="ts">
  import { DateTime } from 'luxon';
  import { news } from '$lib/news.svelte';

  const shortFmt = {
    ...DateTime.DATETIME_SHORT,
    timeZoneName: 'short',
  } as const;
  // const longFmt = { ...DateTime.DATETIME_HUGE, timeZoneName: "short" } as const;

  let { title = 'Latest news' }: { title: string } = $props();

  let item = $derived(news.news[0]);
</script>

<h3>{title}</h3>
{#each item?.paragraphs ?? [] as paragraph}
  <p>{@html paragraph}</p>
{/each}

<p><a href="/news">Read more…</a></p>

<p class="note">
  News from {item?.when?.toLocaleString(shortFmt) ?? '...'}
  ({item?.when?.toRelative() ?? '...'}).
</p>
<p class="note">
  Checked for updates at {news.lastChecked.toLocaleString(shortFmt)}.
</p>

<style lang="postcss">
  p {
    font-size: 80%;
  }

  /*.note {
    margin: 0;
    font-size: 80%;
    font-style: italic;
    font-weight: 400;
    color: hsl(0, 0%, 50%);
  }

  h3 .note {
    font-size: 70%;
  }*/
</style>
