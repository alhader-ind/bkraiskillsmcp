---
name: cloudflare-hosting
description: Guidelines for deploying websites and application frameworks to Cloudflare Hosting Services (Pages and Workers). Use when setting up automated deployments or configuring full-stack applications for Cloudflare.
---

# Cloudflare Hosting Services Integration

This skill provides the standard procedures and environment constraints for hosting websites, full-stack application frameworks, and backend APIs using Cloudflare Pages and Cloudflare Workers. 

## 1. Choosing the Right Service

- **Cloudflare Pages:** Use for static websites (React, Vue, plain HTML) and full-stack heavily frontend frameworks (Next.js, Astro, Remix, Nuxt, SvelteKit).
- **Cloudflare Workers:** Use for standalone backend APIs, serverless functions, proxy servers, or purely compute-driven resources.

## 2. Cloudflare Pages Deployment (Frameworks)

For deploying frameworks to Cloudflare Pages, the prevailing method is using **C3 (create-cloudflare-cli)** or manually configuring your framework.

### Next.js
Next.js apps are deployed to Cloudflare Pages using `@cloudflare/next-on-pages`.
1. Install the CLI: `npm install -D @cloudflare/next-on-pages`
2. Update the build script in `package.json`:
```json
"scripts": {
  "build": "next build",
  "pages:build": "npx @cloudflare/next-on-pages"
}
```3. Ensure that Next.js uses the Edge Runtime where needed.

### Astro / Remix / SvelteKit / Nuxt
Most native frameworks have official Cloudflare adapters:
- **Astro**: `npx astro add cloudflare` (Produces a serverless function for Pages).
- **Remix**: Generated with Cloudflare Pages adapter.
- **Static Assets (Vite/React)**: Build output directory is `dist/`. No special adapter is needed beyond mapping the build command `npm run build` and the output directory `dist` during Cloudflare Pages configuration.

## 3. Cloudflare Workers Deployment (APIs & Microservices)

To create or configure a Cloudflare Worker:
1. Ensure the entry point (e.g., `src/index.ts`) exports a standard Fetch handler:
```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response("Hello from Cloudflare Workers!");
  },
};
```
2. Initialize or update `wrangler.toml` at the project root:
```toml
name = "my-worker-app"
main = "src/index.ts"
compatibility_date = "2026-04-28"

# [vars]
# MY_VARIABLE = "example"
```

## 4. Local Development & Wrangler CLI

You **MUST** use Wrangler to test Cloudflare environments locally and perform deployments. 

- **Local Simulation:** Use `npx wrangler dev` or `npx wrangler pages dev dist/` to simulate the Edge environment. Note: When running inside the AI Studio sandboxed environment, ensure that you bind to the correct permissible port (port `3000` is the only external port available).
- **Wrangler Deploy:** `npx wrangler deploy` (for Workers) or `npx wrangler pages deploy dist/` (for Pages).

## 5. Environment Variables & Authentication in AI Studio

To deploy from AI Studio or similar CI/CD automated environments without browser interaction:
- You cannot use `wrangler login` because it requires an interactive browser session.
- **Target Approach:** You **MUST** define `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the environment variables (`.env`).
  - Instruct the user to obtain these from their Cloudflare Dashboard -> API Tokens.
  - Expose a `.env.example`:
```env
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
```

## 6. Binding Storage and Databases

When interacting with Cloudflare's stateful resources (D1, KV, R2):
- Always define bindings in the `wrangler.toml` (Workers) or `wrangler.toml`/UI (Pages).
- Provide TypeScript definitions for the bindings to ensure type safety.
```typescript
export interface Env {
  DB: D1Database;
  MY_KV: KVNamespace;
  BUCKET: R2Bucket;
}
```

## Best Practices
- **Do not configure `appType: "spa"`** if the framework handles its own routing and SSR (like Next.js).
- **Node.js Compatibility:** Cloudflare Workers use the V8 engine, not Node.js. Use `nodejs_compat` in the `wrangler.toml` compatibility flags if you must use built-in Node modules (e.g., `crypto`, `buffer`).
- **Build Times:** Ensure dependencies are pre-compiled and do not attempt to run heavy binary compilations in the Cloudflare environment limits.
