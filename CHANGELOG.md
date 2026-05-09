# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
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
