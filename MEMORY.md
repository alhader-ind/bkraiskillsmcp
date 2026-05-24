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
- **Current Phase:** Phase 3 & 4 (Completed Bouncer Edge Enforcement & Platform Assets).
- **Recent Milestones:**
  - Formulated and appended **SECTION 10: Locked Persona & Platform-Specific Implementation Rules** inside `/AGENTS.md` to establish immutable formatting, pull-request schemas, Zustand localStorage state persistence, and cryptographic Timing-attack proof policies.
  - Implemented Phase 4 Edge Enforcement using Hono middleware to intercept and redirect bots trying to access `/skills/*.md` directly.
  - Generated Phase 3 integration assets: `openai-action.json`, `claude_desktop_config.json`, and `gemini-tool-schema.json`.
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
  - **Resolved JSON Parsing Crash ("Unexpected token '<'"):** Discovered `llms.json` was omitted from start because it is gitignored and `sync-skills` task wasn't run on start. Configured `"dev"` script in `package.json` to auto-execute `npm run sync-skills` on dev launch. Guarded `fetchSkillsManifest()` in `skills.service.ts` to block and report non-JSON content-type responses (like SPA HTML fallbacks) with a clean human-readable error explanation instead of crashing.
  - **Drafted AI Studio Instructions Prompt:** Designed and created `/GEMINI_SYSTEM_INSTRUCTIONS.md` containing a self-contained, high-performance system instructions prompt template optimized for Gemini models to strictly carry the SkillsGem AI persona, code invariants, and offline stability guarantees in `aistudio.google.com`.
  - **ESLint & Workspace Compiler checking integration:** Installed modern ESLint v9, `@eslint/js`, and `typescript-eslint` packages as dev dependencies. Configured a unified ESLint Flat configuration file (`eslint.config.js`) supporting ignored directories and allowing appropriate TypeScript annotations. Added `"lint"` script to `package.json`, enabling streamlined syntax validation.
  - **Engineered Programmatic Multi-Platform Compiler Check Endpoint (`/api/lint`)**:
    - Completed highly optimized Node.js process check mapping inside `/server.ts` utilizing promisified `child_process.exec('npx eslint . -f json')` allowing the server to dynamically check files on demand, parse the diagnostic stream, and return pristine structured JSON.
    - Integrated clean edge-sandbox fallback routes under `/src/worker.ts` returning informative status vectors when running on serverless global CDN isolations.
  - **Engineered Multi-Tiered adaptive prompt orchestrator (Reasoning Gate, Semantic Router, Context Manager)**:
    - Designed `/src/swarm/core/Orchestrator.ts` handling the 3 crucial phases of dynamic prompt preparation: *Tier 1: Reasoning Gate* (analyzing queries with LLMs or fast heuristic structures and isolating candidate skill targets), *Tier 2: Semantic Router* (ranking score correlations using custom keywords, tags, and gate signals), and *Tier 3: Context Manager* (combining active rules into packed payloads with character-based token trackers and alert buffers).
    - Registered a POST route `/api/skills/orchestrate` inside Hono web-worker endpoints to act as the REST bridge for routing requests.
    - Built a POST route `/api/skills/simulate` proxying to `@google/genai` to test physical execution under compiled prompt payloads recursively.
    - Designed the interactive visual playground dashboard `/src/features/skills/components/SessionOrchestrator.tsx` and nested it smoothly inside the main SPA tab controls for instant utility mapping.
- **Resolved Challenges/Bugs:**
  - Resolved dynamic rate limiting issues with sources (Cloudflare/Vercel) during raw-skill syncing, completely integrating a `200ms` proactive API throttle into `GitHubAdapter.ts` and refactoring `SyncEngine` sequentialization to prevent nested recursive concurrency storms.
  - Resolved duplicate React key warning inside the dynamic keyword mapping lists of `SessionOrchestrator.tsx`.
  - Resolved `GoogleGenAI is not defined` ReferenceError inside `worker.ts` by adding imports from `@google/genai`.
  - Bypassed API model failures on local key fallbacks by enforcing active checking for the standard `AIza` Gemini prefix format in `Orchestrator.ts` and `worker.ts`.
- **Active Challenges/Bugs:**
  - Ensuring Cloudflare ASSETS binding accurately serves static files in remote environment.

## 3. Dependency & Infrastructure Matrix
- **Critical Dependencies:**
  - `hono` (^4.x.x) - Routing.
  - `eslint` (^9.x.x) - Linter engine.
  - `typescript-eslint` (^8.x.x) - Type-safe eslint bindings.
  - `@eslint/js` (^9.x.x) - Base ESLint recommended configurations.
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
