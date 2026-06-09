# Design Specification: BizSim UI Refinement & Animated BI Dashboard Charts

**Date:** 2026-06-09  
**Status:** Approved  
**Topic:** Month Dropdown, Input Prefix, Full-Width Light Navbar, Animated BI Charts

---

## 1. Goal & Product Vision
This specification outlines the visual and interaction updates to improve the user experience and visual polish of the BizSim web application:
1. **Smarter Month Selection**: Replace text inputs for logging monthly periods with a structured Month/Year dropdown menu.
2. **Form Layout Fix**: Resolve overlapping text styling in currency inputs ("Rp" prefix overlapping placeholder text) by modifying visual grid structures and input paddings.
3. **Navbar Restyling**: Adopt the structural layout and uppercase tracking styles of the reference navbar, while maintaining the established white-blue design system.
4. **Animated BI Dashboard Charts**: Revamp the bar and line charts to resemble premium analytics tools, featuring grids, Y-axis scales, hover details, and fluid entrance animations.

---

## 2. Proposed Changes

### A. Dashboard Period Dropdown (`app/dashboard/page.tsx`)
* **Target state**: A side-by-side pair of selectors (Month and Year) default-initialized to the current Indonesian month and year. On submit, they are concatenated (e.g. `"Maret 2026"`).

### B. Currency Form Spacing Repair (`components/SimForm.tsx`)
* **Target state**: Inputs wrapped in a `relative flex items-center` container. Prefix `Rp` with a vertical divider is placed absolutely inside. Inputs have a left-padding of `style={{ paddingLeft: '46px' }}`.

### C. Full-Width Navigation Restyling (`components/Navigation.tsx`)
* **Target state**: A full-width rectangular header bar with uppercase bold links (`tracking-wider text-[11px] font-bold uppercase`), a minimalist brand logo, and system status controls.

### D. Animated BI/Analytic Dashboard Charts
#### 1. Monthly Cash Flow Bar Chart (`app/dashboard/page.tsx`)
* **Structure & Spacing**:
  * Expand the chart container to render an explicit Y-axis on the left (e.g. labels: `Rp 50Jt`, `Rp 25Jt`, `0`).
  * Add 3-4 subtle, dashed horizontal gridlines (`stroke-dasharray="3 3"` in gray-200) in the background.
  * Increase bar width to a robust `16px` width with `rx="4"` (4px rounded corners) at the top of each bar.
  * Align labels and legends cleanly.
* **Entrance Animations**:
  * Apply a keyframe vertical scale animation (`@keyframes growVertical`) with `transform-origin: bottom` and cubic-bezier easing to make the bars grow fluidly when the chart loads.
* **Interactive States**:
  * Highlight bars with opacity on hover. Add tooltip indicators displaying exact rupiah amounts.

#### 2. Working Capital Runway Line/Area Chart (`components/ResultCard.tsx`)
* **Structure & Spacing**:
  * Smooth out the path using a clean, thinner line (`strokeWidth="2.5"` instead of a thick outline) with a blue color.
  * Add a subtle, fading background area gradient (`fill="url(#chartGradient)"` from light-blue `#2563eb` with `0.1` opacity to transparent `0` at the bottom).
  * Reduce marker sizes and style them elegantly: small white circles with a blue outline (`stroke="#2563eb" fill="#ffffff" strokeWidth="2" r="4"`).
  * Align labels and add dashed horizontal gridlines.
* **Entrance Animations**:
  * Animate the SVG line drawing effect using `stroke-dasharray` and `stroke-dashoffset` keyframes (`@keyframes drawLine`) to draw the curve from left to right.
  * Stagger the Point markers (`circle` elements) to pop in sequentially.

---

## 3. Verification Plan
* **Visual Inspection**: Open the browser subagent and verify:
  1. The layout at `/simulasi` has no prefix overlaps (the "Rp" prefix is properly padded).
  2. The dashboard form features Month and Year dropdowns.
  3. The header is a full-width header with uppercase navigation links.
  4. Both the bar chart and the line chart render with proper Y-axis helper scales, horizontal grid lines, and smooth path/bar entrance animations.
* **TypeScript & Compilation**: Execute `npm run build` in the workspace to verify there are no compilation errors.
