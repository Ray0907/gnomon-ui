# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web framework packages with a documentation and interactive demo site.

## Users

Frontend engineers, creative developers, and design engineers building spatial
catalogs, 3D selectors, product explorers, exhibitions, and object-led interfaces.

## Product Purpose

Gnomon UI provides accessible, composable primitives for interfaces where users
navigate and select objects in space. It separates state and interaction contracts
from rendering so teams can own the scene, models, materials, and visual language.

Success means a developer can understand the mental model in one viewport, install
only the packages they need, build a controlled or uncontrolled collection, and
preserve equivalent pointer, touch, and keyboard access.

## Information Architecture

The website separates product orientation from durable technical reference:

```text
/
├── Positioning + package installation
├── Live WebGL proof
└── Primitive mental model
    │
    ├── /docs/getting-started
    ├── /docs/concepts
    ├── /docs/react
    ├── /docs/vue
    ├── /docs/three
    ├── /docs/api/*
    └── /examples/*
```

The homepage is a gateway, not the complete documentation surface. Its first three
jobs, in order, are to explain what Gnomon does and how to install it, prove the
shared interaction contract in a live scene, and reveal the primitive mental
model. Guides own framework-specific workflows, API pages own exhaustive
reference, and examples own focused, runnable patterns.

## Interaction State Coverage

Every first-party surface specifies what the user sees across the complete state
set. A renderer failure never removes the semantic collection or its controls.

| Feature | Loading | Empty | Error | Success | Partial |
| --- | --- | --- | --- | --- | --- |
| Docs route | Keep the previous page visible and announce the destination after a 300ms delay; do not flash a skeleton for fast static routes. | Show the requested section title, explain that no entries exist, and link to the nearest parent guide. | Show the failed route and a retry link without replacing the global docs navigation. | Focus the page heading after client navigation and expose previous/next guide links. | Render available prose and label unavailable generated reference blocks in place. |
| Live Stage | Show the calibration field, axes, and `INITIALIZING RENDERER`; keep semantic controls present but disabled. | Show an empty display base, `NO OBJECTS REGISTERED`, and a primary link to the first collection example. | Replace the canvas with the equivalent DOM scene, say what failed, and offer `TRY WEBGL AGAIN`. | Show the selected object, ready status, measurement, inspector, and all input methods. | Render resolved objects; represent unresolved objects as labeled base placeholders while the full semantic collection remains navigable. |
| Spatial Collection | Show `LOADING COLLECTION`, preserve the collection label, and disable previous/next until order is known. | Explain that the collection needs at least one item and link to the smallest valid code example. | Keep any last valid items visible, identify the collection error in an inline live region, and offer retry. | Expose selection, position, disabled items, and previous/next availability consistently. | Keep valid items interactive; unresolved or invalid items remain labeled and disabled with a reason. |
| Code and install copy | Keep the command readable; only the copy control reports progress with `COPYING`. | Show the expected package or snippet location and a link to the relevant setup step. | Replace the control label with `COPY FAILED` and keep the text selectable for manual copy. | Replace the label with `COPIED` in place, then return to `COPY` without a toast. | Copy only the complete visible command and label omitted optional lines rather than silently truncating them. |
| Framework and renderer examples | Keep the example frame and title stable while its runtime initializes. | Explain which required input is missing and link directly to the relevant API field. | Keep source visible, show the runtime failure beside the output, and provide reset. | Demonstrate real package APIs with equivalent pointer, touch, and keyboard behavior. | Mark unsupported capabilities explicitly and keep the headless or DOM behavior available. |

Empty states teach the smallest valid next step. Error states preserve useful
content and recovery actions. Loading states avoid layout shifts, and partial
states never imply capabilities that are not active.

## Developer Journey

The primary journey moves from visual proof to a runnable first success without
requiring the developer to infer the next step.

