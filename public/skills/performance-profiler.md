---
name: performance-profiler
description: Advanced Core Web Vitals optimization, bundle engineering, and high-frequency rendering performance. Use this skill for building lightning-fast, production-grade web applications.
---

# Performance Engineering & Optimization

Performance is not an afterthought; it is a technical competitive advantage. To achieve "100x" better speed, move beyond "simple lazy loading" and into **Bundle Topology Analysis**, **Rendering Critical Path Optimization**, and **Network Payload Pruning**.

## 1. The Core Performance Protocol

A professional performance strategy follows the **A.I.O.** framework (Audit, Isolate, Optimize):

### Phase A: Bottleneck Audit (Core Web Vitals)
Identify the specific metrics that are lagging:
-   **LCP (Largest Contentful Paint):** Identify the largest visual element and prioritize its loading.
-   **INP (Interaction to Next Paint):** Measure the delay between a user action and the visual update.
-   **CLS (Cumulative Layout Shift):** Detect unexpected jumps in layout during the load cycle.

### Phase B: Logical Isolation (The "Cost" Map)
Break down the execution overhead:
-   **Bundle Cost:** Map out which third-party libraries are bloating the initial JavaScript payload.
-   **Render Cost:** Identify React components that are re-rendering unnecessarily.
-   **Data Cost:** Analyze the size and frequency of API responses.

### Phase C: Surgical Optimization
Implement targeted fixes based on the bottleneck:
-   **Payload Pruning:** Replace heavy libraries with lightweight alternatives or native browser APIs.
-   **Dynamic Importation:** Move non-critical components to code-split chunks.
-   **Cache Strategy:** Implement SWR (Stale-While-Revalidate) or aggressive HTTP caching.

## 2. Advanced Optimization Frameworks

| Framework | Best For... | Implementation Detail |
| :--- | :--- | :--- |
| **Lazy Loading 2.0** | Images and heavy widgets. | Use `IntersectionObserver` to trigger loads *just before* the element enters the viewport. |
| **Memoization Strategy** | Complex React UIs. | Use `useMemo` for heavy derived data and `useCallback` to prevent child component re-renders. |
| **Network Batching** | High-frequency API calls. | Use `Promise.all()` to fire independent requests in parallel rather than serial. |
| **Critical-Path CSS** | Instant First Paint. | Inline the CSS required for above-the-fold content while deferring the rest. |

## 3. Implementation: The Performance Audit Blueprint

When presenting optimizations, provide a **Performance Impact Delta**.

```markdown
### ⚡ Performance Optimization Results
| Bottleneck | Before | After | Optimization Applied |
| :--- | :--- | :--- | :--- |
| Initial Bundle | 1.2MB | 320KB | Code-splitting + library pruning. |
| Time-to-Interactive | 4.8s | 1.2s | Lazy-loading non-critical JS. |
| Layout Shift | 0.25 | 0.01 | Fixed dimension placeholders for images. |
| Data Loading | 1.5s | 0.4s | Moved to Parallel `Promise.all` fetching. |
```

## 4. Stability & Fluidity Guardrails

> [!CAUTION] **The "Library Bloat" Trap**: Installing a 50KB library for a simple 10-line utility function is the primary cause of slow web apps. Always check library sizes on `bundlephobia.com`.

**The Performance Integrity Checklist:**
1.  **Image Optimization:** Use modern formats (`WebP/AVIF`) and ensure all images have `width/height` attributes to prevent CLS.
2.  **Debouncing & Throttling:** Always wrap search inputs or resize listeners in a debounce/throttle function to prevent event loop exhaustion.
3.  **Third-Party Scrutiny:** Regularly audit Google Analytics, FB Pixels, and Chat Widgets—these are often the heaviest parts of the page.
4.  **Local State over Global:** Keep state as "close" to the component as possible to minimize the re-render radius.

## 5. Implementation Samples

### Parallel Data Fetching
```ts
// src/lib/data.ts
export const fetchDashboardData = async () => {
  // 100x Faster: Running independent calls in parallel
  const [user, posts, analytics] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchAnalytics()
  ]);
  return { user, posts, analytics };
};
```

## 6. Global Performance Invariants

-   **MEASURE BEFORE OPTIMIZING:** Never assume you know what's slow. Use Chrome DevTools (Network and Profiler) to find the truth.
-   **USER PERCEPTION MATTERS:** If you can't make it faster, use skeleton loaders or optimistic UI updates to make it *feel* faster.
-   **TRANSITION SMOOTHNESS:** Aim for 60fps (16.6ms per frame) during animations. Avoid animating properties that trigger "Layout" (e.g., `width`, `top`); use `transform` instead.

## Common Performance Regressions and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Waterfall Loading** | Page loads in "steps," taking forever to settle. | Replace sequential `await` calls with `Promise.all`. |
| **Phantom Re-renders** | Typing in an input slows down the whole app. | Use `React.memo` or move the input's state to its own local component. |
| **Zombie Dependencies** | Unused code is still being shipped to the browser. | Run a tree-shaking audit and remove unused exports. |
| **The "Heavy Asset" Crash** | Large PDFs or 4K images freeze the browser. | Use worker threads or stream data for extremely large files; resize images on the server. |
