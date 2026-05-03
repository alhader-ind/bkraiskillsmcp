---
name: kinde-auth-implementer
description: Configuration and implementation instructions for Kinde Auth, focusing on passwordless login, Next.js App Router integration, and feature flags.
---

# Kinde Auth Implementer

Kinde provides powerful passwordless login, B2B configurations, and feature flags directly tied to the authentication context.

## 1. Installation
```bash
npm install @kinde-oss/kinde-auth-nextjs
```

## 2. Environment Variables
Add the required Kinde variables from your account.

```env
KINDE_CLIENT_ID=your_client_id
KINDE_CLIENT_SECRET=your_client_secret
KINDE_ISSUER_URL=https://your_domain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

## 3. Next.js API Route for Auth Handlers
Create a catch-all API route configuration to handle OAuth flows.

```ts
// src/app/api/auth/[kindeAuth]/route.ts
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
export const GET = handleAuth();
```

## 4. Usage in Server Components
Kinde provides helper functions to get the current session in server contexts.

```tsx
// src/app/dashboard/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  const user = await getUser();
  return <div>Hello {user?.given_name}</div>;
}
```

## 5. Feature Flags (Kinde Specific)
Kinde integrates Feature Flags with user profiles natively.

```ts
const { getFlag } = getKindeServerSession();
const newFeatureFlag = await getFlag("new-dashboard", false);

if (newFeatureFlag?.value) {
    // Show new dashboard
}
```
