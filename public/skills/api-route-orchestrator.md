---
name: api-route-orchestrator
description: Advanced endpoint engineering and request-response lifecycle management. Use this skill for designing high-performance REST/GraphQL APIs with strict validation and error consistency.
---

# API Route Orchestrator: Endpoint Engineering

API Routes are the gateways to system logic. To achieve "100x" better throughput, move beyond "handlers" and into **Logic Decoupling**, **Schema-First Validation**, and **Uniform Error Topography**.

## 1. The Request Lifecycle Protocol

Engineer consistent endpoints through the **R.O.U.T.E.** (Request, Organize, Unify, Transform, Exit) framework:

### Phase A: Schema-First Request Validation (Request)
Guard the entry point:
-   **Zod/Joi Invariants:** Every request body, param, and query MUST be validated against a strict schema before reaching logic.
-   **Sanitization:** Neutralize XSS and SQL injection payloads at the parsing layer.

### Phase B: Service Logic Decoupling (Organize)
Keep handlers lean:
-   **Controller/Service Split:** Routes handle HTTP concerns; Services handle business logic.
-   **Dependency Injection:** Inject data access layers to keep routes testable in isolation.

### Phase C: Uniform Error Topography (Unify)
Standardize failure:
-   **Global Error Handler:** Transform all exceptions into consistent JSON structures (`{ error: string, code: number }`).
-   **HTTP Semantic Integrity:** Use 422 for validation errors, 403 for forbidden, and 500 only for unhandled crashes.

### Phase D: Response Transformation (Transform)
Clean the output:
-   **DTO Pattern:** Map internal DB models to clean public Data Transfer Objects to avoid leaking sensitive fields.
-   **Serialization Optimization:** Ensure high-frequency endpoints use efficient JSON structures or Buffer streams.
