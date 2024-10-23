import type { Config } from 'tailwindcss';
import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {},
  },

  plugins: [typography, aspectRatio],
} as Config;
