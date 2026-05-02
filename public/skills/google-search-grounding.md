---
name: google-search-grounding
description: Advanced real-time intelligence gathering and verification. Use this skill for deep research, fact-checking, and tracking fast-moving events.
---

# Google Search Grounding & Web Intelligence

Google Search Grounding transforms an AI from a static knowledge base into a real-time intelligence engine. When implementing or using this skill, prioritize **verification**, **recency**, and **triangulation** over simple retrieval.

## 1. The Multi-Stage Intelligence Protocol

To achieve "100x" better results than a single prompt, follow the **Recursive Intelligence Loop**:

### Phase A: Query Decomposition (Atomic Gaps)
Never search for a complex user prompt directly. Break it into individual "Information Gaps":
- **Contextual Baseline:** "What is the current state of X?"
- **Delta/Recent Changes:** "What happened to X in the last 24 hours?"
- **Expert Consensus:** "What do domain experts say about X?"

### Phase B: Search Pass 1 (Broad Scan)
Execute broad queries to identify key entities, dates, and conflicting narratives. 
> [!TIP] Use search operators like `site:news.google.com "topic"` or `"topic" after:2024-01-01` to force recency.

### Phase C: Search Pass 2 (Deep Dive & Verification)
Target the specific contradictions or gaps found in Pass 1. If Source A says "Yes" and Source B says "No," the second pass must specifically look for the "Why" behind the contradiction.

## 2. Implementation: The `google_search` Function

When using standard AI SDKs (like Gemini or OpenAI), the `google_search` tool should be implemented with robust error handling and structured output.

```ts
// Example: Advanced Search Tool Implementation
export async function googleSearch(query: string) {
  try {
    // 1. Sanitize & Engineering: Add "filetype:pdf" or "site:.gov" if looking for reports
    const refinedQuery = `${query} -site:pinterest.com -site:instagram.com`;

    const response = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(refinedQuery)}&api_key=${process.env.SERPAPI_KEY}`);
    
    if (!response.ok) throw new Error(`Search API failed: ${response.statusText}`);
    
    const data = await response.json();

    // 2. Extract structured snippets
    return data.organic_results.slice(0, 5).map(result => ({
      title: result.title,
      snippet: result.snippet,
      link: result.link,
      source: result.displayed_link,
      date: result.date || 'Unknown'
    }));
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return { error: "Failed to retrieve real-time data." };
  }
}
```

## 3. Advanced Query Engineering Patterns

| Intent | Pattern | Optimization |
| :--- | :--- | :--- |
| **Fact Checking** | `"Claim text" OR "debunked" OR "verification"` | Target contradictions immediately. |
| **Technical Research** | `site:github.com OR site:stackoverflow.com "error message"` | Focus on code repositories. |
| **Market Data** | `filetype:pdf "industry report" 2024` | Force primary document retrieval. |
| **Breaking News** | `"event" -inurl:2023 -inurl:2022` | Filter out old archives. |

## 4. The Triangulation Method (Truth Guardrails)

> [!CAUTION] **The "One-Source" Trap**: Never report a claim as "Fact" if it only appears in one search snippet, especially for controversial topics.

**The Verification Checklist:**
1.  **Identify 3 Independent Sources:** (e.g., a news site, an official blog, and a technical repo).
2.  **Check Internal Consistency:** Do the dates and figures align across all three?
3.  **Cross-Reference Snippets:** Does the "snippet" text actually support the "title"? Hallucinations often start with title/snippet mismatches.

## 5. Handling "No Results" or Ambiguity

If the search yields nothing relevant, do **not** revert to the AI's internal pre-trained knowledge without warning. Use the following tiered response logic:

1.  **Acknowledge the Gap:** "My real-time search for [Topic] returned no authoritative results from the last 24 hours."
2.  **State the 'Last Known' State:** "Based on my internal knowledge (cutoff: [Date]), the status was X, but this may be outdated."
3.  **Propose a Pivot:** "Would you like me to broaden the search to related events in [related industry]?"

## 6. Hallucination Guardrails for Citations

When synthesizing search results, use **Explicit Attribution**:

- **Good:** "According to the official Cloudflare blog [1], the new Workers limit is 10MB." 
- **Bad:** "The Workers limit has been increased to 10MB." (Implicit knowledge).

### Source Mapping Template
Always append a "Sources" block at the end of grounded responses:
```markdown
### Sources
[1] https://blog.cloudflare.com/new-limits (Published: 2024-04-15)
[2] https://news.ycombinator.com/item?id=... (Discussion)
```

## Common Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Recency Bias** | Reporting news from 3 years ago as "today." | Include current year in the query dynamically. |
| **Source Poisoning** | Citing a SEO-farm or AI-generated news site. | Add `-site:bgr.com -site:theverge.com` (exclude low-signal). |
| **Circular Citations** | Source A cites Source B, which cites Source A. | Trace back to the *original* press release or data repo. |
| **Query Narrowing** | Searching for "X is better than Y" (biased). | Search for "Comparison of X and Y" (neutral). |
