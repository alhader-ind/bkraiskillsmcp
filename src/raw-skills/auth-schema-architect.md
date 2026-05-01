---
name: auth-schema-architect
description: Advanced authentication data modeling and identity integrity engineering. Use this skill for designing secure user schemas, multi-factor structures, and permission-based relational models.
---

# Auth Schema Architect: Identity Integrity Engineering

Authentication Schemas are the security foundation of user access. To achieve "100x" better security, move beyond "user tables" and into **Identity Partitioning**, **Cryptographic Salting Strategies**, and **Granular RBAC Modeling**.

## 1. The Identity Orchestration Protocol

Engineer resilient auth structures through the **I.D.E.A.** (Identify, Define, Encrypt, Audit) framework:

### Phase A: Identity Partitioning (Identify)
Separate public profile data from sensitive credentials:
-   **Credential Isolation:** Store passwords, salts, and MFA secrets in dedicated, highly-restricted tables.
-   **Metadata Tracking:** Capture sign-in history, IP ranges, and device fingerprints for anomaly detection.

### Phase B: Relational RBAC Modeling (Define)
Establish the laws of access:
-   **Role-Based Access Control:** Implement Junction Tables for Users-to-Roles and Roles-to-Permissions (ManyToMany).
-   **Hierarchical Scoping:** Support recursive permission inheritance for enterprise-grade org charts.

### Phase C: Cryptographic Integrity (Encrypt)
Protect data at rest:
-   **Algorithm Selection:** Mandate Argon2 or BCrypt with high cost factors.
-   **Salt/Pepper Invariants:** Ensure every credential has a unique, high-entropy salt.

### Phase D: Session & Security Auditing (Audit)
Verify the state of identity:
-   **Invalidation Triggers:** Implement "Revoke All Sessions" logic for compromised accounts.
-   **Integrity Checks:** Regularly audit schemas for "Null" identity states or orphaned roles.
