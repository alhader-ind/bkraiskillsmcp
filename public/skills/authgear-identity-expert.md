---
name: authgear-identity-expert
description: Implementation guide for Authgear, covering passkeys, B2B SaaS B2C authentication, UI customization, and multi-factor authentication (MFA).
---

# Authgear Identity Expert

Authgear operates as an Identity Provider (IdP) focusing on secure workflows, passkeys, and highly customizable UI templates directly rendered on the IdP side.

## 1. Installation
Install the generic OIDC or specific `@authgear/web` SDK.
```bash
npm install @authgear/web
```
*(If using Next.js, mostly rely on standard OIDC connected to Authgear as the provider, or use the native SDK for SPAs).*

## 2. Environment Configuration
```env
NEXT_PUBLIC_AUTHGEAR_CLIENT_ID=your_client_id
NEXT_PUBLIC_AUTHGEAR_ENDPOINT=https://your-project.authgear.app
```

## 3. Web SDK Initialization (Client-Side Example)
For single-page application flows:

```ts
import authgear from '@authgear/web';

async function init() {
  await authgear.configure({
    clientID: process.env.NEXT_PUBLIC_AUTHGEAR_CLIENT_ID!,
    endpoint: process.env.NEXT_PUBLIC_AUTHGEAR_ENDPOINT!,
    sessionType: 'refresh_token',
  });
}
```

## 4. Authorizing
Trigger the standard login UI which redirects to the Authgear-hosted customizable pages.

```ts
function startLogin() {
    authgear.startAuthorization({
        redirectURI: window.location.origin + '/auth-redirect',
        prompt: 'login' // Force login or let it autologin
    });
}
```

## 5. Token Exchange Callback
Handle the callback on the `/auth-redirect` route.

```ts
async function handleCallback() {
   try {
       await authgear.finishAuthorization();
       console.log('Logged in successfully!');
   } catch (err) {
       console.error("Auth failed:", err);
   }
}
```

## 6. OIDC Server-Side Fallback
If using NextAuth.js or Better Auth, use the OpenID Connect (OIDC) generic provider pointing at your `AUTHGEAR_ENDPOINT`.
```ts
// Using generic OIDC
import NextAuth from 'next-auth';

export const { handlers, auth } = NextAuth({
    providers: [
        {
            id: 'authgear',
            name: 'Authgear',
            type: 'oidc',
            issuer: process.env.AUTHGEAR_ENDPOINT,
            clientId: process.env.AUTHGEAR_CLIENT_ID,
            clientSecret: process.env.AUTHGEAR_CLIENT_SECRET,
        }
    ]
});
```
