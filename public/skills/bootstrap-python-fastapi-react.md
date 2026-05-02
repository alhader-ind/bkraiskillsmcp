---
name: bootstrap-python-fastapi-react
description: Strict initialization protocol for a Python FastAPI Backend and Vite React Frontend. Teaches AI to handle venv and requirements.txt alongside Node.
tags: [bootstrap, python, fastapi, react, vite, fullstack, venv]
---

# Bootstrap Protocol: Python FastAPI + Vite React Full-Stack

**Use Case:** The user requests a Python backend (often for AI/Data tasks) paired with a modern React frontend in a single repository.

> [!CRITICAL] VENV & CORS WARNING
> AI Agents must specifically isolate the Python environment using `venv`. Do not install global pip packages. The frontend and backend must run on different ports (e.g., FastAPI on 8000, Vite on 3000), using Vite proxy to bypass CORS.

## Step 1: Root Orchestration
Set up the root directory to manage both frontend and backend concurrently via NPM.

**`package.json` (Root)**
```json
{
  "name": "fastapi-react-root",
  "private": true,
  "scripts": {
    "start": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm install && npm run dev",
    "dev:backend": "cd backend && bash start.sh",
    "setup:backend": "cd backend && python3 -m venv venv && ./venv/bin/pip install -r requirements.txt"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

## Step 2: The Backend Environment (`/backend`)
Isolate the Python backend. Instruct the AI to explicitly create `requirements.txt` and a startup script wrapper.

**`backend/requirements.txt`**
```text
fastapi==0.111.0
uvicorn==0.29.0
```

**`backend/start.sh`**
```bash
#!/bin/bash
# Automatically source the virtual environment
if [ ! -d "venv" ]; then
  echo "Setting up Python Virtual Environment..."
  python3 -m venv venv
  ./venv/bin/pip install -r requirements.txt
fi

source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**`backend/main.py`**
```python
from fastapi import FastAPI

app = FastAPI(title="React + FastAPI Protocol")

@app.get("/api/health")
def read_health():
    return {"status": "ok", "message": "FastAPI is running successfully in venv"}
```

## Step 3: The Frontend Environment (`/frontend`)
Configure the React Vite app to proxy requests to the FastAPI backend.

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
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
});
```

*(AI Note: Ensure you generate the baseline Vite React structural files like package.json, index.html, main.tsx for the frontend following standard SPAs)*

## Step 4: Verify & Yield
Trigger full initialization by running:
1. `npm install` at root
2. `npm run setup:backend` to initialize the venv
3. `npm start` to fire up gracefully without stalling. Wait for the success signal.
