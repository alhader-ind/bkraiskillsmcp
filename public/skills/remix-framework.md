---
name: remix-framework
description: Guidelines for building full-stack web applications using the Remix framework. Use when creating React-based applications that require robust server-side rendering, nested routing, and standard web fetch APIs via loaders and actions.
---

# Remix Framework Integration Guidelines

This skill provides the standard procedures and environment constraints for building full-stack web applications using **Remix** (powered by Vite). Remix is a React framework that focuses on web standards and leveraging the Fetch API for server-side operations.

## 1. Project Setup
When initializing or configuring a Remix application:
- Always prefer the modern **Vite-based** setup (`vite.config.ts` with `@remix-run/dev/vite`).
- Use TypeScript and Tailwind CSS as the default tooling.
- Project structure centers around the `app/` directory (`app/root.tsx`, `app/routes/`).

## 2. Architecture & Data Flow
Remix handles data fetching and mutations through server-side functions explicitly tied to route components.

### Loaders (Data Fetching / GET)
Run exclusively on the server to provide data to your route.
```tsx
import { json } from "@remix-run/node"; // or cloudflare/etc based on deployment
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  const data = await db.getRecords();
  return json({ data });
};

export default function RouteComponent() {
  const { data } = useLoaderData<typeof loader>();
  return <div>{data.map(item => <p key={item.id}>{item.name}</p>)}</div>;
}
```

### Actions (Mutations / POST, PUT, DELETE)
Run on the server to handle form submissions and updates.
```tsx
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  
  if (!name) return json({ error: "Name is required" }, { status: 400 });
  
  await db.createRecord({ name });
  return redirect("/success");
};

export default function RouteComponent() {
  const actionData = useActionData<typeof action>();
  
  return (
    <Form method="post">
      <input type="text" name="name" />
      {actionData?.error ? <p>{actionData.error}</p> : null}
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## 3. Routing (Flat Routing)
Remix uses a file-system-based router. Modern Remix defaults to **flat routing**:
- `app/routes/_index.tsx`: The index route (`/`).
- `app/routes/about.tsx`: The `/about` route.
- `app/routes/users.$id.tsx`: A dynamic route (`/users/123`).
- `app/routes/admin._index.tsx`: Index route under `/admin`.
- Path segments without UI layout are prefixed with `_` (e.g., `_layout.tsx`).

## 4. State Management (Form & useFetcher)
- **`<Form>`**: Use for traditional navigations. Upon submission, Remix automatically revalidates all active loaders.
- **`useFetcher()`**: Use for background mutations and data fetching that **does not** trigger a URL navigation (e.g., "Add to cart" buttons or autocomplete dropdowns).
  ```tsx
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action="/api/like">
      <button type="submit">Like</button>
    </fetcher.Form>
  );
  ```

## 5. Development Environment Constraints (AI Studio)
> [!CAUTION]
> **Port Binding Rules:** The application MUST bind its client to port `3000` and host `0.0.0.0`. All external traffic routes via an nginx reverse proxy exclusively to port 3000.

- Because modern Remix uses Vite, update the `package.json` dev script or `vite.config.ts` to enforce the port and host limits:
  ```json
  "scripts": {
    "dev": "vite dev --port 3000 --host 0.0.0.0"
  }
  ```
- If running a custom Express server (`server.js`), ensure `process.env.PORT || 3000` is applied and bound to `0.0.0.0`.

## 6. Error Handling
Remix allows you to define inline Error Boundaries for routes.
```tsx
import { useRouteError } from "@remix-run/react";

export function ErrorBoundary() {
  const error = useRouteError();
  return <div>Something went wrong: {error.message}</div>;
}
```

## 7. Styling
- Use Tailwind CSS. Import the generated CSS in `app/root.tsx`:
  ```tsx
  import styles from "./tailwind.css?url";
  export const links = () => [{ rel: "stylesheet", href: styles }];
  ```
