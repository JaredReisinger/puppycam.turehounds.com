<script lang="ts">
  // import { page } from '$app/stores';

  // import GoogleAnalytics from "$lib/GoogleAnalytics.svelte";
  import Nav from '$lib/Nav.svelte';

  let { children }: { children: () => any } = $props();
</script>

<Nav />

<main class="p-5">
  {@render children()}
</main>

<style lang="postcss">
  /* main {
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  @media (max-width: 1024px) {
    main {
      padding: 0.5em;
    }
  } */
</style>
