import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// GitHub Pages serves under /matefc-mock-app/, while Cloudflare Pages serves at
// the domain root — pass DEPLOY_BASE=/ for the Cloudflare (beta) build. Routing
// uses HashRouter, so no server-side rewrites are needed.
export default defineConfig(({ mode }) => ({
  base: process.env.DEPLOY_BASE ?? (mode === 'production' ? '/matefc-mock-app/' : '/'),
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
}));
