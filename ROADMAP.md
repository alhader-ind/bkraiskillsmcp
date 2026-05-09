# SkillsGem AI - Project Roadmap (ROADMAP.md)

## Phase 1: Core Knowledge Base & Retrieval (Completed ✅)
- [x] Basic SPA for exploring skills.
- [x] `llms.txt` and `llms.json` sync process.
- [x] Raw markdown skill storage.
- [x] Express API (Legacy) for granular retrieval.

## Phase 2: Edge Migration & MCP Integration (Completed ✅)
- [x] Migrate to Hono Framework.
- [x] Bundle for Cloudflare Workers (`_worker.js`).
- [x] Implement globally accessible MCP Server.
- [x] Implement Memory Blueprint (Technical Memory).
- [x] Deploy to Cloudflare Pages/Workers successfully (Ready for Deployment Execution).
- [x] Verify `ASSETS.fetch` stability in production.

## Phase 3: Hardening & Intelligence (Completed ✅)
- [x] Add semantic search / embedding based retrieval in `/api/skills`.
- [x] Add robust API rate limiting via Cloudflare rate limiting or Hono middleware.
- [x] Implement Analytics telemetry for skill usage tracking.
- [x] Multi-tenant support/authentication for private skills.

## Phase 4: Integrations & Extensions
- [x] GitHub App integration allowing PR generation via MCP.
  - [x] Stage 1: Webhook Interception, HMAC Signature Verification, & Auth Base.
  - [x] Stage 2: App Installation & Access Token Generation (Edge JWT signing via `jose`).
  - [x] Stage 3: MCP Tool Definitions (`github_create_pull_request`) for PR creation.
- [ ] Build a CLI tool for external agents to pull and sync local `AGENTS.md`.
- [ ] Introduce User Custom instruction overriding.
