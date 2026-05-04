import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import workerApp from './src/worker.js';
import fs from 'fs';
import path from 'path';

const app = new Hono();

// Serve static files from /dist FIRST
app.use('/*', serveStatic({ root: './dist' }));

// Add the worker API routes
app.route('/', workerApp);

// SPA Fallback for non-API routes
app.get('*', async (c) => {
  if (!c.req.path.startsWith('/api/')) {
    try {
      const indexPath = path.resolve('dist/index.html');
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf-8');
        return c.html(html);
      }
    } catch {
      console.error("Index HTML not found.");
    }
  }
  return c.notFound();
});

// Start Node server on port 3000
serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Node Server (Prod) running on http://localhost:${info.port}`);
});
