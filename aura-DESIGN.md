---
version: alpha
name: "Aura Light"
description: "Primary visual anchor uses #ffffff with page and card surface background. Typography baseline relies on Inter for hero headline — 'create beautiful designs'."
colors:
  background: "#ffffff"
  secondary-surface: "#f5f5f5"
  surface-muted: "#fafafa"
  foreground: "#171717"
  medium-gray: "#525252"
  muted-text: "#737373"
  primary-action: "#171717"
  primary-foreground: "#fafafa"
  subtle-text: "#a3a3a3"
  border: "#e6e6e6"
typography:
  display-hero:
    fontFamily: "Inter"
    fontSize: "60px"
    fontWeight: "500"
    lineHeight: "60px"
    letterSpacing: "-3px"
  section-heading:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: "500"
    lineHeight: "28px"
    letterSpacing: "-0.45px"
  body-default:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
    letterSpacing: "-0.16px"
  body-small:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "20px"
    letterSpacing: "-0.16px"
  label-default:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: "400"
    lineHeight: "16px"
    letterSpacing: "-0.16px"
  label-medium:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: "500"
    lineHeight: "16px"
    letterSpacing: "-0.16px"
  caption:
    fontFamily: "Inter"
    fontSize: "10px"
    fontWeight: "400"
    lineHeight: "15px"
    letterSpacing: "-0.16px"
  caption-medium:
    fontFamily: "Inter"
    fontSize: "10px"
    fontWeight: "500"
    lineHeight: "15px"
    letterSpacing: "-0.16px"
  eyebrow-light:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: "100"
    lineHeight: "28px"
    letterSpacing: "-0.16px"
rounded:
  radius-sm: "6px"
  radius-md: "8px"
  radius-base: "12px"
  radius-lg: "16px"
  radius-pill: "9999px"
spacing:
  space-1: "2px"
  space-2: "4px"
  space-3: "6px"
  space-4: "8px"
  space-5: "12px"
  space-6: "16px"
  space-7: "18px"
  space-8: "24px"
  space-9: "32px"
  space-10: "40px"
  space-11: "48px"
  space-12: "64px"
  space-sidebar: "192px"
  space-panel: "224px"
---

## Overview

Primary visual anchor uses #ffffff with page and card surface background. Typography baseline relies on Inter for hero headline — 'create beautiful designs'.

This system uses a 4px base grid with scale values 2, 4, 6, 8, 12, 16, 24, 32, 40, 48, 64.

**Signature traits:**
- Core token rhythm: Token evidence indicates consistent color, spacing, and radius rhythm across visible UI.

## Colors

The palette uses 10 validated color tokens across 1 theme profile. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**
- **surface-primary** maps to `background`: Role "primary" is grounded by usage context "Page and card surface background".
- **action-text** maps to `foreground`: Role "text" is grounded by usage context "Primary heading and body text, nav links".
- **content-text** maps to `muted-text`: Role "text" is grounded by usage context "Secondary text, nav items, placeholder text, icon labels".
- **action-border** maps to `border`: Role "border" is grounded by usage context "Dividers, card outlines, input borders, button borders".

