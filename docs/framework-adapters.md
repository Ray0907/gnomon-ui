# Framework adapters

Gnomon UI keeps state ownership separate from renderer ownership.

```text
React / Vue / future adapter
          │
          ▼
@gnomon-ui/core
selection · order · keyboard intent · data-state
          │
          ▼
@gnomon-ui/three
mount · setValue · report selection · dispose
          │
          ▼
project-owned renderer
geometry · models · materials · camera · lighting
```

## Core contract

`createSpatialStore()` accepts:

- `items`: ordered `{ value, disabled?, textValue? }` records.
- `value` or `defaultValue`: controlled or uncontrolled selection.
- `orientation`: horizontal or vertical keyboard intent.
- `loop`: whether navigation wraps collection edges.
- `onValueChange`: `{ value, previousValue, reason }`.

The store skips disabled items, preserves stable snapshots when only callback
identity changes, and exposes subscriptions suitable for framework bindings.

## DOM contract

React and Vue emit the same styling and state attributes:

- `data-gnomon-collection`
- `data-gnomon-scene`
- `data-gnomon-item`
- `data-gnomon-value`
- `data-state="active | inactive"`
- `data-orientation="horizontal | vertical"`
- `data-disabled`

Both bindings keep the active option discoverable, label icon-only actions, and
route Home, End, and axis-specific arrow keys through the core navigation helpers.

## React adapter

React exposes:

- `Spatial.Root`
- `Spatial.Scene`
- `Spatial.Collection`
- `Spatial.Item`
- `Spatial.Previous`
- `Spatial.Next`
- `Spatial.Label`
- `useSpatial()`

`asChild` composes Gnomon behavior onto a project-owned element. Controlled values
use `onValueChange`; uncontrolled values use `defaultValue`. `Spatial.Scene`
receives the current snapshot through a render function and marks the
project-owned renderer host without taking over its geometry or lifecycle.

## Vue adapter

Vue exposes the matching `Spatial.*` components and `useSpatial()` composable.
`v-model` maps to the core controlled value. Scoped slots receive active state
without moving item order or input logic into templates. `Spatial.Scene` exposes
the same snapshot as a scoped slot and accepts an `as` element.

## Renderer adapter

`mountSpatialRenderer()` accepts a factory that returns:

```ts
type SpatialRendererAdapter<Item> = {
	setItems?: (items: readonly Item[]) => void;
	setValue: (
		value: string | null,
		update?: { reason?: SpatialChangeReason; immediate?: boolean },
	) => void;
	dispose: () => void;
};
```

The renderer reports pointer-derived selection through `onValueChange`. Framework
keyboard changes can request an immediate visual update, avoiding repeated travel
animation for expert input.

## Adding another framework

A new adapter should:

1. Subscribe to `SpatialStore`.
2. Map controlled value conventions to `setOptions({ value })`.
3. Preserve the DOM attributes and keyboard intent above.
4. Keep renderer lifecycle outside the component state machine.
5. Test disabled items, loop boundaries, RTL horizontal navigation, and cleanup.

Svelte and Solid are architecture targets, not shipped or compatibility-tested
packages in v0.1.
