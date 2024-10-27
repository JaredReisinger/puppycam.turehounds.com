import type { Config } from 'tailwindcss';
// import colors from 'tailwindcss/colors';
import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from '@tailwindcss/typography';
import ariaAttributes from 'tailwindcss-aria-attributes';

// @ts-expect-error we *know* 'config' is a valid property!
const typographyConfig = typography().config.theme.typography;

// console.log(
//   `========================\n${Object.keys(typographyConfig.DEFAULT.css[1])}\n=========================`
// );

const proseBlack = ({ theme }) => ({
  '--tw-prose-body': theme('colors.black'),
  '--tw-prose-headings': theme('colors.black'),
  '--tw-prose-lead': theme('colors.black'),
  '--tw-prose-links': theme('colors.black'), // links!
  '--tw-prose-bold': theme('colors.black'),
  '--tw-prose-counters': theme('colors.black'),
  '--tw-prose-bullets': theme('colors.black'),
  '--tw-prose-hr': theme('colors.black'),
  '--tw-prose-quotes': theme('colors.black'),
  '--tw-prose-quote-borders': theme('colors.black'),
  '--tw-prose-captions': theme('colors.black'),
  '--tw-prose-code': theme('colors.black'),
  '--tw-prose-pre-code': theme('colors.black'),
  '--tw-prose-pre-bg': theme('colors.black'),
  '--tw-prose-th-borders': theme('colors.gray[400]'),
  '--tw-prose-td-borders': theme('colors.gray[400]'),
  '--tw-prose-invert-body': theme('colors.black'),
  '--tw-prose-invert-headings': theme('colors.white'),
  '--tw-prose-invert-lead': theme('colors.black'),
  '--tw-prose-invert-links': theme('colors.white'),
  '--tw-prose-invert-bold': theme('colors.white'),
  '--tw-prose-invert-counters': theme('colors.black'),
  '--tw-prose-invert-bullets': theme('colors.black'),
  '--tw-prose-invert-hr': theme('colors.black'),
  '--tw-prose-invert-quotes': theme('colors.black'),
  '--tw-prose-invert-quote-borders': theme('colors.black'),
  '--tw-prose-invert-captions': theme('colors.black'),
  '--tw-prose-invert-code': theme('colors.white'),
  '--tw-prose-invert-pre-code': theme('colors.black'),
  '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
  '--tw-prose-invert-th-borders': theme('colors.black'),
  '--tw-prose-invert-td-borders': theme('colors.black'),
});

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    fontFamily: {
      sans: ['Encode Sans', 'Arial', 'Helvetica', 'sans-serif'],
      serif: ['serif'],
    },

    // it is *absurd* that this is the easiest way to set the default typography
    // "prose" color...
    typography: ({ theme }) => ({
      ...typographyConfig,
      DEFAULT: {
        ...typographyConfig.DEFAULT,
        css: [
          typographyConfig.DEFAULT.css[0],
          proseBlack(theme),
          typographyConfig.DEFAULT.css[2],
          typographyConfig.DEFAULT.css[3],
        ],
      },
    }),

    extend: {
      typography: ({ theme }) => ({
        // custom theme?
        black: {
          css: {
            ...proseBlack(theme),
          },
        },
      }),
    },
  },

  plugins: [typography, aspectRatio, ariaAttributes],
} as Config;
