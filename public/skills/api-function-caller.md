---
name: api-function-caller
description: Advanced tool orchestration, recursive parameter resolution, and autonomous action-chaining. Use this skill for transforming conversational intent into high-fidelity system executions.
---

# Advanced API Function Calling & Tool Selection

API Function Calling is the engine of agency. To achieve "100x" better reliability, move beyond "simple JSON" and into **Recursive Parameter Resolution**, **Contextual Tool Chaining**, and **Autonomous Error Recovery**.

## 1. The Autonomous Action Protocol

Execute system actions through the **P.E.X.** (Parse, Execute, X-Ray) framework:

### Phase A: Semantic Parameter Resolution (Parse)
Map loose conversational intent to strict system schemas:
-   **Entity Disambiguation:** Resolve pronouns (e.g., "it," "that file") to specific IDs/Paths from the recent context.
-   **Normalization & Casting:** Ensure all inputs match the schema's type requirements (e.g., casting `"5"` to `5`, formatting dates to ISO-8601).
-   **Dependency Check:** Identify if the requested action requires a "Prerequisite Call" (e.g., calling `list_files` before `edit_file`).

### Phase B: Transactional Execution (Execute)
Manage the lifecycle of the tool invocation:
-   **Schema Adherence:** Generate payloads that are 100% compliant with the `input_schema`—no "shadow" parameters or hallucinated keys.
-   **Constraint Validation:** Pre-verify that values fall within allowed ranges (e.g., clamping `brightness: 200` to `100`).
-   **Batch Handling:** Parallelize independent calls for performance (e.g., processing multiple files in one turn).

### Phase C: Recursive Verification (X-Ray)
Evaluate the tool's output and react accordingly:
-   **Success Confirmation:** Verify that the output confirms the intended state change.
-   **Error Deconstruction:** If a call fails, parse the error message for actionable clues (e.g., "File not found" -> trigger a search).
-   **Correction Loop:** Automatically re-attempt the call with refined parameters without prompting the user, unless fundamental ambiguity exists.

## 2. Advanced Orchestration Frameworks

| Pattern | Logic Flow | Best For... |
| :--- | :--- | :--- |
| **Recursive Retrieval** | List -> Search -> Read -> Edit. | Surgical code modifications. |
| **Conditional Batching** | verify_logic -> if(true) -> execute_action. | Secure transactions (e.g., payments, access changes). |
| **Rollback Simulation** | Track state -> Execute -> If fail, call Reverter. | Maintaining system integrity during multi-step processes. |
| **Fuzzy-to-Fixed Mapping** | Map "natural words" to "enum values." | IoT control and DB querying. |

## 3. Implementation: The Action Intelligence Blueprint

When planning a multi-step execution, provide an **Action Chain Walkthrough**.

```markdown
### 🛠️ Autonomous Action Plan
| Step | Tool | Objective | Trigger Condition |
| :--- | :--- | :--- | :--- |
| 1 | `list_files` | Locate the config file. | Initial Request. |
| 2 | `read_file` | Extract current API endpoints. | Step 1 Success. |
| 3 | `edit_file` | Update the endpoint to v2. | Step 2 Content Match. |
| 4 | `verify_build` | Ensure no syntax errors. | Step 3 Success. |
```

## 4. Resilience & Safety Guardrails

> [!CAUTION] **The "Shadow Update" Trap**: Never assume a tool call worked because you generated the JSON. The system state ONLY changes once the `tool_output` is received and validated.

**The Resilience Checklist:**
1.  **Auth Scoping:** Never execute calls that exceed the user's current permission level found in the environment.
2.  **No Hallucinated Tools:** Only use tools explicitly provided in the current environment's manifest.
3.  **Sanitized Payloads:** Ensure strings don't contain injection attempts or character-set errors that break the JSON parser.
4.  **Loop Prevention:** If a tool call fails 3 times with the same error, STOP and consult the user for clarification.

## 5. Implementation Pattern: Parallel Tool Invocations

```json
{
  "calls": [
    {
      "name": "update_status",
      "arguments": { "id": "task_1", "status": "done" }
    },
    {
      "name": "update_status",
      "arguments": { "id": "task_2", "status": "done" }
    }
  ]
}
```

## 6. Global Function-Call Invariants

-   **ZERO CHATTER:** During tool selection, omit conversational filler. The focus is on precision and speed.
-   **JSON PURITY:** Ensure every payload is valid JSON. Use double-quotes and escape special characters.
-   **LATENCY AWARENESS:** Always prefer the "Most Direct" tool for a task to minimize round-trip costs.

## Common Tool Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Parameter Hallucination** | Inventing an `id` that doesn't exist. | Pre-call a `lookup` or `list` tool to verify the ID. |
| **Type-Strict Rejection** | Sending a string to a field expecting a boolean. | Strictly cast to JSON primitives (`true` / `false`). |
| **Logical Deadlock** | Trying to `delete` an item that is already `deleted`. | Always perform a "Condition Check" or handle 404s gracefully. |
| **Context Exhaustion** | Sending 10MB of data to an API that accepts 1MB. | Chunk the data or use a "Stream" tool if available. |

