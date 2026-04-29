---
name: multimodal-vision
description: Advanced spatial cognition, semantic deconstruction, and visual-to-logic translation. Use this skill when interpreting complex UI screenshots, architectural diagrams, or high-entropy images.
---

# Advanced Multimodal Vision & Visual Intelligence

Multimodal Vision is the bridge between chaotic pixel data and structured logical symbols. To achieve "100x" better visual comprehension, move beyond "image description" and into **Structural Decomposition**, **Spatial Relational Logic**, and **Semantic Grounding**.

## 1. The Multi-Tiered Vision Protocol

Process images through the **G.S.E.** (Global, Spatial, Extraction) framework to ensure zero-loss interpretation:

### Phase A: Global Scene & Archetype Analysis (Global)
Categorize the intent and source of the visual input:
-   **Archetype Identification:** Is this a High-Fidelity UI, a Low-Fi Wireframe, a Technical Flowchart, or a Real-World Photograph?
-   **Style Signature:** Identify the design language (e.g., "Minimalist SaaS with heavy use of Inter and Lucide icons").
-   **Primary Objective:** What is the most critical information the user wants from this specific image?

### Phase B: Spatial Relational Logic (Spatial)
Map the geometry of the scene to understand intent:
-   **Coordinate Mapping:** Establish a mental grid (Top-Left, Center-Right, Bottom-Center).
-   **Hierarchy & Emphasis:** Identify the "Focal Point." What element is the user's eye drawn to first? (e.g., "The Primary CTA is a large violet button in the center-right").
-   **Relational Vectors:** Describe elements by their distance and direction from others (e.g., "The user menu is nested within the top-right corner of the sidebar").

### Phase C: Semantic Extraction & OCR (Extraction)
Translate pixels into actionable data:
-   **High-Fidelity OCR:** Transcribe all visible labels, headers, and micro-copy with 100% accuracy.
-   **State Detection:** Identify component states (e.g., "The 'Submit' button is currently in a disabled/greyed-out state").
-   **Iconography Decoding:** Translate visual symbols into logic (e.g., "A 'Bell' icon with a red dot indicates 'Unread Notifications'").

## 2. Advanced Vision Intelligence Matrix

| Capability | Best For... | Interpretation Logic |
| :--- | :--- | :--- |
| **UI-to-Code Schema** | Reconstructing Apps. | Identify Grid/Flex containers, padding-logic, and Tailwind-specific color shades. |
| **Diagram Parsing** | System Architecture. | Map nodes (services) to edges (data flow) and identify directional protocols. |
| **Optical Data Extraction** | Infographics/Tables. | Convert visual charts into raw JSON objects or Markdown tables. |
| **Contextual Saliency** | Complex Scenes. | Prioritize "Information-Dense" areas while filtering out visual noise. |

## 3. Implementation: The Visual Grounding Blueprint

When analyzing an image, present your findings in a **Structured Visual Audit**.

```markdown
### 👁️ Visual Intelligence Audit
| Category | Observation | Logical Mapping |
| :--- | :--- | :--- |
| **Global Archetype** | Dashboard UI | Main navigation sidebar with top search bar. |
| **Text (OCR)** | "Active Users: 1,204" | Dynamic data point found in center-left card. |
| **Component States** | Search Input | Focused state with blue ring (Primary Focus). |
| **Color/Type** | Brand Primary | `#6366f1` (Indigo-500) used for CTAs. |
```

## 4. Grounding & Hallucination Guardrails

> [!CAUTION] **The "Visual Probability" Trap**: Vision models often guess text or icons based on context ("It looks like a menu"). You MUST only describe what is objectively verifiable in the pixels.

**The Vision Integrity Checklist:**
1.  **Pixel-to-Text Veracity:** Do not summarize text; transcribe it exactly. If it's blurry, mark it as `[UNCLEAR]`.
2.  **Color Precision:** Avoid generic names. Use closest Tailwind-500 scale or Hex estimates (e.g., "Emerald-600" over "Green").
3.  **Numerical Saliency:** Explicitly count repeating elements (buttons, cards, rows) to prevent coding loop errors.
4.  **No Supposition:** If an action isn't visible (e.g., what happens after a click), do not assume. Document the "Visual Intent" instead.

## 5. Security & Privacy Protocols

-   **PII Sensitivity:** Automatically redact or skip the extraction of sensitive PII (SSNs, Card Numbers) from screenshots.
-   **Anonymity Guardrail:** Do not identify individuals or perform facial recognition.
-   **No Medical Guesswork:** Refuse requests to diagnose medical conditions from scans or anatomical images.

## 6. Global Vision Invariants

-   **DESCRIBE BEFORE ACTING:** Always output a summary of your visual understanding before generating code or logic from an image.
-   **HIERARCHY MATTERS:** Always process from "Big Picture" to "Small Detail."
-   **RESPECT THE CROP:** If the image is cut off, acknowledge the missing context rather than guessing.

## Common Visual Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Contextual Drift** | Describing a sub-component while ignoring the parent modal. | Always check the "Global Scene" (Phase A) first. |
| **Shadow Phantoms** | Interpreting shadows or gradients as UI borders. | Differentiate between "Structural Borders" and "Depth Effects." |
| **Language Mismatch** | Misinterpreting icons in non-English interfaces. | Use spatial context and universal symbols (e.g., Trash = Delete) regardless of label. |
| **Logic Gaps** | Missing the "Back" arrow because it's subtle. | Perform a dedicated "Corner Audit" (scanning all 4 corners of the image). |
