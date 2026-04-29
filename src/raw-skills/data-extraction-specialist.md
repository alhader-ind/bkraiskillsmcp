---
name: data-extraction-specialist
description: Advanced unstructured-to-structured synthesis, semantic entity resolution, and high-fidelity JSON orchestration. Use this skill for transforming chaotic text or documents into production-ready data schemas.
---

# Advanced Data Extraction & Semantic Synthesis

Data Extraction is the process of distilling order from entropy. To achieve "100x" better precision, move beyond "simple parsing" and into **Semantic Entity Resolution**, **Ontological Mapping**, and **Multi-Stage Validation Loops**.

## 1. The High-Fidelity Extraction Protocol

Execute structured synthesis through the **S.S.V.** (Scan, Structure, Verify) framework:

### Phase A: Semantic Scan & Entity Resolution (Scan)
Identify the logic-blocks within the unstructured noise:
-   **Contextual Anchoring:** Determine the document's domain (e.g., Clinical, Legal, Financial) to prime the extraction model.
-   **Boundary Detection:** Mark the start and end of high-entropy zones (e.g., "The section between 'Terms' and 'Conditions' contains the price data").
-   **Entity Disambiguation:** Differentiate between similar entities (e.g., distinguishing between a "Billing Address" and a "Shipping Address" using surrounding keywords).

### Phase B: Ontological Structuring & Mapping (Structure)
Map raw tokens to a predefined type-safe schema:
-   **Type-Strict Casting:** Ensure dates are ISO-8601, currencies are numeric (strings stripped of symbols), and booleans are derived from intent.
-   **Hierarchical Nesting:** Transform linear text into rich, nested JSON objects (e.g., grouping `line_items` under an `invoice` parent).
-   **Null-Safety Mapping:** Explicitly assign `null` to missing fields rather than skipping them, preserving schema consistency for downstream consumers.

### Phase C: Recursive Validation & Integrity (Verify)
Audit the extracted data for logical coherence:
-   **Internal Consistency Check:** Verify that extracted parts sum to the whole (e.g., ensuring `subtotal + tax == total`).
-   **Format Hardening:** Run the output through a JSON linter to ensure zero syntax errors.
-   **Confidence Scoring:** Tag extracted entities with a low/high confidence flag based on evidence clarity.

## 2. Advanced Extraction Framework Matrix

| Capability | Best For... | Extraction Logic |
| :--- | :--- | :--- |
| **Named Entity Recognition (NER)** | People, Places, Organizations. | Uses semantic position to identify proper nouns. |
| **Tabular Conversion** | Invoices, Lists, Logs. | Maps rows and columns to array-of-objects structures. |
| **Temporal Extraction** | Calendars, Deadlines. | Normalizes relative time ("next Tuesday") to absolute timestamps. |
| **Sentiment & Intent Mapping** | Customer Feedback, Reviews. | Extracts the "vibe" and "urgency" as structured metadata. |

## 3. Implementation: The Extraction Blueprint

When performing a complex extraction, provide a **Data Mapping Audit**.

```markdown
### 📊 Semantic Extraction Audit
| Raw Entity | Extracted Value | Target Data Type | Logic Applied |
| :--- | :--- | :--- | :--- |
| "Total: $1,200.50" | `1200.50` | `number` | Stripped `$` and `,`, parsed as float. |
| "expires Dec '25" | `2025-12-31` | `date (ISO)` | Inferring end-of-month from partial date. |
| "Jane (CEO)" | `{ "name": "Jane", "role": "CEO" }` | `object` | Split name and title via parenthetical logic. |
| "Contact at [Email]" | `[Email Address]` | `string (email)` | Regex-based pattern matching. |
```

## 4. Precision & Integrity Guardrails

> [!CAUTION] **The "Hallucination" Trap**: Never "invent" data to fill a required schema field. If the information isn't in the source text, it MUST be `null`.

**The Extraction Integrity Checklist:**
1.  **Zero Chatter:** Output ONLY the requested data structure (usually JSON). No conversational preamble or postscript.
2.  **Strict Schema Adherence:** Every key in the target JSON must match the user's requested schema exactly.
3.  **Sanitization Baseline:** Remove unnecessary whitespace, control characters, or HTML tags from extracted strings.
4.  **Reference Grounding:** If requested, provide the exact "Source Fragment" for every extracted value to enable verification.

## 5. Implementation Pattern: Complex JSON Schema

```json
{
  "document_type": "Invoice",
  "metadata": {
    "confidence_score": 0.98,
    "extraction_timestamp": "2024-05-20T10:00:00Z"
  },
  "entities": {
    "vendor": {
      "name": "Acme Corp",
      "tax_id": "12-3456789"
    },
    "items": [
      { "description": "Widget A", "qty": 10, "unit_price": 5.00 },
      { "description": "Grommet B", "qty": 2, "unit_price": 12.50 }
    ],
    "total_due": 75.00
  }
}
```

## 6. Global Extraction Invariants

-   **DATA OVER NARRATIVE:** In extraction mode, you are a data pipe. Prioritize schema fidelity over natural language.
-   **PRESERVE EXACTNESS:** Do not paraphrase proper nouns or specific codes; extract them exactly as they appear in the source.
-   **IDEMPOTENCY:** Given the same text and schema, always produce the same JSON structure.

## Common Extraction Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Contextual Overlap** | Multiple dates found, wrong one extracted for "Deadline." | Prioritize dates nearest to keyword "Deadline" or "Due." |
| **Unit Confusion** | Extracting "10kg" as just the number `10`. | Separate value and unit into two fields: `{ "val": 10, "unit": "kg" }`. |
| **Logic Leakage** | The model explains *why* it extracted a value. | Enforce "SILENT_MODE" (JSON-only output). |
| **Formatting Crash** | Invalid JSON due to unescaped quotes in a string. | Use standard JSON escape sequences (`\"`) for internal quotes. |
