---
name: clerk-auth-architect
description: Configuration and implementation guide for Clerk Auth in Next.js/React applications, covering UI components, middleware protection, and webhook synchronization.
---

# Clerk Auth Architect

Clerk is a comprehensive identity and user management platform. This guide covers how to set it up in a modern React/Next.js environment.

## 1. Installation
Install the required package for your framework.
```bash
npm install @clerk/nextjs
```

## 2. Environment Variables
Add your Clerk API keys to your `.env` or `.env.local` file.
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 3. Middleware Configuration
Protect your routes using Clerk's middleware. Create a `middleware.ts` file in your root or `src/` directory.

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
      await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

## 4. App Provider
Wrap your application with the `<ClerkProvider>` in your root layout (`src/app/layout.tsx`).

```tsx
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

## 5. Webhook Synchronization (Important)
Since Clerk holds your user data, you need to sync it to your own database (like PostgreSQL/Prisma or Supabase) using Webhooks.
Use Svix to verify webhooks in an API route (`/api/webhooks/clerk/route.ts`).
```ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) throw new Error('Please add WEBHOOK_SECRET')

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) return new Response('Error', { status: 400 });

  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    return new Response('Error', { status: 400 })
  }

  // Handle evt.type == 'user.created', 'user.updated', etc.
  return new Response('', { status: 200 })
}
```
