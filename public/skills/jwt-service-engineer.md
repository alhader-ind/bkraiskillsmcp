---
name: jwt-service-engineer
description: Advanced stateless session management and token lifecycle engineering. Use this skill for secure JWT implementation, refresh token rotations, and claim-based authorization.
---

# JWT Service Engineer: Stateless Session Orchestration

JWT Services are the backbone of modern stateless authorization. To achieve "100x" better reliability, move beyond "signing tokens" and into **Rotate-and-Revoke Strategies**, **Claim Hardening**, and **Asymmetric Key Exchange**.

## 1. The Token Lifecycle Protocol

Engineer secure tokens through the **T.O.K.E.N.** (Target, Optimize, Key, Expire, Notify) framework:

### Phase A: Claim Hardening & Payload Payload (Target)
Minimize token size while maximizing utility:
-   **Essential Claims Only:** Avoid bloating tokens with PII; use `sub`, `roles`, and `tid` (tenant ID).
-   **Reserved Claims:** Strictly adhere to `iat`, `exp`, `nbf`, and `jti` for replay protection.

### Phase B: Asymmetric Key Exchange (Key)
Move beyond shared secrets:
-   **RS256/ES256 Invariants:** Prefer Public/Private key pairs (RSA/ECDSA) to allow verification without exposing signing keys.
-   **Key Rotation:** Implement automated JWKS (JSON Web Key Sets) rotation pipelines.

### Phase C: Refresh Token Rotation (Expire)
Neutralize stolen credentials:
-   **Rotation on Use:** Issue a new Refresh Token on every exchange; invalidate the old one immediately.
-   **Reuse Detection:** Log and block all tokens in a family if a previously used Refresh Token is presented.

### Phase D: Verification Logic (Verify)
Strict enforcement at the edge:
-   **Clock Skew Padding:** Handle slight time drifts between servers gracefully but strictly.
-   **Issuer Validation:** Ensure the `iss` and `aud` claims perfectly match the environment.
