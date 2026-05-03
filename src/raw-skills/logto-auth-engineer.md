---
name: logto-auth-engineer
description: Guide for setting up Logto as an open-source OIDC identity provider, managing machine-to-machine tokens, RBAC, and frontend SDK integration.
---

# Logto Auth Engineer

Logto is an open-source Identity as a Service (IDaaS) built on OIDC (OpenID Connect). It's great for self-hosting or managed identity.

## 1. Installation
Install the appropriate Logto framework SDK. For Next.js App Router:
```bash
npm install @logto/next
```

## 2. Configuration
Define your Logto credentials in an environment matching your Logto Application.

```env
LOGTO_ENDPOINT=https://your-tenant.logto.app/
LOGTO_APP_ID=foo
LOGTO_APP_SECRET=bar
LOGTO_COOKIE_SECRET=at_least_32_chars_long_secret
LOGTO_BASE_URL=http://localhost:3000
```

## 3. Libraries / Server Helper
Create a central configuration file.

```ts
// src/libraries/logto.ts
import LogtoClient from '@logto/next/server-actions';
import { cookies } from 'next/headers';

export const logtoClient = new LogtoClient({
  endpoint: process.env.LOGTO_ENDPOINT!,
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.LOGTO_BASE_URL!,
  cookieSecret: process.env.LOGTO_COOKIE_SECRET!,
  cookieFetch: async () => {
    const cookieStore = await cookies();
    return cookieStore.get('logto')?.value;
  },
});
```

## 4. API Routes for Callback
You must handle the OIDC callback.

```ts
// src/app/api/logto/sign-in-callback/route.ts
import { logtoClient } from '@/libraries/logto';

export async function GET(request: Request) {
  await logtoClient.handleSignInCallback(request.url);
  return Response.redirect(new URL('/', request.url));
}
```

## 5. Getting User State
To fetch user information across the server context.

```ts
import { logtoClient } from '@/libraries/logto';

export async function Page() {
  const isAuthenticated = await logtoClient.isAuthenticated();
  if (!isAuthenticated) return <div>Please Log in</div>;
  
  const user = await logtoClient.fetchUserInfo();
  return <div>Welcome, {user.name}</div>;
}
```
