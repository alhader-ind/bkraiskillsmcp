---
name: nextjs-framework
description: Guidelines for building modern React web applications using Next.js App Router. Use when creating full-stack apps or static sites that require Server Components and SEO.
---

# Next.js (App Router) Integration Guidelines

This skill provides the standard procedures and environment constraints for building full-stack applications and websites using Next.js with the App Router architecture.

## 1. Project Setup
When initializing or configuring a Next.js application, always prefer the modern App Router (`app/` directory).
- Use TypeScript and Tailwind CSS as the default tooling.
- Ensure the project structure adheres to Next.js 15+ standards.

## 2. Architecture & Components
Next.js utilizes **React Server Components (RSC)** by default.

### Server Components (Default)
- Keep components as Server Components whenever possible. They do not ship JavaScript to the client.
- They are excellent for data fetching (direct database access, async fetch calls), backend logic, and minimizing client payload.
- Example:
  ```tsx
  export default async function Page() {
    const data = await fetch('https://api.example.com/data').then((res) => res.json());
    return <div>{data.title}</div>;
  }
  ```

### Client Components
- You **MUST** add the `'use client'` directive at the very top of the file when you need interactivity.
- Use Client Components for: React state (`useState`), lifecycle effects (`useEffect`), DOM event listeners (`onClick`), or browser APIs.
- Push Client Components as far down the component tree as possible (at the leaves) to maximize the use of Server Components wrapper elements.

## 3. Routing (App Router)
- Routes are defined by folders inside the `app/` directory.
- The UI for a route is defined in a `page.tsx` file inside that folder.
- Shared layouts (like Navbars or Footers) go in `layout.tsx`.
- Handling Loading states is done in `loading.tsx` and Error boundaries in `error.tsx`.

### API Routes (Route Handlers)
- API endpoints are defined using `route.ts` inside a route segment (e.g., `app/api/users/route.ts`).
- Export HTTP methods directly:
  ```typescript
  import { NextResponse } from 'next/server';

  export async function GET(request: Request) {
    return NextResponse.json({ message: "Hello from API" });
  }

  export async function POST(request: Request) {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  }
  ```

## 4. Development Environment Constraints (AI Studio)
> [!CAUTION]
> **Port Binding Rules:** The application MUST bind to port `3000`. All external traffic routes via an nginx reverse proxy exclusively to port 3000.

- Ensure your `package.json` dev script accommodates the AI Studio environment constraints: `next dev -H 0.0.0.0 -p 3000`.
- Avoid attempting to map Next.js to run on alternative ports or relying on `localhost` dynamically allocating a port inside the sandboxed container.

## 5. Styling
- Default to using Tailwind CSS with utility classes for all styling needs.
- Ensure the Tailwind setup encompasses all layout folders. Provide styling directly via `className` properties.

## 6. Image Optimization
- Use `next/image` (`<Image />`) for optimized image loading. 
- Be sure to configure `next.config.js` with remote patterns if loading images from external sources.

## 7. SEO and Metadata
- Define metadata statically or dynamically in `page.tsx` or `layout.tsx` for optimal SEO:
  ```typescript
  import type { Metadata } from 'next';

  export const metadata: Metadata = {
    title: 'App Name',
    description: 'App Description',
  };
  ```
