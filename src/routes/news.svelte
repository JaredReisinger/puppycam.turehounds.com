<script type="ts">
  import { DateTime } from "luxon";
  import { store as newsStore } from "../components/news";
  import type { NewsItem } from "../components/news";

  const shortFmt = {
    ...DateTime.DATETIME_SHORT,
    timeZoneName: "short",
  } as const;
  const longFmt = { ...DateTime.DATETIME_HUGE, timeZoneName: "short" } as const;

  let news: NewsItem[];
  let newsDate: string = "...";
  let checkDate: string = "...";

  $: {
    // console.log("PuppyDetails data update?", $dataStore);
    news = $newsStore.news;

    if (news) {
      newsDate = news[0].when.toLocaleString(shortFmt);
    }

    if ($newsStore.lastChecked) {
      checkDate = $newsStore.lastChecked.toLocaleString(shortFmt);
    }
  }
</script>

<svelte:head>
  <title>News - Ture Hound PuppyCam!</title>
</svelte:head>

<div class="wrapper">
  <h1>News and updates</h1>

  <p class="note">
    Most-recent news from {newsDate}.
  </p>
  <p class="note">
    Checked for updates at {checkDate}.
  </p>

  {#each $newsStore.news as item}
    <h3>
      {item.when.toLocaleString(longFmt)}
      <span class="note">({item.when.toRelative()})</span>
    </h3>
    {#each item.paragraphs as paragraph}
      <p>{@html paragraph}</p>
    {/each}
  {/each}
</div>

<style lang="scss">
  .wrapper {
    max-width: 50em;
    /*font-weight: 400;*/
  }

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
