import type { Config } from 'tailwindcss';
// import colors from 'tailwindcss/colors';
import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from '@tailwindcss/typography';
import ariaAttributes from 'tailwindcss-aria-attributes';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    fontFamily: {
      sans: ['Encode Sans', 'Arial', 'Helvetica', 'sans-serif'],
      serif: ['serif'],
    },

    // extend: {},
  },

  plugins: [typography, aspectRatio, ariaAttributes],
} as Config;
