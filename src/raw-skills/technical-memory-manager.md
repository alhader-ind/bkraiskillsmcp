---
name: technical-memory-manager
description: Technical memory management, project state persistence, and architectural mapping. Use this skill to maintain a CONTEXT.md or MAP.md that tracks implemented features, technical debt, and pending tasks.
---

# Technical Memory Manager: The Repository Brain

Technical Memory is the cognitive anchor of a project. To achieve "100x" better consistency across long agent sessions, move beyond "working from memory" and into **Stateful Context Mapping**, **Feature Inventorying**, and **Architectural History**.

## 1. The Context Persistence Protocol

Engineer a continuous project memory through the **M.A.P.S.** (Map, Audit, Persist, Sync) framework:

### Phase A: Architecture & File Mapping (Map)
Identify the current topography of the codebase:
-   **Structure Visualization:** Document the primary directory tree and the purpose of key files.
-   **Dependency Wiring:** Track how major components (React, Express, Prisma) are connected.
-   **Entry Point Tracking:** Identify the "Source of Truth" for routing, state, and database initialization.

### Phase B: Feature & State Auditing (Audit)
Record the current progress of the application:
-   **Completion Inventory:** List every feature that is 100% functional and verified.
-   **In-Progress Ghosting:** Identify features that are partially implemented but not yet "Live."
-   **Debt Cataloging:** Note any "TODO" comments, hardcoded values, or temporary hacks that need resolution.

### Phase C: Context Persistence (Persist)
Update the `CONTEXT.md` or `MAP.md` as the primary memory store:
-   **The "Last Known Good State":** Record the timestamp and Git hash (if available) of the last successful build.
-   **Technical Decision Log (TDL):** Document *why* a specific library or pattern was chosen (e.g., "Switched to Zustand because Context was causing re-renders").
-   **Module Manifest:** Maintain a list of active modules and their responsibilities.

### Phase D: Session Synchronization (Sync)
Ensure the next LLM turn starts with full awareness:
-   **Summarization of Turn:** At the end of a turn, append a "Turn Summary" to the memory file.
-   **Context Injection:** On the start of a new turn, read the `CONTEXT.md` first to restore state.
-   **Hallucination Check:** Compare current implementation ideas against the memory to ensure they don't conflict with existing features.

## 2. Technical Memory Matrix

| Document | Focus | Use Case |
| :--- | :--- | :--- |
| **CONTEXT.md** | Current Session State | Immediate progress tracking and task lists. |
| **MAP.md** | Architectural Topography | Long-term overview of file relations and logic flow. |
| **DECISIONS.md** | Rationales & Trade-offs | Preventing circular arguments about tech stack choices. |
| **API.md** | Interface Contracts | Ensuring backend and frontend stay in sync. |

## 3. Implementation: The Memory Blueprint

When updating project memory, utilize the following structural pattern for `CONTEXT.md`.

```markdown
# 🗺️ Project Context Map
**Status:** 🟢 Stable / 🟡 Building / 🔴 Blocked
**Last Update:** 2026-04-30 18:45 UTC

### ✅ Implemented Features
- [Primary] OAuth Integration (Google)
- [Database] Prisma Schema with Location-based Inventory
- [Security] Failure Mode Preemptor Skill

### 🏗️ In-Progress
- [UI] Admin Dashboard sidebar refactoring
- [Logic] Double-entry accounting system verification

### ⚠️ Technical Debt / Known Issues
- Hardcoded API URL in `geminiService.ts`
- Missing unit tests for the 'Taxation' module
```

## 4. Continuity & Logic Guardrails

> [!CAUTION] **The "Drift" Trap**: If you implement a feature but forget to update the `CONTEXT.md`, the next LLM turn may spend 5 minutes "discovering" that feature, or worse, try to overwrite it.

**The Memory Integrity Checklist:**
1.  **Read-Before-Write:** Always read the `CONTEXT.md` at the start of a turn if it exists.
2.  **Update-After-Success:** Only record a feature as "✅ Implemented" after a successful build/test.
3.  **Concise but Deep:** Don't write fluff. Focus on variable names, routing paths, and database fields.
4.  **No Hallucinated Progress:** Never record a task as completed just because the code was written; it must be verified.

## 5. Implementation Pattern: Turn-End Sync

```markdown
## 📝 Turn Summary [Turn ID: 12]
- **Action:** Implemented the `technical-memory-manager` skill.
- **Files Modified:** `skillsData.ts`, `constants/skills.tsx`, `AGENTS.md`.
- **Status:** Verified via `compile_applet`.
- **Next Step:** Suggest 9 more skills or proceed with POS feature implementation.
```

## 6. Global Memory Invariants

-   **SINGLE SOURCE OF TRUTH:** The `CONTEXT.md` (or `MAP.md`) is the final authority on project state.
-   **NON-DESTRUCTIVE UPDATES:** Never delete history; move old tasks to an "Archive" section if necessary.
-   **AESTHETIC CLARITY:** Uses Icons and Tables to make the memory "skimmable" for the next agent turn.
