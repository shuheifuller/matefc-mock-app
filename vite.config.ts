import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// `base` is set to the repo name so assets resolve correctly on GitHub Pages
// (https://shuheifuller.github.io/matefc-mock-app/). Routing uses HashRouter,
// so no server-side rewrites are needed.
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/matefc-mock-app/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
