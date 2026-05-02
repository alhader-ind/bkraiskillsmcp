---
name: bootstrap-vite-react-spa
description: Strict, step-by-step initialization protocol for building a bulletproof Vite + React SPA environment. Prevents AI build failures during scaffolding.
tags: [bootstrap, vite, react, spa, tailwind, frontend]
---

# Bootstrap Protocol: Vite React SPA

**Use Case:** The user requests a React framework, a lightweight dashboard, or a highly interactive Single-Page Application (SPA) without strict SEO requirements.
*Note: Create React App (CRA) is entirely deprecated and MUST NOT be used under any circumstances.*

> [!CRITICAL] INTERACTIVE CLI WARNING
> AI Agents often fail when running `npm create vite@latest` because it launches an interactive prompt requiring human TTY input.
> You MUST explicitly write the configuration and boilerplate files yourself following this EXACT Step-by-Step protocol.

## Step 1: Guarantee the `package.json`
Write the exact `package.json` file. This guarantees absolute version control and bypasses all interactive CLIs.

```json
{
  "name": "vite-react-spa",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.3",
    "vite": "^5.3.1"
  }
}
```

## Step 2: Trigger Dependency Lock
Immediately trigger your package installation tool (e.g. `install_dependencies`).
**Crucial:** Do not attempt to run build commands until dependencies are successfully verified.

## Step 3: Global Configurations
Vite relies tightly on three specific infrastructure files. Create them synchronously:

**`vite.config.ts`**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**`tsconfig.node.json`**
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

**`tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**`postcss.config.js`**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Step 4: The Application Entry Root
Vite places `index.html` at the *root* directory, NOT inside public or src.

**`index.html`**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Step 5: Source Files Scaffolding
Set up the React application root inside the `/src` folder.

**`src/index.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root {
  height: 100%;
}
```

**`src/main.tsx`**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**`src/App.tsx`**
```typescript
import { HandMetal } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950 text-zinc-50">
      <div className="flex flex-col items-center gap-4 text-center max-w-lg">
        <HandMetal className="w-16 h-16 text-emerald-400" />
        <h1 className="text-4xl font-bold tracking-tight">Vite SPA Activated</h1>
        <p className="text-zinc-400">
          Your React environment has been strictly scaffolded by the AI Bootstrap Protocol.
          You are now ready to build out your domain components.
        </p>
      </div>
    </div>
  )
}

export default App
```

## Step 6: Verify & Yield
Run `compile_applet` or equivalent testing. A common failure in Vite is missing the `postcss` and `autoprefixer` dependencies if Tailwind CSS styling doesn't apply. Wait for confirmation before writing massive React UI layouts.
