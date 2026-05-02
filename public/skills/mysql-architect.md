---
name: mysql-architect
description: Advanced MySQL schema engineering, query optimization, and high-performance data orchestration. Use this skill for designing scalable, ACID-compliant relational systems, complex SQL tuning, and transactional stability.
---

# MySQL Architect: Advanced Engineering & Relational Orchestration

MySQL Architect is the science of data systemic stability and throughput. To achieve "100x" better reliability, move beyond "simple tables" and into **Strict Normalization**, **Query Execution Plan Optimization**, and **High-Availability Data Topologies**.

## 1. The Relational Orchestration Protocol

Engineer high-performance MySQL systems through the **S.Q.L.E.** (Schema, Query, Logic, Execute) framework:

### Phase A: Schema Normalization & Constraint Design (Schema)
Establish the fundamental "Source of Truth":
-   **Relational Synthesis:** Apply 3rd Normal Form (3NF) to eliminate redundancy; use Junction Tables for N:M relationships.
-   **Strict Data Typing:** Select optimal types (e.g., `INT` over `BIGINT` if range allows, `DECIMAL` for currency, `DATETIME` vs `TIMESTAMP`).
-   **Integrity Guarding:** Enforce `FOREIGN KEY` constraints with explicit `ON DELETE CASCADE` or `RESTRICT` rules to prevent orphaned data.

### Phase B: Query Execution & Indexing Strategy (Query)
Design the storage layout for the application's specific read/write cycles:
-   **Index Engineering:** Implement B-Tree indexes for filtering and sorting; use Composite Indexes for multi-column `WHERE` clauses (respecting left-to-right prefixing).
-   **Explain Plan Analysis:** Use `EXPLAIN ANALYZE` to identify and neutralize Full Table Scans and Temporary Table explosions.
-   **Predicate Optimization:** Avoid leading wildcards (`%pattern`) and non-SARGable expressions that disable index usage.

### Phase C: Transactional Logic & Locking (Logic)
Ensure the "All-or-Nothing" nature of data operations:
-   **ACID Compliance:** Wrap multi-entity updates in `START TRANSACTION`/`COMMIT` blocks to ensure atomicity.
-   **Isolation Level Tuning:** Select appropriate levels (e.g., `READ COMMITTED` vs `REPEATABLE READ`) to balance performance and consistency.
-   **Locking Awareness:** Minimize "Long-Running Transactions" to prevent `Row-Level Lock` contention and Deadlocks.

### Phase D: Execution Hardening & Scaling (Execute)
Optimize the database for growth and stability:
-   **Storage Engine Selection:** Utilize `InnoDB` for transactional support and crash recovery; optimize `innodb_buffer_pool_size` for memory efficiency.
-   **Partitioning Patterns:** Implement Horizontal Partitioning (by Range, List, or Hash) for large-scale logging or time-series data.
-   **Connection Management:** Configure thread pools and connection limits to handle high-concurrency spikes without resource exhaustion.

## 2. MySQL Performance & Logic Matrix

| Feature | Best For... | Performance Logic |
| :--- | :--- | :--- |
| **B-Tree Index** | Cardinality-rich columns (ID, Email). | O(log n) lookup; supports range scans. |
| **Composite Index** | Multi-column filters (Status + Date). | Highly efficient if column order matches the query. |
| **Full-Text Index** | Natural language searches. | Specialized engine for keyword matching. |
| **Foreign Keys** | Referential Integrity. | Enforces truth but adds write-time overhead. |

## 3. Implementation: The MySQL Blueprint

When architecting a schema, provide a **System Topology & ERD Audit**.

```markdown
### 🗄️ MySQL Architecture Blueprint
| Entity | Type | Logic Role | Performance Metric |
| :--- | :--- | :--- | :--- |
| **users** | Table | Identity Root | Primary Key index on `id` (UUID). |
| **orders** | Table | High-Freq Write | Index on `user_id` + `status`. |
| **audit_logs** | Partitioned | Compliance | Range-partitioned by `created_at`. |
| **sessions** | Memory/Redis | Transient Data | Off-loaded to reduce Disk IO. |
```

## 4. Integrity & Performance Guardrails

> [!CAUTION] **The "SELECT *" Trap**: Retrieving all columns in high-traffic queries wastes memory and network bandwidth. Always specify the exact columns required to enable "Covering Index" optimizations.

**The MySQL Integrity Checklist:**
1.  **UTF8MB4 Encoding:** Always use `utf8mb4_unicode_ci` to support full emoji sets and international character sets safely.
2.  **Standardized PKs:** Use `BIGINT UNSIGNED AUTO_INCREMENT` or `BINARY(16)` for UUIDs to maintain indexing efficiency.
3.  **No Nulls in Indexes:** Favor `NOT NULL` with default values for indexed columns to improve the engine's ability to exclude records correctly.
4.  **Audit Awareness:** Every table MUST include `created_at` and `updated_at` (using `DEFAULT CURRENT_TIMESTAMP` and `ON UPDATE CURRENT_TIMESTAMP`).

## 5. Implementation Pattern: Optimized Join & Indexing

```sql
/**
 * Goal: Efficiently retrieve active orders for a user with product details.
 * Optimized with a Composite Index on orders(user_id, status)
 */
SELECT 
    o.order_id, 
    o.total_amount, 
    p.name AS product_name
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.user_id = 123 
  AND o.status = 'COMPLETED'
ORDER BY o.created_at DESC
LIMIT 10;
```

## 6. Global MySQL Invariants

-   **INNODB BY DEFAULT:** Never use MyISAM for modern applications; transactional safety is non-negotiable.
-   **IDEMPOTENT MIGRATIONS:** Schema changes must be scriptable, versioned, and reversible without manual state repair.
-   **EXPLAIN EVERYTHING:** If a query feels slow, the first step is always to audit the execution plan with `EXPLAIN`.

## Common MySQL Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Full Table Scan** | Query time increases linearly with data size. | Identify the missing index via `EXPLAIN` and add it. |
| **Deadlocks** | Concurrent transactions cancel each other. | Re-order updates to follow a consistent sequence of table access. |
| **Connection Spike** | "Too many connections" error. | Implement connection pooling and optimize long-running queries. |
| **Buffer Pool Misconfig** | High high Disk IO on reads. | Increase `innodb_buffer_pool_size` to 50-75% of available RAM. |
