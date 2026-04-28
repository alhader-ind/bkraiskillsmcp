---
name: Hono Framework
description: Guidelines for building fast, edge-optimized web applications and APIs using the Hono framework.
---

# Hono Framework Guidelines

Hono is a small, simple, and ultrafast web framework built on Web Standards. It works on any JavaScript runtime: Cloudflare Workers, Fastly Compute, Deno, Bun, Node.js, and others.

## 1. Core Concepts

- **Ultrafast Routing**: Built on a highly optimized `RegExpRouter`.
- **Web Standard APIs**: Uses standard Request, Response, and standard Web APIs.
- **Middleware**: Supports a robust ecosystem of built-in and custom middleware (e.g., Zod validator, CORS, basic auth).
- **Zero Dependencies**: Hono itself only relies on Web Standard APIs.

## 2. Basic Setup (Node.js / generic JS runtimes)

Create an instance of Hono and define routes.

```ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

// Basic GET route
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Path parameters and JSON response
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, status: 'active' })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
```

## 3. Middleware and Validation

- Use `@hono/zod-validator` for type-safe schema validation.
- Built-in middleware like `logger` and `cors` are available in `hono/logger` and `hono/cors`.

```ts
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

app.use('*', logger())

const schema = z.object({
  name: z.string(),
  age: z.number(),
})

app.post('/profile', zValidator('json', schema), (c) => {
  const data = c.req.valid('json')
  return c.json({
    success: true,
    data,
  })
})
```

## 4. JSX & RPC (HonoX / Hono client)

- **RPC (hc)**: Hono can share the API specification from the server to the client without code generation, enabling type-safe fetches.
- **JSX**: Hono has a built-in JSX engine for returning HTML seamlessly from endpoints, often used for SSR in edge environments.

## 5. Deployment

- **Cloudflare Workers / Pages**: Native integration using `export default app`.
- **Node.js**: Requires `@hono/node-server` adaptor.
- **Bun / Deno**: Native runtime support.
