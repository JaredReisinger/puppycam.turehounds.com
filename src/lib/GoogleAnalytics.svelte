<script module lang="ts">
  let headInjected = false;
</script>

<script lang="ts">
  import { page } from '$app/stores';

  export let trackingId: string | undefined;

  // only inject if it hasn't been done yet!
  const injectHead = !headInjected;
  headInjected = true;

  // helpers for <script> injection, so that Svelte doesn't attempt to interpret
  // the <script>!
  const scriptOpen = "\x3Cscript\x3E";
  const scriptClose = "\x3C/script\x3E";

  // kick the 'gtag()' function on page-change...
  $: {
    //@ts-ignore gtag
    if (trackingId && $page && typeof gtag !== 'undefined') {
      // REVIEW: why is this not an "event" of "page_view"?
      //@ts-ignore gtag
      gtag("config", trackingId, { page_path: $page.path });
    }
  }
</script>

<!--
  Svelte will not do variable replacements inside of <script> tags (apparently?)
  so we have to encapsulate the entire script inside a bogus {@html} block, *and*
  avoid a bare <script> tag.  (The <script src=...> seems to work, 
  interestingly.)
-->
<svelte:head>
  {#if injectHead}
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id={trackingId}"></script>
      {@html `${scriptOpen}
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", "${trackingId}");
${scriptClose}`}
  {/if}
</svelte:head>
