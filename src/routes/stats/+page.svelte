<script lang="ts">
  import PuppyDetails from '$lib/PuppyDetails.svelte';
  import PuppyWeights from '$lib/PuppyWeights.svelte';
  import { state as puppyState } from '$lib/puppy-data.svelte.js';
</script>

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
    The puppies’ weights are shown in ounces, since most viewers are in the
    United States. We actually measure in grams, though, because our scale can
    measure to either one-gram-level accuracy or to eighth-of-an-ounce accuracy.
    Since 1 gram is about 1/28th of an ounce, using grams is <em>waaaaay</em>
    more accurate. We convert these measurement to ounces purely for display.
  </p>

  <p>
    The analogous data for Disa’s previous litter was recorded in an Excel file,
    and was only for us. Since this site is an excuse to play with some
    technology, I’m playing with some data-visualization tools purely for the
    sake of building a pretty chart from the raw data.
  </p>

  {#if puppyState.data.latestDate.diffNow().negate().as('months') < 4}
  <PuppyDetails />
  {/if}

  <p class="aside final">
    Have an idea for something else to chart? Drop me a line and let me know!
    (For the record, I’m already thinking about adding historical “puppy
    weather” data, since that information is/can-be available through the same
    mechanism that yields the “current” weather.)
  </p>
</div>

<style lang="postcss">
  .wrapper {
    max-width: 50em;
    /* font-weight: 400; */
  }

  .aside {
    margin: 1em 0;
    border: 1px solid hsl(0, 0%, 80%);
    border-radius: 0.5em;
    background-color: hsl(0, 0%, 90%);
    padding: 1em;
    font-style: italic;
    color: hsl(0, 0%, 40%);
  }

  .aside.final {
    margin-top: 2em;
  }
</style>
