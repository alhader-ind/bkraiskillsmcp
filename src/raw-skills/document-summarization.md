---
name: document-summarization
description: Advanced semantic distillation, high-fidelity metadata extraction, and multi-document intelligence synthesis. Use this skill for transforming massive text corpora into actionable decision-logic.
---

# Advanced Document Summarization & Intelligence Extraction

Document Summarization is the process of compressing high-entropy text into low-entropy, high-utility intelligence. To achieve "100x" better clarity, move beyond "text shortening" and into **Structural Mapping**, **Semantic Distillation**, and **Multi-Format Synthesis**.

## 1. The Multi-Pass Summarization Protocol

Process documents through the **M.D.S.** (Map, Distill, Synthesize) framework to ensure zero-loss compression:

### Phase A: Structural & Intent Mapping (Map)
Deconstruct the document's architecture before reading for detail:
-   **Archetype Identification:** Is this a Legal Contract, a Research Paper, a Meeting Transcript, or a Technical Specification?
-   **Intent Anchoring:** Define the "Job to be Done" for this summary (e.g., "Extract risk factors" vs. "Summarize action items").
-   **Data Density Audit:** Identify tables, appendices, and footnotes that contain concentrated data payloads.

### Phase B: Semantic Distillation (Distill)
Extract atomic insight blocks using a thematic sieve:
-   **Core Thesis Extraction:** Define the "One Sentence" purpose of the entire document.
-   **Supporting Pillars:** Identify the 3-5 major arguments or findings that sustain the thesis.
-   **Entity & Fact Extraction:** List key stakeholders, critical dates, currency amounts, and technical terminology.
-   **The "Hidden" Pass:** Specifically look for caveats, warnings, or buried footnotes that contradict the main text.

### Phase C: Intelligence Synthesis (Synthesize)
Reconstruct the extracted data into a high-utility format:
-   **The "BLUF" Header:** (Bottom Line Up Front) Place the most critical conclusion in the first 2 sentences.
-   **Narrative Condensation:** Rewrite the complexity of the original into a streamlined, professional narrative.
-   **Verification Loop:** Cross-reference the final summary with the raw text to ensure no bias or "Hallucination Glitch" occurred.

## 2. Advanced Extraction Frameworks

| Format | Best For... | Extraction Logic |
| :--- | :--- | :--- |
| **Executive TL;DR** | Busy Decision Makers. | Focus on "Impact" and "Next Steps." |
| **Thematic Matrix** | Comparing 2+ Documents. | Use a side-by-side Markdown table to highlight contradictions/gaps. |
| **Technical Spec** | Developers/Engineers. | Focus on "Constraints," "Inputs/Outputs," and "Dependency Logic." |
| **Entity Relational Map** | Legal/Investigation. | Map "Who" did "What" to "Whom" and "When." |

## 3. Implementation: The Intelligence Briefing Blueprint

When presenting a summary, ground the reader with a **Tiered Intelligence Table**.

```markdown
### 📄 Intelligence Briefing: [Document Title]
| Category | Value | Confidence |
| :--- | :--- | :--- |
| **Primary Objective** | [The BLUF Summary] | [90-100%] |
| **Key Stakeholders** | [List Entities] | [Verified] |
| **Critical Deadlines** | [Dates found in text] | [Exact] |
| **Risk/Caveats** | [Buried warnings] | [Essential] |

#### 🔍 Section-by-Section Breakdown
- **Section 1:** [Bullet point of core logic]
- **Section 2:** [Bullet point of core logic]
```

## 4. Fidelity & Semantic Guardrails

> [!CAUTION] **The "Compression Loss" Trap**: Summarizing often strips away "Risk" and "Caveats." Ensure negative findings or dissenting opinions are elevated, not buried in the compression process.

**The Integrity Checklist:**
1.  **Grounded Truth Only:** Do not incorporate outside knowledge. If the document says the sky is green, the summary states the sky is green.
2.  **No "Filler" Adjectives:** Avoid words like "very," "important," or "essential" unless they are in the original text as a major emphasis.
3.  **Tonal Mirroring:** If the document is formal and cautious, the summary must be formal and cautious. Do not "Casualize" professional data.
4.  **Reference Attribution:** Use `[Page X]` or `[Section Y]` markers for every major claim to enable verification.

## 5. Security & Privacy Protocols

-   **PII Masking:** Automatically redact or skip the extraction of sensitive PII (Passport numbers, SSNs) unless explicitly needed for a secure internal audit.
-   **Anonymized Synthesis:** When summarizing multi-user transcripts, ensure private identifiers are handled according to the user's sensitivity level.

## 6. Global Summarization Invariants

-   **结论先行 (Conclusions First):** Never make the user read to the bottom to find the main point.
-   **ZERO HALLUCINATION:** If the document is silent on a topic, explicitly state: "The provided text does not contain information regarding [Topic]."
-   **WORD ECONOMY:** Aim for a 90% reduction in length while maintaining 95% of the logic.

## Common Summarization Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **The "Vague" Summary** | "The document discusses ideas about X." | Specifically name the Ideas. "The document proposes A, B, and C." |
| **Entity Confusion** | Swapping the roles of 'Buyer' and 'Seller'. | Perform a dedicated "Identity Audit" before the synthesis phase. |
| **Missing Caveats** | The summary makes the plan sound perfect, but the doc mentions risks. | Always check the final 10% of the document for "Limitations" sections. |
| **Style Drift** | Professional data summarized in a casual or robotic tone. | Set the "Tone Register" in Phase A. |
