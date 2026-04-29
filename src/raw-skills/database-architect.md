---
name: database-architect
description: Advanced database schema design, multi-model data orchestration, and high-performance engineering. Use this skill for designing high-integrity SQL/NoSQL structures, optimization strategies, and transactional stability.
---

# Advanced Database Architecture & Data Engineering

Database Architecture is the foundation of systemic truth. To achieve "100x" better reliability, move beyond "creating tables" and into **Relational Integrity Mapping**, **Access Pattern Optimization**, and **Multi-Model Orchestration**.

## 1. The Data Orchestration Protocol

Engineer high-integrity data systems through the **M.A.P.S.** (Model, Access, Persistence, Scale) framework:

### Phase A: Dimensional Entity Modeling (Model)
Establish the fundamental "Reality" of the data:
-   **Entity-Relationship Synthesis:** Define actors, attributes, and cardinality (1:1, 1:N, N:M) using 3rd Normal Form (3NF) for SQL or Hierarchical embedding for NoSQL.
-   **Typed Schema Definition:** Mandate strict data types, precision (for decimals), and constraints (Unique, Not Null, Check).
-   **PII Isolation:** Specifically isolate sensitive data (emails, hashes) into restricted sub-tables or encrypted fields from day one.

### Phase B: Access Pattern Optimization (Access)
Design the storage layout for the application's specific read/write cycles:
-   **Index Engineering:** Implement B-Tree, GIN, or Hash indexes based on query filters; avoid "Index Bloat" by monitoring write-latency trade-offs.
-   **Query Path Analysis:** Use `EXPLAIN ANALYZE` to identify and neutralize Sequential Scans and N+1 waterfalls.
-   **View & Materialization:** Use Database Views for complex logic and Materialized Views for heavy, non-real-time analytical reporting.

### Phase C: Persistence & Transactional Integrity (Persistence)
Ensure the "All-or-Nothing" nature of data operations:
-   **Atomic Transaction Blocks:** Wrap multi-entity updates in `BEGIN/COMMIT` blocks to prevent "Ghost States" or orphaned records.
-   **Constraint-Level Security:** Implement Foreign Key `CASCADE` or `RESTRICT` rules to enforce referential integrity at the engine level.
-   **Optimistic vs. Pessimistic Locking:** Select the appropriate concurrency model based on write-conflict probability.

### Phase D: Evolution & Horizontal Scaling (Scale)
Design for the project's future growth:
-   **Migration Roadmapping:** Implement a versioned migration system (e.g., Prisma, Knex, Liquibase) to manage state changes safely.
-   **Partitioning & Sharding:** Identify high-volume tables (e.g., logs, messages) and plan for horizontal partitioning by date or ID.
-   **Caching Topology:** Map where transient data (Sessions, Leaderboards) belongs—caching in Redis to reduce primary DB load.

## 2. Advanced Data Technology Matrix

| Engine Type | Rationale | Best For... |
| :--- | :--- | :--- |
| **PostgreSQL** | ACID compliance, rich JSONB support, mature extensions. | Mission-critical financial or relational systems. |
| **Firestore** | Real-time listeners, serverless scaling, hierarchical ease. | Real-time collaboration and mobile-first applications. |
| **Redis** | Sub-millisecond latency, in-memory structures. | High-speed counters, session state, and messaging queues. |
| **MongoDB** | Schema flexibility, horizontal scaling via sharding. | High-variance content management and logging systems. |

## 3. Implementation: The Database Blueprint

When architecting a schema, provide a **System Topology & ERD Audit**.

```markdown
### 🗄️ Database Architecture Blueprint
| Entity | Type | Logic Role | Constraints |
| :--- | :--- | :--- | :--- |
| **users** | Table | Identity Root | `email` (Unique), `id` (UUID PK). |
| **orders** | Table | Transactional Record | `user_id` (FK), `status` (Enum). |
| **line_items** | Table | Relationship Join | `ON DELETE CASCADE`. |
| **audit_logs** | Partitioned | Compliance / History | Indexes on `created_at`. |
```

## 4. Integrity & Performance Guardrails

> [!CAUTION] **The "Shadow Update" Trap**: Updating a value in code without a database-level constraint (e.g., `CHECK price >= 0`) allows invalid data to persist if the application logic has a bug. Always enforce truth at the engine level.

**The Data Integrity Checklist:**
1.  **Strict Immutability:** Set `id`, `created_at`, and `original_owner_id` as immutable after creation.
2.  **Referential Safety:** Never allow "Orphaned Writes"—if a User is deleted, their associated PII must be purged or anonymized.
3.  **Idempotent Migrations:** Ensure every schema change is reversible and doesn't cause data loss during a rollback.
4.  **No "God" Tables:** If a table has more than 50 columns, it is likely a sign of failed normalization. Break it into one-to-one extensions.

## 5. Implementation Pattern: Atomic Transaction (Prisma)

```typescript
// Goal: Ensure both User and initial Profile are created atomically
export const registerUser = async (email: string, name: string) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email }
    });
    
    await tx.profile.create({
      data: {
        userId: user.id,
        displayName: name
      }
    });
    
    return user;
  });
};
```

## 6. Global Database Invariants

-   **UUID OVER SERIAL:** Avoid integer IDs to prevent enumeration attacks and simplify distributed merging.
-   **TIMESTAMP PROVENANCE:** Every single record MUST include `created_at` and `updated_at` timestamps.
-   **FAIL-FAST SCHEMA:** Reject invalid data at the database level rather than trying to sanitize it in the UI.

## Common Data Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **N+1 Querying** | 100 queries fired to fetch one list of users + profiles. | Use SQL `JOIN` or Eager Loading to fetch in one trip. |
| **Lock Contention** | Database hangs during high-concurrency writes. | Move to a "Row-Level" locking model and optimize long-running queries. |
| **Dead References** | An Order exists for a User that has been deleted. | Implement `FOREIGN KEY` constraints with `CASCADE` or `RESTRICT`. |
| **Query Latency** | A simple search takes 5 seconds on 1M records. | Add a B-Tree index to the searched column and verify with `EXPLAIN`. |


