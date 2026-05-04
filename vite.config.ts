import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import devServer from '@hono/vite-dev-server';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: 'src/worker.ts',
      exclude: [
        /^(?!\/api).*/, // Exclude all requests that do not start with /api
      ],
      injectClientScript: false,
    }),
  ],
});
