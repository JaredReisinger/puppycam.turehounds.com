<script lang="ts">
  import { page } from '$app/state';

  import Icon from 'svelte-fa';
  import {
    faFacebookF,
    faInstagram,
    faYoutube,
    type IconDefinition,
  } from '@fortawesome/free-brands-svg-icons';

  import tureHoundsLogo from '$lib/images/ture-hounds-logo.png';

  /** Information about a navigation item/route. */
  type RouteInfo = [string, string, IconDefinition?, string?];

  const routeInfo: RouteInfo[] = [
    ['/', 'Live'],
    ['/stats', 'Stats'],
    ['/news', 'News'],
    ['/about', 'About'],
    // These aren't really routes, but make the UI easier to render!
    ['https://turehounds.com', 'Ture Hounds Home'],
    [
      'https://www.facebook.com/TureHounds',
      '[FACEBOOK]',
      faFacebookF,
      '#1877f2',
    ],
    [
      'https://www.instagram.com/turehounds',
      '[INSTAGRAM]',
      faInstagram,
      '#E1306C',
    ],
    ['https://www.youtube.com/@turehounds', '[YOUTUBE]', faYoutube, '#ff0000'],
  ];
</script>

<nav
  class="border-b border-gray-300 p-3 pb-1 text-sm font-light w-full flex flex-col md:flex-row items-center"
>
  <div class="text-lg font-bold">
    <a href="/">
      <img
        alt="Ture Hounds"
        src={tureHoundsLogo}
        class="h-12 pr-1 pb-2 align-middle inline"
      />
      PuppyCam
    </a>
  </div>

  <ul class="md:ml-4 lg:ml-16 flex">
    {#each routeInfo as route}
      {@const [url, name, icon, color] = route}
      <li>
        <a
          class="block p-2 decoration-2 underline-offset-4 hover:text-sky-500 aria-current-page:text-sky-500 aria-current-page:underline transition-colors duration-200"
          aria-current={page.url.pathname === url ? 'page' : undefined}
          href={url}
          ><span class:icon
            >{#if icon}<Icon {icon} size="lg" {color} />{:else}{name}{/if}</span
          ></a
        >
      </li>
    {/each}
  </ul>
</nav>

<style lang="postcss">
</style>
