# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- **Phase 4 - GitHub App Integration (Stage 3 Complete)**:
  - Engineered `GitHubPRService` (`src/services/githubPRService.ts`) for stateless git tree creation, committing, and PR generation via GitHub REST API.
  - Wired live `github_create_pull_request` execution mapped securely into the Model Context Protocol (MCP) server environment.
  - Implemented Edge-optimized RS256 JWT Signing mechanism (`src/services/githubAuth.ts`) using `jose` library.
  - Engineered `/api/github/test-auth` endpoint for verifying GitHub App JWTs and retrieving temporary Installation Access Tokens.
  - Enhanced memory caching for token rotation and rate limit minimization.
  - Engineered Webhook Interception endpoint (`/api/github/webhook`).
  - Implemented Web Crypto API HMAC SHA-256 for GitHub `x-hub-signature-256` verification.
  - Appended Cloudflare env bindings for GitHub Secrets (`GITHUB_WEBHOOK_SECRET`, `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`).

### Fixed
- **Cloudflare Pages Deployment**:
  - Removed `GITHUB_*` plaintext keys from `wrangler.jsonc` `vars` to prevent collision (`Binding already in use` error) when defining deployment SECRETS in the Cloudflare Dashboard.
- **Deployment Implementation**:
  - Engineered bulletproof `scripts/deploy.js` pre-flight matrix checker.
  - Refined `_worker.js` esbuild target parameters to `--platform=browser` aligned directly with Cloudflare Pages execution constraints.
  - Vetted `wrangler.toml` for nodejs_compat and bindings.
- **Phase 3 Deliverables Complete**:
  - Semantic Search endpoint `/api/skills/semantic-search` using Cloudflare Workers AI `bge-base-en-v1.5`.
  - Hono Rate Limiting Middleware protecting `/api/*` endpoints.
  - Analytics Telemetry via Cloudflare Analytics Engine `SKILLS_USAGE` dataset.
  - Multi-tenant Private Routes (`/api/private/*`) guarded by Bearer Token Authentication.
- **MEMORY.md**: Established Core Technical Memory architecture.
- **ROADMAP.md**: Outlined Phase 1 to Phase 4 future development trajectories.
- **CHANGELOG.md**: Instituted strict chronological tracking of changes.
- `python-excel-architect` skill added to `src/raw-skills` and updated in `AGENTS.md`.

### Changed
- Refactored `server.ts` to utilize Hono Node Server for local production runs.
- Replaced Express.js backend with Hono Framework in Edge-compatible `src/worker.ts`.
- Altered `vite.config.ts` to utilize `@hono/vite-dev-server` for seamless local dev.
- Updated SPA routing fallback to properly serve `index.html` from Vite Dev server and Cloudflare asset bindings.

### Removed
- `express` and `@types/express` completely purged from `package.json`.
- `functions` directory removed (relocated logic into Hono app).
