---
name: force-latest-dependencies
description: Strict override protocol preventing AI from using outdated package versions from its training data. Enforces live web/npm search to determine the latest framework and library versions.
tags: [dependencies, versions, npm, python, grounding, search, environment]
---

# Grounded Dependency Version Protocol

**Use Case:** Executing code generation, scaffolding, bootstrapping, or manual file creation that requires explicitly defining versions in `package.json`, `requirements.txt`, `Gemfile`, or `Cargo.toml`. 

> [!CRITICAL] MENTAL CUTOFF WARNING
> Your internal training data is permanently outdated. Frameworks like Next.js, React, Nuxt, Svelte, and Tailwind undergo major version changes frequently. You are strictly forbidden from guessing version numbers based on your pre-trained weights when explicitly requested to use the latest environment.

## Step 1: Identify Core Dependencies
Extract the main libraries needed for the requested stack (e.g., `next`, `react`, `vite`, `tailwindcss`, `fastapi`, `lucide-react`, `svelte`).

## Step 2: Live Grounded Verification (The Search Mandate)
Before writing ANY version configuration file, you MUST use your available tools (`search_web`, `read_url_content`, or `shell_exec`) to find the *actual* current latest version for each core dependency.

**Preferred Approach using Shell Exec (Fastest for Node):**
Utilize the shell execution tool to grab live versions dynamically:
```bash
npx npm info react version
npx npm info next version
npx npm info tailwindcss version
```

**Alternative Approach using Grounded Search:**
Use API endpoints like `https://registry.npmjs.org/vite/latest` via `read_url_content` or `search_web` tools to find the latest version of Python packages (e.g., PyPI) or Node packages.

## Step 3: Dynamic Config Generation
Only AFTER retrieving the confirmed latest versions, dynamically substitute them into the required bootstrap templates (like the `package.json` you are generating).

**DO NOT:**
- Hardcode `^18.2.0` for React if your search reveals version ^19.0.0 is the current verified stable.
- Hardcode `^3.4.1` for Tailwind if version 4.0 is available.
- Hallucinate `latest` tags blindly in package lock scenarios without knowing the actual versions.
- Skip this step and rely on your cut-off knowledge.

## Step 4: Fallback to `@latest` CLIs Safely
When instructing users to use CLI scaffolders (like `npx create-next-app@latest`), using `@latest` is safe. BUT, you must still verify what framework version `@latest` resolves to currently! This ensures the code you subsequently generate (like specific app router syntax, Vite plugin signatures, or middleware structures) matches the *actual* latest framework paradigms, not an outdated paradigm from your pre-training.

## Step 5: Acknowledge the Versions
When delivering the generated configuration or environment to the user, include a brief summary stating: 
> *"Verified core dependencies via live registry check: React (vX.X), Next.js (vX.X)..."*
