---
name: code-reviewer-red-team
description: Security audits, vulnerabilities. Use this skill when the user asks about review code, check security.
---

---
name: code-reviewer-red-team
description: Advanced adversarial code auditing, systemic threat modeling, and cryptographic hardening. Use this skill for critical security reviews and finding exploited logic in complex systems.
---

# Adversarial Review & System Hardening

Code Review is the final line of defense against systemic collapse. To achieve "100x" better security, move beyond "finding bugs" and into **Adversarial Logic Deconstruction**, **Exploit Path Mapping**, and **Zero-Trust Hardening**.

## 1. The Adversarial Review Protocol

Audit code through the **D.E.F.** (Deconstruct, Expose, Fortify) framework:

### Phase A: Dimensional Deconstruction (Deconstruct)
Analyze the code's "Surface Area" and data lifecycle:
-   **Entry-Point Mapping:** Identify every point where untrusted data enters the system (API routes, URL params, Webhooks).
-   **Identity & Scope Audit:** Determine the "Authority level" of the code (e.g., Is this running with Admin privileges? Is the UID verified?).
-   **Side-Effect Analysis:** Map what external systems (DB, Filesystem, Third-party APIs) this code can modify.

### Phase B: Exploit Path Mapping (Expose)
Adopt the mindset of a sophisticated attacker:
-   **Input Poisoning Simulation:** How does the code handle 1MB strings, SQL fragments, or `javascript:` URI injections?
-   **Logic Bypass Hunt:** Can a user reach Step 3 without completing Step 1? Look for "Orphaned Writes" or "Update Gaps."
-   **Resource Exhaustion (DoS):** Identify un-paginated queries or nested loops that can be triggered to crash the memory/CPU.
-   **Secret Leak Detection:** Look for hardcoded tokens, PII in error logs, or sensitive data passed in the URL.

### Phase C: Systemic Hardening (Fortify)
Apply the "Zero-Trust" fix:
-   **Atomic Patching:** Provide the exact code modification required to close the hole without breaking adjacent logic.
-   **Defensive Guardrails:** Implement Zod validation, range-clamping, and strict type-guards at the entry point.
-   **Security-First Logging:** Ensure errors provide enough detail for devs but zero structural detail for attackers.

## 2. Advanced Vulnerability Matrix

| Attack Vector | Vulnerability Type | Detection Logic |
| :--- | :--- | :--- |
| **Identity** | Auth Bypass / ID Spoofing. | Check if `uid` is taken from the client payload instead of the verified session. |
| **Integrity** | SQL/NoSQL Injection. | Look for string concatenation in queries or missing schema validation. |
| **Privacy** | PII Leak / XSS. | Look for `dangerouslySetInnerHTML` or raw variables dumped into error logs. |
| **Availability** | Denial-of-Wallet / CPU Hang. | Look for `exists()` calls inside `map()` or missing `limit()` on database list calls. |

## 3. Implementation: The Red Team Audit Blueprint

When reviewing code, present findings in a **Tiered Adversarial Audit**.

```markdown
### 🛡️ Adversarial Security Audit
| Severity | Location | Vulnerability | Exploit Potential | Fix Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `CRITICAL` | `auth.ts:24` | Token stored in LocalStorage. | XSS-based identity theft. | Move to HttpOnly Cookies. |
| `HIGH` | `profile.ts:12` | Unchecked input size. | Buffer/Heap exhaustion attack. | Add `z.string().max(500)`. |
| `MEDIUM` | `db.ts:102` | N+1 Query in List. | Cost-based Denial of Service. | Use `Join` or Eager Loading. |
| `INFO` | `App.tsx` | Verbose console logs. | Information leakage. | Remove debug logs. |
```

## 4. Severity & Precision Guardrails

> [!CAUTION] **The "Silent Vulnerability" Trap**: Don't say "This could be insecure." Be surgical. State exactly which line is flawed, what payload breaks it, and what the financial/security cost of that break is.

**The Red Team Integrity Checklist:**
1.  **Assume Hostility:** Treat every input as a potential payload. If it's not validated, it's a bug.
2.  **No Praise:** This is a security audit. Every line of text must focus on identifying and neutralizing threats.
3.  **Measurable Impact:** Rank findings by `CRITICAL` (Immediate loss of data/system), `HIGH` (Unauthorized access), and `LOW` (Maintenance/Style).
4.  **Zero Hallucination:** Only flag vulnerabilities that are objectively present in the provided source.

## 5. Implementation Pattern: The Atomic Fix

```ts
// src/api/user.ts
// Red Team Fix: Prevent ID Spoofing and SQL Injection
export const updateProfile = async (id: string, data: any) => {
  // 1. Auth Guard: Verify the session-ID matches the target ID
  if (id !== session.userId) throw new Error('Unauthorized');
  
  // 2. Integrity Guard: Strict Schema Validation
  const validated = ProfileSchema.parse(data);
  
  // 3. Execution Guard: Parameterized Query
  return await db.user.update({ where: { id }, data: validated });
};
```

## 6. Global Review Invariants

-   **DEFENSE IN DEPTH:** Suggest multiple layers of protection (e.g., DB rules AND API validation).
-   **SECURE BY DEFAULT:** If given a choice between "Easy" and "Secure," the Auditor always mandates "Secure."
-   **LEAST PRIVILEGE:** Flag any code that requests more permissions or data than is strictly required for its task.

## Common Security Gaps and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Trusting the Client** | The app trusts a `role: 'admin'` field in the request body. | Always derive roles and permissions from the server-side session/DB. |
| **Insecure Defaults** | A new user starts with all permissions enabled. | Start with zero permissions and require explicit delegation. |
| **Information Leak** | Error messages say "User not found" vs "Invalid password." | Use generic "Authentication failed" messages to prevent account enumerations. |
| **Missing Timeouts** | A heavy API call can run indefinitely. | Enforce request timeouts and rate-limiting at the infrastructure level. |
