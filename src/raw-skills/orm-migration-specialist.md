---
name: orm-migration-specialist
description: Advanced database schema evolution, ORM orchestration (Prisma, Drizzle, TypeORM), and high-fidelity migration engineering. Use this skill for designing robust schemas, resolving migration drifts, and managing complex database state.
---

# ORM & Migration Specialist: Advanced Schema Engineering

ORM Engineering is the bridge between application logic and persistent truth. To achieve "100x" better reliability, move beyond "db push" and into **Strict Schema Invariants**, **Declarative Drift Resolution**, and **Stateful Migration Pipelines**.

## 1. The Schema Evolution Protocol

Engineer a resilient data layer through the **S.C.A.N.** (Schema, Check, Apply, Normalize) framework:

### Phase A: Schema Definition & Invariant Logic (Schema)
Construct the blueprint of the data world:
-   **Relationship Synthesis:** Define 1:1, 1:N, and N:M connections with clear cascading rules (`onDelete: Cascade`).
-   **Index Engineering:** Explicitly define unique constraints and B-Tree/GIN indexes for performance-critical fields.
-   **Typed Precision:** Mandate appropriate types (e.g., `Decimal` for money, `String` vs `Text` for length limits).

### Phase B: Drift Detection & Conflict Analysis (Check)
Analyze the delta between the code and the database:
-   **Manual Migration Ghosting:** Identify "Shadow Changes" applied directly to the DB without code-level reflection.
-   **Format Validation:** Ensure the migration files are syntactically correct for the target engine (Postgres, MySQL, SQLite).
-   **Lockfile Sync:** In Prisma, ensure `schema.prisma` is in sync with the generated client.

### Phase C: Stateful Migration Execution (Apply)
Apply changes with zero-data-loss guarantees:
-   **Atomic Transactions:** Ensure migrations are wrapped in a single transaction that rolls back on failure (where the DB supports it).
-   **Seed Orchestration:** Automate the population of lookup tables and required system data after migration.
-   **Client Regeneration:** Trigger the generation of type-safe clients (e.g., `prisma generate`) immediately following the schema update.

### Phase D: Normalization & Performance Hardening (Normalize)
Refine the schema for production scale:
-   **View & Trigger Mapping:** Implement complex logic at the DB level for performance-intensive aggregations.
-   **Soft-Delete Invariants:** Standardize the use of `deletedAt` for transactional integrity.
-   **Audit Logging:** Implement automatic triggers for tracking row-level modifications.

## 2. ORM Ecosystem Matrix

| Feature | Prisma | Drizzle | TypeORM/Sequelize |
| :--- | :--- | :--- | :--- |
| **Logic Type** | Declarative (Schema file) | Code-First (TS) | Decorator / Class based |
| **Type Safety** | High (Generated) | Extreme (Inferred) | Medium (Manual) |
| **Migrations** | Opinionated (Files) | Explicit (SQL) | Mixed / Manual |
| **Performance** | High (Rust Engine) | Optimal (SQL-like) | Varies by pattern |

## 3. Implementation: The Migration Blueprint

When evolving a database, provide a **Schema Evolution Audit**.

```markdown
### 📂 Schema Evolution Blueprint
| Entity | Logic Change | Migration Type | Integrity Guard |
| :--- | :--- | :--- | :--- |
| **User** | Add `email_verified` | Alter Table (Nullable) | Default to `false`. |
| **Order** | Add `Product` ref | Create N:M Table | Cascading Delete. |
| **Post** | Index `slug` | Create Unique Index | Verify no dupes first. |
| **Audit** | Initial Setup | Base Schema | Auto-id + Timestamps. |
```

## 4. Integrity & Migration Guardrails

> [!CAUTION] **The "Production Drift" Trap**: Never use commands like `prisma db push` on a production database. It can lead to unintended table drops if the schema has "extra" tables not in your code. Always use versioned migrations.

**The Migration Integrity Checklist:**
1.  **Backfill Necessity:** If adding a `NOT NULL` column to an existing table, you MUST provide a default or a migration script to populate existing rows.
2.  **Naming Consistency:** Use `snake_case` or `camelCase` consistently; don't mix them across tables and columns.
3.  **Type Hardening:** Never use `JSON` for data that requires relational integrity or strict filtering.
4.  **Client Freshness:** Ensure `node_modules` is updated and the ORM client is regenerated before restarting the app after a migration.

## 5. Implementation Pattern: Prisma Migration Flow

```bash
# 1. Modify schema.prisma
# 2. Run migration generator (creates SQL file)
npx prisma migrate dev --name add_user_roles

# 3. Verify the generated SQL
# (Check for dropped tables or columns!)

# 4. Generate the Type-Safe client
npx prisma generate
```

## 6. Global Schema Invariants

-   **MIGRATIONS ARE IMMUTABLE:** Once a migration file is committed, never edit it. Create a new migration to reverse or fix it.
-   **NO UNTYPED WRITE:** Every database interaction must pass through the ORM's types to prevent SQL injection and logic errors.
-   **SEED DATA IS CODE:** Treat system-required data (e.g., default categories) as code and manage it via versioned seed scripts.

## Common Migration Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Migration Drift** | "Database and schema are out of sync." | Run `prisma migrate resolve` or reset the shadow database. |
| **Data Truncation** | "Data will be lost in table X." | Add a default value to the new column or use a multi-step migration. |
| **Relation Failure** | "Foreign key constraint violation." | Check the order of table creation; ensure parent rows exist before children. |
| **Client Stale** | "Property X does not exist on type Y." | Run `npx prisma generate` to sync the TS types with the new schema. |
