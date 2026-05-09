# SkillsGem AI Knowledge Base & MCP Server

SkillsGem AI is an augmented reasoning system with mandatory skill-grounding. It provides a curated, dynamic library of specialized AI system instructions ("skills") synced from leading industry registries.

This project is built using:
- **Hono:** Ultra-fast web framework tailored for Edge environments.
- **React + Vite:** Frontend SPA.
- **Model Context Protocol (MCP):** Exposes skills to compatible LLM clients natively.

## Project Structure & Architecture

- `src/worker.ts`: Main Hono application logic. Runs on Cloudflare Edge. Mounts MCP Server and static assets.
- `src/raw-skills/`: Raw markdown storage for AI Skills.
- `server.ts`: Local production Node.js runner for Hono.
- `AGENTS.md`: Mandatory Pre-Response Skill Protocol injected into AI systems.

## 🧠 Technical Memory & Continuity

To prevent cognitive drift and ensure perfect continuity across AI agent sessions, this repository utilizes the **Technical Memory Manager Protocol**.

Before contributing or modifying this repository, Agents **MUST** consult and maintain the following files:

*   **[`MEMORY.md`](MEMORY.md)**: The "Repository Brain". Contains the current Architecture Matrix, In-Flight Logic state, and active challenges.
*   **[`CHANGELOG.md`](CHANGELOG.md)**: Strict chronological tracking of structural and functional modifications.
*   **[`ROADMAP.md`](ROADMAP.md)**: Strategic trajectory and future milestone planning.
*   **[`APP_ANALYSIS_REPORT.md`](APP_ANALYSIS_REPORT.md)**: Deep architectural audits and conceptual analysis.

**Rule:** AI Agents MUST read `MEMORY.md` at the start of a session and edit it at the end of a session if architectural changes were made.

## Dynamic Skill CLI & Synchronizer

A robust Command Line Interface (CLI) is integrated for fetching, listing, and auditing skills from external registries (e.g., GitHub) directly into your local workspace. Built with an extensible `SyncEngine` and `GitHubAdapter`, it operates using highly resilient, parallelized execution pipelines (`Promise.allSettled`), exponential backoff, and strict output mapping supporting machine-readable JSON formats via `--json`.

```bash
# Sync entire remote registries locally (outputs JSON payload)
npx tsx src/swarm/cli.ts sync --json

# Download a specific skill
npx tsx src/swarm/cli.ts pull prd-documentation-master --json

# Validate and Hash Check existing local skills
npx tsx src/swarm/cli.ts audit --json
```

For agentic interactions, refer to [CLI_SPECS.md](CLI_SPECS.md).

## Getting Started (Local Development)

```bash
# Install dependencies
npm install

# Start Local Dev environment (Hono + Vite)
npm run dev

# Generate llms.txt and llms.json from external remote skill repositories via SyncEngine CLI Tool
npm run sync-skills # (alias for npx tsx src/swarm/cli.ts sync)
```

## Deployment (Cloudflare)
This application targets Cloudflare Pages natively via Wrangler.

```bash
# Build the production files (builds both Vite frontend into /dist and Hono worker into _worker.js)
npm run build

# Preview locally
npm run preview
```
