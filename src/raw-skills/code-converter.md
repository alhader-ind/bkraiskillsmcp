---
name: code-converter
description: Advanced cross-language logic translation, idiomatic transpilation, and multi-framework architectural mapping. Use this skill for high-fidelity code migrations and polyglot system integrations.
---

# Advanced Code Translation & Idiomatic Transpilation

Code Conversion is the mapping of intent across distinct computational paradigms. To achieve "100x" better fidelity, move beyond "syntax swapping" and into **Logical Abstraction**, **Idiomatic Re-Engineering**, and **Pattern-Equivalence Mapping**.

## 1. The High-Fidelity Translation Protocol

Execute precise code migrations through the **L.I.T.** (Logic, Idiom, Transpile) framework:

### Phase A: Logical Deconstruction & Abstraction (Logic)
Distill the code to its mathematical and functional essence:
-   **Algorithm Distillation:** Identify the core sorting, filtering, or transformation logic without its syntax-specific baggage.
-   **Data Structure Mapping:** Determine the underlying collection types (e.g., Is this a Map, a Linked List, or a simple Array-of-Objects?).
-   **Side-Effect Analysis:** Catalog external IO calls, state mutations, and closure dependencies.

### Phase B: Idiomatic Reconstruction & Adaptation (Idiom)
Rebuild the logic using the "Native Soul" of the target environment:
-   **Language-Specific Primitives:** Replace manual loops with target-native iterators (e.g., `for` to `.map()`, or manual recursion to tail-call optimization).
-   **Type System Synthesis:** Re-verify type safety using the target's specific capabilities (e.g., mapping Python's Duck Typing to TypeScript's Strict Interfaces).
-   **Dependency Parity:** Identify target-native package equivalents (e.g., migrating from `Pandas` to `danfojs` or `Axios` to `Fetch`).

### Phase C: Context-Aware Transpilation (Transpile)
Finalize the output for immediate execution and readability:
-   **Style Guide Adherence:** Enforce the target's community standards (e.g., PEP 8 for Python, CamelCase for JS, Go-style internal naming).
-   **Error Handling Migration:** Translate error models (e.g., `try-except` to `Result` types or `try-catch`).
-   **Syntax Hardening:** Ensure all brackets, semicolons, and indentation follow the target's strict requirements.

## 2. Advanced Language Mapping Matrix

| Source Paradigm | Target Paradigm | Transformation Strategy |
| :--- | :--- | :--- |
| **Imperative (C/Java)** | **Functional (TS/Haskell)** | Convert stateful loops into immutability-based map/reduce pipelines. |
| **Dynamic (Python/JS)** | **Strict (TS/Go/Rust)** | Inject explicit type-safety, result-types, and memory bounds. |
| **Class-Based (OOP)** | **Hook-Based (React)** | Map lifecycle methods to `useEffect` and state properties to `useState`. |
| **Sync/Blocking** | **Async/Non-Blocking** | Wrap logic in `async/await` and manage event-loop continuity. |

## 3. Implementation: The Translation Blueprint

When converting code, provide a **Logic-to-Idiom Mapping**.

```markdown
### 🔄 Logical Transpilation Audit
| Logic Segment | Source Pattern | Target Implementation | Idiomatic Gain |
| :--- | :--- | :--- | :--- |
| **Data Fetching** | `request` (sync) | `fetch` (async/await) | Non-blocking execution. |
| **Collection** | `dict` (raw) | `Map<string, User>` | Strict type-safety & key indexing. |
| **Iterator** | `for i in range` | `.map()` | Declaration vs. Implementation focus. |
| **State** | `this.state` | `const [state, setState]` | Functional component optimization. |
```

## 4. Accuracy & Integrity Guardrails

> [!CAUTION] **The "Literalism" Trap**: Never do a direct word-for-word translation. A Pythonic script translated literally into JavaScript is "Bad JavaScript," even if it runs.

**The Translation Integrity Checklist:**
1.  **Semantic Parity:** The "Before" and "After" code must produce the exact same output for the same input.
2.  **Zero Hallucinated Libs:** Don't import libraries that don't exist in the target language's ecosystem.
3.  **No Logic Leakage:** Avoid leaving artifacts of the old language (e.g., `def` keywords in JS or `let` in Python) in the final output.
4.  **Helper Isolation:** If a core feature doesn't exist in the target, create a tidy `utils` function rather than cluttering the main logic.

## 5. Implementation Pattern: Complex Migration (Python to TS)

```typescript
// Original Python: processed_users = [u.name.upper() for u in users if u.is_active]

// Target TypeScript (Idiomatic):
import type { User } from './types';

export const getActiveUserNames = (users: User[]): string[] => {
  return users
    .filter(user => user.isActive)
    .map(user => user.name.toUpperCase());
};
```

## 6. Global Translation Invariants

-   **IDIOM OVER SYNTAX:** Always prefer the target language's "best way" over the source's "literal way."
-   **PERFORMANCE NEUTRALITY:** Ensure the conversion doesn't introduce hidden complexity (O(n) logic becoming O(n^2)).
-   **TYPE INTEGRITY:** Every converted variable must have a clear type definition in compiled/typed languages.

## Common Translation Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Scoping Errors** | Variable `x` is undefined in the new language. | Map local-scope (`let/const`) vs. global-scope rules accurately. |
| **Off-by-One Sync** | Array indexing differs $(0$-based vs $1$-based$)$. | Explicitly check start/end bounds during the abstraction phase. |
| **Memory Leaks** | Garbage collection is handled differently. | Manually clear listeners or use appropriate lifecycle hooks in the target. |
| **Null pointer Crash** | New language is stricter about `null`. | Add optional chaining or null-guards during the transpile phase. |
