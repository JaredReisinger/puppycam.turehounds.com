<script lang="ts">
  import { onMount } from 'svelte';
  import { DateTime, Duration } from 'luxon';

  import { humanizeDuration, shortFmt } from '$lib/datetime.js';
  import { state as puppyState } from '$lib/puppy-data.svelte.js';
  import {
    formatPoundsOunces,
    gramsToPounds,
    properName,
  } from '$lib/puppy-data-utils.js';

  let { title, showFuture = false }: { title?: string; showFuture?: boolean } =
    $props();

  let ageCheckNow = $state(DateTime.local());

  // re-check age every N minutes...
  function updateAgeCheckNow() {
    ageCheckNow = DateTime.local();
  }
  onMount(() => {
    updateAgeCheckNow();
    const interval = setInterval(
      updateAgeCheckNow,
      Duration.fromISO('PT5S').toMillis()
    );
    return () => {
      clearInterval(interval);
    };
  });

  let dogs = $derived(puppyState.data.dogs);

  let birthdate = $derived(dogs[0]?.birthdate);
  let age = $derived(birthdate?.diff(ageCheckNow).negate());
  let measurementDate = $derived(dogs[0]?.weights.slice(-1)[0][0]);
  let future = $derived(age?.toMillis() < 0);
</script>

<div>
  {#if title}<h3>{title}</h3>{/if}

  {#if dogs.length <= 0}
    <p>No puppy data is currently available.</p>
  {:else}
    {#if future}
      <!-- recalc the expectation to only include weeks -->
      <p>
        The puppies are expected in {humanizeDuration(age, ['weeks']).text}.
      </p>
    {:else}
      <p>
        The puppies are {humanizeDuration(age, ['weeks', 'days']).text} old.
      </p>
    {/if}

    {#if !future || showFuture}
      <table class="mt-4 table table-auto prose">
        <thead>
          <tr class="smaller">
            <th class="text-left">nickname</th>
            <th>collar</th>
            <th>sex</th>
            <th class="text-left">weight</th>
          </tr>
        </thead>
        <tbody>
          {#each dogs as dog}
            {@const weightG = dog.weights.slice(-1)[0][1]}
            <tr class={dog.collar}>
              <td>{properName(dog)}</td>
              <td class="smaller">{dog.collar}</td>
              <td class="smaller text-center">{dog.sex}</td>
              <td class="smaller"
                >{formatPoundsOunces(gramsToPounds(weightG))}
                <span class="smaller">({weightG}g)</span></td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}

  <div class="mt-2 meta">
    {#if measurementDate && (!future || showFuture)}
      <div>
        Measured: {measurementDate.toLocaleString(shortFmt)}
      </div>
    {/if}
    <div>
      Last checked: {puppyState.lastChecked?.toLocaleString(shortFmt) ?? '...'}
    </div>
  </div>
</div>

<style lang="postcss">
</style>
