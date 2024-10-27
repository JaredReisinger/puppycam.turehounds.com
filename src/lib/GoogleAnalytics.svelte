<script lang="ts">
  let { trackingId }: { trackingId: string } = $props();

  // another approach to injection?
  let script = $derived(`\x3Cscript>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
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
</svelte:head>
