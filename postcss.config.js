import cssNesting from 'tailwindcss/nesting/index.js';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

export default {
  plugins: [
    cssNesting(),
    tailwindcss(),
    autoprefixer(),

    !dev &&
      cssnano({
        preset: 'default',
      }),
  ],
};
