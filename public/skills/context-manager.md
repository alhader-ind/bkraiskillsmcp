---
name: context-manager
description: Advanced project state persistence, technical memory synthesis, and session continuity management. Use this skill for synchronizing codebase state across distributed agent turns or complex project migrations.
---

# Advanced Context Management & Project Continuity

Context Management is the nervous system of iterative engineering. To achieve "100x" better continuity, move beyond "simple summaries" and into **Technical Memory Synthesis**, **State Hydration**, and **Architectural Synchronization**.

## 1. The Context Persistence Protocol

Preserve and restore system state through the **M.E.S.H.** (Manifest, Entity, State, Handover) framework:

### Phase A: Technical Manifest & Environment Audit (Manifest)
Establish the "Hard Facts" of the project environment:
-   **Stack Topology:** Explicitly catalog the primary technologies (e.g., React 18, Vite, Express) and critical libraries (e.g., Lucide, Motion).
-   **Infrastructure Invariants:** Record hard-coded facts about the runtime (e.g., "Port 3000 mapping," "Firebase Region: us-central1").
-   **Dependency Checksum:** Reference the current state of `package.json` to identify installed vs. requested but missing packages.

### Phase B: Entity Graph & File Mapping (Entity)
Reconstruct the structural relationships of the codebase:
-   **Feature Domain Mapping:** List verified functional blocks (e.g., `Auth`, `Dashboard`, `Payments`) and their core files.
-   **Dependency Graphing:** Note how components intersect (e.g., "The Navbar depends on the `useAuth` hook in `/features/auth`").
-   **Draft Isolation:** Identify files that exist but are in a "Draft" or "Placeholder" state, requiring further logic hardening.

### Phase C: In-Flight Logic & State Tracking (State)
Capture the "Active Memory" of the current development turn:
-   **Task Delta:** Document exactly what was changed in the most recent turn (The "Surgical Edit" log).
-   **Logical Debt:** List known bugs, lint warnings, or pending "TODO" logic that was deferred for later phases.
-   **Contextual Primes:** Identify the user's specific preferences or architectural decisions that were established during the conversation.

### Phase D: Strategic Handover & Roadmap (Handover)
Transition the mental model to the next logical state:
-   **Immediate Next-Steps:** Provide a prioritized 1-3 step roadmap of specific files to be created or modified.
-   **Blocker Awareness:** Explicitly state if an action is waiting on user input (e.g., "Waiting for the API Key") or environment setup.
-   **Synthesis Summary:** Output a "Snapshot" markdown block that serves as the definitive source of truth for the next agent turn.

## 2. Technical Memory Framework Matrix

| Pattern | Data Fidelity | Best For... |
| :--- | :--- | :--- |
| **Project Snapshot** | High Recency. | Immediate turn-to-turn continuity. |
| **Architectural Map** | High Structural. | Onboarding new agents or explaining system design to the user. |
| **Logic Delta** | High Functional. | Summarizing a complex debugging session or a large feature rollout. |
| **Debt Tracker** | High Maintenance. | Ensuring long-term project stability and preventing "Placeholder Creep." |

## 3. Implementation: The Context Snapshot Blueprint

When concluding a turn, provide a **System State Snapshot**.

```markdown
### 🧠 Project Context Snapshot
| Project State | Current Status | Notes |
| :--- | :--- | :--- |
| **Primary Goal** | Stripe Checkout Integration | Pending Webhook implementation. |
| **Completed** | `OrderModel.ts`, `StripeClient.ts` | Fully typed and verified. |
| **In-Progress** | `CheckoutButton.tsx` | UI complete, logic missing. |
| **Blockers** | `STRIPE_SECRET_KEY` | User needs to provide via Settings. |
| **Next Step** | Configure `server.ts` routes. | Depends on `StripeClient.ts`. |
```

## 4. Context Integrity & Safety Guardrails

> [!CAUTION] **The "Drift" Trap**: Never assume a feature works just because a previous summary says it's "Done." Always run a `lint_applet` or `compile_applet` to verify the state on disk.

**The Context Integrity Checklist:**
1.  **Truth Grounding:** Always prioritize the `package.json` and file-tree over conversational history when describing the stack.
2.  **Secret Redaction:** Ensure no actual API keys, passwords, or PII are ever included in the context summaries.
3.  **Fidelity Enforcement:** Use exact file paths and function names—avoid vague terms like "the login page" or "database stuff."
4.  **Actionable Focus:** If a summary doesn't clearly state "What to do next," it has failed as a context bridge.

## 5. Session Re-Hydration Logic

When starting a turn with an existing context:
1.  **Audit the Tree:** Verify that all files listed in "Completed" actually exist.
2.  **Verify Invariants:** Check `.env.example` to ensure all required configuration keys are documented.
3.  **Sync Goals:** Re-read the user's latest prompt to detect if the "Primary Goal" has shifted since the last summary.

## 6. Global Context Invariants

-   **ZERO DISCREPANCY:** If a file is on disk but not in the summary, add it. If it's in the summary but not on disk, remove it.
-   **CHRONOLOGICAL INTEGRITY:** Summarize changes in the order they were executed to preserve the "Logic Chain."
-   **CONCISE PRECISION:** Be brief. A 500-word summary creates noise; a 50-word targeted table creates velocity.

