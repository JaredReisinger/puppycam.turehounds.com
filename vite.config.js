import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import yaml from '@modyfi/vite-plugin-yaml';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [sveltekit(), yaml(), tailwindcss()],

  resolve: {
    preserveSymlinks: true,
  },

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
