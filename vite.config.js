import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-app-html',
      configureServer(server) {
        // Intercept client-side SPA routes to serve app.html
        // while preserving the original index.html and /api endpoints untouched
        server.middlewares.use((req, res, next) => {
          const url = req.url.split('?')[0];
          if (
            url === '/' ||
            url === '/index.html' ||
            (!url.startsWith('/api') &&
             !url.startsWith('/@') &&
             !url.startsWith('/src') &&
             !url.startsWith('/node_modules') &&
             !url.startsWith('/logo') &&
             !url.startsWith('/images') &&
             !url.includes('.'))
          ) {
            req.url = '/app.html';
          }
          next();
        });
      }
    }
  ],
  // During local development, proxy /api/* to the Express API server.
  // In production the Express server serves both the static build and the API.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'app.html')
      }
    }
  }
});
