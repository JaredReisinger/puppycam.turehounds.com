<script lang="ts">
  import { page } from '$app/state';
  import { PUBLIC_GOOGLE_TRACKING_ID } from '$env/static/public';

  import GoogleAnalytics from '$lib/GoogleAnalytics.svelte';

  import '../app.css';

  let { children }: { children: () => any } = $props();

  // SEO data - title, description, open-graph... etc.
  const rootUrl = 'https://puppycam.turehounds.com';
  const titleBase = 'Ture Hounds PuppyCam!';
  const descriptionDefault = 'The PuppyCam site for Ture Hounds.';
  const imageDefault = '/puppies-day1.jpg';

  let pageUrl = $derived(`${rootUrl}${page.url.pathname}`);

  let title = $derived(
    page.data.title ? `${page.data.title} — ${titleBase}` : titleBase
  );
  let description = $derived(page.data.description || descriptionDefault);
  let image = $derived(`${rootUrl}${page.data.image || imageDefault}`);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />

  <meta property="twitter:card" content="summary" />
  <meta property="twitter:domain" content="puppycam.turehounds.com" />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={image} />
  <meta property="twitter:url" content={pageUrl} />

  <!-- <meta property="twitter:label1" content="" />
  <meta property="twitter:data1" content="" />
  <meta property="twitter:label2" content="" />
  <meta property="twitter:data2" content="" /> -->
</svelte:head>

<GoogleAnalytics trackingId={PUBLIC_GOOGLE_TRACKING_ID} />

{@render children()}

<style lang="postcss">
</style>
