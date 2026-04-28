---
name: "github-import-migration"
description: >-
  Provides migration rules for GitHub repositories imported into AI Studio.
  Use when the app was imported from a GitHub repository and needs to be made
  compatible with the AI Studio environment. Covers Node.js runtime, port
  configuration, package manager normalization, framework-specific fixes
  (Next.js, React, Angular, static sites), Firebase SDK extraction, third-party
  LLM SDK handling, and the migration workflow.
---

Explore the codebase and understand its setup (framework, build system,
dependencies, project layout).

## Scope Restrictions

-   Do NOT restyle the application (no Tailwind migration, no design changes).
-   Do NOT refactor code beyond what's needed for AI Studio compatibility.
-   Do NOT add new features or libraries.
-   Focus ONLY on making the existing code run in this environment.

## AI Studio Environment Rules

1.  **Runtime**: Node.js only with npm as the package manager. If the project
    uses yarn (yarn.lock), pnpm (pnpm-lock.yaml), or bun (bun.lockb/bun.lock),
    delete their lock files, remove any \`packageManager\` field from
    package.json, and run \`npm install\` to generate a package-lock.json.
2.  **Port and Host**: 3000 is the ONLY accessible port. The dev script must
    start the server on port 3000 and listen on host \`0.0.0.0\` (not \`localhost\`
    or \`127.0.0.1\`).
3.  **Dev Script**: package.json must have a "dev" script that starts the
    development server on port 3000.
4.  **Static Sites**: If the project has no package.json but contains
    HTML/CSS/JS files, initialize a Node.js project: create a package.json,
    install \`express\` as a dependency, and create a simple \`server.js\` that
    serves the static files on port 3000 (host \`0.0.0.0\`). Set the "dev" script
    to \`node server.js\`.
5.  **Next.js**:
    -   Add \`output: "standalone"\` to next.config (required for
        sharing/publishing).
    -   Remove any \`--turbopack\` flag from the dev script (not supported).
6.  **Firebase SDK**: If the project uses Firebase SDK, extract the
    \`initializeApp()\` config into a \`firebase-applet-config.json\` file (with
    fields: projectId, apiKey, authDomain, firestoreDatabaseId set to
    "(default)") and update the import to use it.
7.  **Gemini API — Environment Variable Setup**: AI Studio uses different API key
    variables depending on where Gemini is called from:
    -   **Client-side** (React components, \`'use client'\` Next.js pages, browser
        code): Use \`process.env.GEMINI_API_KEY\`. Ensure
        \`.env.example\` contains \`GEMINI_API_KEY="MY_GEMINI_API_KEY"\`.
    -   **Server-side** (Express routes, API handlers, Next.js API routes, server
        actions): Use \`process.env.GOOGLE_GENAI_API_KEY\`. Ensure \`.env.example\` contains
        \`GOOGLE_GENAI_API_KEY=\`.
    -   If the project references \`GEMINI_API_KEY\` in server-side code, rename it
        to \`GOOGLE_GENAI_API_KEY\` in both the code and \`.env\`/\`.env.example\`.
    -   If the project uses \`@google/generative-ai\` (old SDK), migrate to
        \`@google/genai\` (new SDK).
8.  **Third-party LLM SDKs** (OpenAI, Anthropic, Hugging Face, etc.): Ensure all
    API calls are server-side and extract API key variable names into
    \`.env.example\`.
9.  **Project Structure**: If \`package.json\` is in a subdirectory instead of the
    project root, restructure so that \`package.json\` is at root and the app can
    be started from there.
10. **Unsupported Dependencies**: If the project uses native system dependencies
    (e.g., puppeteer, canvas, ffmpeg) or external database drivers (e.g., pg,
    mongoose, mysql2), note the limitation and suggest Firebase/Firestore
    alternatives where applicable.
11. **Error Logging**: Ensure all application errors are logged via
    \`console.error\` — don't swallow exceptions.
12. **Existing Setup**: Where possible, follow the existing project setup,
    databases, APIs, and configuration.
13. **Next.js Custom Server**: If the project uses a custom \`server.js\` or
    \`server.ts\` with Next.js, remove it and switch to the built-in Next.js
    server. \`output: "standalone"\` is mandatory for AI Studio and is
    incompatible with custom servers. Update the \`dev\` script to use \`next dev
    -p 3000 -H 0.0.0.0\`.
14. **Unsupported Node.js Frameworks**: For projects using Svelte/SvelteKit,
    Vue/Nuxt, Remix, Astro, Gatsby, or other non-standard Node.js frameworks —
    treat them as generic Node.js projects. Do NOT attempt to apply React,
    Next.js, or Angular-specific patterns. Just ensure the dev server starts on
    port 3000 (host \`0.0.0.0\`) and that \`package.json\` has a working \`dev\`
    script.

## Migration Workflow

1.  Read the codebase to understand the setup.
2.  Apply necessary changes (package.json, config files, etc.).
3.  Run \`install_dependencies\` after package.json changes.
4.  Run \`compile_applet\` to verify the build.
5.  Check for errors and fix iteratively.
