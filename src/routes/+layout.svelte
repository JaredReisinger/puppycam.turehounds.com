<script lang="ts">
  import { page } from "$app/stores";

  // import GoogleAnalytics from "@components/GoogleAnalytics.svelte";
  import Nav from "@components/Nav.svelte";

  export let segment: string;

  $: path = $page.url.pathname;

  // We *should* be able to let the page define the overrides for the open graph
  // etc. values, but it's not clear that they can...Doing so simply results in
  // duplicate <meta> headers, which seems messy and weird.
  let titlePrefix: string;
  let pageDescription: string;

  $: {
    switch (path) {
      case "/about":
        titlePrefix = "About - ";
        pageDescription =
          "More than you want to know about the PuppyCam site and how it all works.";
        break;
      case "/stats":
        titlePrefix = "Statistics - ";
        pageDescription = "Further details and statistics about the puppies.";
        break;
      default:
        titlePrefix = "";
        pageDescription =
          "A 24/7 live view of the current Ture Hounds litter; puppies of Disa and Yoshi.";
    }
  }

  // values for open-graph/twitter...

  const rootUrl = "https://puppycam.turehounds.com";
  $: pageUrl = `${rootUrl}${path}`;
  $: pageTitle = `${titlePrefix}Ture Hounds PuppyCam!`;
  const pageImage = `${rootUrl}/puppies-day1.jpg`;
</script>

<svelte:head>
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:image" content={pageImage} />

  <meta property="twitter:card" content="summary" />
  <meta property="twitter:domain" content="puppycam.turehounds.com" />
  <meta property="twitter:title" content={pageTitle} />
  <meta property="twitter:description" content={pageDescription} />
  <meta property="twitter:image" content={pageImage} />
  <meta property="twitter:url" content={pageUrl} />

  <!-- <meta property="twitter:label1" content="" />
  <meta property="twitter:data1" content="" />
  <meta property="twitter:label2" content="" />
  <meta property="twitter:data2" content="" /> -->
</svelte:head>

<!-- <GoogleAnalytics trackingId={process.env.APP_GOOGLE_TRACKING_ID} /> -->

<Nav {segment} />

<main>
  <slot />
</main>

<style lang="postcss">
  main {
    /* position: relative; */
    /* max-width: 56em; */
    /* background-color: hsl(194, 70%, 48%); */
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
