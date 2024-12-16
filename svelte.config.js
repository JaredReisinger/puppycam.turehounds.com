import adapter from '@sveltejs/adapter-static'; // or '-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // version: {
    //   name: process.env.npm_package_version,
    // },

    paths: {
      base: '',
      // assets: '/',
      relative: false,
    },

    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'fallback.html',
      precompress: true,
      strict: true,
    }),

    // prerender: {
    //   default: true,
    //   enabled: true,
    // },
  },
};

export default config;
