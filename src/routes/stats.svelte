<script lang="ts">
  import PuppyDetails from "../components/PuppyDetails.svelte";
  import PuppyWeights from "../components/PuppyWeights.svelte";
</script>

<svelte:head>
  <title>Statistics - Ture Hound PuppyCam!</title>
</svelte:head>

<div class="wrapper">
  <h1>Statistics!</h1>

  <p>
    If there’s one thing I (Jared) like, it’s data and statistics. One of the
    rules of thumb we have as Basenji breeders is that the puppies should double
    in weight by the end of their first week. To know that, we need to measure
    their weight when they’re born, and at least at the end of their first week.
    If we’re measuring at all, we might as well measure fairly often, and
    compare that against a projected “double in one week” guideline.
  </p>

  <p>
    This chart shows the individual puppy weight measurements over time. The
    initial weight points appear “staggered” because they are: their position on
    the x-axis represents that puppy’s specific birth time. The subsequent
    points share a single moment in time, because it takes only a few seconds to
    weigh and record each puppy.
  </p>

  <PuppyWeights />

  <p>
    The analogous data for Disa’s previous litter was recorded in an Excel file,
    and was only for us. Since this site is an excuse to play with some
    technology, I’m playing with some data-visualization tools purely for the
    sake of building a pretty chart from the raw data.
  </p>

  {#if false}
    <PuppyDetails />
  {/if}

  <p class="aside">
    Have an idea for something else to chart? Drop me a line and let me know!
    (For the record, I’m already thinking about adding historical “puppy
    weather” data, since that information is can/be available through the same
    mechanism that yields the “current” weather.)
  </p>
</div>

<style type="scss">
  .wrapper {
    max-width: 50em;
    // font-weight: 400;
  }

  .aside {
    margin: 2em 0 1em;
    border: 1px solid hsl(0, 0%, 80%);
    border-radius: 0.5em;
    background-color: hsl(0, 0%, 90%);
    padding: 1em;
    font-style: italic;
    color: hsl(0, 0%, 40%);
  }
</style>
