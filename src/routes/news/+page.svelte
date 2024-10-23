<script lang="ts">
  import { DateTime } from 'luxon';
  import { news } from '$lib/news.svelte';

  const shortFmt = {
    ...DateTime.DATETIME_SHORT,
    timeZoneName: 'short',
  } as const;
  const longFmt = { ...DateTime.DATETIME_HUGE, timeZoneName: 'short' } as const;
</script>

<svelte:head>
  <title>News - Ture Hound PuppyCam!</title>
</svelte:head>

<div class="wrapper">
  <h1>News and updates</h1>

  <p class="note">
    Most-recent news from {news.lastModified?.toLocaleString(shortFmt)}.
  </p>
  <p class="note">
    Checked for updates at {news.lastChecked.toLocaleString(shortFmt)}.
  </p>

  {#each news.news as item}
    <h3>
      {item.when.toLocaleString(longFmt)}
      <span class="note">({item.when.toRelative()})</span>
    </h3>
    {#each item.paragraphs as paragraph}
      <p>{@html paragraph}</p>
    {/each}
  {/each}
</div>

<style lang="postcss">
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
