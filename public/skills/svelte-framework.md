---
name: svelte-framework
description: Guidelines for building reactive web applications using Svelte 5 and SvelteKit. Use when creating modern, highly reactive full-stack apps or static sites.
---

# Svelte & SvelteKit Integration Guidelines

This skill provides the standard procedures and environment constraints for building full-stack applications and websites using Svelte 5 and SvelteKit.

## 1. Project Setup
When initializing or configuring a Svelte application, always prefer SvelteKit with Svelte 5.
- Use TypeScript and Tailwind CSS as the default tooling.
- Ensure the project structure adheres to SvelteKit routing conventions.

## 2. Svelte 5 Runes (Reactivity)
Svelte 5 introduces "Runes" for reactivity. You should use them as the primary way of defining component state and logic.

### State and Props
- Use `$state()` for reactive variables.
- Use `$props()` to receive component properties.
- Example:
  ```svelte
  <script lang="ts">
    let { initialCount = 0 } = $props();
    let count = $state(initialCount);

    function increment() {
      count += 1;
    }
  </script>

  <button onclick={increment}>
    Count is {count}
  </button>
  ```

### Derived and Effects
- Use `$derived()` for computed values.
- Use `$effect()` for side effects and DOM manipulations that require the component to be mounted.
  ```svelte
  <script lang="ts">
    let count = $state(0);
    let double = $derived(count * 2);

    $effect(() => {
      console.log(`The count is now ${count}`);
    });
  </script>
  ```

## 3. Routing (SvelteKit)
- Routes are defined by folders inside the `src/routes/` directory.
- The UI for a route is defined in a `+page.svelte` file inside that folder.
- Shared layouts (like Navbars or Footers) go in `+layout.svelte`.
- Global styles and initial setup are typically imported in `src/routes/+layout.svelte`.

### Data Fetching
- Provide data to a page via a `+page.ts` (client & server) or `+page.server.ts` (server-only) file.
- Example `src/routes/blog/+page.server.ts`:
  ```typescript
  import type { PageServerLoad } from './$types';

  export const load: PageServerLoad = async () => {
    return {
      posts: [{ title: 'Hello World' }]
    };
  };
  ```
- Access data in `src/routes/blog/+page.svelte`:
  ```svelte
  <script lang="ts">
    let { data } = $props();
  </script>

  {#each data.posts as post}
    <h2>{post.title}</h2>
  {/each}
  ```

### API Routes
- API endpoints are defined using `+server.ts` inside a route segment.
- Export HTTP methods directly:
  ```typescript
  import { json } from '@sveltejs/kit';
  import type { RequestHandler } from './$types';

  export const GET: RequestHandler = async () => {
    return json({ message: "Hello from API" });
  };
  ```

## 4. Development Environment Constraints (AI Studio)
> [!CAUTION]
> **Port Binding Rules:** The application MUST bind to port `3000`. All external traffic routes via an nginx reverse proxy exclusively to port 3000.

- Ensure your `package.json` dev script accommodates the AI Studio environment constraints. Vite handles this natively if configured, but ensure the port is explicitly `3000` and host is `0.0.0.0` if using a custom server or modifying the Vite config (`vite dev --port 3000 --host 0.0.0.0`).

## 5. Styling
- Default to using Tailwind CSS with utility classes for all styling needs.
- Ensure the Tailwind setup encompasses all layout folders. 
- You can provide component-specific styling inside the `<style>` tag of a Svelte component if strict scoping is necessary, but Tailwind utilities are preferred.

## 6. Snippets (Reusable UI)
Svelte 5 uses snippets instead of slots for component composition:
```svelte
{#snippet mySnippet(name)}
  <p>Hello {name}</p>
{/snippet}

{@render mySnippet("Alice")}
```
