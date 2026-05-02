---
name: qa-test-engineer
description: Advanced quality assurance automation, systemic edge-case discovery, and full-spectrum testing engineering. Use this skill for building resilient unit, integration, and E2E test suites with high-fidelity verification.
---

# Advanced QA Engineering & Automated Verification

Test Engineering is the discipline of proving correctness under stress. To achieve "100x" better quality, move beyond "simple assertions" and into **Failure Mode Analysis**, **Behavioral Boundary Probing**, and **Deterministic Isolation**.

## 1. The Resilience & Verification Protocol

Engineer high-confidence test suites through the **V.I.P.E.R.** (Verify, Isolate, Permutation, Evaluate, Regression) framework:

### Phase A: Tactical Verification & Scoping (Verify)
Define the boundaries of the testable universe:
-   **Contract Verification:** Ensure the module adheres to its input/output types and interface definitions.
-   **Success Path Mapping:** Document the "Happy Path" requirements to establish a baseline for correct behavior.
-   **Risk-Based Prioritization:** Focus testing energy on "High-Value" logic (e.g., Auth, Payments, Data Transformation) over trivial UI styling.

### Phase B: Mocking & Dependency Isolation (Isolate)
Protect tests from the chaos of the outside world:
-   **Deterministic Mocking:** Use `vi.mock()` or `msw` (Mock Service Worker) to intercept network calls and return fixed, predictable payloads.
-   **Clock & Timer Freezing:** Use `vi.useFakeTimers()` to test time-dependent logic (e.g., session timeouts, debouncing) without waiting.
-   **Atomic State Reset:** Ensure every test starts with a "Clean Slate" by resetting DB stores and global registers in `beforeEach`.

### Phase C: Boundary & Input Permutation (Permutation)
Stress-test the logic with the "Chaos Spectrum":
-   **The "Dirty Dozen" Audit:** Inject `null`, `undefined`, empty-strings, extreme numbers (`Infinity`, `-1`), and malformed JSON.
-   **Edge-Case Discovery:** Probe boundary conditions (e.g., what happens at exactly 0 items? What about at 10,001 items?).
-   **Property-Based Fuzzing:** Use libraries like `fast-check` to generate random but valid inputs to find hidden logic branches.

### Phase D: Multi-Layered Evaluation (Evaluate)
Assess the system from multiple perspectives:
-   **Unit Level:** Test pure functions for algorithmic correctness (0-side-effects).
-   **Integration Level:** Verify the "Handshake" between services (e.g., Controller -> Db -> Cache).
-   **E2E (End-to-End) Level:** Simulate high-fidelity user journeys (e.g., Playwright/Cypress) through the full application stack.

### Phase E: Regression & CI Integration (Regression)
Protect the future from the past:
-   **Snapshot Guarding:** Use visual or data snapshots to detect accidental structural drifts in UI or complex JSON outputs.
-   **Code Coverage Analysis:** Monitor coverage not just for percentage, but to ensure all "Critical Logic Paths" are hit.
-   **Flakiness Elimination:** Quarantine and neutralize intermittent failures; a "Sometimes-Pass" test is a security liability.

## 2. Test Layering & Tooling Matrix

| Layer | Complexity | Rationale | Best For... |
| :--- | :--- | :--- | :--- |
| **Unit** | Low | Extremely fast; pinpoints specific logic errors. | Math, Utils, State reducers. |
| **Integration** | Medium | Verifies component intersection and DB connectivity. | API routes, Service layers. |
| **E2E / Browser** | High | Maximum confidence; tests real-world user flow. | Checkout, Auth login, Form submission. |
| **Visual / CSS** | Medium | Detects UI regressions that logic tests miss. | Landing pages, Reusable UI kits. |

## 3. Implementation: The Test Suite Blueprint

When delivering a test suite, provide a **Scenario & Coverage Audit**.

```markdown
### 🧪 Verification Strategy Audit
| Scenario | Logic Guard | Test Method | Coverage Goal |
| :--- | :--- | :--- | :--- |
| **Successful Auth** | JWT persistence | E2E (Playwright) | Verify cookie presence. |
| **Malformed Login** | 400 Bad Request | Integration (Vitest) | Check error message string. |
| **Token Expiry** | Auto-logout logic | Unit (FakeTimers) | Advance clock by 1 hour. |
| **DB Timeout** | Error handling UI | Mock (MSW) | Simulate 503 response. |
```

## 4. Quality & Stability Guardrails

> [!CAUTION] **The "Assertion Blindness" Trap**: Avoid writing tests that only check for "success" (e.g., `expect(result).toBeDefined()`). Assert the *exact* expected state to prevent "Ghost Success" where a function returns garbage that still counts as "defined."

**The QA Integrity Checklist:**
1.  **AAA Integrity:** Every test MUST follow **Arrange** (Set up state), **Act** (Run function), **Assert** (Verify outcome).
2.  **No Logic in Tests:** Keep test code simple. If your test needs `if/else` statements, you are building a second, un-tested application.
3.  **Selector Resilience:** Never select UI elements by fragile CSS classes: prefer `data-testid` or ARIA roles (`getByRole('button', { name: /submit/i })`).
4.  **Deterministic Cleanup:** Always unmount components and clear mock history in `afterEach` to prevent "State Leaking" between tests.

## 5. Implementation Pattern: Integration Boundary Test

```typescript
// src/services/auth.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loginUser } from './auth';

describe('loginUser() Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw "Account Locked" after 5 failed attempts (Edge Case)', async () => {
    // 1. Arrange: Mock the DB to return a specific "locked" flag
    const mockDb = { find: vi.fn().mockResolvedValue({ attempts: 5, locked: true }) };
    
    // 2. Act & 3. Assert
    await expect(loginUser('test@ex.com', 'wrong-pass', mockDb))
      .rejects.toThrow(/account is locked/i);
  });
});
```

## 6. Global QA Invariants

-   **TESTS AS DOCUMENTATION:** Write test descriptions that read like a functional specification (e.g., "It should return a 404 when the user ID is invalid").
-   **FAIL FIRST:** Prove that a test can fail before you write the code to make it pass (Red-Green-Refactor).
-   **ENVIRONMENT PARITY:** Ensure tests run in an environment that mimics production as closely as possible (e.g., using a real Postgres container via Testcontainers vs. a mocked SQLite).

## Common Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Brittle Selectors** | Changing a `<div>` to a `<section>` breaks 20 tests. | Switch to testing library's `getByRole` or `getByLabelText`. |
| **Async Race Condition** | Test randomly fails because a Promise takes too long. | Use `waitFor()` or explicit `await` on all async operations. |
| **Hidden Side-Effects** | Test A passes alone but fails when the whole suite runs. | Identify un-cleared global state (e.g., `localStorage`) and reset in `beforeEach`. |
| **Mock Decay** | The mock data is out of sync with the real API schema. | Use Shared TypeScript Types for both the API and the Mocks. |

