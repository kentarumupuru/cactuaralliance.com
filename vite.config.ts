import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/cactuaralliance.com/',
  build: {
    chunkSizeWarningLimit: 1200,
  },
  server: {
    watch: {
      ignored: ['**/ca-proxy/**'],
    },
  },
});
