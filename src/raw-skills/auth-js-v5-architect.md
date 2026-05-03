---
name: auth-js-v5-architect
description: Comprehensive configuration and implementation guide for Auth.js v5 (NextAuth) in modern JS frameworks, covering Next.js setup, JWT/Database sessions, edge compatibility, and CSRF defense.
---

# Auth.js v5 Architect

This guide outlines the modern setup and configuration of **Auth.js v5** (formerly NextAuth.js), the industry-standard authorization framework for modern JavaScript applications.

## 1. Core Concepts
Auth.js v5 decouple the authentication logic from Next.js specifics, allowing to use it in multiple frameworks (SvelteKit, Express, etc.), while still providing a unified `NextAuth` entry for Next.js.
Key improvements:
- Edge runtime support.
- Native TypeScript support without module augmentation overrides if possible.
- Agnostic core (`@auth/core`).

## 2. Next.js App Router Setup

### Installation
Ensure you install the beta/latest versions for v5.
```bash
npm install next-auth@beta
```

### Environment Variables
Generate an auth secret. Auth.js v5 relies on standard environment variables like `AUTH_SECRET` rather than `NEXTAUTH_URL`.
```env
# .env.local
AUTH_SECRET=your_super_secret_string # You can generate this using `npx auth secret`
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
```

### Configuration (`auth.ts`)
In Next.js, the best practice is to have a centralized `auth.ts` file in the root or `src/` directory.

```ts
// src/auth.ts
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export const {
  handlers,
  signIn,
  signOut,
  auth
} = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    // other providers...
  ],
  // Optional: Edge-compatible adapter and session configurations
});
```

### Route Handlers
Export the `GET` and `POST` handlers inside a catch-all route handler.

```ts
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

## 3. Session Fetching

### Server-Side (App Router)
Leverage the exported `auth()` method for fast, server-side session checks.

```tsx
// src/app/page.tsx
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  
  if (!session) return <div>Not authenticated</div>;

  return <div>Welcome, {session.user?.name}</div>;
}
```

### Client-Side
To read sessions in client components (`use client`), use `SessionProvider` (wrapping the layout) and the `useSession` hook.

```tsx
'use client';
import { useSession } from 'next-auth/react';

export function UserButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <button>Sign In</button>;

  return <div>User: {session.user?.name}</div>;
}
```

## 4. Edge-Compatible Database Adapters
Auth.js v5 is fully edge-compatible. Ensure your database driver is also edge compatible (e.g., Prisma Accelerate or neon serverless).

```ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client/edge'; // Use Edge Driver
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  session: {
    strategy: 'jwt', // Strategy depends on adapter capability and use-case
  },
});
```

## 5. JWT vs. Database Sessions
- **JWT (Default without adapters):** Fast and lightweight, stored securely in an HTTP-only cookie.
- **Database (Default with an adapter):** Stores a session identifier in the cookie and looks up the session in the DB.

If you specify an adapter but want to use JWTs (beneficial for edge environments due to less DB lookup overhead):
```ts
session: {
  strategy: 'jwt',
}
```

## 6. CSRF Protection
Auth.js automatically utilizes dynamic double-submit cookie mechanisms to block Cross-Site Request Forgery (CSRF). 
To utilize server actions for mutations cleanly, you can pipe the `auth()` method or action validations:
```ts
// server action
'use server';
import { auth } from '@/auth';

export async function mutateData() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  
  // Proceed with mutation...
}
```

## Summary
- Put all configuration in a root-level `auth.ts` file.
- `AUTH_SECRET` is required and automatically picked up.
- `auth()` seamlessly replaces legacy methods for server contexts.
- Make adapters edge-compatible to benefit from Next.js serverless performance architectures.
