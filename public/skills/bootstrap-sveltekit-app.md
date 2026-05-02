---
name: bootstrap-sveltekit-app
description: Strict, step-by-step initialization protocol for building a bulletproof SvelteKit + Svelte 5 environment. Bypasses interactive create-svelte CLIs.
tags: [bootstrap, svelte, sveltekit, frontend, tailwind, vite]
---

# Bootstrap Protocol: SvelteKit + Svelte 5

**Use Case:** The user requests a Svelte application, utilizing SvelteKit for routing, SSR, or full-stack capabilities, styled with Tailwind CSS.

> [!CRITICAL] INTERACTIVE CLI WARNING
> AI Agents often fail when running `npm create svelte@latest` because it launches an interactive prompt requiring human TTY input.
> You MUST explicitly write the configuration and boilerplate files yourself following this EXACT Step-by-Step protocol to bypass scaffolding prompts.

## Step 1: Guarantee the `package.json`
Write the exact `package.json` file.

```json
{
  "name": "sveltekit-app",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-check --tsconfig ./tsconfig.json --watch"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "svelte": "^5.0.0-next.1",
    "svelte-check": "^3.6.0",
    "tailwindcss": "^3.4.0",
    "tslib": "^2.4.1",
    "typescript": "^5.0.0",
    "vite": "^5.0.3"
  },
  "type": "module"
}
```

## Step 2: Trigger Dependency Lock
Immediately trigger package installation.

## Step 3: Global Configurations
Write the vital SvelteKit and Vite configuration files.

**`svelte.config.js`**
```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};

export default config;
```

**`vite.config.ts`**
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()]
});
```

**`tsconfig.json`**
```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true
  }
}
```

**`tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: []
};
```

**`postcss.config.js`**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
};
```

## Step 4: App Routing Boundaries
SvelteKit relies on a strict `/src/routes` directory structure and an `app.html` entry point.

**`src/app.html`**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

**`src/app.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`src/routes/+layout.svelte`**
```svelte
<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen bg-neutral-950 font-sans text-neutral-50 flex flex-col">
  {@render children()}
</div>
```

**`src/routes/+page.svelte`**
```svelte
<main class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
  <div class="p-6 bg-orange-600/10 border border-orange-500/30 rounded-2xl">
    <h1 class="text-4xl font-extrabold tracking-tight text-orange-500">SvelteKit 5 Scaffolded</h1>
  </div>
  <p class="text-lg text-neutral-400 max-w-md mx-auto">
    Your Svelte application is ready. Tailwind is built in, and SSR routing is active.
  </p>
</main>
```

## Step 5: Verify & Yield
Run `compile_applet` or equivalent testing. SvelteKit will auto-generate the `.svelte-kit` directory on the first dev or build run.
