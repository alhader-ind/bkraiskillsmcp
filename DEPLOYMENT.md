# Cloudflare Deployment Guide

This appliction is configured to be deployed to **Cloudflare Pages**. It is a static Single Page Application built with Vite.

## 1. Prerequisites

Before deploying, you must configure your Cloudflare API credentials. 

1. Log in to your Cloudflare Dashboard.
2. Go to **My Profile -> API Tokens**.
3. Create an API token with `Cloudflare Pages` deployment permissions.
4. Obtain your Cloudflare **Account ID** from the dashboardURL or the Workers & Pages section.

Update your `.env` (copy from `.env.example`):
```env
# Cloudflare Credentials
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
```

## 2. Configuration Constraints 

The project uses `wrangler.toml` to define Cloudflare Pages configurations:
```toml
name = "bkraiskillsmcp"
compatibility_date = "2026-04-28"
compatibility_flags = [ "nodejs_compat" ]
pages_build_output_dir = "dist"

[vars]
VITE_APP_ENV = "production"
```
- **Node.js Compatibility:** By default Cloudflare uses V8. For most static client-side React apps, no special Node.js compatibility flags are required.
- **Routing:** Because this is a Vite-based SPA, ensure that your client-side routing is configured so unknown routes fallback to `index.html`. Cloudflare Pages typically handles this automatically for SPA setups, but you can add a `_routes.json` if you need fine-grained control over exclusions.

## 3. Deployment Scripts

We have added the following deployment scripts to `package.json` for manual or local deployment:

- `npm run build`: Compiles the application (and SSR functions) into the `dist/` directory using Vite and syncs LLM skills data.
- `npm run pages:deploy`: Runs Wrangler to push the `dist/` directory to Cloudflare Pages.
- `npm run deploy`: Combines both steps. It first runs the build, then deploys to Cloudflare Pages.

## 4. Automated CI/CD Pipeline (GitHub Actions)

A sophisticated deployment pipeline has been engineered in `.github/workflows/deploy.yml`. The system adheres to the *Infrastructure-as-Code* philosophy by automating scoping, engineering, and release mechanisms.

**How it works:**
1. **Pull Requests:** When a PR is opened targeting `main`, the pipeline automatically builds and deploys a preview version of the application to a generated URL without affecting production.
2. **Push to Main:** When commits are merged or pushed to `main`, the pipeline automatically builds and deploys the application directly tracking your primary production domain on Cloudflare Pages.

**Required Secrets:**
To enable seamless automated deployments, the following secrets **MUST** be supplied in your GitHub repository (`Settings > Secrets and variables > Actions`):
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API Token.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.

This continuous release flow optimizes delivery cycles and prevents local build environments from introducing "Works on my machine" failures to production.

## 5. MCP & LLM Context Discovery

This project is optimized for AI consumption via two main protocols:

### A. Simple LLM Ingestion (URL-based)
If you are using a tool like **Cursor**, **Windsurf**, or **Gemini/Claude** with long context:
1. Provide the URL: `https://bkraiskillsmcp.pages.dev/llms-full.txt`
2. This file contains the **entire** skills knowledge base in a single document for one-shot ingestion.

### B. MCP Server (Protocol-based)
For AI clients that support the **Model Context Protocol (MCP)**:
- **SSE Endpoint:** `https://bkraiskillsmcp.pages.dev/api/mcp`
- This endpoint allows agents to dynamically discover and retrieve skills as tools or resources.

### C. Raw GitHub Context
If you are pointing an AI to your GitHub repository, ensure you reference the correct paths:
- Skills Source: `https://github.com/alhader-ind/bkraiskillsmcp/tree/main/src/raw-skills`
- Raw Link Example: `https://raw.githubusercontent.com/alhader-ind/bkraiskillsmcp/main/src/raw-skills/surgical-debugger.md`

*Note: Ensure your GitHub branch matches `main` or update the links accordingly.*
