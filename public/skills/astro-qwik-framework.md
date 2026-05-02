---
name: astro-qwik-framework
description: Guidelines for building ultra-fast, resumable web applications using Astro and Qwik. Use when creating content-heavy sites, highly interactive applications where TTI (Time to Interactive) is critical, or when combining SSG with resumable interactivity.
---

# Astro & Qwik Framework Integration Guidelines

This skill provides the standard procedures and environment constraints for building modern web applications using **Astro** (for content, routing, and Islands architecture) and **Qwik** (for zero-hydration resumable interactivity).

## 1. Project Setup and Architecture

You can use Qwik as a standalone meta-framework (Qwik City) or integrate it within an Astro project for the best of both worlds.

### Astro + Qwik (Recommended for Content + High Interactivity)
Astro allows you to build UI with its native `.astro` components (which render to static HTML) and embed Qwik components for client-side interactivity without the heavy hydration cost of React or Vue.

**Integration:**
Add the Qwik integration to Astro:
`npx astro add @qwikdev/astro`

## 2. Astro Guidelines

- **`.astro` Files:** Use Astro components for layout, routing, and static HTML generation.
- **Data Fetching:** Fetch data securely in the frontmatter of `.astro` files (the code block delineated by `---`). It runs only on the server/build-time.
  ```astro
  ---
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  ---
  <h1>{data.title}</h1>
  ```
- **Islands Architecture:** By default, framework components (like React, Svelte, or Qwik) inside Astro are static HTML. To make them interactive, you traditionally use client directives like `client:load` or `client:visible`.
  - *Exception for Qwik:* Qwik components in Astro **do not need** client directives because Qwik's resumability handles JS delivery automatically as users interact.

## 3. Qwik Guidelines (Resumability & Reactivity)

Qwik is built around **Resumability** instead of hydration. It serializes the application state into the HTML and lazy-loads JavaScript only when an event occurs.

### The `$` Suffix
The `$` symbol is a strict rule in Qwik. It tells the Qwik optimizer to extract the function into a separate lazy-loaded chunk.
- `component$()`: Defines a Qwik component.
- `useTask$()`: Like `useEffect` but runs on server (during SSR) and client.
- `onClick$()`, `onInput$()`: Event handlers that are lazy-loaded.

### Component Example
```tsx
import { component$, useSignal } from '@builder.io/qwik';

export const Counter = component$(() => {
  const count = useSignal(0);

  return (
    <button onClick$={() => count.value++}>
      Count: {count.value}
    </button>
  );
});
```

### State Management
- `useSignal(initialValue)`: For primitive values (strings, numbers, booleans). Accessed via `.value`.
- `useStore(initialObject)`: For deeply reactive objects, arrays, and complex state.

## 4. Development Environment Constraints (AI Studio)

> [!CAUTION]
> **Port Binding Rules:** The application MUST bind to port `3000` and host `0.0.0.0`. All external traffic routes via an nginx reverse proxy exclusively to port 3000.

- **For Astro:** Ensure your `package.json` dev script accommodates the AI Studio constraints:
  ```json
  "scripts": {
    "dev": "astro dev --port 3000 --host 0.0.0.0"
  }
  ```
- **For standalone Qwik (Vite):** Update the `vite.config.ts` or `package.json` to enforce port 3000. 

## 5. Styling

- Default to using **Tailwind CSS** with utility classes.
- For Astro: `npx astro add tailwind`.
- For Qwik: Follow the standard Vite + Tailwind setup.
- Scoped styling is available in `.astro` files using the `<style>` block if necessary.

## 6. Using Qwik inside Astro

When using Qwik components inside Astro, pass server-fetched data as props. Qwik will serialize these props into the HTML so they are immediately available on the client.

```astro
---
// index.astro
import { Counter } from '../components/Counter';
const serverData = { startingCount: 10 };
---

<html lang="en">
  <body>
    <h1>My Astro + Qwik App</h1>
    <!-- No client directive needed for Qwik! -->
    <Counter startingCount={serverData.startingCount} />
  </body>
</html>
```
