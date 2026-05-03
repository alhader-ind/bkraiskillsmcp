---
name: propelauth-b2b-auth
description: Guide for setting up PropelAuth for B2B/multi-tenant applications, focusing on organization management, RBAC, and SSO integration in React/Next.js environments.
---

# PropelAuth B2B Auth Guide

PropelAuth simplifies multi-tenant B2B configurations, providing ready-made organization (tenant) selection, invitations, and Role-Based Access Control (RBAC).

## 1. Installation
Install the PropelAuth Next.js library.
```bash
npm install @propelauth/nextjs
```

## 2. Environment Configuration
Fetch keys from your PropelAuth dashboard.
```env
PROPELAUTH_AUTH_URL=https://auth.yourdomain.com
PROPELAUTH_API_KEY=YOUR_API_KEY
PROPELAUTH_VERIFIER_KEY=YOUR_VERIFIER_KEY
PROPELAUTH_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## 3. Initialization
Create `src/lib/propelauth.ts` to initialize the client.

```ts
import { initAuth } from "@propelauth/nextjs/server";

export const propelauth = initAuth({
    authUrl: process.env.PROPELAUTH_AUTH_URL!,
    apiKey: process.env.PROPELAUTH_API_KEY!,
    integrationApiKey: process.env.PROPELAUTH_API_KEY!,
    verifierKey: process.env.PROPELAUTH_VERIFIER_KEY!,
});
```

## 4. API Routes Setup
Handle the routes for login, logout, callback.

```ts
// src/app/api/auth/[slug]/route.ts
import { getRouteHandlers } from "@propelauth/nextjs/server/app-router";
const routeHandlers = getRouteHandlers();

export const GET = routeHandlers.getRouteHandler;
export const POST = routeHandlers.postRouteHandler;
```

## 5. Organization Access Logging (B2B RBAC)
When checking auth on the server, you can verify access to specific organizations.

```ts
import { propelauth } from "@/lib/propelauth";
import { redirect } from "next/navigation";

export default async function OrgDashboard({ params }: { params: { orgId: string } }) {
    const user = await propelauth.getUser();

    if (!user) return redirect("/api/auth/login");

    const orgClass = user.getOrg(params.orgId);
    if (!orgClass) {
        return <div>You don't belong to this organization.</div>;
    }

    if (!orgClass.hasPermission("can_manage_billing")) {
         return <div>Access Denied. Contact your Admin.</div>;
    }

    return <div>Welcome to {orgClass.orgName}</div>;
}
```
