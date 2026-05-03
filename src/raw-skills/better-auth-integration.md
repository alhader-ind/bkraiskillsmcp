---
name: better-auth-integration
description: Implementation guide for Better Auth in modern JS/TS frameworks, covering type-safe authentication, database adapters, plugins, and session management.
---

# Better Auth Integration

Better Auth is a modern, modular, and deeply type-safe authentication framework for TypeScript environments.

## 1. Installation
Install the core Better Auth package.
```bash
npm install better-auth
```
If using a database adapter (e.g., Prisma):
```bash
npm install @better-auth/prisma
```

## 2. Server Configuration
Create the central `auth.ts` file to define your Better Auth instance and plugins.

```ts
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "sqlite", "mysql"
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    nextCookies(), // Next.js specific plugin
  ]
});
export type Auth = typeof auth;
```

## 3. Database Schema
Better Auth relies on specific tables (`user`, `session`, `account`, `verification`). Generate these via its CLI or map them to your schema tool (like Prisma).
```bash
npx better-auth generate
```

## 4. API Routes
Expose the auth handler to handle paths like `/api/auth/sign-in`.

```ts
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth.handler);
export { handler as GET, handler as POST };
```

## 5. Client Usage
Better Auth exports a strongly typed client generation tool.

```ts
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { useSession, signIn, signUp, signOut } = authClient;
```
Usage in components:
```tsx
'use client';
import { useSession, signOut } from "@/lib/auth-client";

export default function UserInfo() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;

  return <button onClick={() => signOut()}>Sign out</button>;
}
```
