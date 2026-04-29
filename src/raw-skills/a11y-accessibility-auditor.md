---
name: a11y-accessibility-auditor
description: Advanced WCAG 2.1/2.2 compliance, semantic structural auditing, and assistive technology optimization. Use this skill for building inclusive, a11y-first web interfaces.
---

# Accessibility Auditing & Inclusive Design

Accessibility (a11y) is not a "feature"—it is a fundamental requirement of modern software. To achieve "100x" better accessibility, move beyond "adding alt tags" and into **Semantic Integrity Auditing**, **Focus Management Orchestration**, and **Assistive Technology Alignment**.

## 1. The WCAG 2.1/2.2 Compliance Protocol

A professional accessibility audit follows the **POUR** framework (Perceivable, Operable, Understandable, Robust):

### Phase A: Perceivable (Sensory Access)
Ensure information and UI components are presentable to users in ways they can perceive:
-   **Text Alternatives:** Provide `alt` text for non-text content; ensure icons have labels.
-   **Contrast Ratios:** Verify that text meets the 4.5:1 (Normal) and 3:1 (Large) minimum contrast requirements.
-   **Adaptability:** Ensure the layout remains functional when zoomed to 400% or viewed on small screens.

### Phase B: Operable (Functional Access)
Ensure user interface components and navigation are operable:
-   **Keyboard First:** Every single interactive element MUST be reachable and triggered via keyboard (`Tab`, `Enter`, `Space`).
-   **Focus Integrity:** Implement visible focus indicators and ensure focus never gets "trapped" in a modal or menu.
-   **Timing:** Provide users enough time to read and use content (e.g., extendable timeouts).

### Phase C: Understandable (Cognitive Access)
Ensure information and the operation of the UI are understandable:
-   **Predictability:** Navigation and components should behave in consistent ways across the application.
-   **Input Assistance:** Provide clear error labels and suggestions when a user makes an input mistake.

## 2. Advanced ARIA Design Patterns

| Pattern | Role | Best For... |
| :--- | :--- | :--- |
| **Combobox** | `role="combobox"` | Inputs with auto-complete or dropdown suggestions. |
| **Live Regions** | `aria-live="polite"` | Dynamic content updates (notifications, status changes) that screen readers must announce. |
| **Wayfinding** | `role="main/nav/search"` | Defining critical landmarks for screen reader navigation. |
| **Dialog/Modal** | `role="dialog"` | Ensuring focus is trapped and screen readers don't read "background" content. |

## 3. Implementation: The Accessibility Audit Blueprint

When auditing code, provide a **Delta-Audit** that highlights exactly what was missing and why the fix matters.

```markdown
### 🔎 Accessibility Audit Results
| Element | Issue | Fix Applied | Impact |
| :--- | :--- | :--- | :--- |
| Header Icon | Missing `aria-label` | Added `aria-label="Toggle Navigation"` | Screen readers now announce intent. |
| Submit Button | No keyboard `Tab` access | Converted `div` to semantic `<button>` | Restored keyboard functionality. |
| Color Scheme | Low contrast (2.1:1) | Updated hex to `#374151` | Complies with WCAG AA standard. |
```

## 4. Focus Management & Navigation Guardrails

> [!CAUTION] **The "Shadow Interactive" Trap**: Using `onClick` on a `div` creates a "Shadow Interactive" that keyboard users and screen readers cannot find. NEVER do this.

**The a11y Integrity Checklist:**
1.  **Semantic Hierarchy:** Use H1-H6 tags in a logical, nesting order. Never skip levels (e.g., H1 to H3).
2.  **Focus Trapping:** Ensure that when a Modal opens, focus moves to the first element INSIDE it and stays there until closed.
3.  **Label Association:** Every `<input>` MUST be linked to a `<label>` via the `id` and `for` (or `htmlFor` in React) attributes.
4.  **Hiding Content:** Use `aria-hidden="true"` correctly on decorative icons so screen readers skip them.

## 5. UI/UX Polishing for Inclusivity

-   **Motion Sensitivity:** Respect `prefers-reduced-motion` media queries by disabling or simplifying animations for affected users.
-   **Target Size:** Ensure all touch and click targets are at least 44x44 pixels to accommodate users with limited motor precision.
-   **Error Recovery:** Don't just turn a border red on error; add a text description of *what* happened and *how* to fix it.

## 6. Global a11y Invariants

-   **ZERO DIV-BUTTONS:** All button-like interactions MUST use the `<button>` tag or `role="button"` with keyboard listeners.
-   **VISIBLE FOCUS:** Never remove `outline: none;` without replacing it with a clearly visible, high-contrast custom focus state.
-   **LANGUAGE DEFINITION:** Ensure the `<html>` tag has a `lang` attribute to assist speech synthesis engines.

## Common Accessibility Anti-patterns and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **The Empty Link** | `<a href="..."> <svg /> </a>` | Add `aria-label` to the link or hidden text inside the tag. |
| **Form Ghosting** | Placeholder text used as the only label. | Use a visible `<label>` element that persists after the input is filled. |
| **Infinite Scrolling** | Screen readers get trapped in a loop of loading items. | Implement "Load More" buttons or clear keyboard landmarks for navigation. |
| **Icon-Only Menus** | Dashboard with 10 icons and no text. | Use Tooltips that are keyboard-accessible and provide `aria-labels`. |
