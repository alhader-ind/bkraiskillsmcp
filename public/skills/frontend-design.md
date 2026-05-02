---
name: "frontend-design"
description: Advanced visual architecture, design systems orchestration, and performance-tuned UI recipes. Use this skill to build distinctive, high-fidelity interfaces across all web applications.
---

# Visual Architecture & Aesthetic Engineering

Frontend Design is the discipline of creating emotional resonance through functional interfaces. To achieve "100x" better visual results, move beyond "styling components" and into **Visual Rhythm**, **Hierarchy Orchestration**, and **Contextual Atmosphere**.

## 1. The Design Implementation Protocol (The "Mood-to-Markup" Loop)

A professional design doesn't happen by accident. Follow the **Aesthetic Synthesis lifecycle**:

### Phase A: Mood & Archetype Selection
Identify the "Soul" of the application before choosing colors:
-   **Archetype:** Is it an "Efficient Utility," a "Dramatic Editorial," or a "Cinematic Experience"?
-   **Typography Pairing:** Select fonts that reinforce the archetype (e.g., Mono for Technical, Serif for Luxury).
-   **Color Logic:** Define a palette based on psychological intent (e.g., Neon on Black for High-Energy/Brutalist).

### Phase B: Spatial Hierarchy & Rhythm
Define the "Flow" of information:
-   **Vertical Rhythm:** Use consistent but varied spacing (`mb-2`, `mb-8`, `mb-24`) to create a "scannable" path.
-   **Visual Anchors:** Identify the "Oversized" elements that ground the user.
-   **Structural Honesty:** Use grids and borders to celebrate the architecture rather than hiding it.

### Phase C: Interaction Physics (Micro-Moments)
Add the "Juice" that makes the UI feel alive:
-   **Transition Dynamics:** Use `motion/react` for entry animations and state changes.
-   **Stateful Feedback:** Implement hover, active, and focus states that provide immediate "Tactile" feedback.

## 2. Advanced Aesthetic Recipes

| Recipe | Archetype | Key Visual Signature |
| :--- | :--- | :--- |
| **Technical Dashboard** | "Mission Control" | Visible grids, monospace data, italic serif headers. |
| **Editorial Hero** | "Cover Story" | Massive typography (24vw), tight line-height (0.85), skewed transforms. |
| **Luxury Prestige** | "Concierge" | Serif fonts, warm off-white tones, oval masks, generous white space. |
| **Brutalist Creative** | "Experimental" | High-contrast neon, numbered columns, marquee animations, thick borders. |

## 3. Implementation: Technical Design Specs

When implementing a design, use the **Standard CSS-Variable Archetype**:

```css
:root {
  --f-sans: 'Inter', system-ui, sans-serif;
  --f-mono: 'JetBrains Mono', monospace;
  --f-display: 'Anton', 'Space Grotesk', sans-serif;
  
  --c-bg: #E4E3E0;
  --c-ink: #141414;
  --c-accent: #F27D26;
  
  --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Vertical Rhythm Utility */
.section-v-rhythm > * + * {
  margin-top: clamp(2rem, 5vw, 6rem);
}
```

## 4. Continuity & Fluidity Guardrails

> [!CAUTION] **The "Defaultism" Trap**: Standard shadows, generic blue/purple gradients, and identical spacing signal "Low-Quality AI Slop." Avoid them at all costs.

**The Design Integrity Checklist:**
1.  **Intentional Spacing:** Never use `p-4` on everything. Use `p-2` for micro-elements, `p-8` for cards, and `py-24` for sections.
2.  **Typography Contrast:** Ensure at least two levels of difference between Headings and Body (e.g., 64px Bold vs 16px Regular).
3.  **Active States:** Every button MUST have a clear `hover:` and `active:scale-95` state.
4.  **Responsive Fluidity:** Use `clamp()` for font sizes and widths to ensure smooth transitions between Desktop and Mobile.

## 5. UI Layout Archetypes for Developers

| Pattern | Best For... | Implementation Strategy |
| :--- | :--- | :--- |
| **The Bento Grid** | Dashboards / Portfolios | `grid grid-cols-1 md:grid-cols-12 gap-4`. |
| **The Split Pane** | SaaS Landers | `flex flex-col md:flex-row h-screen`. |
| **The Layered Index** | Content Rich Lists | `border-b border-ink/20 hover:bg-ink hover:text-bg`. |
| **The Sidebar Rail** | High-Density Tools | `w-16 hover:w-64 transition-all sticky top-0`. |

## 6. Global Design Invariants

-   **TYPE-DRIVEN:** If the design is failing, fix the typography first.
-   **STRUCTURE-FIRST:** Build the layout in black and white before adding color.
-   **MOBILE-FIRST CORE:** Ensure the logic works on small screens before scaling up.

## Common Design Failures and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Visual Noise** | Too many borders, shadows, and colors competing. | Remove 50% of borders and use whitespace to create separation. |
| **Muted Hierarchy** | All text looks roughly the same size/weight. | Increase Heading size and decrease Subtitle opacity (0.6). |
| **Scale Breakage** | Elements look "lost" on ultra-wide monitors. | Wrap content in `max-w-7xl mx-auto`. |
| **Dead Interface** | Buttons don't change state when hovered. | Add `transition-all duration-200` to all interactive elements. |
    particles) to improve game feel.

### 2.3. Responsiveness

-   **Scale to Fit**: The game view should often scale to fit the screen while
    maintaining its aspect ratio (letterboxing if necessary), rather than
    reflowing like a document.
