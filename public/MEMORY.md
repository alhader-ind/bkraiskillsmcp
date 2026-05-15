# 🧠 SkillsGem AI Core Memory (MEMORY.md)

> **IMMUTABLE DIRECTIVE:** This file is the single source of truth for the project's state. It MUST be updated before any session handover or major architectural change.

## 1. Project Identity & Architecture
- **Project Name:** SkillsGem AI Knowledge Base & MCP Server
- **Core Purpose:** To provide a dynamic, granular skill loading protocol for LLMs and Agentic systems, allowing them to fetch optimized instructions remotely.
- **Architecture:** 
  - **Environment:** Cloudflare Workers (Edge runtime) with Node.js fallback.
  - **Framework:** Hono (Ultrafast edge framework).
  - **Frontend:** React + Vite (SPA served statically via Hono or Cloudflare Pages).
  - **MCP Server:** Runs globally within the Hono worker environment.
  - **Registry/Storage:** Remote GitHub Pages / local `llms.txt`, `llms-full.txt`, and RAW Markdown files (`src/raw-skills/`).

## 2. In-Flight State (Current Snapshot)
- **Current Phase:** Phase 4 Stage 3 CLI Tooling & Automation (Completed).
- **Recent Milestones:**
  - Conducted robust multi-phase system architecture analysis under the guidance of the `systems-architect` and `technical-documenter` protocols, codifying all structural and dependency findings formally into `APP_ANALYSIS_REPORT.md`.
  - Designed and deployed robust CLI (`src/swarm/cli.ts`) mapping sub-commands (`pull`, `sync`, `list`, `audit`, `demo`) equipped with `--json` outputs isolating artifacts.
  - Formulated `SyncEngine` (`src/swarm/core/SyncEngine.ts`) wrapping scalable asynchronous asset fetching with automated Markdown header parsers and caching mechanisms.
  - Built `GitHubAdapter` mapped with intelligent `Link` header pagination, exponential rate-limit back-offs, and normalized data extraction.
  - Deprecated legacy monolithic `scripts/sync-skills.js` mechanism in favor of scalable TypeScript execution.
  - Integrated `vitest` unit-test engineering to mock API fetching logic confirming robust `SyncEngine` initialization.
  - Diagnosed and resolved Web Crypto API incompatibilities for RSA signatures on Cloudflare Edge by engineering a `convertPKCS1toPKCS8` DER/ASN.1 transformation layer. This automatically bridges standard GitHub PKCS#1 private keys to Edge-compatible PKCS#8 structures for fast JWT generation.
  - Successfully deployed and executed the automated GitHub Pull Request MCP tool directly from the Edge, creating live PRs via GitHub App tokens.
  - Resolved `SSEServerTransport` Cloudflare isolate proxying by polyfilling Node's `ServerResponse` adapter over standard `TransformStream`. 
  - Exposed `/api/test-pr` REST fallback endpoint allowing instant GitHub Integration functional evaluation.
  - Designed `github_create_pull_request` MCP Tool utilizing precise GitHub REST API git tree primitives.
  - Deployed `GitHubPRService` allowing AI agents to fully automate pulling context -> pushing code.
  - Implemented GitHub Auth Service (`src/services/githubAuth.ts`) for stateless edge-compatible RS256 JWT generation using `jose`.
  - Added temporary Installation Access Token fetching and caching logic.
  - Added `/api/github/test-auth` endpoint for integration smoke testing.
  - Integrated GitHub App webhook interception (`/api/github/webhook`) with Web Crypto HMAC SHA-256 validation.
  - Hardened Cloudflare Pages compilation strategy (esbuild target: browser).
  - Drafted custom validation hook `scripts/deploy.js` to guard deployment operations.
  - **Identified & Fixed Deployment Collision:** Removed `GITHUB_*` plaintext keys from `wrangler.jsonc` `vars` block to resolve Cloudflare Pages `Binding already in use` conflict against Dashboard Secrets.
  - Implemented Edge-optimized Rate Limiting (Isolate-Local map).
  - Configured Cloudflare Analytics Engine Telemetry for API requests.
  - Defined Multi-Tenant authentication guard (`/api/private/*`).
  - Added Semantic Search endpoint framework (`@cf/baai/bge-base-en-v1.5` binding).
  - Migrated Express server to Hono + Cloudflare Worker (`src/worker.ts`).
  - Integrated Model Context Protocol (MCP) Server endpoints in Hono.
  - Implemented static fallback routing (`index.html` delivery for SPA navigation in Hono).
  - Designed the Memory Blueprint (you are reading it).
- **Active Challenges/Bugs:**
  - Ensuring Cloudflare ASSETS binding accurately serves static files in remote environment.

## 3. Dependency & Infrastructure Matrix
- **Critical Dependencies:**
  - `hono` (^4.x.x) - Routing.
  - `@hono/node-server` - Local prod execution.
  - `vite` - SPA build.
  - `@modelcontextprotocol/sdk` - Required for MCP server implementation.
  - `esbuild` - Worker bundling (`_worker.js`).
- **Environment Variables Required:**
  - N/A yet, but Cloudflare API Tokens needed for deployment.

## 4. Continuity Directives (Agent Instructions)
1. **Never use `fs` module inside `worker.ts`**. It operates on Cloudflare Edge. Use `ASSETS.fetch` or standard fetch.
2. Always ensure `vite build` runs before bundling the Hono worker.
3. When adding a new skill, add the `.md` file to `src/raw-skills/`, run `npx tsx src/swarm/cli.ts sync` to generate `llms.txt` and `llms.json` efficiently utilizing the extensible CLI integration logic.

## 5. Security & Red Team Notes
- Endpoints like `/api/skills` accept user input (`search`, `id`). Ensure sanitization holds up against directory traversal (though paths are mapped via JSON registry).
- MCP exposed endpoints do not explicitly require authentication yet; ensure it aligns with project goals.
