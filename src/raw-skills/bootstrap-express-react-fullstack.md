---
name: bootstrap-express-react-fullstack
description: Strict, step-by-step initialization protocol for building a bulletproof Express.js Backend + Vite React SPA Frontend environment. Solves CORS and port configuration limits.
tags: [bootstrap, express, react, fullstack, vite, cors, concurrently]
---

# Bootstrap Protocol: Express.js + Vite React Full-Stack

**Use Case:** The user requests a Full-Stack application requiring a custom Express.js backend and a React (Vite) frontend, running within the same repository.

> [!CRITICAL] CORS & PORT ARCHITECTURE WARNING
> AI Agents struggle with full-stack networking. You MUST isolate the backend to port `3001` and the frontend to port `3000` (or proxy logic). You MUST use Vite's proxy to bypass CORS restrictions. You MUST orchestrate both environments using `concurrently` from the root.

## Step 1: Root Orchestration
Set up the root directory to manage both frontend and backend concurrently.

**`package.json` (Root)**
```json
{
  "name": "fullstack-app-root",
  "private": true,
  "scripts": {
    "start": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm install && npm run dev",
    "dev:backend": "cd backend && npm install && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

## Step 2: The Backend Environment (`/backend`)
Create the backend structure strictly on port 3001.

**`backend/package.json`**
```json
{
  "name": "backend",
  "type": "module",
  "scripts": {
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5"
  }
}
```

**`backend/server.js`**
```javascript
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Standard middleware
app.use(cors());
app.use(express.json());

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Express Backend is fully operational.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Backend] Server listening on http://localhost:${PORT}`);
});
```

## Step 3: The Frontend Environment (`/frontend`)
Set up the Vite React SPA configuring the proxy to map `/api` to the backend.

**`frontend/vite.config.ts`**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
});
```
*(Ensure all other standard Vite config files like `tailwind.config.js` and `package.json` map to standard React SPA protocols).*

## Step 4: Verify & Yield
Trigger dependency installation at the root. Start the stack via `npm start`. Ensure the React component successfully executes a `fetch('/api/health')` without throwing a CORS error.
