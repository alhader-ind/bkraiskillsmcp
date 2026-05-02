---
name: dependency-integrity-officer
description: Advanced package management, dependency resolution, and version collision mitigation. Use this skill for fixing npm/yarn errors, peer dependency conflicts, and environment-specific installation failures.
---

# Dependency Integrity Officer: Advanced Package Orchestration

Dependency management is the physical foundation of software execution. To achieve "100x" better stability, move beyond "npm install" and into **Lockfile Verification**, **Peer-Dependency Resolution**, and **Native Binary Compatibility**.

## 1. The Installation Integrity Protocol

Engineer a buildable environment through the **V.I.S.A.** (Verify, Isolate, Solve, Audit) framework:

### Phase A: Manifest Verification & Environment Scoping (Verify)
Analyze the requirements before touching the filesystem:
-   **Engine Constraints:** Verify `node`, `npm`, or `pnpm` versions in `package.json` vs. the actual host environment.
-   **Manifest Consistency:** Identify mismatches between `package.json` and lockfiles (`package-lock.json`, `pnpm-lock.yaml`).
-   **Native Dependency Scoping:** Identify packages that require C++ compilation or platform-specific binaries (e.g., `bcrypt`, `sharp`).

### Phase B: Dependency Isolation & Cache Management (Isolate)
Neutralize local corruption:
-   **Global Cache Purging:** Use `npm cache clean --force` or specific tool cleaners to remove poisoned artifacts.
-   **Node Modules Reset:** Perform a "Deep Clean" (e.g., `rm -rf node_modules`) to ensure no ghost dependencies persist.
-   **Registry Awareness:** Explicitly define the registry (npm, GitHub, private) to avoid 404 or 403 authorization failures.

### Phase C: Recursive Conflict Resolution (Solve)
Resolve the logic of version collisions:
-   **Peer-Dependency Flattening:** Use `--legacy-peer-deps` as a temporary bridge, but prioritize manual reconciliation of version ranges.
-   **Yarn/PNPM Overrides:** Utilize the `resolutions` or `pnpm.overrides` field to force-pin vulnerable or conflicting sub-dependencies.
-   **Dependency Deduping:** Use `npm dedupe` to flatten the tree and reduce bundle size/memory overhead.

### Phase D: Automated Security & Integrity Audit (Audit)
Verify the safety and health of the tree:
-   **Vulnerability Scanning:** Run `npm audit` and perform manual assessment of "Breaking" fixes.
-   **License Compliance:** Verify that all dependencies follow the project's legal requirements.
-   **Build Verification:** Immediately run a production build (`npm run build`) to ensure that tree-shaking and minification are not broken by the new additions.

## 2. Package Manager Logic Matrix

| Feature | NPM | PNPM / Yarn | Rationale |
| :--- | :--- | :--- | :--- |
| **Lockfile** | `package-lock.json` | `pnpm-lock.yaml` | Deterministic builds. |
| **Storage** | `node_modules` | Content-Addressable Store | Disk space efficiency. |
| **Resolution** | Flatish Tree | Symlinked / Isolated | Prevents "Phantom Dependencies." |
| **Speed** | Standard | High (Parallel) | Critical for CI/CD optimization. |

## 3. Implementation: The Integrity Blueprint

When heart-fixing a dependency issue, provide a **Resolution Strategy Audit**.

```markdown
### 🛡️ Dependency Resolution Blueprint
| Package | Status | Conflict Issue | Resolution Strategy |
| :--- | :--- | :--- | :--- |
| **@types/react** | ❌ Conflict | Peer mismatch with React 19. | Upgrade to latest, pin to 18.x. |
| **framer-motion** | ✅ Resolved | Tree-shaking error in ESM. | Enable `legacy-peer-deps` flag. |
| **prisma** | ❌ Drift | Binary not found in Docker. | Add `prisma generate` to postinstall. |
| **lodash** | ✅ Stable | Redundant versions. | Run `npm dedupe` to unify on v4. |
```

## 4. Stability & Security Guardrails

> [!CAUTION] **The "Force" Trap**: Blindly using `npm install --force` can lead to unpredictable runtime crashes where different modules expect different versions of the same singleton. Always prefer explicit overrides.

**The Integrity Checklist:**
1.  **Lockfile Invariant:** Never commit code that doesn't include a corresponding lockfile update.
2.  **Dev-Dependency Strictness:** Ensure build tools (Vite, TypeScript, Tailwind) are in `devDependencies` to keep production images lean.
3.  **No Wildcard Versions:** Use `~` or `^` carefully; for mission-critical apps, consider pinning exact versions to prevent upstream breakages.
4.  **Verification Pass:** Always verify that the app actually boots after a dependency change.

## 5. Implementation Pattern: Resolving Peer Conflicts

```bash
# Problem: react-router-dom expects React 18, but you have React 19.
# Strategy: Deduce if the crash is semantic or just a manifest warning.

# 1. Attempt soft-reconciliation
npm install react-router-dom --legacy-peer-deps

# 2. Use Overrides in package.json for long-term fix
{
  "overrides": {
    "react-router-dom": {
      "react": "$react"
    }
  }
}
```

## 6. Global Integrity Invariants

-   **ONE SOURCE OF TRUTH:** Never mix `npm`, `yarn`, and `pnpm` in the same repository. Pick one and delete the other lockfiles.
-   **IDEMPOTENT BUILDS:** A fresh `npm ci` must result in the exact same application state every time.
-   **FAIL FAST:** If a dependency fails to install, stop the pipeline; do not attempt to "skip" errors.

## Common Dependency Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Module Not Found** | Code runs but cannot find package `X`. | Check `package.json` for typo; check if it's in `devDependencies` but needed in prod. |
| **Ghost Deps** | Importing `Y` works even though it's not in `package.json`. | Switch to `pnpm` or `yarn berry` to enforce strict dependency isolation. |
| **Binary Mismatch** | "Unsupported platform for package Z." | Delete `node_modules` and lockfile; reinstall on the target OS (or build inside Docker). |
| **Type Collision** | "Duplicate identifier" errors in TypeScript. | Check for multiple versions of `@types/node` or similar core typings. |
