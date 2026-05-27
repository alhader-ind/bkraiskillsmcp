---
id: mobile-ux-arch
name: Mobile UX Architecture
description: Advanced guidelines for building production-ready mobile-first interfaces in React. Focuses on safe portals, responsive navigation, and high-fidelity interaction patterns.
version: 1.0.0
tags: [ui, ux, mobile, react, design]
---

# Mobile UX Architecture Skill

This skill provides a standardized framework for delivering "zero-mistake" mobile experiences within the SkillsGem ecosystem. Use this when building or refactoring interfaces that must perform flawlessly on mobile devices while maintaining desktop elegance.

## 1. The Portal Mandate (Modal Integrity)

**CRITICAL:** Never render overlay components (Modals, Popovers, Drawers) inline within the component tree if there is any risk of overflow clipping or z-index wars.

### The Problem
Nested `overflow-hidden` containers or relative parents can crop modals, making them unusable.

### The Solution: React Portals
Always use `createPortal` to attach the UI to the `document.body`.

```tsx
import { createPortal } from 'react-dom';

export function MyModal({ children }) {
  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl">
        {children}
      </div>
    </div>
  );
  
  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}
```

## 2. Positioning & Centering

- **Mobile:** Modals should be centered with a standard padding (e.g., `p-4`) to ensure they don't hit the screen edges.
- **Scrolling:** Use `max-h-[85vh] overflow-y-auto` on the modal body to prevent content from being unreachable on small screens.
- **Backdrop:** Use a heavy backdrop (`bg-neutral-950/90`) with `backdrop-blur` to isolate the user from the background noise.

## 3. Responsive Navigation Bridge

- **Desktop (md+):** Vertical sidebars are preferred.
- **Mobile (<md):** Bottom Navigation Bars are mandatory for primary routes.
- **Header:** Should be sticky (`h-14` or `h-16`) and provide a clear brand identity + user profile access.

## 4. The FAB Pattern (Floating Action Button)

For primary workflows (like "Add Transaction"):
- **Desktop:** Primary button in the header or top of the list.
- **Mobile:** Floating Action Button (FAB) at the bottom-right for thumb-accessibility.

## 5. Touch-First Inputs

- **Inputs:** Height should be at least `48px` to `56px`.
- **Buttons:** Large, rounded-2xl or rounded-full buttons.
- **Interactive States:** Use `active:scale-[0.98]` to provide tactile feedback without hover states.
- **Font Size:** Primary input text should be `16px` (text-base) to prevent iOS auto-zoom on focus.

## 6. Layout Density

- Avoid large margins on mobile. Use `px-4` instead of `px-8`.
- Stack grid columns: `grid-cols-1 sm:grid-cols-2`.
- Use `truncate` or `text-ellipsis` for long user info in restricted headers.
