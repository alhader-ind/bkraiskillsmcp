---
name: backend-engineer
description: Advanced API orchestration, secure data modeling, and high-integrity server-side systems. Use this skill for building robust, scalable backends and complex server logic.
---

# Advanced Backend Engineering & System Integrity

Backend Engineering is the architecture of systemic truth. To achieve "100x" better reliability, move beyond "writing routes" and into **API Contract Enforcement**, **Atomic Transactional Logic**, and **Zero-Trust Security Architectures**.

## 1. The Expert Backend Protocol

Develop high-integrity server systems through the **C.A.S.E.** (Contract, Atomicity, Secret, Exit) framework:

### Phase A: API Contract & Schema Enforcement (Contract)
Establish the "Vocabulary" of the system before processing logic:
-   **Schema-First Validation:** Use `Zod` or similar to strictly validate `req.body`, `req.query`, and `req.params` at the entry point.
-   **Data Transfer Objects (DTOs):** Define explicit interfaces for data flowing between layers to prevent "In-Place Mutation" bugs.
-   **Strict Response Shapes:** Enforce a consistent JSON structure (e.g., `{ success: true, data: T }`) for all endpoints.

### Phase B: Atomic Business Logic (Atomicity)
Ensure that operations are all-or-nothing and side-effect free:
-   **Transactional Guarding:** Use DB transactions (`BEGIN/COMMIT`) for multi-step updates to prevent orphaned or corrupted records.
-   **Idempotency Logic:** Implement "Retry-Safe" endpoints (e.g., using `Idempotency-Key` headers) to prevent duplicate actions like double-payments.
-   **Service-Repository Separation:** Decouple business rules (Services) from data access logic (Repositories/Models) for 100x better testability.

### Phase C: Zero-Trust Security & Secrets (Secret)
Hardening the system against internal and external threats:
-   **Identity Orchestration:** Enforce `HttpOnly`, `Secure`, `SameSite=Strict` cookies for sessions/JWTs—never trust LocalStorage.
-   **Parameterized Integrity:** Strictly use ORMs or Prepared Statements to prevent SQL Injection; never concatenate strings in queries.
-   **Secret Hygiene:** Use the platform's Secret Manager for API keys and DB URLs; provide a `.env.example` with zero actual secrets.

### Phase D: Operational Observability (Exit)
Ensure the system is maintainable and debuggable:
-   **Tiered Error Handling:** Implement a centralized `ErrorHandler` that masks system details from clients while logging full traces server-side.
-   **Performance Profiling:** Monitor for "N+1" query problems and implement connection pooling to handle high concurrency.
-   **Caching Strategy:** Use Redis or local memory caches for "Read-Heavy" data with clear TTL (Time-To-Live) policies.

## 2. Advanced Backend Framework Matrix

| Technique | Logic Role | Best For... |
| :--- | :--- | :--- |
| **Middleware Gates** | Auth, Validation, Rate-Limiting. | Cross-cutting security and traffic control. |
| **Webhook Orchestration** | Asynchronous Event Handling. | Third-party integrations (Stripe, GitHub) and long-running tasks. |
| **Optimistic Locking** | Concurrency Management. | Preventing "Lost Update" bugs in multi-user write scenarios. |
| **Stream Processing** | Large Data Handling. | Processing multi-GB files or massive DB exports without memory crashes. |

## 3. Implementation: The Backend Architecture Blueprint

When architecting a server feature, provide a **Data Flow & Security Audit**.

```markdown
### 🖥️ Backend System Blueprint
| Layer | Technology | Responsibility |
| :--- | :--- | :--- |
| **Entry Point** | Express / Hono | Route mapping and Middleware execution. |
| **Validation** | Zod | Runtime schema enforcement (Input rejection). |
| **Service Layer** | TypeScript Logic | Business rules and external API calls. |
| **Data Layer** | Prisma / Drizzle | Type-safe persistence and query building. |
| **Security** | bcrypt / Argon2 | Safe cryptographic hashing for sensitive data. |
```

## 4. Stability & Integrity Guardrails

> [!CAUTION] **The "Silent Failure" Trap**: Swallowing errors in a `try/catch` without logging them or notifying the client results in a "Zombie System." Always log every non-nominal exit path.

**The Backend Integrity Checklist:**
1.  **Strict Input Parsing:** Reject any payload that includes unexpected keys (prevent "Mass Assignment" vulnerabilities).
2.  **Environment Parity:** Ensure the server behaves identically in development and production by relying only on environment variables.
3.  **Sanitized Responses:** Never return raw error objects or database stack traces to the client—this leaks architecture details.
4.  **No Plaintext Secrets:** Ensure PII (emails, names) is encrypted or masked in logs and non-critical database fields.

## 5. Implementation Pattern: Service Layer Logic

```ts
// src/services/PaymentService.ts
export const processOrder = async (orderId: string) => {
  return await db.transaction(async (tx) => {
    const order = await tx.orders.findUnique({ where: { id: orderId } });
    if (order.status !== 'pending') throw new Error('Order not processable');
    
    await tx.orders.update({ where: { id: orderId }, data: { status: 'paid' } });
    await tx.inventory.decrement({ where: { productId: order.productId } });
    // All succeed or all fail
  });
};
```

## 6. Global Backend Invariants

-   **FAIL FAST:** Validate input first, check auth second, and execute expensive business logic last.
-   **STATELESSNESS:** Prefer stateless JWTs or sessions stored in a database/Redis to allow for horizontal scaling.
-   **QUERY EFFICIENCY:** Always use `JOIN` or `SELECT` only the necessary fields; never `SELECT *` from large tables.

## Common Backend Anti-patterns and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **God Controllers** | Routing files that contain hundreds of lines of DB logic. | Move DB logic to a Repository or Service file. |
| **N+1 Query Waterfall** | An API call takes seconds to fetch a simple list. | Use "Eager Loading" (Join) to fetch related data in one trip. |
| **Race Conditions** | Two users buy the last item at the same time. | Use `Atomic Increments` or `Transaction Isolations`. |
| **Auth Drift** | A user remains logged in after their session was revoked. | Implement a "Short JWT + Long Refresh" mechanism with server-side revocation. |