| Step | Developer does | Intended feeling | Product support |
| --- | --- | --- | --- |
| 1 | Lands on the homepage and scans the first viewport. | “This is a precise spatial primitive system, not another 3D showcase.” | Positioning, install command, framework support, and live proof appear as one composition. |
| 2 | Drags, scrolls, clicks, or uses arrow keys in the stage. | “The interaction is real and input-complete.” | The same selected value updates the scene, semantic controls, inspector, and status. |
| 3 | Selects a primitive and follows its registration into the scene and code. | “I understand where state ends and rendering begins.” | Anatomy, highlighted code, and selected object expose one shared contract. |
| 4 | Switches React or Vue and opens the corresponding Getting Started guide. | “This fits my stack without learning a proprietary scene model.” | Equivalent adapter examples preserve the same concepts and naming. |
| 5 | Copies the install command and runs the smallest example. | “I have a working baseline I can own.” | The guide gives one dependency path, one complete example, expected output, and a visible verification step. |
| 6 | Adds Three/WebGL or replaces the renderer and visual language. | “The framework helps without taking over my scene.” | Renderer guides separate required contracts from optional theme and implementation choices. |
| 7 | Returns for upgrades or deeper API work. | “This project is stable enough to build on.” | Versioned reference, changelog, compatibility table, and migration guides distinguish stable, changed, and deprecated contracts. |

### Time Horizons

- **First 5 seconds:** Establish Gnomon's name, purpose, framework scope, and one
  unmistakable spatial proof.
- **First 5 minutes:** Move from interaction to mental model to a verified,
  runnable framework example.
- **First 5 years:** Preserve trust through stable semantics, explicit
  compatibility, versioned documentation, deprecation windows, and migration
  guidance.

## Positioning

Most 3D web demos bind state, input, rendering, and product UI into one bespoke
canvas. Gnomon UI treats spatial interaction as a reusable UI primitive system:
a framework-agnostic core, framework-native bindings at the edge, and a
renderer-independent contract.

## Operating Context

- `@gnomon-ui/core` runs in any modern TypeScript application.
- `@gnomon-ui/react` provides compound components and hooks.
- `@gnomon-ui/vue` provides components and composables.
- `@gnomon-ui/three` connects a canvas renderer to the same state contract.
- `@gnomon-ui/theme` supplies an optional premium default visual language.
- The website is both documentation and a live example; books are one synthetic
  dataset, not the identity or limit of the framework.

## Initial Capabilities and Constraints

- Controlled and uncontrolled selected value.
- Linear collection navigation with orientation, looping, and disabled items.
- Pointer, drag, wheel, and keyboard selection parity.
- Stable `data-state`, `data-orientation`, and `data-disabled` styling contracts.
- Renderer adapter lifecycle: mount, update selection, report selection, dispose.
- React and Vue bindings ship in v0.1; the core and renderer contracts remain open
  to Svelte, Solid, and other integrations.
- The homepage demo uses a mixed set of procedural specimens. Its default selected
  object is a Gnomon-specific cobalt calibration assembly; books appear only in
  secondary examples and never name the collection.
- Demo content makes no production benchmark, customer, adoption, or compatibility
  claims.
- Static Next.js export remains the website deployment target.

## Brand Commitments

- Product name: Gnomon UI.
- Canonical repository: `Ray0907/gnomon-ui`.
- Canonical package family: `@gnomon-ui/*`, subject to namespace reservation
  before publication.
- Name meaning: a gnomon is a reference pointer that makes position legible
  through its relationship to a measured field. Gnomon UI makes the relationship
  between semantic state, input, and spatial output equally visible.
- Voice: precise, direct, technical, and quietly confident.
- Primary line: “Accessible primitives for spatial interfaces.”
- The framework never owns a project’s content, models, or visual identity.
- The project is independent from Stripe and Mint; references are provenance, not
  affiliation or permission to reuse trademarks and artwork.

## Product Principles

- Separate interaction state from render technology.
- Prefer excellent defaults without making customization expensive.
- Make the component anatomy visible in the rendered result.
- Keep the novice path obvious and the expert path fast.
- Expose real framework contracts in examples; do not stage fake APIs.
- Handle focus, reduced motion, disposal, and input edge cases invisibly.
- Let objects remain the subject while Gnomon provides the reference system.

## Accessibility and Inclusion

The DOM layer owns semantic controls, roving selection, visible focus, live status,
and keyboard navigation. Canvas interactions mirror those actions rather than
replacing them. Color never carries state alone, touch targets remain at least
44px, zoom is not blocked, and reduced-motion preferences remove spatial travel
while preserving clear state changes.

## Evidence on Hand

- A working Three.js rendering and input foundation derived from the MIT-licensed
  Complete Shelf experience.
- Procedural geometry and a renderer lifecycle exercised by the live demo.
- An approved split documentation and live-demo composition.
- Existing static export, type-check, lint, and rendered-output validation.
