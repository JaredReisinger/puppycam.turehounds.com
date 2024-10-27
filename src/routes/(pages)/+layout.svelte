<script lang="ts">
  import Nav from '$lib/Nav.svelte';

  let { children }: { children: () => any } = $props();
</script>

<Nav />

<main class="p-1 md:p-5">
  {@render children()}
</main>

<style lang="postcss">
</style>
