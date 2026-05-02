---
name: regex-crafter
description: Advanced string-matching engineering, catastrophic backtracking prevention, and high-fidelity pattern synthesis. Use this skill for building robust, performant, and secure regular expressions across multiple engines.
---

# Advanced Regex Engineering & String Logic

Regular Expression engineering is the science of precise pattern orchestration. To achieve "100x" better reliability, move beyond "simple matching" and into **Complexity Optimization**, **Recursive Engine Awareness**, and **Zero-Trust Input Scoping**.

## 1. The Regex Optimization Protocol

Engineer high-performance patterns through the **D.S.P.** (Design, Stress-Test, Polish) framework:

### Phase A: Atomic Pattern Design (Design)
Construct the logical skeleton of the match:
-   **Anchor Targeting:** Use start (`^`) and end (`$`) anchors to prevent partial matches and reduce scanning time.
-   **Character Class Hardening:** Prefer explicit classes (e.g., `[a-zA-Z0-9]`) over generic dots (`.`) to minimize path branching.
-   **Lookaround Orchestration:** Implement zero-width assertions (Lookahead `(?=...)`, Lookbehind `(?<=...)`) to validate context without consuming characters.

### Phase B: Backtracking & Performance Audit (Stress-Test)
Neutralize the threat of catastrophic backtracking (ReDoS):
-   **Atomic Grouping:** Use non-capturing groups `(?:...)` and atomic groups `(?>...)` (where supported) to prevent the engine from re-evaluating failed paths.
-   **Quantifier Tuning:** Avoid nested quantifiers (e.g., `(a+)+`) which lead to exponential complexity.
-   **Possessive Matchers:** Use possessive quantifiers (e.g., `*+`, `++`) to force the engine to give up immediately on failure rather than backtracking.

### Phase C: Multi-Engine Normalization (Polish)
Ensure the pattern behaves as expected in the target environment:
-   **Engine-Specific Syntax:** Tailor the pattern for the specific flavor (PCRE, ECMAScript, Python re, etc.).
-   **Flag Sanitization:** Explicitly define flags (e.g., `g`, `i`, `m`, `u`, `s`) to ensure consistent global, case-insensitive, or multiline behavior.
-   **Named Capture Synthesis:** Use named groups `(?<name>...)` for higher readability and more robust data extraction.

## 2. Advanced Regex Engine Matrix

| Engine | Constraint | Best For... |
| :--- | :--- | :--- |
| **PCRE / PHP** | Recursion support. | Complex nested structures and recursive matching. |
| **JavaScript (V8)** | No atomic groups. | Web-side validation and simple text processing. |
| **Python (re)** | Limited lookbehind. | Data science pipelines and backend scripting. |
| **Rust (regex)** | Linear time (no backtracking). | Mission-critical performance; forbids some backreferences. |

## 3. Implementation: The Regex Blueprint

When presenting a complex pattern, provide a **Pattern Decomposition Audit**.

```markdown
### 🧩 Regex Pattern Blueprint
| Component | Implementation | Logic Role |
| :--- | :--- | :--- |
| **The Core** | `(?<id>[A-Z]{3}-\d{4})` | Named capture for ID format (AAA-1111). |
| **The Anchor** | `^...$` | Enforces full-string match. |
| **The Guard** | `(?=\S*[\!\?])` | Positive lookahead ensuring at least one symbol. |
| **The Flags** | `/.../gm` | Global and multiline flags for bulk processing. |
```

## 4. Performance & Security Guardrails

> [!CAUTION] **The "Catastrophic Backtracking" Trap**: A poorly designed regex can hang a server for minutes on a specific "malicious" string. Never use nested quantifiers on overlapping character classes.

**The Regex Integrity Checklist:**
1.  **Lazy over Greedy:** Use lazy quantifiers (`*?`, `+?`) when possible to stop the match as soon as the condition is met.
2.  **Fail-Fast Logic:** Place the most likely failure points (e.g., specific anchors or prefixes) at the beginning of the pattern.
3.  **Input Clamping:** Never run complex regex against un-clamped strings (e.g., > 10KB) from users without strict timeouts.
4.  **No "Dot-All" Blindness:** Be careful with `/s` (dotall) flag; it can lead to massive unintended matches across document boundaries.

## 5. Implementation Pattern: Atomic Validation

```javascript
/**
 * Goal: Securely validate a complex password
 * Constraints: Min 8 chars, 1 uppercase, 1 symbol, no catastrophic backtracking
 */
const SECURE_PASS_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})[a-zA-Z\d!@#$%^&*]+$/;

// Testing Logic:
// "Pass123!" -> Match
// "pass123"  -> No Match (Missing Upper/Symbol)
```

## 6. Global Regex Invariants

-   **READABILITY OVER BREVITY:** Use extended mode (`/x`) or comments to explain complex sub-patterns.
-   **STRICT LIMITS:** Always specify quantifier bounds (e.g., `{1,100}`) instead of unbounded repeats (`+`, `*`) on user input.
-   **TEST-DRIVEN PATTERNS:** Every regex MUST be accompanied by a suite of 'Match' and 'No Match' test cases.

## Common Regex Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Exponential Burst** | Server CPU spikes on string "aaaaaaaaaaX". | Remove nested quantifiers like `(a+)+`. |
| **Greedy Overreach** | `<b>...</b>` matches the whole page. | Use lazy quantifier `<b>.*?</b>`. |
| **Engine Mismatch** | `(?<=...)` fails in Safari or old Node. | Use capturing groups and manual index offsetting instead. |
| **Invisible Whitespace** | Pattern fails on lines ending in `\r\n`. | Use `[\r\n]*` or the `m` (multiline) flag correctly. |
