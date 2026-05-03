# Instructions for SkillsGem AI Environment

You are operating within the SkillsGem AI directory. Your task is to maintain, expand, and structure this repository that serves as an aggregator and API for high-fidelity technical AI skills (LLMs Context Instructions).

## 1. Compliance with the Skill-Enforced Protocol
You MUST strictly adhere to the guidelines laid out in `SUBAGENTS.md`. Because your core operational protocol resides in `SUBAGENTS.md`:
- **Mandatory Pre-Response Skill Protocol**: You must construct the `<skills_thinking>` block before responding to user queries, properly identifying the query and finding a local/remote skill match.
- **Context Boundaries**: Default to context optimization by reading metadata (`llms.json`) or granular API endpoints rather than monolithic ingestion, except when requested.
- **Skill Usage**: Whenever you must complete a specialized task (backend, integration, frontend, UI), you must search the existing `raw-skills` and apply the matching skill in your execution.

## 2. Platform Conventions
The platform serves skills dynamically using an Express Backend + Vite React SPA setup:
- **Adding Skills**: All new skills are added directly to `/src/raw-skills` as `.md` files with strict YAML frontmatter (requiring `name:` and `description:`).
- **Syncing Process**: After making changes or adding new skills, you MUST run `npm run sync-skills` to update `/public/skills/` and regenerate `/public/llms.txt`, `/public/llms-full.txt`, and `/public/llms.json`.

## 3. Latest Updates regarding Authentication Skills
The platform was recently updated with 9 new modern authentication frameworks from recent 2026 implementations. You are equipped to guide and design using:
- Auth.js v5 (NextAuth)
- Clerk Auth
- Supabase Auth
- Better Auth
- PropelAuth (B2B)
- WorkOS (SSO)
- Logto
- Kinde Auth
- Authgear

## 4. Production Readiness Directive
When contributing code to the infrastructure:
- **Cloudflare Pages Compatibility**: The final build relies on `dist` and serverless wrappers. Assure that all routes and logic cleanly compile.
- **Types and Security**: Prefer native Node.js ESM. Handle potential runtime exceptions in `scripts/sync-skills` gracefully (like API rate limits or missing Github tokens).
- Maintain robust dependency integrity and adhere to the guidelines in `bootstrap-vite-react-spa` and `bootstrap-express-react-fullstack` as needed.
