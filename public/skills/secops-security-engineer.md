---
name: secops-security-engineer
description: Advanced zero-trust architecture, cryptographic integrity, and adversarial threat mitigation. Use this skill for building mission-critical, secure-by-default applications.
---

# SecOps Engineering & Zero-Trust Architecture

Security is not a layer; it is the fundamental fabric of systemic integrity. To achieve "100x" better security, move beyond "simple passwords" and into **Identity Orchestration**, **Cryptographic Hardening**, and **Adversarial Mitigation**.

## 1. The Zero-Trust Security Protocol

A professional security architecture follows the **A.V.E.** framework (Authenticate, Validate, Encrypt):

### Phase A: Identity & Access Orchestration (Authenticate)
Establish "Who" is acting and with what authority:
-   **Multi-Factor Baseline:** Mandate MFA concepts where applicable.
-   **Stateful JWT Hardening:** Use short-lived Access Tokens and long-lived Refresh Tokens stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
-   **RBAC (Role-Based Access Control):** Implement granular permission gates for every API endpoint.

### Phase B: Perimeter & Data Sanitization (Validate)
Trust no incoming data:
-   **Strict Schema Validation:** Use Zod or similar to enforce data types, lengths, and regex patterns at the entry point.
-   **XSS & CSRF Prevention:** Sanitize all user-generated content and implement anti-CSRF tokens for non-GET requests.
-   **Rate Limiting:** Protect against Brute-Force and Denial-of-Wallet attacks by limiting requests per IP/User.

### Phase C: Cryptographic Integrity (Encrypt)
Protect data both at rest and in transit:
-   **Modern Hashing:** Use Bcrypt (cost >= 12) or Argon2 for passwords; never use MD5/SHA-1.
-   **Transport Layer:** Enforce HTTPS-Only and set strict HSTS headers.
-   **Sensitive Data Masking:** Anonymize PII in logs and database previews.

## 2. Advanced Threat Mitigation Frameworks

| Threat | Defense Pattern | Implementation Detail |
| :--- | :--- | :--- |
| **SQL Injection** | Parameterized Queries | Use an ORM or prepared statements; never concatenate strings in SQL. |
| **JWT Spoofing** | Secret Rotation | Use RS256 (Asymmetric) signatures and rotate private keys periodically. |
| **XSS (Cross-Site)** | CSP (Content Security Policy) | Set headers that restrict script sources to trusted domains only. |
| **Clickjacking** | X-Frame-Options | Block the site from being rendered in unauthorized iframes. |

## 3. Implementation: The Security Audit Blueprint

Every security update must include an **Adversarial Simulation Delta**.

```markdown
### 🛡️ Security Audit & Mitigation
| Feature | Potential Exploit | Mitigation Applied | Result |
| :--- | :--- | :--- | :--- |
| Auth Flow | JWT theft via XSS | Switched LocalStorage to HttpOnly Cookies. | Data is inaccessible to JS. |
| Form Input | SQL Injection | Implemented Zod schema + Prepared Statements. | Payloads are sanitized. |
| API Access | Brute-force login | Added 5-try Rate Limiting + Exponential Backoff. | Entropy attack neutralized. |
```

## 4. Input & Secret Management Guardrails

> [!CAUTION] **The "Secret Leak" Trap**: Committing a `.env` file or hardcoding a Token in a client component is a total system failure. Use the platform's secret manager.

**The SecOps Integrity Checklist:**
1.  **Sanitization Reflex:** Never trust `innerHTML`; use `textContent` or use a sanitization library for Markdown.
2.  **Principle of Least Privilege:** Grant users/services only the minimum permissions required for their task.
3.  **No Plaintext Secrets:** Ensure no passwords, keys, or PII ever touch the system console or error logs.
4.  **Error Masking:** Return generic error messages ("Login Failed") to the client while logging specific errors server-side.

## 5. Implementation Pattern: Secure JWT

```ts
// server/auth.ts
res.cookie('token', jwt, {
  httpOnly: true, // Prevents JS access (Anti-XSS)
  secure: true,   // Mandates HTTPS
  sameSite: 'strict', // Prevents CSRF
  maxAge: 3600000 // 1 Hour
});
```

## 6. Global Security Invariants

-   **DEFENSE IN DEPTH:** Never rely on a single security measure. Use both client-side sanitization and server-side validation.
-   **AUDIT EVERYTHING:** Maintain logs of critical actions (login, payment, settings change) to establish a forensic trail.
-   **FAIL SECURELY:** If an auth check throws an error, default to `DENY` rather than `ALLOW`.

## Common Security Pitfalls and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Auth Drift** | User can still access the dashboard after logging out. | Clear cookies and blacklist the JWT server-side. |
| **Sensitive Payload** | User email is visible in the URL bar. | Move sensitive identifiers to the POST body or encrypted session. |
| **Weak Complexity** | User signs up with "password123". | Enforce zxcvbn-based password strength requirements. |
| **Broken CORS** | API responds to `*` (Any origin). | Explicitly allowlist only your specific app domains. |
