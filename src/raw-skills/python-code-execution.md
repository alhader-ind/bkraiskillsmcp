---
name: python-code-execution
description: Advanced sandboxed data analysis, mathematical modeling, and visualization. Use this skill for complex calculations, chart generation, and data processing.
---

# Python Code Execution & Sandboxed Intelligence

Python Code Execution turns an AI into a precise computational engine. Use this skill to move beyond "probabilistic guessing" (LLM logic) and into "deterministic verification" (Runtime logic). Prioritize **reproducibility**, **error resilience**, and **visual clarity**.

## 1. The Advanced Execution Protocol

To achieve "100x" better results, follow the **Computational Loop**:

### Phase A: Problem Modeling (Pseudo-Code)
Before writing a single line of Python, define the mathematical or logical model. Identify:
- **Inputs:** What data is being processed? (JSON, CSV text, raw numbers).
- **Transformation:** Which libraries are required? (Pandas for tables, Matplotlib for charts).
- **Success Metric:** What does the final output look like? (A single float, a clean table, a PNG buffer).

### Phase B: Recursive Debugging (The Exception Loop)
Never treat the first execution as the final one.
1. **Initial Run:** Execute the core logic.
2. **Error Capture:** If an `ImportError` or `ValueError` occurs, analyze the stack trace immediately.
3. **Self-Correction:** Rewrite the code to handle null values, type mismatches, or missing columns.

### Phase C: Data Presentation
Don't just output raw numbers. Format the results:
- **Summary Statistics:** Mean, Median, Std Dev.
- **Visualizations:** Use `plt.tight_layout()` and consistent labels.
- **Narrative Context:** Explain *what* the calculated number means in the user's context.

## 2. Implementation: The `python_runtime` Schema

When calling a Python tool, ensure the code is "Ready-for-Runtime" (RFR).

```python
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

def analyze_and_plot(data_json):
    try:
        # 1. Load Data
        df = pd.DataFrame(data_json)
        
        # 2. Calculation
        summary = df.describe().to_dict()
        
        # 3. Visualization
        plt.figure(figsize=(10, 6))
        df.plot(kind='line')
        plt.title("Data Trends")
        
        # 4. Save to Buffer (for AI Studio/Web)
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        
        return {"summary": summary, "chart": img_base64}
    except Exception as e:
        return {"error": str(e)}
```

## 3. Advanced Mathematical & Analysis Patterns

| Intent | Pattern | Optimization |
| :--- | :--- | :--- |
| **Statistical Testing** | `scipy.stats.ttest_ind` | Ensure sample sizes are valid before testing. |
| **TimeSeries Forecast** | `numpy.polyfit` | Use higher-order polynomials for non-linear trends. |
| **Complex Regex** | `re.compile(pattern).finditer` | Pre-compile patterns for large text blobs. |
| **Financial Math** | `numpy.irr` or `npv` | Handle varying cashflow lengths dynamically. |

## 4. Sandbox Constraints & Security (Air-Gapped Ops)

> [!CAUTION] **Air-Gapped Environment**: The Python sandbox has NO network access. You cannot `pip install` or `requests.get` at runtime.

**Standard Library Checklist:**
- **Data:** `pandas`, `numpy`, `scipy`.
- **Viz:** `matplotlib`, `seaborn`, `plotly` (static).
- **Core:** `math`, `statistics`, `re`, `datetime`, `itertools`.
- **Missing:** Database drivers (Postgres), External APIs, OS-level subprocessing.

## 5. Visual Excellence (Chart Design Recipes)

When generating charts, follow these high-fidelity rules:
1.  **DPI awareness:** Use `plt.figure(dpi=100)`.
2.  **Color Schemes:** Use color-blind friendly palettes (`viridis`, `magma`).
3.  **Labeling:** Every axis must have a label AND a unit (e.g., "Revenue ($USD)").
4.  **Annotate:** Use `plt.annotate()` for outliers or major trend shifts.

## 6. Common Failure Modes and Solutions

| Problem | Symptom | Fix |
| :--- | :--- | :--- |
| **Type Confusion** | `TypeError: list indices must be integers...` | Use `print(type(var))` to verify data structure before indexing. |
| **Memory Overflow** | `MemoryError` during large data processing. | Process data in chunks or use `df.astype('category')` for strings. |
| **Silent Failures** | Incorrect calculation but no error. | Write `assert` statements inside the code to verify intermediate values. |
| **Chart Clipping** | Legend covers data points. | Use `plt.legend(bbox_to_anchor=(1.05, 1))` to move legend outside. |
