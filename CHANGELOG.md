# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Documented
- Executed comprehensive architectural analysis, rewriting `APP_ANALYSIS_REPORT.md` following **systems-architect** and **technical-documenter** constraints. Encompasses the Hono Edge configurations, Swarm Core ingestion logic (`SyncEngine.ts`, `GitHubAdapter.ts`), multi-stage deployment patterns, and MCP interoperability.

## [v1.6.0] - 2026-05-15
### Added
- **Phase 3 & 4 - Edge Enforcement & Integration Assets**:
  - Engineered Phase 4 Hono middleware interceptor ("The Bouncer") to block aggressive static scraping bots from directly hitting `/skills/*.md`, returning API endpoint directives instead.
  - Formulated Phase 3 `openai-action.json` OpenAPI schema mapping Hono Edge endpoints to ChatGPT Custom Actions.
  - Drafted `claude_desktop_config.json` defining remote proxy/bridge configuration to stream `skillsgem-mcp-server` into Claude Desktop/Cursor natively.
  - Architected `gemini-tool-schema.json` mapping API operations contextually into Gemini Vertex functional declarations.
- **Swarm CLI Architecture & SyncEngine**:
  - Engineered an extensible, Commander.js-driven CLI (`src/swarm/cli.ts`) supporting commands: `sync`, `pull`, `list`, `audit`, and `demo`.
  - Built `SyncEngine` (`src/swarm/core/SyncEngine.ts`) mapping parallel asynchronous remote payload fetching utilizing `Promise.allSettled`.
  - Constructed `GitHubAdapter` (`src/swarm/core/GitHubAdapter.ts`) with robust, rate-limit sensitive exponential backoff and recursive `Link` header pagination capabilities.
  - Introduced `--json` machine-readable output flags strictly emitting normalized JSON responses, isolating STDOUT artifacts for external AI-agent parsing.
  - Validated architecture with high-fidelity `vitest` unit test coverage spanning mocking of asynchronous HTTP handlers.

## [v1.5.0] - 2026-05-09
### Added
- **Phase 4 - GitHub App Integration (Completed)**:
  - Validated edge-native automated PR creation via `github_create_pull_request` MCP tool.
  - Diagnosed and resolved Cloudflare Web Crypto constraint by engineering `convertPKCS1toPKCS8` to automatically wrap raw RSA private keys (PKCS#1) into edge-compatible ASN.1 DER (PKCS#8) formats, restoring full JWT signing capability at the CDN edge.
  - Engineered `GitHubPRService` (`src/services/githubPRService.ts`) for stateless git tree creation, committing, and PR generation via GitHub REST API.
  - Wired live `github_create_pull_request` execution mapped securely into the Model Context Protocol (MCP) server environment.
  - Initialized `/api/mcp` capability with Mock `ServerResponse` adapter exposing `@modelcontextprotocol/sdk/server/sse.js` to Cloudflare TransformStreams.
  - Instantiated `/api/test-pr` ad-hoc REST pathway for frictionless immediate curl testing without full MCP handshake.
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
