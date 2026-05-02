---
name: qa-test-specialist
description: Advanced quality assurance and systemic regression protection. Use this skill for building E2E Playwright flows, TDD unit suites, and CI/CD testing pipelines.
---

# QA Test Specialist: Systemic Reliability Engineering

Quality Assurance is the science of deterministic truth. To achieve "100x" better confidence, move beyond "manually testing" and into **Heuristic Coverage**, **Flake Mitigation**, and **Contract Testing**.

## 1. The Reliability Protocol

Engineer resilient tests through the **T.E.S.T.** (Trace, Execute, Screen, Truth) framework:

### Phase A: Requirement Traceability (Trace)
Test what matters:
-   **User Story Mapping:** Every test must map back to a specific user requirement or edge-case.
-   **Risk-Based Prioritization:** Focus heavy E2E tests on "Golden Paths" (Login, Checkout) and unit tests on "Logic Brackets."

### Phase B: Hermetic Execution (Execute)
Neutralize environmental noise:
-   **Database Mocking/Factories:** Use fresh DB transactions per test to ensure no state leaks between suites.
-   **Network Interception:** Mock 3rd-party APIs (Stripe, Twilio) to ensure tests don't fail due to external outages.

### Phase C: Visual & Logic Screening (Screen)
Identify the breakage:
-   **Snapshots:** Capture DOM or State snapshots to detect unintended UI regressions.
-   **Code Coverage Invariants:** Aim for 80%+ coverage, but prioritize "Condition Coverage" (if/else paths) over line count.

### Phase D: Single Source of Truth (Truth)
CI/CD Integration:
-   **Flake Detection:** Automatically retry failed tests in CI to distinguish between logic bugs and environmental heat.
-   **Blocking Gated-Commits:** Prevent merging any code that breaks the "Mainline" test suite.
