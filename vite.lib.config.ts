import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/lib',
    emptyOutDir: false,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/swarm/index.ts'),
        cli: resolve(__dirname, 'src/swarm/cli.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external: [
        '@google/genai',
        '@modelcontextprotocol/sdk',
        'node-fetch',
        /^node:.*/,
        'fs',
        'path',
        'node:fs',
        'node:path',
        'crypto',
        'node:crypto',
        'util',
        'node:util'
      ]
    }
  }
});
