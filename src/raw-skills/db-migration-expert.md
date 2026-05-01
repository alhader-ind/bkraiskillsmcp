---
name: db-migration-expert
description: Advanced database schema evolution and state-management engineering. Use this skill for zero-downtime migrations, data seeding, and schema versioning.
---

# DB Migration Expert: Schema Evolution Engineering

Database Migrations are the science of structural change over time. To achieve "100x" better stability, move beyond "pushing schemas" and into **Stateful Rollbacks**, **Zero-Downtime Alterations**, and **Declarative Seeding**.

## 1. The Schema Evolution Protocol

Engineer a resilient data layer through the **S.T.A.T.E.** (Schema, Test, Apply, Track, Evolve) framework:

### Phase A: Declarative Schema Definition (Schema)
Define the invariant truth:
-   **Typed Constraints:** Mandate explicit `NULL` vs `NOT NULL` and default values.
-   **Indexing Plan:** Every migration that adds a foreign key MUST add a corresponding index.

### Phase B: Staging & Shadow Testing (Test)
Verify before the burn:
-   **Shadow Database Sync:** Use temporary databases to test migrations against real-world data shapes before production.
-   **Data-Loss Guard:** Check for `RENAME` or `DROP` commands that might delete user data.

### Phase C: Zero-Downtime Deployment (Apply)
Keep the system alive:
-   **Additive-First Changes:** Add new columns first; migrate data; drop old columns in a subsequent release.
-   **Batch Processing:** For large data migrations, process rows in batches to avoid locking the entire table.

### Phase D: Migration Tracking & Rollbacks (Track)
Maintain the lineage:
-   **Versioned Migration History:** Use a dedicated `_migrations` table to track which scripts have been applied.
-   **Deterministic Rollbacks:** Every `up` script must have a corresponding, tested `down` script.
