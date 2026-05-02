---
name: bootstrap-nextjs-app-router
description: Strict, step-by-step initialization protocol for building a bulletproof Next.js (App Router) environment. Prevents AI build failures during scaffolding.
tags: [bootstrap, nextjs, react, frontend, framework, react]
---

# Bootstrap Protocol: Next.js App Router

**Use Case:** The user requests a new Next.js application, or a React application utilizing server-side rendering, SEO features, or full-stack API capabilities.

> [!CRITICAL] INTERACTIVE CLI WARNING
> AI Agents often fail when running `npx create-next-app` because it launches an interactive prompt requiring human TTY input. 
> You MUST explicitly write the configuration and boilerplate files yourself following this EXACT Step-by-Step protocol.

## Step 1: Guarantee the `package.json`
Write the exact `package.json` file. This guarantees absolute version control and bypasses all interactive CLIs.

```json
{
  "name": "nextjs-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

## Step 2: Trigger Dependency Lock
Immediately trigger your package installation tool (e.g. `install_dependencies`).
**Crucial:** Do not attempt to run build commands until dependencies are successfully verified.

## Step 3: Global Configurations
While dependencies are installing, write the Next.js foundational config files:

**`next.config.mjs`**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**`postcss.config.mjs`**
```javascript
/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    tailwindcss: {},
  },
};
```

**`tailwind.config.ts`**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

## Step 4: The App Directory (Scaffolding)
Ensure you set up the Next.js App Router by writing files strictly under the `/app` directory.

**`app/globals.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}
```

**`app/layout.tsx`**
```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Application",
  description: "Generated dynamically via structured AI bootstrap protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans flex min-h-screen flex-col">
        {children}
      </body>
    </html>
  );
}
```

**`app/page.tsx`**
```typescript
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 text-slate-900 gap-6">
      <div className="p-4 bg-blue-500/10 text-blue-600 rounded-xl border border-blue-200">
        <h1 className="text-3xl font-bold">Hello World</h1>
      </div>
      <p className="text-slate-500 max-w-sm text-center">
        This Next.js application was successfully skyrocketed from zero using the AI Bootstrap Protocol.
      </p>
    </main>
  );
}
```

## Step 5: Verify & Yield
Run `compile_applet` or equivalent testing. Ensure the application compiles without throwing `Cannot read NextConfig` or missing TypeScript aliases errors. Wait for confirmation before starting heavy domain-specific UI editing.
