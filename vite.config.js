// import { exec as execCallback } from 'child_process';
// import { promisify } from 'util';

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Get current tag/commit and last commit date from git
// const exec = promisify(execCallback);
// const [version, commitHash] = (
//   await Promise.all([exec('git describe --tags'), exec('git rev-parse HEAD')])
// ).map((v) => JSON.stringify(v.stdout.trim()));

export default defineConfig({
  plugins: [sveltekit()],

  // define: {
  //   CLIENT_VERSION: version,
  //   CLIENT_COMMIT_HASH: commitHash,
  // },

  resolve: {
    alias: {
      // '@generated': __dirname + '/src/generated',
      '@components': __dirname + '/src/components',
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },

  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
});
