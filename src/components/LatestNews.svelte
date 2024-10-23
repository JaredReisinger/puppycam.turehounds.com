<script lang="ts">
  import { DateTime } from "luxon";
  import { store as newsStore } from "@components/news";
  import type { NewsItem } from "@components/news";

  const shortFmt = {
    ...DateTime.DATETIME_SHORT,
    timeZoneName: "short",
  } as const;
  // const longFmt = { ...DateTime.DATETIME_HUGE, timeZoneName: "short" } as const;

  export let title: string = "Latest news";

  let item: NewsItem | undefined;
  let newsDate: string  = "...";
  let newsRelDate: string | null = "...";
  let checkDate: string = "...";

  $: {
    item = (($newsStore.news?.length ?? 0) > 0) ? $newsStore.news?.[0]: undefined;

    if (item) {
      newsDate = item.when.toLocaleString(shortFmt);
      newsRelDate = item.when.toRelative();
    }

    if ($newsStore.lastChecked) {
      checkDate = $newsStore.lastChecked.toLocaleString(shortFmt);
    }
  }
</script>

<h3>{title}</h3>
{#each (item?.paragraphs ?? []) as paragraph}
  <p>{@html paragraph}</p>
{/each}

<p><a href="/news">Read more…</a></p>

<p class="note">
  News from {newsDate} ({newsRelDate}).
</p>
<p class="note">
  Checked for updates at {checkDate}.
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
