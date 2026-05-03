---
name: workos-sso-setup
description: Instructions for integrating WorkOS for Enterprise Single Sign-On (SSO), SCIM directory sync, and user identity management APIs.
---

# WorkOS SSO Setup

WorkOS is the premier provider for enterprise capabilities, handling SSO (SAML/OIDC) and Directory Sync (SCIM).

## 1. Installation
Install the official WorkOS Node SDK.
```bash
npm install @workos-inc/node
```

## 2. Environment Setup
Add your API key and Client ID.
```env
WORKOS_API_KEY=sk_test_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## 3. AuthKit Next.js Setup
AuthKit by WorkOS provides a hosted identity platform. Use `@workos-inc/authkit-nextjs` for rapid integration.

```bash
npm install @workos-inc/authkit-nextjs
```
Wrap your app or configure middleware.

```ts
// middleware.ts
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  // Protect routes or leave standard configurations
});

export const config = {
  matcher: ['/', '/(.*)'],
};
```

Access user on the server:
```tsx
import { getUser } from '@workos-inc/authkit-nextjs';

export default async function Page() {
  const { user } = await getUser();

  if (!user) {
    return <div>Not logged in</div>;
  }
  return <div>Hello {user.firstName}</div>;
}
```

## 4. Manual SSO Integration (Without AuthKit)
If integrating SSO manually:

1. **Authorization URL**: Connect users to their IdP based on their Organization ID.
```ts
import { WorkOS } from '@workos-inc/node';
const workos = new WorkOS(process.env.WORKOS_API_KEY);

const authorizationUrl = workos.sso.getAuthorizationUrl({
  clientId: process.env.WORKOS_CLIENT_ID,
  organization: 'org_...',
  redirectUri: process.env.WORKOS_REDIRECT_URI,
});
```

2. **Callback Handling**: Exchange the authorization code for a profile.
```ts
const { profile } = await workos.sso.getProfileAndToken({
  code,
  clientId: process.env.WORKOS_CLIENT_ID,
});
console.log(profile); // Contains SAML attributes
```
