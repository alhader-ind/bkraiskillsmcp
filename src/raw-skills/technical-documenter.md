---
name: technical-documenter
description: Advanced technical memory management, multi-audience documentation engineering, and architectural mapping. Use this skill for building high-fidelity READMEs, API specs, and system walkthroughs.
---

# Technical Memory & Architectural Documentation

Technical Documentation is the externalized mental model of a system. To achieve "100x" better clarity, move beyond "writing descriptions" and into **Systemic Contextualization**, **API Spec Engineering**, and **Consumer-Centric Walkthroughs**.

## 1. The Technical Memory Protocol

A professional documentation suite follows the **C.M.U.** framework (Context, Mechanism, Utility):

### Phase A: Architecture & Context Mapping
Establish the "Why" and the "Where":
-   **High-Level Mission:** Define the primary objective of the module/system in a single, punchy sentence.
-   **Dependency Graph:** Explicitly list what this code requires to run and what other systems depend on it.
-   **Tech Stack Audit:** Note the languages, frameworks, and critical libraries involved.

### Phase B: Mechanical Breakdown (The "How It Works")
Deconstruct the logic for technical peers:
-   **Logic Flow:** Describe the exact sequence of events (e.g., "Request -> Middleware -> Controller -> Database").
-   **Data Spec:** Define the exact shape of inputs and outputs (using TypeScript interfaces or JSON schema).
-   **State Management:** Describe how data persists and changes throughout the lifecycle.

### Phase C: Utility & Developer Experience (DX)
Enable immediate execution:
-   **The "Golden Path" Example:** Provide a copy-pasteable code snippet that demonstrates the most common use case.
-   **Setup & Prerequisites:** List exact environment variables, install commands, and hardware requirements.
-   **Error Dictionary:** Document common failure states and how to resolve them.

## 2. Multi-Audience Documentation Matrix

| Audience | Deliverable | Key Focus |
| :--- | :--- | :--- |
| **New Developers** | README.md | Installation, "Hello World" example, and architectural overview. |
| **API Consumers** | Swagger / OpenAPI Spec | Endpoints, authentication, and specific payload schemas. |
| **Architects** | System Design Doc (SDD) | Scalability, data flow diagrams (Mermaid), and security model. |
| **Management** | executive_summary.md | Business value, cost-to-run, and project status. |

## 3. Implementation: The Documentation Blueprint

When documenting a project, use a **Tiered Metadata Table** to ground the reader instantly.

```markdown
### 📄 Module: [Module Name]
- **Status:** `[DONE/BETA/STABLE]`
- **Last Updated:** [Date]
- **Complexity:** `[LOW/MEDIUM/HIGH]`
- **Primary Endpoint:** `POST /api/v1/process`

#### 🛠️ Quick Start
1. `npm install`
2. Configure `process.env.SECRET_KEY`
3. Call `processData(payload)`
```

## 4. Clarity & Precision Guardrails

> [!CAUTION] **The "Drift" Trap**: Outdated documentation is worse than no documentation. If you change a function signature, you MUST update its docstring and the README simultaneously.

**The Documentation Integrity Checklist:**
1.  **Strict Markdown Hierarchy:** Use H1 for titles, H2 for sections, and H3 for sub-points. Never jump levels.
2.  **No Ghost Code:** Every usage example MUST be tested and verified to work with the current codebase.
3.  **Active Voice:** Use direct imperatives ("Call this function") rather than passive descriptions ("This function is called").
4.  **Zero Ambiguity:** Use exact file paths (`/src/lib/utils.ts`) instead of vague phrases like "in the utils file."

## 5. Lifecycle Documentation Patterns

-   **Inline JSDoc:** Use for every exported function to enable IDE intelligent autocomplete.
-   **Mermaid.js Flowcharts:** Use for visual sequence diagrams of complex logic.
-   **Changelog Persistence:** Maintain a `CHANGELOG.md` following the "Keep a Changelog" standard.

## 6. Global Documentation Invariants

-   **DX FIRST:** Documentation is a product. Ensure it is scannable, searchable, and concise.
-   **NO REPETITION:** Use links to internal files rather than copy-pasting the same logic description in multiple places.
-   **TRUTH GROUNDING:** If the code and the documentation disagree, the code is the truth. Update the document immediately.

## Common Documentation Anti-patterns and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **The Wall of Text** | A 5000-word block with no sub-headers. | Use Bullet points, Tables, and H2/H3 headers for scannability. |
| **Missing "Why"** | The doc explains *what* a function does but not *why* it exists. | Add a "Rationale" section for complex architectural decisions. |
| **Broken Paths** | Documentation refers to files that were moved or deleted. | Use a relative path checker or mark file-references during refactoring. |
| **Example-less Docs** | A list of functions with no usage snippets. | Always include a "Practical Usage" block for every public API. |
