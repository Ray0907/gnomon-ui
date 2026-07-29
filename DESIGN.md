---
name: Gnomon UI
description: A calibration-lab interface system for accessible spatial primitives.
colors:
  mineral: "#f4f5f1"
  mineral-deep: "#e9ece7"
  white: "#fbfcf8"
  ink: "#10120f"
  ink-muted: "#5f655f"
  hairline: "rgba(16, 18, 15, 0.16)"
  hairline-strong: "rgba(16, 18, 15, 0.34)"
  cobalt: "#173fff"
  cobalt-deep: "#0827c9"
  acid: "#b8f500"
  acid-ink: "#557300"
  signal: "#ff3f24"
  axis-y: "#527b00"
  aluminum: "#b8bdb8"
typography:
  headline:
    fontFamily: "Archivo Variable, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(42px, 4.5vw, 68px)"
    fontWeight: 580
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  headline-narrow:
    fontFamily: "Archivo Variable, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(40px, 5vw, 58px)"
    fontWeight: 580
    lineHeight: 0.9
  headline-stacked:
    fontFamily: "Archivo Variable, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(46px, 10vw, 76px)"
    fontWeight: 580
    lineHeight: 0.9
  headline-mobile:
    fontFamily: "Archivo Variable, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(42px, 13vw, 66px)"
    fontWeight: 580
    lineHeight: 0.9
  headline-short:
    fontFamily: "Archivo Variable, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(40px, 4.2vw, 58px)"
    fontWeight: 580
    lineHeight: 0.9
  stage-display:
    fontFamily: "Archivo Variable, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(52px, 7.1vw, 112px)"
    fontWeight: 620
    lineHeight: 0.75
  stage-display-stacked:
    fontFamily: "Archivo Variable, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(58px, 12vw, 96px)"
    fontWeight: 620
    lineHeight: 0.75
  stage-display-mobile:
    fontFamily: "Archivo Variable, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "16vw"
    fontWeight: 620
    lineHeight: 0.75
  title:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 620
    lineHeight: 1
  brand:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 670
    lineHeight: 1
  brand-mobile:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 670
    lineHeight: 1
  body:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 420
    lineHeight: 1.5
  body-compact:
    fontFamily: "Archivo Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 420
    lineHeight: 1.45
  label:
    fontFamily: "JetBrains Mono Variable, SFMono-Regular, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 520
    lineHeight: 1
  label-fluid:
    fontFamily: "JetBrains Mono Variable, SFMono-Regular, Consolas, monospace"
    fontSize: "clamp(11px, 0.72vw, 12px)"
    fontWeight: 500
    lineHeight: 1.37
  label-sm:
    fontFamily: "JetBrains Mono Variable, SFMono-Regular, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
  label-xs:
    fontFamily: "JetBrains Mono Variable, SFMono-Regular, Consolas, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1
  label-xxs:
    fontFamily: "JetBrains Mono Variable, SFMono-Regular, Consolas, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1
  label-micro:
    fontFamily: "JetBrains Mono Variable, SFMono-Regular, Consolas, monospace"
    fontSize: "9px"
    fontWeight: 500
    lineHeight: 1
rounded:
  square: "0"
  control: "2px"
  object-device: "7px"
  object-textile: "8px"
  circle: "50%"
spacing:
  unit: "8px"
  page-gutter: "clamp(18px, 2.2vw, 36px)"
components:
  action-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 18px"
  tab-active:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
    height: "44px"
  inspector:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0"
---

# Design System: Gnomon UI

## Overview

**Creative North Star: "The Calibration Instrument"**

Gnomon UI feels designed by the people who build museum display systems and
precision developer tools. Mineral surfaces, cobalt structural fields, acid status
marks, aluminum display bases, rulers, axes, and square controls make the interface feel
physical without imitating a desktop editor.

Component anatomy and spatial output are one system. Lines explain selection,
measure, hierarchy, focus, or code-to-scene correspondence; they are never added as
technical decoration. The visual system is precise, direct, and quietly confident.

**Key Characteristics:**

- Bright mineral atmosphere with one committed cobalt structural field.
- Flat DOM surfaces connected to a dimensional, object-led WebGL stage.
- Archivo wayfinding paired with JetBrains Mono instrument readouts.
- Hairlines, registration marks, and measurement rails instead of floating cards.
- Framework code, semantic state, and spatial selection remain visibly connected.

## Colors

The palette is a bright calibration laboratory with cobalt structure, restrained
signals, and neutral physical materials.

### Primary

- **Structural Cobalt:** Owns active navigation, code fields, selection outlines,
  and primary documentation actions.
- **Deep Cobalt:** Carries pressed and high-contrast cobalt states.

### Secondary

- **Live Acid:** Marks ready, active, passing, and focus-ready states.
- **Signal Vermilion:** Belongs to authored demo-object details, not generic UI
  warnings.