### Primary Brand
- **Background** (#ffffff): Page and card surface background. Role: primary. {authored: rgb(255, 255, 255), space: rgb, alpha: 0.2}

### Text Scale
- **Foreground** (#171717): Primary heading and body text, nav links. Role: text. {authored: rgb(23, 23, 23), space: rgb}
- **Medium Gray** (#525252): Mid-weight secondary text, footer text. Role: text. {authored: rgb(82, 82, 82), space: rgb}
- **Muted Text** (#737373): Secondary text, nav items, placeholder text, icon labels. Role: text. {authored: rgb(115, 115, 115), space: rgb}
- **Primary Action** (#171717): Primary button fill, strong CTA backgrounds. Role: text. {authored: rgb(23, 23, 23), space: rgb}
- **Primary Foreground** (#fafafa): Text on primary dark buttons. Role: text. {authored: rgb(250, 250, 250), space: rgb, alpha: 0.3}
- **Subtle Text** (#a3a3a3): Tertiary text, captions, disabled states. Role: text. {authored: rgb(163, 163, 163), space: rgb}

### Interactive
- **Border** (#e6e6e6): Dividers, card outlines, input borders, button borders. Role: border. {authored: rgb(230, 230, 230), space: rgb, alpha: 0.3}

### Surface & Shadows
- **Secondary Surface** (#f5f5f5): Muted/secondary UI surfaces, hover states. Role: background. {authored: rgb(245, 245, 245), space: rgb}
- **Surface Muted** (#fafafa): Card and sidebar backgrounds, subtle section fills. Role: background. {authored: rgb(250, 250, 250), space: rgb, alpha: 0.3}

## Typography

Typography uses Inter across extracted hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Uses Inter throughout for a uniform feel. Weight range spans medium, regular, light. Sizes range from 10px to 60px.

### Type Scale Evidence
| Role | Font | Size | Weight | Line Height | Letter Spacing | Stack / Features | Notes |
|------|------|------|--------|-------------|----------------|------------------|-------|
| Hero headline — 'Create beautiful designs' | Inter | 60px | 500 | 60px | -3px | Inter, sans-serif; features: "calt", "rlig", "salt", "ss01", "ss02" | Extracted token |
| Section titles and sub-headings | Inter | 18px | 500 | 28px | -0.45px | Inter, sans-serif; features: "calt", "rlig", "salt", "ss01", "ss02" | Extracted token |
| Primary body copy, nav links, general UI text | Inter | 16px | 400 | 24px | -0.16px | Inter, sans-serif; features: "calt", "rlig", "salt", "ss01", "ss02" | Extracted token |
| Secondary body text, input text, card descriptions | Inter | 14px | 400 | 20px | -0.16px | Inter, sans-serif; features: "calt", "rlig", "salt", "ss01", "ss02" | Extracted token |
| UI labels, chip text, small tags | Inter | 12px | 400 | 16px | -0.16px | Inter, sans-serif; features: "calt", "rlig", "salt", "ss01", "ss02" | Extracted token |
| Emphasized labels, button text in chips | Inter | 12px | 500 | 16px | -0.16px | Inter, sans-serif; features: "calt", "rlig", "salt", "ss01", "ss02" | Extracted token |
| Micro-labels, badge text, metadata | Inter | 10px | 400 | 15px | -0.16px | Inter, sans-serif; features: "calt", "rlig", "salt", "ss01", "ss02" | Extracted token |
| Emphasized micro-labels, active badge text | Inter | 10px | 500 | 15px | -0.16px | Inter, sans-serif; features: "calt", "rlig", "salt", "ss01", "ss02" | Extracted token |
| Thin-weight eyebrow or announcement text | Inter | 18px | 100 | 28px | -0.16px | Inter, sans-serif; features: "calt", "rlig", "salt", "ss01", "ss02" | Extracted token |

## Layout

Responsive system uses 4 breakpoint tier(s): mobile, tablet, desktop, wide.

### Responsive Strategy
- **mobile (360-640px)**: Constrain layout for small viewports and prioritize vertical stacking.
- **tablet (>= 640px)**: Increase spacing and column structure for medium-width viewports.
- **desktop (>= 1024px)**: Expand layout density and horizontal composition for wide viewports.
- **wide (>= 1536px)**: Stretch composition with generous gutters and wider layout spans.

### Spacing System
| Token | Value | Px | Notes |
|------|-------|----|-------|
| space-1 | 2px | 2 | Extracted spacing token |
| space-2 | 4px | 4 | Mapped to --space |
| space-3 | 6px | 6 | Extracted spacing token |
| space-4 | 8px | 8 | Extracted spacing token |
| space-5 | 12px | 12 | Extracted spacing token |
| space-6 | 16px | 16 | Extracted spacing token |
| space-7 | 18px | 18 | Extracted spacing token |
| space-8 | 24px | 24 | Extracted spacing token |
| space-9 | 32px | 32 | Extracted spacing token |
| space-10 | 40px | 40 | Extracted spacing token |
| space-11 | 48px | 48 | Extracted spacing token |
| space-12 | 64px | 64 | Extracted spacing token |
| space-sidebar | 192px | 192 | Extracted spacing token |
| space-panel | 224px | 224 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence
| Shadow Token | Layers | Details |
|--------------|--------|---------|
| n/a | 0 | No validated shadow payload |

### Interaction Signals
| Theme | Signal | Evidence |
|-------|--------|----------|
| Light | backdrop-filter | blur(4px) ; blur(8px) ; blur(24px) |
| Light | outline-style | solid |
| Light | outline-color | rgb(23, 23, 23) ; rgb(115, 115, 115) ; rgb(163, 163, 163) |
| Light | outline-width | 3px ; 2px |
| Light | outline-offset | 0px ; 2px |
| Light | transform | matrix(1, 0, 0, 1, 0, 10) ; matrix(1, 0, 0, 1, 0, 0) ; matrix(1, 0, 0, 1, 25, 0) |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles
| Token | Value | Px | Role Mapping |
|------|-------|----|--------------|
| radius-sm | 6px | 6 | Subtle corner |
| radius-md | 8px | 8 | Control corner |
| radius-base | 12px | 12 | Control corner |
| radius-lg | 16px | 16 | Card corner |
| radius-pill | 9999px | 9999 | Large surface corner |

### Geometry Evidence
| Radius Token | Shape | Units |
|--------------|-------|-------|
| radius-sm | 6px | px |
| radius-md | 8px | px |
| radius-base | 12px | px |
| radius-lg | 16px | px |
| radius-pill | 9999px | px |

## Components

(none detected)

## Do's and Don'ts

Guardrails protect Core token rhythm without adding unsupported visual claims.

| Do | Don't |
|----|---------|
| Do maintain consistent spacing using the base grid | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text) | Don't mix rounded and sharp corners in the same view |
| Do use the primary color only for the single most important action per screen |  |
| Do verify evidence before writing new design-system guidance |  |

## Responsive Evidence

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <= 600px | (max-width: 600px) |
| Mobile | <= 640px | (max-width: 640px) |
| Mobile | >= 360px | (min-width: 360px) |
| Mobile | >= 640px | (min-width: 640px) |
| Tablet | >= 768px | (min-width: 768px) |
| Desktop | >= 1024px | (min-width: 1024px) |
| Desktop | >= 1280px | (min-width: 1280px) |
| Desktop | >= 1400px | (min-width: 1400px) |
| Desktop | >= 1536px | (min-width: 1536px) |
| Breakpoint 10 | Unknown | (prefers-reduced-motion: reduce) |

## Agent Prompt Guide

### Example Component Prompts
- Create button component using validated primary color role and spacing tokens.
- Create card component with mapped radius role and evidence-backed elevation.
- Create form input component using inferred typography hierarchy and border roles.

### Iteration Guide
1. Start with extracted palette and typography roles only.
2. Map spacing and radius directly from token tables before visual polish.
3. Apply component patterns one section at a time and compare against source intent.
4. Keep elevation claims tied to explicit evidence in output.
5. Iterate with smallest diffs and re-check section hierarchy after each change.
