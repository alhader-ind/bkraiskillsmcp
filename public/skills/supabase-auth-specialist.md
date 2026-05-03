---
name: supabase-auth-specialist
description: Comprehensive configuration guide for Supabase Authentication, including SSR setup in Next.js, RLS policies, and OAuth integrations.
---

# Supabase Auth Specialist

This guide details configuring Supabase Auth (GoTrue) in a modern Server-Side Rendered (SSR) environment like Next.js App Router.

## 1. Installation
Install Supabase's SSR auth helpers.
```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. Environment Variables
Add your Supabase URL and Anon Key.
```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 3. Server-Side Client Creation
Create a utility file for Supabase SSR (`src/utils/supabase/server.ts`).

```ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}
```

## 4. Middleware Session Refresh
Create `middleware.ts` to refresh the session token.

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()
  return supabaseResponse
}
```

## 5. Security (Row Level Security)
Always enforce data access through RLS policies directly in PostgreSQL.
```sql
-- Example: Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING ( auth.uid() = id );
```
