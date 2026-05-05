---
name: python-excel-architect
description: Advanced Excel spreadsheet engineering using Python and openpyxl. Use this skill to generate sophisticated reports, configure office-style formatting, conditional formatting, charts, data validation, pane freezing, and row grouping.
tags: [python, excel, openpyxl, automation, data-analysis, reporting, charts]
---
# Python Excel Architect (`openpyxl` Guidelines)

This skill provides ultra-detailed instructions for generating sophisticated, office-style Excel spreadsheets using Python's `openpyxl` library. When a user requests an automated Excel report, Python script for spreadsheets, or a data export tool using `.xlsx`, you MUST apply these advanced structural and visual rules.

## 1. Core Environment Setup
- Always strictly use `openpyxl` for native `.xlsx` generation.
- Provide complete script snippets, including required imports:
  ```python
  from openpyxl import Workbook
  from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
  from openpyxl.worksheet.datavalidation import DataValidation
  from openpyxl.formatting.rule import CellIsRule, ColorScaleRule
  from openpyxl.chart import BarChart, LineChart, Reference
  ```
- Use `wb = Workbook()` to initialize and `wb.save("filename.xlsx")` to output.

## 2. Office-Style Formatting
Never leave cells raw. Use professional Microsoft Office-standard formatting for all reports:
- **Header Rows**: Set text to Bold, White. Use a corporate background fill (e.g., dark blue `1F4E78` or dark grey `595959`).
- **Borders**: Apply `thin` gray or black borders to all data ranges using `Side(border_style="thin", color="000000")`.
- **Alignment**: Center-align headers; right-align numbers; left-align strings.
- **Number Formatting**: Apply explicit number formats.
  - Currency: `ws['A1'].number_format = '"$"#,##0.00'`
  - Dates: `ws['A1'].number_format = 'YYYY-MM-DD'`
- **Column Widths**: Auto-adjust or manually set column widths so data is readable (`ws.column_dimensions['A'].width = 25`).

## 3. Data Validation
Enforce data integrity strictly during UI-less spreadsheet generation:
- Create `DataValidation` objects for dropdowns, date limits, or numeric bounds.
- Example (Dropdown list): `dv = DataValidation(type="list", formula1='"Option1,Option2"', allow_blank=True)`
- Example (Numeric bound): `dv = DataValidation(type="whole", operator="between", formula1=1, formula2=100)`
- Always apply the validation to specific cell ranges: `dv.add("B2:B100")`.
- Add to worksheet: `ws.add_data_validation(dv)`.

## 4. Conditional Formatting
Make the data visually intuitive. Use `ws.conditional_formatting.add()`:
- **Heatmaps**: Use `ColorScaleRule` for heatmaps on numerical columns.
- **Outlier Highlights**: Use `CellIsRule` to highlight outliers (e.g., red background for negative numbers, green for positive).
  ```python
  redFill = PatternFill(start_color='FFC7CE', end_color='FFC7CE', fill_type='solid')
  ws.conditional_formatting.add("C2:C100", CellIsRule(operator='lessThan', formula=['0'], fill=redFill))
  ```

## 5. Charts and Visualizations
Always embed visual summaries of the data within the same workbook (often on a separate "Dashboard" sheet or at the top).
- **Bar Charts / Line Charts**: Use `BarChart()` or `LineChart()`.
- **Data References**: Use `Reference(ws, min_col=..., min_row=..., max_col=..., max_row=...)` to bind chart data dynamically.
- **Styling**: Set `chart.style = 11` (or similar standard Office styles).
- Always set X and Y axis titles, chart title, and position the chart explicitly using `ws.add_chart(chart, "E5")`.

## 6. Advanced Structure: Grouping, Freezing Panes & Pivot Tables
Make the sheet natively navigable for business users.
- **Freezing Panes**: Always freeze the header row and/or key identifier columns so they remain visible while scrolling. 
  - `ws.freeze_panes = "A2"` (Freezes row 1).
  - `ws.freeze_panes = "B2"` (Freezes Row 1 and Col A).
- **Grouping Rows/Columns**: Group granular data so users can collapse/expand it to see high-level summaries.
  - `ws.row_dimensions.group(2, 10, hidden=True)`
- **Pivot Tables Configuration**:
  - *Note*: Fully creating responsive Pivot Caches purely in native `openpyxl` requires complex XML cache definitions. 
  - *Best Practice*: For automated scripts, compute the aggregated pivot data using `pandas.pivot_table()`, write the results to a "Summary" worksheet using `openpyxl`, and apply grouping, conditional formatting, and charts to that summary sheet so it accurately mimics the functionality and aesthetics of an active Pivot Table.
