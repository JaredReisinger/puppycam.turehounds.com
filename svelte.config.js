import adapter from '@sveltejs/adapter-static';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // // for more information about preprocessors
  // preprocess: [
  //   // vitePreprocess({
  //   //   postcss: true,
  //   // }),
  //   vitePreprocess(),
  // ],

  kit: {
    version: {
      name: process.env.npm_package_version,
    },

    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: true,
    }),

    alias: {
      // '@generated/*': './src/generated/*',
      '@components/*': './src/components/*',
    },

    // prerender: {
    //   default: true,
    //   enabled: true,
    // },
  },
};

export default config;
