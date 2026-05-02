---
name: rate-limiting-officer
description: Advanced traffic control and resource exhaustion protection. Use this skill for designing sliding-window limiters, IP-based blocking, and DDoS mitigation strategies.
---

# Rate Limiting Officer: Traffic & Resource Engineering

Rate Limiting is the shield against "Denial of Wallet" and service exhaustion attacks. To achieve "100x" better availability, move beyond "requests per minute" and into **Token Bucket Algorithms**, **Distributed State Limiting**, and **Adaptive Throttling**.

## 1. The Traffic Control Protocol

Engineer resilient limits through the **L.I.M.I.T.** (Load, Identify, Monitor, Intercept, Threshold) framework:

### Phase A: Identity Scoping (Identify)
Define who is being limited:
-   **IP-Based Leaking:** Group unauthenticated traffic by source IP or CIDR block.
-   **User-Tier Scoping:** Apply different limits for `Free` vs `Pro` users via JWT claims.

### Phase B: Distributed State Management (Load)
Limiting across clusters:
-   **Redis/Memcached Backends:** Store hits in centered, ultra-fast memory stores to ensure limits persist across multiple instances.
-   **Atomic Increments:** Use `INCR` and `EXPIRE` commands to avoid race conditions in high-traffic spikes.

### Phase C: Algorithm Selection (Monitor)
Choose the right geometry:
-   **Sliding Window Log:** Precise but memory intensive; best for low-volume, high-value endpoints.
-   **Token Bucket:** Allows for "bursty" traffic while maintaining a steady long-term rate.

### Phase D: Interception & Feedback (Intercept)
The "Cool Down" UX:
-   **429 Too Many Requests:** Strictly return the correct HTTP code with a `Retry-After` header.
-   **Exponential Backoff:** Communicate to the client exactly how they should back off.
