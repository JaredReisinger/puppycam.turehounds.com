import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import yaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
  plugins: [sveltekit(), yaml()],

  resolve: {
    preserveSymlinks: true,
  },

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
