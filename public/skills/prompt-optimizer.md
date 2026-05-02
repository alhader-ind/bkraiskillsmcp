---
name: prompt-optimizer
description: Advanced linguistic engineering, intent synthesis, and meta-prompt optimization. Use this skill to transform vague user requests into high-fidelity AI instructions.
---

# Prompt Engineering & Intent Optimization

Prompt Engineering is the science of aligning a Large Language Model's probabilistic output with a specific, deterministic goal. To achieve "100x" better results, move beyond "simple questions" and into **Contextual Priming**, **Structural Constraints**, and **Iterative Refinement Cycles**.

## 1. The Multi-Dimensional Prompt Engineering Protocol

A professional prompt is a "specification," not a "request." Follow the **Intent-to-Instruction (I2I)** lifecycle:

### Phase A: Intent & Persona Synthesis
Identify the "Archetype" required for the task:
-   **Archetype:** Define the specific domain expertise required (e.g., "Senior Systems Architect," "Creative Copywriter").
-   **Tone & Register:** Establish the linguistic style (e.g., "Professional yet concise," "Academic and analytical").
-   **Core Mission:** State the "One Big Goal" of the prompt in absolute terms.

### Phase B: Context Scaffolding (The "Knowledge Guard")
Provide the AI with the boundaries of the world it operates in:
-   **Target Audience:** Who is reading the end result?
-   **Available Data:** Explicitly list what information is provided and what must be inferred.
-   **Baseline Knowledge:** Define what common knowledge is assumed and what requires specialized handling.

### Phase C: Constraint & Output Engineering
Force the model into a specific "Logical Shape":
-   **Negative Constraints:** Explicitly list what the AI must NOT do (e.g., "No preamble," "Avoid jargon").
-   **Structural Constraints:** Define the specific format (e.g., "Markdown with H3 headers," "Strict JSON schema").
-   **Length/Complexity:** Specify word counts, step-counts, or complexity levels (e.g., "Explain it like I'm 5").

## 2. Advanced Prompting Frameworks

| Framework | Pattern | Best For... |
| :--- | :--- | :--- |
| **CO-STAR** | Context, Objective, Style, Tone, Audience, Response | High-performance marketing or business prompts. |
| **RTF** | Role, Task, Format | Quick, high-utility operational tasks. |
| **Few-Shot** | Role + Examples -> Task | Ensuring consistent style or technical formatting. |
| **CoT (Chain-of-Thought)** | "Think step-by-step" | Logic-heavy tasks, math, or complex debugging. |

## 3. Few-Shot & Optimization Patterns

### Pattern: The "Few-Shot" Blueprint
Add 2-3 examples of "Perfect Input-Output" pairs to ground the model. This is the single most effective way to improve reliability.
```text
Example 1: Input: [X] -> Output: [Y]
Example 2: Input: [A] -> Output: [B]
Instruction: Now process [C].
```

### Pattern: The "Check-Your-Work" Reflex
Always include a instruction for the model to self-evaluate: "Before finalizing your response, verify it against existing Constraint X and Y."

## 4. The Engineering Guardrails (Anti-Hallucination)

> [!CAUTION] **The "Eager-to-Please" Trap**: AI models will often hallucinate facts to satisfy a prompt's premise. Implement explicit "Truth Gates."

**The Integrity Checklist:**
1.  **Non-Knowledge Buffer:** "If you do not know the answer, explicitly state that you are unsure."
2.  **Source Verification:** "Base your answer ONLY on the provided text. Do not use outside training data."
3.  **Ambiguity Flagging:** "If the prompt is ambiguous, ask for clarification before proceeding."

## 5. Implementation: The Meta-Prompt Template

When optimizing a user's prompt, output the result in this **Master Template** structure:

```markdown
# [Expert Persona Name]
## Mission
[Clear, 1-sentence goal]

## Context
[Audience, Background, Data]

## Key Instructions
1. [Step 1]
2. [Step 2]

## Constraints
- [Constraint 1]
- [Constraint 2]

## Output Format
[Markdown/JSON/CSV details]
```

## 6. Global Prompt Invariants

-   **PRECISION OVER POLITENESS:** Use direct imperatives ("Do X," "Must Y") rather than polite requests ("Please do X").
-   **LOGICAL ORDERING:** Place the most important instructions at the very beginning or the very end of the prompt (the "serial position effect").
-   **TOKEN EFFICIENCY:** Remove fluff and filler words to maximize the model's focus on semantic meaning.

## Common Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Instruction Overload** | The AI ignores half the instructions. | Group related instructions and use numbered lists. |
| **Style Leakage** | The AI uses "LLM-speak" (e.g., "delve," "tapestry"). | Add specific "Forbidden Words" to the Constraints section. |
| **Logic Gaps** | The AI skips a critical step in a sequence. | Use "Chain-of-Thought" (CoT) and explicitly request step numbering. |
| **Output Squashing** | The AI's response is too short or lacks detail. | Specify "Detailed 5-paragraph analysis" instead of "a summary." |

