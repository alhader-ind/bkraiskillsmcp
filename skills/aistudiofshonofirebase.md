---
name: AI Studio Fullstack Hono Firebase Starter
description: Strict initialization protocol for building a bulletproof Hono.js Backend + Vite React SPA Frontend environment with Firebase Admin Auth and SQLite in AI Studio.
---

# Bootstrap Hono + Vite React + Firebase Auth

When a user requests to build a fullstack application using **Hono**, **Vite** (React), **Firebase Auth**, and **SQLite (libSQL)** within the AI Studio environment, follow this strict playbook to ensure the stack resolves properly.

## Problem Context
By default, applying the `@hono/vite-dev-server` plugin without specific exclusion rules causes the Hono server to greedily intercept standard web assets (like `index.html` and `.tsx` files). In the AI Studio environment, this leads to a notorious `404 Not Found` screen because Vite's React router never receives the request.

## Core Architectural Blueprint

### Step 1: Vite + Hono Dev Server Fix
You MUST explicitly exclude standard Vite routes from the Hono Dev Server interceptor. The most effective approach is to configure Hono to *only* intercept paths starting with `/api`.

**`vite.config.ts`**
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import honoDevServer from '@hono/vite-dev-server';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    honoDevServer({
      entry: 'server.ts',
      // CRITICAL: Exclude EVERYTHING that isn't an /api route.
      // This allows Vite to properly serve the React frontend app.
      exclude: [
        /^(?!\/api(\/|$)).*/,
      ],
      injectClientScript: false,
    }),
  ],
  server: {
    port: 3000,
  }
});
```

### Step 2: Hono Server Entry (`server.ts`)
The server serves two distinct roles: API runtime in development, and Fullstack Static + API server in production.

**`server.ts`**
```ts
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

app.get('/api/health', (c) => c.json({ status: 'ok' }));

// 1. In Production, serve the Vite built files
if (process.env.NODE_ENV === 'production') {
  app.use('/*', serveStatic({ root: './dist/client' }));
  app.get('*', serveStatic({ path: './dist/client/index.html' }));
}

export default app;

// 2. Start node-server
if (process.env.NODE_ENV === 'production' || process.argv[1]?.endsWith('server.cjs')) {
  serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
}
```

### Step 3: Firebase Admin Authentication Middleware
Use `firebase-admin` to securely verify JWT tokens provided by the client side.

```ts
import { adminAuth } from './src/lib/firebase-admin';

export const authMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing token' }, 401);
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]);
    c.set('user', decodedToken);
    await next();
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
};
// Usage: app.get('/api/protected', authMiddleware, (c) => ...)
```

### Step 4: Strict Build Scripting (`package.json`)
The Vite build process defaults to building the client. You MUST append an `esbuild` step to bundle the `server.ts` for Node execution.

```json
"scripts": {
  "build": "vite build && npx esbuild server.ts --bundle --platform=node --target=node20 --outfile=dist/server.cjs",
  "start": "node dist/server.cjs"
}
```

## Summary
By isolating the Hono router strictly to the `/api` regex and deferring all other paths to Vite, you guarantee zero collision between standard SSR/SPA frontends and edge-ready backend logic!