## Common Context Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Context Drift** | The summary says "Auth is done," but the file is empty. | Always verify file content via `view_file` before finalizing the summary. |
| **Ghost Roadmap** | The roadmap suggests modifying files that don't exist yet. | Label them as `[NEW]` to avoid confusion. |
| **Information Decay** | The summary focuses on a feature that was deleted 5 turns ago. | Purge "Outilier context" that is no longer relevant to the current task. |
| **Ambiguity Stall** | The next agent doesn't know where to start. | Provide the exact file path and line number for the first planned edit. |

## 1. The Context Persistence Protocol

A professional context handover follows a precise reconstruction of the project's technical and logical state.

### Phase A: Architecture & Stack Audit
Establish the "Hard Facts" of the environment:
-   **Tech Stack:** Explicitly list Frameworks (React, Next.js), Languages (TypeScript), and Key Libraries (Tailwind, Radix).
-   **Environment Constraints:** Note critical infrastructure facts (e.g., "Standard Express on Port 3000," "Firebase Enterprise Enabled").
-   **Core Manifest:** Reference the current state of `package.json`, `metadata.json`, and `.env.example`.

### Phase B: File-System & Dependency Mapping
Reconstruct the structural graph:
-   **Completed Modules:** List files that are "Done" and verified (e.g., `src/components/ui/Button.tsx`).
-   **Partial/Draft Files:** Identify files that exist but contain "TODOs" or placeholder logic.
-   **Dependency Graph:** Note how features interact (e.g., "The Auth feature depends on the Firebase config in `src/lib/firebase.ts`").

### Phase C: The "In-Flight" Logical State
Capture the session's active work-stream:
-   **Current Sprint:** What task was literally in the middle of being executed?
-   **Technical Debt:** List known bugs, lint errors, or "Surgical Debugging" fixes that were recently applied.
-   **Next-Step Roadmap:** Provide a prioritized list of the next 3 files to be created or modified.

## 2. Technical Memory Standards

| Category | Standard | Implementation Detail |
| :--- | :--- | :--- |
| **Recency** | State-Timestamping | Always include the "Last Updated" timestamp for the state summary. |
| **Fidelity** | No Approximation | Use exact file paths and function names. Never say "the login stuff." |
| **Accessibility** | Markdown-Ready | Format the summary to be 100% compatible with AI system prompt injection. |
| **Logic** | Boolean Completion | Every feature is either `[DONE]`, `[IN-PROGRESS]`, or `[PENDING]`. |

## 3. Advanced Persistence Patterns

### Pattern: The "Snapshot" Summary
Use this for a quick handover at the end of a long turn.
```markdown
## Project Snapshot: [Project Name]
- **Current Task:** Integrating Stripe Webhooks.
- **Finished:** `server.ts`, `stripeClient.ts`.
- **Pending:** `api/webhooks/route.ts`.
- **Blocker:** Waiting for User to provide `STRIPE_WEBHOOK_SECRET`.
```

### Pattern: The "Deep Context" Transfer
Use this when switching between "Systems Architect" mode and "Frontend Engineer" mode. It bridges the gap between high-level plan and low-level code.

## 4. Context Guardrails & Integrity

> [!CAUTION] **The "Drift" Trap**: Code changes faster than documentation. Never trust a `README.md` and ignore the `package.json` reality.

**The Context Integrity Checklist:**
1.  **Truth Grounding:** Always run `list_dir` and `view_file` on the `package.json` before finalizing a state summary.
2.  **Secret Scrubbing:** Ensure NO API keys, tokens, or PII are saved in the persistent context logs.
3.  **Ambiguity Elimination:** If a file's purpose is unclear, mark it as `[NEEDS_REVIEW]` rather than guessing its function.

## 5. Session Initialization (The "Resume" Logic)

When initiating a new session from a Context Summary, follow these steps:
1.  **Verify Manifest:** Check if the files listed in "Finished" actually exist on disk.
2.  **Lint Check:** Run a quick `lint_applet` to verify the inherited code is syntactically sound.
3.  **Re-Hydrate Goals:** Compare the "Next-Step Roadmap" with the user's latest prompt to detect context shifts.

## 6. Global Context Invariants

-   **ZERO HALLUCINATION:** Do not list files that were planned but never actually created.
-   **ACTIONABLE ONLY:** Focus on data that helps the next agent turn execute code immediately.
-   **HIERARCHICAL:** Use H1/H2 headers to make the context easily scannable by large language models.

## Common Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Context Drift** | The summary says "Firebase is set up," but the config file is missing. | Re-run the "Verification" tool before outputting the final summary. |
| **Information Bloat** | The summary is so long it exceeds the context window. | Focus on the *Immediate File Graph* rather than the whole history. |
| **Vague State** | "Working on the dashboard." | Specify: "Modifying `DashboardLayout.tsx` to add a responsive sidebar." |
| **Outdated Plan** | The summary follows an old architecture that the user rejected. | Explicitly note "REJECTED" or "DEPRECATED" paths in the roadmap. |
