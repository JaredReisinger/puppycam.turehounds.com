<script lang="ts">
  import GoogleAnalytics from "../components/GoogleAnalytics.svelte";
  import Nav from "../components/Nav.svelte";

  export let segment: string;
</script>

<GoogleAnalytics trackingId="{process.env.APP_GOOGLE_TRACKING_ID}" />

<Nav {segment} />

<main>
  <slot />
</main>

<style type="scss">
  main {
    // position: relative;
    // max-width: 56em;
    // background-color: hsl(194, 70%, 48%);
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  @media (max-width: 1024px) {
    main {
      padding: 0.5em;
    }
  }
</style>
