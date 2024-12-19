<script lang="ts">
  let { trackingId }: { trackingId: string } = $props();

  // another approach to injection?
  let script = $derived(`\x3Cscript>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }

  // gtag("consent", "default", {
  //   "ad_storage": "denied",
  //   "ad_user_data": "denied",
  //   "ad_personalization": "denied",
  //   "analytics_storage": "denied",
  //   "regions":[<list of ISO 3166-2 region codes>]
  // });

  gtag("consent", "default", {
    "ad_storage": "denied",
    "ad_user_data": "denied",
    "ad_personalization": "denied",
    "analytics_storage": "denied"
  });

  gtag("js", new Date());
  gtag("config", "${trackingId}");
  \x3C/script>`);

  // Note that we *don't* have to manually kick the `config` or `page_view`
  // event when the page changes; gtag.js detects URL/history changes
  // automatically, and records a new page view.
</script>

<!--
  Svelte will not do variable replacements inside of <script> tags (apparently?)
  so we have to encapsulate the entire script inside a bogus {@html} block,
  *and* avoid a bare <script> tag.  (The <script src=...> seems to work,
  interestingly.)
-->
<svelte:head>
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id={trackingId}"
  ></script>
  {@html script}

  <!-- also include consent banner, via cookieyes -->
  <!-- TODO: make this a component prop? -->
  {#if import.meta.env.PROD}
    <script
      id="cookieyes"
      type="text/javascript"
      src="https://cdn-cookieyes.com/client_data/aa4cd36c8fff4ea90c61e337/script.js"
    ></script>
  {/if}
</svelte:head>
