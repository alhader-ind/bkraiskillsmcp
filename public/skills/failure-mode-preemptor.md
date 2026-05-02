---
name: failure-mode-preemptor
description: Advanced root-cause isolation, stack-trace deconstruction, and deterministic recovery paths. Use this skill when a build fails, a runtime error occurs, or when the LLM is stuck in an "Error-Fix-Error" loop.
---

# Failure Mode Preemptor: The Hallucination Shield

The Failure Mode Preemptor is a meta-protocol designed to break the cycle of ineffective retries and hallucinated fixes. To achieve "100x" better reliability, move beyond "fixing the error" and into **Deterministic Root-Cause Mapping** and **Branching Recovery Logic**.

## 1. The Deterministic Recovery Protocol

Engineer a path out of failure through the **F.A.I.L.** (Fence, Analyze, Isolate, Loop-Break) framework:

### Phase A: Error Fencing & Perimeter Audit (Fence)
Define the boundaries of the failure:
-   **Terminal Trap:** Capture the *exact* exit code and the full stderr/stdout trace.
-   **Contextual Guardrails:** Identify which file change or dependency installation triggered the failure.
-   **Assumption Testing:** List what you *think* is the cause and immediately attempt to disprove it (e.g., "I assumed the package existed; let me check npmjs.com first").

### Phase B: Stack-Trace Deconstruction & Mapping (Analyze)
Break down the "Black Box" of the error:
-   **Logic vs. Environment:** Determine if the error is a coding logic flaw (e.g., `undefined is not a function`) or an environmental mismatch (e.g., `node: not found`).
-   **Tree-Walking:** Follow the import/dependency tree back to the source. If `prisma` fails, check `node_modules`, then `schema.prisma`, then the database connection string.
-   **Hallucination Check:** If the error refers to a property or method that "should" exist, verify it against the actual package version in `package-lock.json`.

### Phase C: Surgical Isolation & Minimal Reproducer (Isolate)
Neutralize interference:
-   **Comment-Out Isolation:** Temporarily comment out the failing block to verify if the rest of the system builds. If it does, the fault is isolated.
-   **Dependency Sanitization:** Roll back the last `npm install` if the build failed immediately after.
-   **Atomic Fixes:** Apply only ONE change at a time. Never "spray and pray" with multiple fixes in one turn.

### Phase D: Loop-Breaking & Strategy Pivot (Loop-Break)
Exit the "Insanity Cycle":
-   **The 3-Strike Rule:** If a fix fails 3 times, you MUST stop and use `google-search-grounding` or `view_file` to re-read the documentation.
-   **Pivot to Alternative:** If `Library A` is fundamentally incompatible, plan a migration to `Library B` rather than trying to force a fix.
-   **Diagnostic Logging:** Inject high-entropy log statements (`console.log('DEBUG_PATH_A', data)`) to expose invisible state before trying another fix.

## 2. Advanced Error & Recovery Matrix

| Error Type | Likely Cause | Deterministic Recovery Path |
| :--- | :--- | :--- |
| **Module Not Found** | Manifest Drift / Typo. | Check `package.json`, run `npm install`, verify `node_modules` exists. |
| **Type Error** | Null/Undefined access. | Inject optional chaining (`?.`) or add strict null checks. |
| **Prisma Drift** | Schema out of sync. | Run `npx prisma generate` then `prisma db push`. |
| **Vite/Build Error** | HMR or Syntax flaw. | Run `npm run build` locally to see verbose error report. |

## 3. Implementation: The Recovery Blueprint

When stuck in an error loop, provide a **Failure Mode Audit**.

```markdown
### 🛡️ Failure Mode Analysis (Hallucination Shield)
| Detected Error | Failed Hypotheses | Root Cause (Verified) | Recovery Action |
| :--- | :--- | :--- | :--- |
| `vite: not found` | "I need to install vite" | `node_modules` corrupted | `rm -rf node_modules && npm i` |
| `prisma: client` | "Schema is wrong" | `generate` not called | Add to `postinstall` script. |
| `undefined: map` | "Data is missing" | API returning 401 | Fix Auth Headers in service. |
```

## 4. Integrity & Anti-Hallucination Guardrails

> [!CAUTION] **The "Retrying" Trap**: Retrying the same failed code with "more comments" or "slightly different variable names" is a sign of hallucination. You MUST change the underlying logic or the environment state.

**The Preemptor Integrity Checklist:**
1.  **Strict Verification:** After applying a fix, run the verification tool (`compile_applet` / `lint_applet`) immediately.
2.  **No "Ghost" Code:** Never assume an API works because "it should." Verify with a small script or documentation search.
3.  **Traceability:** Every fix must reference a specific line in the stack trace.
4.  **Humble Pivot:** If you are stuck, admit it and suggest a "Discovery Turn" where you only read files instead of writing code.

## 5. Implementation Pattern: The Diagnostic Turn

```bash
# Goal: Break a loop where Prisma is failing to build
# Instead of retrying 'prisma generate', verify the environment

# 1. List files to ensure the schema is where we think it is
ls -R | grep prisma

# 2. Check the logs for the actual database connection error
cat .env.example

# 3. Try a manual generation with maximum verbosity
DEBUG=* npx prisma generate
```

## 6. Global Recovery Invariants

-   **STAY CALM, REDUCE SCOPE:** When an error occurs, reduce the scope of the problem until you find the "Atomic Failure."
-   **CODE IS SECONDARY TO STATE:** Most persistent build errors are caused by "State Drift" (lockfiles, caches, env vars), not logic bugs.
-   **EXPLAIN THE FAILURE:** Never just say "it's fixed." Explain *why* it failed and how the fix prevents it from recurring.

## Common Hallucination Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **The "Should Exist" Bug** | Calling `array.findLast()` in an environment that only supports ES2020. | Verify environment targets; use a polyfill or older method. |
| **The "Silent Fixer"** | LLM says "I fixed it" but the build result is identical. | Check file write permissions; verify the tool actually reached the file. |
| **The "Dependency Lie"** | Trying to install a package that doesn't exist on npm. | Search npmjs.com; check for typos or scoped package prefixes (`@`). |
| **The "Invisible Trace"** | Fixing the "top" error in a list, but the "bottom" error is the cause. | Scroll to the *very first* error message in the console output. |
