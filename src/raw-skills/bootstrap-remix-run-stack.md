---
name: bootstrap-remix-run-stack
description: Strict, step-by-step initialization protocol for building a Remix stack. Bypasses interactive prompts and configures official templates.
tags: [bootstrap, remix, react, fullstack, backend, cloudflare]
---

# Bootstrap Protocol: Remix Run Stack

**Use Case:** The user requests a React framework utilizing Remix for nested routing, data loading, and full-stack capabilities, particularly when aimed at Cloudflare Workers/Pages or Express infrastructure.

> [!CRITICAL] INTERACTIVE CLI WARNING
> `create-remix` is highly interactive. To bypass the prompt blocking, you MUST force the scaffold tool using the precise command flags below.

## Step 1: Force Non-Interactive Scaffolding
Execute the official Remix generator using the `--yes` flag to bypass NPM confirmations, and specify the exact template.

**Execution Command (Express Template):**
```bash
npx -y create-remix@latest --template remix-run/remix/templates/express --yes .
```

*Note: If the user specifically requires Cloudflare instead of Express, substitute the template with `remix-run/remix/templates/cloudflare-pages`.*

## Step 2: Handle Tailwind CSS & Custom Dependencies
The base template might not include Tailwind out of the box. Install required dependencies non-interactively.

**Execution Command:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx -y tailwindcss init -p
```

## Step 3: Inject Tailwind Config
Modify the generated configuration files to establish Tailwind parsing.

**`tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**`app/tailwind.css`** (Create this file)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 4: Update the Root
Import the Tailwind file into Remix's root component.

**Modify `app/root.tsx` Links Function:**
```tsx
import type { LinksFunction } from "@remix-run/node";
import tailwindStyles from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
];
// ... rest of the root component
```

## Step 5: Boilerplate Verification
Write a confirmed index route to verify styling and standard loaders.

**`app/routes/_index.tsx`**
```tsx
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix App AI Bootstrap" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-900 text-zinc-100 font-sans">
      <div className="flex flex-col items-center gap-6 max-w-lg text-center">
        <h1 className="text-4xl font-black text-indigo-400">Remix Stack Bootstrapped</h1>
        <p className="text-zinc-400 text-lg">
          Routing, Loaders, and Tailwind CSS configured successfully via AI Protocol.
        </p>
      </div>
    </div>
  );
}
```

## Step 6: Verify & Yield
Execute `compile_applet` and verify `package.json` scripts (`npm run dev`). Make sure the dev server launches correctly without interactive stalls.
