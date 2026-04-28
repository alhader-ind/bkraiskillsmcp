---
name: Nuxt Framework
description: Guidelines for building modern Vue web applications using Nuxt 3+.
---

# Nuxt 3+ Framework Guidelines

Nuxt is a powerful framework for building Vue 3 applications with features like Server-Side Rendering (SSR), Static Site Generation (SSG), and a robust file-based routing system.

## 1. Project Structure

- **pages/**: File-based routing. Each `.vue` file becomes a route.
- **components/**: Auto-imported components. Use subdirectories for organization.
- **layouts/**: Reusable page structures.
- **composables/**: Auto-imported state and logic helpers.
- **server/**: Nitro engine backend routes (API endpoints).
- **public/**: Static assets like robots.txt or icons.
- **assets/**: Compiled assets like CSS and images.

## 2. Best Practices

- **Auto-imports**: Take advantage of Nuxt's auto-importing for components, composables, and Vue APIs (like `ref`, `computed`).
- **Data Fetching**: Use `useFetch` or `useAsyncData` for isomorphic data fetching that works both on server and client.
- **State Management**: Use `useState` for simple shared state or integrate Pinia for complex stores.
- **Optimization**: Use `<NuxtImg />` for image optimization and `<NuxtLink />` for prefetching routes.
- **Type Safety**: Leverage TypeScript's full potential with `nuxi typecheck`.

## 3. Deployment & Runtime

- Nuxt apps default to port 3000.
- For AI Studio, ensure `nuxt.config.ts` has proper server configuration if needed, though default `nuxi dev` usually handles it.
- Use `npm run build` to generate the `.output` directory for production.

## 4. Example Page

```vue
<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts')
</script>

<template>
  <div>
    <h1>Blog Posts</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <NuxtLink :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
```
