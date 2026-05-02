---
name: frontend-engineer
description: Advanced UI engineering, component lifecycle orchestration, and high-performance interactive systems. Use this skill for building complex React/TypeScript applications with production-grade polish.
---

# Advanced Frontend Engineering & Component Systems

Frontend Engineering is the intersection of design precision and system stability. To achieve "100x" better reliability, move beyond "writing components" and into **Component Orchestration**, **Runtime Resilience**, and **Interactive Physics**.

## 1. The Expert Implementation Protocol

Develop high-fidelity interfaces through the **D.S.O.** (Decompose, State, Optimize) framework:

### Phase A: Component Decomposition & Design System (Decompose)
Break the UI into logical, atomic units before writing code:
-   **Atomic Design:** Categorize elements into Atoms (Buttons), Molecules (Search Inputs), and Organisms (Navbars).
-   **Compositional Strategy:** Identify "slots" and "compound components" where children need flexible placement.
-   **Semantic Scaffolding:** Enforce the use of meaningful HTML tags (`<article>`, `<section>`, `<nav>`) from the first line.

### Phase B: State Modeling & Flow (State)
Identify where "Truth" lives and how it propagates:
-   **Server State Orchestration:** Use `TanStack Query` or `SWR` for remote data fetching, caching, and optimistic updates.
-   **Regional vs. Global State:** Decide between `useState` (Local), custom hooks (Regional), or `Zustand` (Global) based on the "Re-render Radius."
-   **URL as Source of Truth:** Sync UI filters, pagination, and tabs to `searchParams` to ensure state is shareable and persistent.

### Phase C: Runtime Resilience & Performance (Optimize)
Harden the application for the browser environment:
-   **Error Frontiers:** Wrap complex features in `ErrorBoundary` components to prevent a single failure from crashing the entire app.
-   **Render Path Profiling:** Use `useMemo`, `useCallback`, and `React.memo` targeted at expensive calculations or deep sub-trees.
-   **Bundle Topology:** Implement code-splitting (`React.lazy`) for non-critical routes and use dynamic imports for heavy secondary modules.

## 2. Advanced Component Framework Matrix

| Pattern | Best For... | Implementation Logic |
| :--- | :--- | :--- |
| **Compound Components** | Selects, Tabs, Accordions. | Share state via Context internal to the component family. |
| **Render Props / Slots** | Generic Layouts. | Allow consumers to inject custom UI while preserving logic. |
| **Higher-Order Hooks** | Cross-cutting concerns. | Extract complex logic (e.g., `useAuth`, `useLocalStorage`) into reusable logic blocks. |
| **Polymorphic Components** | Generic UI primitives. | Use the `as` prop to change the underlying HTML element while keeping styles. |

## 3. Implementation: The Frontend Architecture Blueprint

When implementing a complex feature, provide a **Component Tree & State Map**.

```markdown
### ⚛️ Component System Blueprint
| Component | Logic Source | Rendering Strategy | A11y Role |
| :--- | :--- | :--- | :--- |
| **SidebarNav** | `useAuthStore` | Static / Client | `role="navigation"` |
| **DataTable** | `useQuery` | Server-State Hydrated | `role="table"` |
| **SearchInput** | `useState` (local) | Client-side Debounce | `aria-autocomplete` |
| **ActionModal** | `useAppStore` | Portaled to Root | `role="dialog"` |
```

## 4. Accessibility & Integrity Guardrails

> [!CAUTION] **The "Visual-Only" Trap**: A UI that looks perfect but is unusable with a keyboard or screen reader is a technical failure. Always ensure `tabIndex` and `aria-labels` are correctly implemented.

**The Frontend Integrity Checklist:**
1.  **Strict Semantic Hierarchy:** Use `H1` through `H6` in order. Never skip levels for "style" purposes.
2.  **Focus Management:** Ensure that opening a modal traps focus and closing it returns focus to the trigger.
3.  **No "Dead" Interactive Elements:** All `onclick` handlers on `divs` must be moved to `<button>` or given `role="button"` + `onKeyDown`.
4.  **Runtime Fail-Safes:** Provide "Empty States" and "Error States" for every data-driven component.

## 5. Implementation Pattern: Compound Component (Tabs)

```tsx
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview"> Dashboard Data... </Tabs.Content>
</Tabs>
```

## 6. Global Frontend Invariants

-   **MOBILE-FIRST CORE:** Develop for the smallest screen, and use Tailwind responsive prefixes (`md:`, `lg:`) to "expand" the layout.
-   **DESIGN SYSTEM ADHERENCE:** Never use arbitrary values (e.g., `p-[17px]`). Stick to the spacing, color, and typographic scales defined in the theme.
-   **PERCEIVED SKELETONS:** Use skeleton loaders instead of generic spinners to maintain layout stability during data transitions.

## Common Frontend Implementation Anti-patterns and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Prop Drilling** | Passing data through 5+ component layers. | Lift state to a Context Provider or a Zustand Store. |
| **Stale Closures** | `useEffect` missing dependencies, leading to old values. | Implement a strict `linter` rule for dependency arrays. |
| **Unstyled Flickering** | Layout jumps as fonts or images load (CLS). | Set explicit aspect ratios and use `font-display: swap`. |
| **Z-Index Chaos** | Modals appearing behind sidebars or footers. | Use React Portals to mount overlays at the document body's root. |
