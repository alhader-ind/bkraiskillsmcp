---
name: systems-architect
description: Advanced technical stack orchestration, high-fidelity repository engineering, and multi-tier scalability roadmapping. Use this skill for building production-grade system blueprints and complex refactorings.
---

# Advanced Systems Architecture & Technical Engineering

Systems Architecture is the blueprint of systemic integrity. To achieve "100x" better reliability, move beyond "file structures" and into **Context-Aware Stack Synthesis**, **Cross-Domain Data Modeling**, and **Deployment-First Orchestration**.

## 1. The Core Architectural Protocol

Engineer a system through the **B.A.S.E.** (Blueprint, Architecture, Service, Exit) framework:

### Phase A: Blueprint & Domain Logic (Blueprint)
Establish the fundamental "Reality" of the system before a single line of UI is written:
-   **Entity Synthesis:** Define the core data models (TypeScript interfaces, DB schemas) and their relationships (1:1, 1:N, N:M).
-   **State Domain Mapping:** Identify where "Truth" lives—Server (DB), Global Store (Zustand), or Transient (Local State).
-   **Edge-Case Modeling:** Predict failure states (Network loss, Auth expiry, Data collisions) at the schema level.

### Phase B: Structural Flow & Modularity (Architecture)
Design the repository for maximum scannability and minimal coupling:
-   **Modular Feature Pattern:** Organize by "Domain" (e.g., `/features/auth`, `/features/billing`) rather than "Type" (e.g., `/components`).
-   **The "Clean" Core:** Ensure business logic is decoupled from framework-specific details (e.g., keeping pure functions in `/services` away from React hooks).
-   **Path Resolution:** Implement absolute imports and clear directory aliasing to prevent "../../../" hell.

### Phase C: Operational Integrity & Service (Service)
Build the "Bridges" between the logic and the environment:
-   **Service Wrapping:** Create thin, swappable wrappers for third-party APIs (Stripe, Firebase, Gemini) to prevent vendor lock-in.
-   **Error Orchestration:** Implement a tiered error handling strategy (Local Rejections -> Global UI Toasts -> Server-Side Sentry/Logging).
-   **Observability Hooks:** Embed performance markers and audit logs into the core data flow.

### Phase D: Deployment & Scalability (Exit)
Ensure the system can live, grow, and be maintained:
-   **Environment Hardening:** Mandate `.env.example` parity and implement runtime validation for all secrets.
-   **Bundle Topology:** Design for code-splitting (lazy loading) and tree-shaking from day one to ensure fast "Time-to-Interactive."
-   **Maintenance Roadmapping:** Document the "How to scale" path for when user load increases 10x.

## 2. Advanced Stack Orchestration Matrix

| Project Persona | Recommended Stack | Rationale |
| :--- | :--- | :--- |
| **Mission-Critical SPA** | Vite + React + Zustand + Zod | Type-safe state, lightning-fast rendering, and strict input validation. |
| **High-Scale Content** | Next.js (App Router) + Tailwind | Global CDN persistence, optimized SEO, and server-component efficiency. |
| **Edge Full-Stack** | Hono + Cloudflare Workers | Near-zero cold starts, global distribution, and minimal compute cost. |
| **Real-Time Engine** | Firebase + WebSockets + Motion | Instant state sync, collaborative physics, and fluid interactivity. |

## 3. Implementation: The Systems Blueprint

When architecting a new project, provide a **System Topology Audit**.

```markdown
### 🏗️ System Topology Blueprint
| Component | Technology | Logic Role |
| :--- | :--- | :--- |
| **Primary Framework** | React 18+ (Vite) | UI Reactivity and View Layer. |
| **Data Orchestration** | TanStack Query | Server-state caching and synchronization. |
| **Logic Core** | TypeScript Services | Framework-agnostic business rules. |
| **Persistence** | Firestore / PostgreSQL | Durable source of truth. |
| **Security Gate** | Firebase Auth / JWT | Zero-trust identity management. |
```

## 4. Scalability & Integrity Guardrails

> [!CAUTION] **The "Prop Drilling" Trap**: If data needs to traverse more than 3 levels of the component tree, it is no longer a "Prop"; it is "Atmospheric State" and belongs in a Global Store (Zustand or Context).

**The Architectural Integrity Checklist:**
1.  **Strict Typing:** Zero `any` usage. All data entering the system must be validated via Zod or TypeScript interfaces.
2.  **Immutability Baseline:** Enforce immutable state transitions to prevent "Ghost Mutations" in the UI.
3.  **Idempotent Actions:** Ensure all write operations (e.g., `saveSettings`) can be safely re-fired during network flakiness.
4.  **Separation of Concerns:** Components handle *Presentation*; Hooks handle *State*; Services handle *Logic*.

## 5. Implementation Pattern: Feature-Based Repo Structure

```text
/src
  /components       # Atomic UI elements (Input, Button)
  /features         # Bounded Contexts (Auth, Search)
    /api            # Feature-specific hooks
    /components     # Feature-specific UI
    /utils          # Feature-specific logic
  /lib              # Third-party wrappers (Firebase, Stripe)
  /services         # Pure business logic core
  /styles           # Global design system (Tailwind)
```

## 6. Global Architectural Invariants

-   **SYSTEM HONESTY:** Never simulate infrastructure (e.g., using `setTimeout` for a mock API). Build for the real latency of the target environment.
-   **PREDICTABLE DATA FLOW:** Data should flow in one direction (Top-Down or Store-to-Component). Bilateral sync is an anti-pattern.
-   **DOCUMENTATION AS CODE:** Use descriptive naming conventions that act as documentation (e.g., `useUserSubscription` rather than `useSub`).

## Common Architectural Anti-patterns and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **God Components** | A `Dashboard.tsx` file with 2,000 lines of code. | Extract logic into custom hooks and sub-components via the Feature Pattern. |
| **Logic Leaks** | API URLs or raw Database keys found in a `.tsx` file. | Move all infrastructure details to `/lib` or `/services`. |
| **Sync Deadlocks** | The UI freezes while a heavy computation runs. | Move heavy logic to Web Workers or handle via asynchronous state (Loading states). |
| **The "Refactor Wall"** | Changing one field breaks 50 components. | Use centralized Type Definitions and DTOs (Data Transfer Objects). |
