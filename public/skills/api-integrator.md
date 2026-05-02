---
name: api-integrator
description: Advanced third-party ecosystem integration, secure webhook orchestration, and multi-provider OAuth implementation. Use this skill for building production-grade external service connections.
---

# API Integration & External Ecosystems

API Integration is the bridge between isolated codebases and the global technical ecosystem. To achieve "100x" better connectivity, move beyond "simple fetch calls" and into **Stateful OAuth Orchestration**, **Idempotent Webhook Processing**, and **Exponential Backoff Resilience**.

## 1. The Secure Integration Protocol

A professional API connection follows the **H.T.V.** framework (Handshake, Transaction, Verification):

### Phase A: Secure Handshake (Auth & Secrets)
Establish the identity and permissions layer:
-   **Credential Isolation:** Ensure all keys are stored in `process.env` and mirrored in `.env.example`.
-   **Auth Strategy Selection:** Implement the correct flow (OAuth2 PKCE for SPAs, Client Credentials for Servers, API Keys with HMAC for Webhooks).
-   **Scope Trimming:** Only request the specific permissions needed for the integration.

### Phase B: Transactional Robustness (The "Safe-Request" Loop)
Execute the data exchange with a "Failure-First" mindset:
-   **Type-Strict Payloads:** Validate request bodies with Zod or TypeScript interfaces before sending.
-   **Timeout Management:** Set explicit timeouts to prevent "Zombie Requests" from blocking the event loop.
-   **Status-Code Intelligence:** Implement specific handlers for 400 (Bad Request), 401 (Auth Fail), 429 (Rate Limit), and 500 (Server Error).

### Phase C: Integrity Verification
Confirm that the data landed correctly:
-   **Webhook Signature Validation:** Always verify the `X-Secret-Signature` or HMAC hash of incoming webhooks to prevent spoofing.
-   **Data Normalization:** Map the third-party response to your local Data Transfer Objects (DTOs) immediately upon arrival.

## 2. Advanced Auth & Integration Patterns

| Pattern | Best For... | Implementation Detail |
| :--- | :--- | :--- |
| **OAuth2 + Refresh Tokens** | Long-term user connectivity (Fitbit, Google). | Store refresh tokens securely; implement auto-rotating token logic. |
| **Idempotent Retries** | Payment processing (Stripe). | Header-based `Idempotency-Key` to prevent double-charging on network failure. |
| **Webhook Proxy** | Local development (Stripe CLI/Ngrok). | Forward external events to a local endpoint during the dev cycle. |
| **Batch Pooling** | High-volume data sync. | Aggregate multiple record updates into a single periodic API call. |

## 3. Implementation: The API Integration Blueprint

When connecting to a service (e.g., Stripe, SendGrid), structure the integration into a **Unified Service Wrapper**.

```ts
// src/services/stripeService.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export const createCheckoutSession = async (priceId: string) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
    });
    return { data: session, error: null };
  } catch (err) {
    console.error("Stripe Error:", err);
    return { data: null, error: err.message };
  }
};
```

## 4. Resilience & Rate-Limit Guardrails

> [!CAUTION] **The "Rate-Limit Cascade"**: If an API returns a 429, don't just retry immediately. This will lead to a IP-level ban. Implement **Exponential Backoff**.

**The Integration Integrity Checklist:**
1.  **Strict JSON Parsing:** Always wrap `JSON.parse` in a try/catch block.
2.  **SDK vs. Fetch:** Prioritize official SDKs (e.g., `@google/genai`, `stripe`) over raw `fetch` for better types and stability.
3.  **Audit Logs:** Log the IDs of external transactions to assist with production debugging.
4.  **Payload Cleaning:** Strip PII and sensitive internal IDs before sending data to external logs or third-party monitoring.

## 5. Client vs. Server Integration Guide

-   **Client-Side (SPA):** Use ONLY for public discovery APIs (e.g., searching Spotify tracks). Never use secrets here.
-   **Server-Side:** MUST be used for any operation involving money, private user data, or API keys.
-   **Hybrid (Next.js/Remix):** Use Server Actions or API Routes to proxy requests from the frontend to the secure backend.

## 6. Global Integration Invariants

-   **ENVIRONMENT-DRIVEN:** Use `VITE_` prefix for client-accessible variables and raw `process.env` for server-only secrets.
-   **VERBOSE LOGGING (Dev Only):** Print full request/response objects during development, but strip them in production.
-   **FAIL-FAST:** If a 401 (Unauthorized) occurs, trigger a global re-auth flow rather than letting the app spin.

## Common API Pitfalls and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **The "Silent" 500** | The API fails but your app continues with `undefined` data. | Implement strict null-checks on every API response field. |
| **CORS Errors** | Browser blocks your request from the UI. | Move the external call to a backend API Route (Server-to-Server skip CORS). |
| **Auth Expiry** | User is logged in but their "Google Photo" feed breaks after 1 hour. | Implement Refresh Token rotation in the backend. |
| **SDK Drift** | Your local types don't match the API's latest version. | Update the SDK and verify major version breaking changes. |
