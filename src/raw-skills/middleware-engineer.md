---
name: middleware-engineer
description: Advanced request interception and cross-cutting concern orchestration. Use this skill for building security guards, logging pipelines, and multi-tenant routing logic.
---

# Middleware Engineer: Interception & Guard Orchestration

Middleware is the "Invisible Layer" of application architecture. To achieve "100x" better modularity, move beyond "logging" and into **Circuit Breaking**, **Multi-Tenant Context Injection**, and **Defensive Routing**.

## 1. The Interception Protocol

Engineer robust pipelines through the **G.U.A.R.D.** (Gate, Understand, Analyze, Route, Deliver) framework:

### Phase A: Pre-Flight Gatekeeping (Gate)
Analyze the request before it reaches logic:
-   **Security Headers:** Inject `CORS`, `CSP`, and `HSTS` headers systematically.
-   **Auth Verification:** Intercept tokens and verify signatures before the controller loads.

### Phase B: Context Injection (Understand)
Hydrate the request:
-   **Current User Mapping:** Attach the `user` object to the request context for downstream access.
-   **Correlation IDs:** Inject unique IDs to every request for distributed tracing across logs.

### Phase C: Defensive Analysis (Analyze)
Protect resources:
-   **Rate Limit Interception:** Block excessive requests at the middleware layer to protect DB resources.
-   **Payload Inspection:** Reject bodies that exceed expected size limits.

### Phase D: Dynamic Routing & Transformation (Route)
Orchestrate the path:
-   **Tenant Resolution:** Identify the sub-domain or header to set the appropriate DB connection string.
-   **Response Wrapping:** Intercept the outgoing response to ensure uniform JSON formatting.
