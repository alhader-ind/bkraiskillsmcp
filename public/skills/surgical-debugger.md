---
name: surgical-debugger
description: Advanced root-cause isolation, stack-trace deconstruction, and minimal-disruption bug resolution. Use this skill for identifying and fixing mission-critical system failures.
---

# Advanced Surgical Debugging & System Resilience

Surgical Debugging is the science of identifying the "Primary Point of Failure" and neutralizing it with zero collateral damage. To achieve "100x" better precision, move beyond "trial-and-error" and into **Stack Trace Deconstruction**, **Variable Isolation**, and **Regression-Proof Patching**.

## 1. The Surgical Debugging Protocol

Resolve system failures through the **I.H.P.** (Isolate, Hypothesize, Patch) framework:

### Phase A: Evidence Deconstruction & Isolation (Isolate)
Map the exact anatomy of the failure before attempting a fix:
-   **Stack Trace Mapping:** Analyze the trace from top-to-bottom to identify the first "User-Land" frame where the error originated.
-   **input/Output Extraction:** Capture the exact payload or user-input that triggered the crash (the "Death Payload").
-   **Environment Check:** Verify if the bug is specific to a runtime (Node vs. Browser), a version (ESM vs. CJS), or a state (Auth vs. Guest).

### Phase B: Variable State & Logic Hypothesis (Hypothesize)
Determine the "Why" behind the "What":
-   **State Inspection:** Log high-entropy variables immediately preceding the crash site to identify "Nulled" or "Poisoned" values.
-   **Binary Logic Filtering:** Temporarily bypass conditional branches to see if the failure is logic-driven or data-driven.
-   **Dependency Audit:** Identify if a peer-dependency mismatch or a silent update in a `^` versioned library is the root cause.

### Phase C: Minimum Disruption Patching (Patch)
Execute the fix with the precision of a scalpel:
-   **The Atomic Fix:** Modify only the specific logic or syntax required—avoid refactoring unrelated code.
-   **The Resilience Guardrail:** Add a type-guard, null-check, or range-clamp to the fix site to prevent the same failure from ever recurring.
-   **Post-Mortem Verification:** Verify the fix against the "Death Payload" and ensure adjacent features remain functional.

## 2. Advanced Troubleshooting Frameworks

| Failure Type | Analysis Pattern | Resolution Logic |
| :--- | :--- | :--- |
| **Logic/Syntax** | Static Analysis. | Correct the operator error or missing bracket in-place. |
| **Race/Async** | Lifecycle Sequencing. | Enforce `await` order or implement a "Loading" lock to prevent double-firings. |
| **State Drift** | Dependency Tracking. | Ensure `useEffect` or Computed properties have 100% accurate dependency arrays. |
| **Silent Fail** | Differential Logging. | Insert "Breadcrumbs" to track where the code stops executing without an error. |

## 3. Implementation: The Debugging Blueprint

When presenting a fix, provide a **Root Cause & Mitigation Audit**.

```markdown
### 🛠️ Surgical Debugging Report
| Observation | Root Cause | Proposed Fix | Guardrail Added |
| :--- | :--- | :--- | :--- |
| `TypeError: x.map is not a function` | API returned `null` instead of `[]`. | Defaulted to empty array at component level. | Added Zod optional schema validation. |
| Button remains disabled | State is locked in "loading" after error. | Added `finally` block to reset state. | Integrated global toast error notification. |
```

## 4. Stability & Regression Guardrails

> [!CAUTION] **The "Regression Sprawl" Trap**: A fix that breaks something else is worse than the original bug. Always limit the "Blast Radius" of your changes to the immediate function scope.

**The Debugging Integrity Checklist:**
1.  **No Ghost Code:** Remove all `console.log` and temporary debugging markers before final submission.
2.  **Null-Safety Baseline:** Every fix should handle both `null` and `undefined` inputs to the modified function.
3.  **Strict Performance Check:** Verify that the fix doesn't introduce an unnecessary loop or an expensive re-render.
4.  **Security Sanitization:** Ensure the fix doesn't bypass an existing auth-check or leak sensitive data in a warning.

## 5. Implementation Pattern: Atomic Correction

```ts
// src/lib/utils.ts
// Fix: Fixed the 'undefined' crash when user profile is missing
export const getDisplayName = (user: User) => {
  // Surgical Fix: Added optional chaining and default fallback
  return user?.profile?.displayName ?? user?.email ?? 'Anonymous';
};
```

## 6. Global Debugging Invariants

-   **DATA OVER GUESSWORK:** If you don't have a stack trace, your first move is to generate one.
-   **THE SCALPEL RULE:** If you need to change 3 lines to fix a bug, don't change 4.
-   **POST-FIX AUDIT:** Always ask "Why did this happen?" to identify if there is a deeper architectural flaw (Phase A drift).

## Common Debugging Anti-patterns and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **The "Patch-on-Patch"** | 10 nested `if` statements fixing edge cases. | Refactor the core data structure to be "Valid by Design." |
| **Silent Swallowing** | `try { ... } catch(e) {}` with no logging. | Always log to a monitoring service or the developer console. |
| **Stale State** | The UI updates to an old value after 1 second. | Invalidate the cache or stabilize the `useEffect` hooks. |
| **Placeholder Logic** | Using `// TODO: fix this later`. | Either fix it now or document it as a "Known Constraint" in Phase D. |
