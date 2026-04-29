---
name: git-master
description: Advanced version control engineering, disaster recovery, and high-fidelity repository management. Use this skill for solving complex merge conflicts, rebasing, and repository restoration.
---

# Advanced Git Engineering & Repository Integrity

Git Mastery is the art of maintaining a pristine source of truth. To achieve "100x" better reliability, move beyond "push and pull" and into **Atomic Commits**, **Non-Destructive Rebasing**, and **Recursive Restoration**.

## 1. The Expert Version Control Protocol

Engineer a resilient repository through the **G.I.R.C.** (Guard, Isolate, Resolve, Commit) framework:

### Phase A: Guardrails & Destructive Awareness (Guard)
Establish a safety net before manipulating history:
-   **The `--dry-run` Ritual:** Always simulate destructive actions (e.g., `git clean -n`, `git commit --dry-run`) to verify intent before execution.
-   **Backup Branching:** Create "Rescue Points" (`git branch backup/pre-rebase`) before performing complex history rewrites.
-   **Reflog Mastery:** Use `git reflog` to track every movement of `HEAD`, ensuring that "deleted" commits can be recovered via their SHA.

### Phase B: State Isolation & Context Switching (Isolate)
Manage multiple logical streams without cross-contamination:
-   **Stash Architecture:** Use `git stash push -m "Context"` to clear the deck for urgent fixes without losing uncommitted progress.
-   **Worktree Orchestration:** Use `git worktree add` to check out multiple branches in parallel directories for multi-tasking without switching.
-   **Sparse Checkout:** Optimize for massive repositories by only materializing files relevant to the current feature domain.

### Phase C: Conflict Resolution & Merge Logic (Resolve)
Navigate architectural collisions with clinical precision:
-   **Linear Rebase Strategy:** Use `git rebase -i` to maintain a clean, readable project history while resolving conflicts iteratively.
-   **Three-Way Merge Analysis:** Interpret `HEAD` (Ours) vs. `REMOTE` (Theirs) markers by referencing the common `BASE` to resolve logical contradictions.
-   **Cherry-Pick Porting:** Move surgical fixes from `main` to `release` branches without merging unnecessary feature bloat.

### Phase D: Commit Integrity & History Scrubbing (Commit)
Deliver a professional, readable, and "Bisect-ready" project history:
-   **Atomic Commits:** Every commit MUST contain a single logical change. If it says "Fixed bug and updated CSS," it should be two commits.
-   **Interactive Squashing:** Use `fixup` and `squash` during rebases to hide "WIP" noise before the final Pull Request.
-   **Protected Pushing:** Never use `--force` on shared branches. Always use `--force-with-lease` to ensure you don't overwrite a teammate's invisible work.

## 2. Advanced Git Framework Matrix

| Command Pattern | Logic Role | Best For... |
| :--- | :--- | :--- |
| **Interactive Rebase** | History Curation. | Cleaning up "WIP" commits before a team review. |
| **Bisect (Binary Search)** | Regression Hunting. | Finding exactly which commit introduced a bug in a large history. |
| **Submodule / Subtree** | Dependency Mapping. | Managing shared libraries inside a parent repository. |
| **Filter-Branch / BFG** | Sensitive Data Removal. | Stripping accidentally committed API keys or large binaries from history. |

## 3. Implementation: The Repository Blueprint

When planning a complex Git operation, provide a **Strategy Audit**.

```markdown
### 🛠️ Git Strategy Blueprint
| Operation | Goal | Command Sequence | Safety Guard |
| :--- | :--- | :--- | :--- |
| **Linearize History** | Clean Main Branch | `git checkout feat`, `git rebase main` | `git branch backup/pre-rebase` |
| **Conflict Fix** | Resolve Logic Clash | `git merge-tool`, `git add .`, `git commit` | Check `BASE` version. |
| **Undo Reset** | Recover Lost Data | `git reflog`, `git reset --hard <sha>` | Verify SHA in `reflog`. |
| **History Scrub** | Remove Secret | `git filter-branch --index-filter ...` | `.env` added to `.gitignore`. |
```

## 4. Stability & Integrity Guardrails

> [!CAUTION] **The "Force" Trap**: Pushing with `--force` on a shared branch is a destructive operation that can permanently delete a colleague's work. Always verify the state of the remote before forcing.

**The Git Mastery Checklist:**
1.  **Strict Commit Hygiene:** Use imperative mood ("Fix bug" not "Fixed bug"). Keep the first line under 50 characters.
2.  **No "God" Commits:** If a commit touches 20 files across 5 features, it is a failure of isolation.
3.  **Environment Isolation:** Ensure `.env` and `node_modules` are in `.gitignore` from the very first commit.
4.  **Verification Pass:** Always run localized tests (`lint`, `build`) before pushing to ensure "Green" status.

## 5. Implementation Pattern: Interactive Rebase

```bash
# Goal: Cleanup the last 5 commits before PR
git rebase -i HEAD~5

# Inside the editor:
# p <sha1> Add logic core
# f <sha2> fixup: fix typo
# f <sha3> fixup: add missing types
# s <sha4> update styles
# r <sha5> finalize implementation

# Result: 2 clean, building commits instead of 5 noisy ones.
```

## 6. Global Git Invariants

-   **COMMIT EARLY, PUSH LATER:** Commit locally to save progress, but only push once the logic is verified and the history is cleaned.
-   **THE MAIN IS SACRED:** Never commit directly to `main` (or `master`). All changes must pass through a Feature Branch and Code Review.
-   **PULL BEFORE PUSH:** Synchronize with the remote often to minimize the complexity of eventual merges.

## Common Git Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Detached HEAD** | "You are in 'detached HEAD' state." | Create a new branch `git checkout -b temp-fix` to save the state. |
| **Merge Hell** | 50+ files in conflict after a long rebase. | `git rebase --abort` and rebase in smaller chunks of commits. |
| **Corrupt Index** | "error: bad signature" or "index file corrupt." | `rm .git/index` and `git reset` to rebuild the index from the tree. |
| **Accidental Reset** | "I deleted my work with `reset --hard`." | Use `git reflog` to find the SHA from before the reset and checkout that SHA. |
