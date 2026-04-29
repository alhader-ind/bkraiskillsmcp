---
name: clean-coder
description: Advanced structural engineering, systemic debt reduction, and high-fidelity architectural synthesis. Use this skill for transforming chaotic legacy "spaghetti" logic into modular, SOLID, and highly maintainable systems.
---

# Advanced Clean Coding & Architectural Synthesis

Clean Coding is the engineering of clarity. To achieve "100x" better maintainability, move beyond "fixing indentation" and into **Architectural Decoupling**, **Cognitive Load Reduction**, and **Functional Purity**.

## 1. The High-Fidelity Refactoring Protocol

Execute systemic elegance through the **C.L.E.A.N.** (Context, Logic, Elegance, Audit, Normalize) framework:

### Phase A: Contextual Domain Mapping (Context)
Understand the "Why" before changing the "How":
-   **Dependency Graphing:** Map how the target code interacts with external modules and state.
-   **Side-Effect Cataloging:** Identify every mutation, API call, or global variable modification.
-   **Constraint Discovery:** Determine if any "messy" code is intentional due to performance optimization or legacy compatibility.

### Phase B: Logic Decoupling & Isolation (Logic)
Separate the "What" from the "Where":
-   **Concerns Partitioning:** Extract business logic from UI/Framework-specific code (e.g., separating data transformation from React Component logic).
-   **Pure Function Extraction:** Convert state-dependent blocks into pure, testable functions that operate only on passed arguments.
-   **Primitive Obsession Mitigation:** Replace generic data structures with domain-specific types or objects that enforce their own invariants.

### Phase C: Elegant Architectural Synthesis (Elegance)
Apply the "Laws of Software Design":
-   **SOLID Infrastructure:** Implement SRP (Single Responsibility) and OCP (Open-Closed) to ensure the system grows without breaking.
-   **DRY Consolidation:** Identify systemic repetition and abstract it into reusable, high-order patterns (Composition over Inheritance).
-   **Cognitive Load Optimization:** Rename variables/functions for semantic clarity and reduce nesting depth via guard clauses and early returns.

### Phase D: Multi-Stage Regression Audit (Audit)
Ensure the "Behavior Invariant" remains unbroken:
-   **Logic Parity Check:** Verify that for every possible input, the "Before" and "After" code produce the exact same observable outcome.
-   **Complexity Benchmarking:** Ensure that Cyclomatic Complexity and Halstead volume metrics have decreased.
-   **Refactor/Test Loop:** If tests exist, they must pass without modification; if they don't, identify the "Golden Outputs" to verify success.

### Phase E: Normalized Documentation & Metadata (Normalize)
Standardize the "Readable Surface" of the code:
-   **JSDoc/Docstring Orchestration:** Add type-safe, descriptive comments for every new public interface.
-   **Self-Documenting Code:** Structure the code so that the "Story" of the logic is told through names and flow, requiring minimal non-standard comments.

## 2. Advanced Clean Code & Pattern Matrix

| Pattern | Rationale | Best For... | Implementation Outcome |
| :--- | :--- | :--- | :--- |
| **Strategy Pattern** | Replaces complex `if/else` or `switch` blocks. | Payment gateways, multi-format export logic. | Higher extensibility. |
| **Factory / Builder** | Standardizes complex object creation. | Setting up mock data, complex UI components. | Lower initialization debt. |
| **Composite Pattern** | Treats single items and groups uniformly. | Tree structures, file systems, UI hierarchies. | Simplified recursive logic. |
| **Observer Pattern** | Decouples notification from implementation. | Real-time updates, event-driven state. | Zero direct coupling. |

## 3. Implementation: The Clean Coder Blueprint

When refactoring a system, provide a **Systemic Improvement Audit**.

```markdown
### 💎 Systemic Refactoring Audit
| Old Pattern | New Pattern | Architectural Gain | Logic Retained |
| :--- | :--- | :--- | :--- |
| 50-line `if/else` | Strategy Map | O(1) lookup, OCP compliant. | 100% |
| Manual Prop Drilling | Zustand / Context | Decoupled UI and State. | 100% |
| Sequential Loops | `.filter().map()` | Declarative, pure data pipeline. | 100% |
| Global Variables | Scoped State/Refs | Thread-safety & Predictability. | 100% |
```

## 4. Elegance & Integrity Guardrails

> [!CAUTION] **The "Golden Logic" Trap**: Never "improve" the actual outcome of the code during a refactor. If a function returns $X$, and you make it "cleaner," it must still return $X$ exactly.

**The Clean Coder Integrity Checklist:**
1.  **Zero Feature Creep:** Do not add "new features" during a refactor. Refactoring is exclusively about structure.
2.  **Naming is Everything:** If you can't name it in 3 words or less, the function is doing too much. Split it.
3.  **Cyclomatic Reduction:** If your nesting level is $> 3$, you have a logic failure. Flatten the flow.
4.  **Shadow Dependency Check:** Ensure that extracting a function doesn't accidentally disconnect it from a hidden closure or `this` context.

## 5. Implementation Pattern: Complex Logic Decomposition

```typescript
// BEFORE: The "Spaghetti" Waterfall
function p(u, d) {
  if (u && u.active) {
    if (d && d.length > 0) {
      let r = [];
      for (let i = 0; i < d.length; i++) {
        if (d[i].p > 100) r.push(d[i]);
      }
      return r;
    }
  }
  return null;
}

// AFTER: The "Elegant" Pipeline (C.L.E.A.N.)
import type { User, Product } from './types';

/**
 * Filter premium products for active users.
 */
export const getPremiumProductsForUser = (user: User | null, data: Product[]): Product[] | null => {
  if (!user?.isActive || !data?.length) return null;

  const PREMIUM_PRICE_THRESHOLD = 100;
  
  return data.filter(product => product.price > PREMIUM_PRICE_THRESHOLD);
};
```

## 6. Global Clean Code Invariants

-   **LEAVING IT BETTER:** Every commit should leave the code more readable than it was found.
-   **TRUST BUT VERIFY:** Always assume a refactor could break something; verify via snapshots or integration checks.
-   **BEAUTY IS FUNCTIONAL:** Clean code isn't just "pretty"; it has fewer bugs and lower maintenance costs.

## Common Refactoring Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Logic Drift** | The new code produces slightly different results for edge cases. | Re-run the "Audit" phase with exact edge-case values from the old code. |
| **Indirection Overload** | "Clean" code has too many tiny files; hard to follow. | Apply the "Rule of Three": Only abstract if the logic is reused or truly complex. |
| **Context Loss** | Naming is too generic (e.g., `processData`). | Use domain-specific verbs (e.g., `calculateInvoiceSubtotal`). |
| **Scope Creep** | Refactoring one file leads to changing 20 others. | Define a "Blast Radius" and stick to it; refactor in small, atomic PRs. |
