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
name = "agent-analysis-report"
compatibility_date = "2026-04-28"
pages_build_output_dir = "dist"

[vars]
VITE_APP_ENV = "production"
```
- **Node.js Compatibility:** By default Cloudflare uses V8. For most static client-side React apps, no special Node.js compatibility flags are required.
- **Routing:** Because this is a Vite-based SPA, ensure that your client-side routing is configured so unknown routes fallback to `index.html`. Cloudflare Pages typically handles this automatically for SPA setups, but you can add a `_routes.json` if you need fine-grained control over exclusions.

## 3. Scripts

We have added the following deployment scripts to `package.json`:

- `npm run build`: Compiles the application into the `dist/` directory using Vite.
- `npm run pages:deploy`: Runs Wrangler to push the `dist/` directory to Cloudflare Pages.
- `npm run deploy`: Combines both steps. It first runs the build, then deploys to Cloudflare Pages.

### How to Deploy
Run the following command:
```bash
npm run deploy
```
*Note: Make sure your API Token and Account ID are set in the environment or the deployment will fail.*