### Neutral

- **Mineral Atmosphere:** The page and scene ground.
- **Deep Mineral:** Separates quiet physical planes.
- **Instrument White:** The cleanest DOM panels and inspector surfaces.
- **Calibration Ink:** Primary text, axes, and structural rules.
- **Muted Ink:** Secondary explanations and inactive metadata.
- **Aluminum:** Physical display bases in the DOM fallback and renderer.

**The Committed Cobalt Rule.** Cobalt owns substantial functional regions rather
than appearing as scattered accent confetti.

**The Reinforced State Rule.** Color never carries state alone; copy, position,
outline, or iconography must confirm it.

## Typography

**Display Font:** Archivo Variable with narrow grotesk fallbacks.

**Body Font:** Archivo Variable with Helvetica Neue and Arial fallbacks.

**Label/Mono Font:** JetBrains Mono Variable with system monospace fallbacks.

**Character:** Archivo reads as exhibition wayfinding instead of startup branding.
JetBrains Mono is an instrument voice reserved for code, coordinates,
measurements, commands, and state.

### Hierarchy

- **Headline:** Tight, heavy, short-lined offer copy using the responsive headline
  tokens.
- **Stage Display:** Oversized, low-contrast registration text inside the live
  scene; it is structural atmosphere, never primary reading copy.
- **Title:** Selection names and inspector values.
- **Body:** Explanations at the body and body-compact steps, limited to 62
  characters per line.
- **Label:** A deliberate 10–12px mono scale for essential instrument readouts.
  The 9px micro token is restricted to non-essential decorative measurements that
  are hidden from assistive technology and never carry state or instructions.
  Labels stay uppercase only when they act like data or commands.

**The Two Voices Rule.** Archivo carries meaning and navigation; JetBrains Mono
carries system evidence. Mono is never decorative texture.

**The Readable Instrument Rule.** Long-form body copy is at least 16px, supporting
copy is at least 14px, and interactive labels are at least 11px. Density comes from
alignment, rules, and concise language rather than unreadably small type.

## Layout

Desktop uses a 42/58 documentation and live-scene split beneath a 64px masthead. The
left side moves from offer, to primitive anatomy, to live code and installation.
The right side remains one uninterrupted stage with status above, measurement
inside, and a compact inspector in the lower corner.

A cobalt registration line connects the highlighted primitive row to the selected
scene object. At 900px and below, the page becomes offer, stage, anatomy, then code.
At 620px and below, control rows expand to at least 44px and the inspector spans
the stage width. The 8px base rhythm permits half and quarter steps only for
hairlines, glyph registration, and renderer geometry.

### Page and Navigation Structure

The homepage remains one product composition with three sequential jobs:

```text
MASTHEAD
├── Product identity
├── Docs
├── Examples
└── Get Started

HOMEPAGE
├── 01 Positioning + install action
├── 02 Live WebGL proof
└── 03 Primitive mental model

DOCS
├── Getting Started
├── Concepts
├── Framework Guides
│   ├── React
│   └── Vue
├── Renderer Guide
│   └── Three / WebGL
└── API Reference

EXAMPLES
└── Focused, runnable interaction patterns
```

Homepage navigation opens real documentation and example routes rather than
scrolling to an exhaustive single-page reference. The docs shell provides stable
local navigation and next-step links; the homepage preserves the approved 42/58
composition and B+C stage emphasis as the visual proof.

### Documentation Breakpoints

- **Above 1180px:** The Docs Shell uses a 240px local-navigation rail, an article
  column capped at 760px, and a 176px on-page index. The article, not the shell,
  owns the readable measure.
- **901–1180px:** The on-page index is removed and represented by an inline table
  of contents after the page introduction; the 208px local-navigation rail
  remains beside the article.
- **621–900px:** Local navigation remains visible above the article as a compact,
  two-column route index. Code and output in Example Frames stack vertically.
- **620px and below:** Local navigation becomes a sticky, full-width `SECTIONS`
  button followed by an inline disclosure. Expanding it pushes the article down;
  it never opens a drawer, traps focus, locks scroll, or covers content.

The disclosure button exposes `aria-expanded` and `aria-controls`. Its revealed
content remains a labeled `nav` landmark, the active route uses
`aria-current="page"`, and successful navigation collapses the disclosure before
moving focus to the destination `h1`. Browser zoom and text reflow must not cause
horizontal page scrolling at 320 CSS pixels.

### State Presentation

State changes reuse the instrument vocabulary instead of introducing generic
alerts, cards, or toasts:

- Loading preserves the final geometry and uses a mono status readout inside the
  affected region.
- Empty scenes retain the measurement field and one aluminum display base so absence is
  legible as a valid state rather than a broken canvas.
