---
name: bootstrap-nuxt-vue3
description: Strict, step-by-step initialization protocol for building a Nuxt 3 + Vue 3 environment. Bypasses highly interactive Nuxt CLIs.
tags: [bootstrap, nuxt, vue, frontend, tailwind, ssr]
---

# Bootstrap Protocol: Nuxt 3 + Vue 3

**Use Case:** The user requests a Vue application utilizing Nuxt 3 for Server-Side Rendering (SSR), Static Site Generation (SSG), or advanced Vue 3 architectures.

> [!CRITICAL] INTERACTIVE CLI WARNING
> Standard installation via interactive CLI will crash the AI environment. You MUST force the application bootstrap using exact command flags or raw package instantiation.

## Step 1: Force Non-Interactive Initialization
You must run the Nuxt initializer with the `--force` flag on the current directory to bypass folder-creation prompts, and strictly skip git/package manager interactive prompts.

**Execution Command:**
Run this shell command:
```bash
npx -y nuxi@latest init . --force --no-install --gitInit=false
```

## Step 2: Install Required Dependencies
Nuxt requires specific module handling. Install the core frameworks and the Tailwind module non-interactively using your package installer.

**Execution Command:**
```bash
npm install
npm install -D @nuxtjs/tailwindcss
```

*(Alternatively, construct the `package.json` manually if the `nuxi` command is blocked)*
**Fallback `package.json`**
```json
{
  "name": "nuxt-app",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "nuxt": "^3.12.0",
    "vue": "^3.4.27",
    "vue-router": "^4.3.3"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.12.0"
  }
}
```

## Step 3: Nuxt Configuration
You must explicitly configure `@nuxtjs/tailwindcss` in `nuxt.config.ts`. 

**`nuxt.config.ts`**
```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
```

## Step 4: UI Boilerplate
Replace the default `app.vue` with a confirmed working Vue template to verify Tailwind parsing.

**`app.vue`**
```vue
<template>
  <div class="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-emerald-50 font-sans">
    <div class="p-8 bg-emerald-900 border border-emerald-700/50 rounded-2xl shadow-2xl max-w-md text-center space-y-4">
      <h1 class="text-3xl font-bold tracking-tight">Nuxt 3 Activated</h1>
      <p class="text-emerald-300">
        Your Vue 3 environment has been successfully bootstrapped using the AI strict protocol. Tailwind CSS is compiled and ready.
      </p>
    </div>
  </div>
</template>
```

## Step 5: Verify & Yield
Execute `compile_applet`. Ensure the Nuxt preparation hooks fire successfully (`nuxt prepare`). Wait for the success signal before implementing heavy page logic in `/pages`.
