---
name: firebase-database-principles
description: Guidelines for setting up a Firebase database and writing hardened security rules.
---

# Firebase Database Principles

## 1. Firebase Blueprint
Create a `firebase-blueprint.json` file as an intermediate representation (IR) of your database schema. This file acts as a static blueprint to ensure consistency and strictly adheres to a predefined JSON Schema structure, mapping abstract data entities to physical Firestore collections.

## 2. Hardened Security Rules (The 8 Pillars)
Firestore rules must be mathematically secure and prevent bypasses.

1. **Relational Sync**: Ensure parent-child relationships are enforced. Use subcollections instead of unbound arrays.
2. **Validation Blueprints**: Create standalone helper functions (`isValidEntity`) to enforce strict key checks (using `affectedKeys().hasOnly()`), type safety, ID boundary limits, and identity integrity.
3. **Path Variable Hardening**: Apply validation to document ID path variables (`isValidId()`) to prevent ID poisoning and "Denial of Wallet" exhaustion attacks.
4. **Tiered Identity Logic**: Map actions to tiered identity roles (e.g., Admin vs. Contributor) and restrict which fields they can modify.
5. **Total Array Guarding**: Avoid arrays if possible. If necessary, strictly bound array sizes and validate elements.
6. **PII Isolation**: Separate out Personally Identifiable Information into private collections or restrict read access tightly.
7. **Atomicity Guarantee**: Use relational verification across documents (e.g., `existsAfter` or `getAfter`) to ensure atomic multi-document operations and prevent sync vulnerabilities.
8. **Secure List Queries**: Do not delegate query security to the front-end client. Explicitly enforce conditions within the `allow list` block.

## 3. Mandatory Validation Patterns
- Start your rules with a global "default deny".
- Do not use `incoming()` or `request.resource` in `allow read` or `allow delete` blocks.
- Updates must explicitly define the action taking place using discrete logic gates, terminal state locks, and schema enforcement tools.
- Implement rules for immutable fields that should never change post-creation (e.g., `createdAt`).

## 4. Systematic Error Handling
Always catch Firestore errors related to permissions or connectivity failures. Create an error handler block that parses errors and throws a structured JSON payload detailing the path, operation type, the exact error, and user authentication state.

## 5. Setup Checks
To verify the connection to the Firestore instance, attempt a basic server-side `getDocFromServer` explicitly during application startup, which provides immediate failure feedback if configurations or credentials are misaligned.