- Errors use plain language, an inline recovery action, and a semantic DOM
  equivalent; cobalt remains structural and is not repurposed as an error color.
- Success is visible through content, status copy, and enabled interaction, never
  through acid color alone.
- Partial output uses labeled placeholders at the missing object's intended
  position and keeps valid content fully interactive.
- Copy feedback replaces the initiating label in place and never creates a toast.

## Elevation & Depth

DOM surfaces are flat: no ambient card shadows, glass blur, or decorative
gradients. Hierarchy comes from tonal planes, 1px rules, selection fills, and
overlap. Depth belongs to the WebGL scene, where diffuse light, cast shadows,
fog, material roughness, and physical scale make objects legible.

**The Flat Instrument Rule.** A DOM surface may overlap another surface, but it
does not float through a generic box shadow.

## Shapes

Controls and documentation surfaces are square or use the 2px control radius.
Circles are reserved for authored object details, direction glyph construction,
and status points. The 7px and 8px radii belong only to synthetic device and
textile silhouettes in the DOM renderer fallback; they are not UI container
choices.

Borders are usually one-pixel ink hairlines. Selected objects use rectangular
measurement boxes and aluminum bases so object contours can remain expressive
without changing the interface grammar.

## Components

### Buttons

- **Shape:** Square or nearly square using the control radius.
- **Primary:** Cobalt field, white text, and a minimum 44px touch target where the
  control is reachable on touch devices.
- **Hover / Focus:** Fine pointers may change fill; press scales to 0.97 for 140ms.
  Focus combines a dark 2px outline with an acid outer ring.
- **Segmented:** Framework and reference tabs share one ruled container; only the
  active segment receives the full cobalt fill.

### Navigation

The masthead is one compact instrument rail. Links remain fully labeled; the
primary documentation action is a cobalt field. Mobile hides secondary route links
but preserves the labeled Get Started action.

### Primitive Anatomy

The semantic tree uses connector rules and a rectangular active row. The selected
node owns the registration endpoint that points to the selected spatial object.

### Live Stage

The canvas is a real framework consumer. Pointer, drag, wheel, buttons, and
keyboard actions update the same headless store. Status and selection remain
mirrored in semantic DOM content, including when WebGL fails.

The homepage stage presents a mixed specimen collection spanning authored
geometry, a vessel, a luminaire, a device, textile, and modular forms. The default
selection is a Gnomon-specific cobalt calibration assembly with recognizable
registration apertures and material joints. It is an ownable demonstration object,
not a product mascot or framework requirement. Books belong only to secondary,
clearly labeled examples, and collection status uses `OBJECTS`, never `BOOKS`.

### Code Surface

React and Vue snippets switch without changing live selection. The active
primitive owns one acid-highlighted code line, and copy feedback updates in place
without a toast.

### Selection Inspector

A white, square-cornered instrument panel overlays the stage. It exposes value,
type, dimensions, input reason, and labeled previous/next actions without hiding
the selected object.

### Documentation Components

The independent documentation routes use a minimal extension of the same
instrument vocabulary:

- **Docs Shell:** A persistent masthead, ruled local-navigation column, readable
  article measure, and optional on-page index; it uses mineral planes and
  hairlines, never floating containers.
- **Local Nav:** A hierarchical route list with a cobalt active field, visible
  focus, section labels in mono, and full text labels at every level.
- **API Signature:** A ruled definition block that keeps the symbol, type,
  default, and availability aligned; cobalt marks the referenced symbol and acid
  never substitutes for status copy.
- **Example Frame:** One source/output relationship with framework tabs, reset,
  open-in-editor, and semantic runtime status; the example itself earns the
  boundary rather than appearing inside a decorative card.
- **State Callout:** An inline, square-cornered explanation for requirements,
  compatibility, deprecation, or recovery; type, heading, and iconography
  reinforce its meaning without relying on color.
- **Page Pager:** Labeled previous and next guide destinations separated by one
  hairline, including the destination title rather than arrow-only controls.

These components use the existing body, mono label, cobalt, mineral, hairline,
focus, and 44px control tokens. They do not introduce a parallel docs theme,
rounded callout family, generic card system, or extra accent palette.

## Do's and Don'ts

### Do:

- **Do** demonstrate real APIs and state changes in every example.
- **Do** let one cobalt structural field carry the composition's visual energy.
- **Do** use measurement and registration only when they explain relationships.
- **Do** author synthetic objects with enough specificity to feel real.
- **Do** keep React, Vue, DOM fallback, and WebGL selection behavior equivalent.

### Don't:

- **Don't** make books the product identity; they are one demo object type.
- **Don't** turn every data point into a badge or rounded card.
- **Don't** scatter decorative axes, rulers, or code fragments without meaning.
- **Don't** copy Stripe Press typography, palette, imagery, or page structure.
- **Don't** hide essential navigation behind unlabeled icons.
