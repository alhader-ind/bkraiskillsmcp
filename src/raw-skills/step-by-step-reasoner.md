---
name: step-by-step-reasoner
description: Advanced recursive logic, first-principles deduction, and multi-path decision analysis. Use this skill for complex problem solving, mathematical proofs, and high-stakes strategy.
---

# Multi-Tiered Reasoning & Logical Synthesis

Step-by-Step Reasoning (Chain-of-Thought) turns a "Pattern-Matching AI" into a "Deterministic Logic Engine." To achieve "100x" better results, move beyond "linear thinking" and into **Recursive Problem Decomposition**, **Adversarial Branching**, and **Self-Correction Loops**.

## 1. The Dynamic Reasoning Protocol

When faced with a high-complexity task, follow the **Logical Sieve Protocol**:

### Phase A: Problem Decomposition (The "First Principles" Pass)
Strip the problem of its assumptions:
-   **Atomic Variables:** Identify the fundamental truths and variables involved.
-   **Structure of Intent:** What is the specific "Win State"? (e.g., A solved equation, a prioritized list, a strategic pivot).
-   **Boundary Constraints:** What is *impossible* or explicitly disallowed by the user/system?

### Phase B: Multi-Path Exploration (Adversarial Branching)
Avoid the "First Best Idea" trap. Generate at least three distinct solutions:
1.  **The Direct Path:** The most logical, efficient route.
2.  **The Edge-Case Path:** How does this solve for the "1% cases" or extreme values?
3.  **The Inverse Path:** If the goal was to *fail* or achieve the opposite, what would be the cause? (Inversion Principle).

### Phase C: Self-Correction & Convergence
Evaluate the branches before finalizing:
-   **Verification Pass:** Check your own math and logic against a "Red Team" version of yourself.
-   **Optimization:** Merge the best elements of multiple paths into a single, cohesive synthesis.

## 2. Advanced Logical Frameworks

| Framework | Pattern | Best For... |
| :--- | :--- | :--- |
| **First Principles** | Break down to "Universal Truths" and rebuild. | Innovation, complex engineering, new project planning. |
| **Second-Order Thinking** | "And then what?" questioning. | Policy making, feature impact analysis, long-term strategy. |
| **Occam’s Razor** | Prefer the simplest solution among equals. | Debugging, UI design, resource management. |
| **Probabilistic Logic** | Assign % confidence to different outcomes. | Financial forecasting, risk assessment, game theory. |

## 3. Implementation: The "Thinking Space" Blueprint

Every complex response should be preceded by a dedicated **Thinking Space** (`>`). This isn't just for show; it's a computational buffer for the model.

```markdown
> ### Thinking Space: [Problem Title]
> 1. **Initial State:** [What we know]
> 2. **Mental Simulation:** [Step-by-step dry run of Path A]
> 3. **Conflict Detection:** [Catching errors in Path A]
> 4. **Path B Pivot:** [Adjusting for a cleaner approach]
> 5. **Final Verification:** [Confidence Check: 98%]
```

## 4. Logical Guardrails & Anti-Bias Safety

> [!CAUTION] **The "Confirmation Bias" Trap**: Humans and AI often look for data that supports their initial guess. Actively try to *disprove* your hypothesis.

**The Integrity Checklist:**
1.  **Verification of Inputs:** Are the numbers/facts provided by the user actually correct? Ask for clarification if a value looks suspicious.
2.  **No Leaps of Faith:** Ensure every statement in your logic follows directly from the previous one.
3.  **Ambiguity Scaling:** If a problem has multiple valid interpretations, list them and ask the user to choose before proceeding.

## 5. Decision Support & Strategic Synthesis

When helping a user make a "Hard Decision":
-   **Regret Minimization:** Which path results in the least catastrophic failure if it goes wrong?
-   **Expected Value (EV) Analysis:** Weight the value of each outcome by its probability of success.
-   **Time-to-Value:** Factor in the speed of implementation vs. the quality of the result.

## 6. Global Reasoning Invariants

-   **REASONING BEFORE ANSWERING:** Always show the work before providing the "bottom-line" answer to ensure transparency.
-   **ABSOLUTE PRECISION:** Use standard mathematical notation and logical operators (AND, OR, NOT) when applicable.
-   **EXPLICIT ASSUMPTIONS:** Start the response with "Assumption: [X]," if you are filling a gap in the user's data.

## Common Logical Fallacies and Solutions

| Fallacy | Symptom | Fix |
| :--- | :--- | :--- |
| **Sunk Cost Fallacy** | Doubling down on a bad code path because "we already wrote 100 lines." | Assess if a "Start-from-Scratch" approach is more efficient in the long run. |
| **Availability Heuristic** | Overestimating a risk because we just saw a similar bug. | Look at historical data and system-wide patterns instead of just the last 5 minutes. |
| **Survivorship Bias** | Looking only at the successful files and ignoring the failed ones. | Analyze *all* previous attempts to identify why we reached the current state. |
| **Circular Reasoning** | "The API is down because it's not responding." | Dig deeper: Is it a DNS issue? A timeout? A 500 error? Find the *actual* cause. |
