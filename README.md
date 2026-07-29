# Gnomon UI

Accessible primitives for spatial interfaces.

Gnomon UI separates collection state and input contracts from rendering. A React,
Vue, or future framework adapter can drive the same Three.js scene without moving
selection logic, keyboard behavior, or accessibility into the canvas.

The website is a live consumer of the workspace packages. Its books, lamp, vessel,
device, textile, and modular object are synthetic examples—not a required catalog
shape or bundled content library.

## Status

Gnomon UI is an unpublished v0.1 framework prototype. The repository implements and
tests the package boundaries, state contracts, React/Vue bindings, Three.js
lifecycle, and documentation demo. Package names and the public npm namespace have
not been reserved.

## Packages

| Package | Responsibility | Framework dependency |
| --- | --- | --- |
| `@gnomon-ui/core` | Store, collection order, navigation, controlled state | None |
| `@gnomon-ui/react` | Compound components, hooks, `asChild` | React |
| `@gnomon-ui/vue` | Components, composables, `v-model` | Vue |
| `@gnomon-ui/three` | Renderer lifecycle and selection bridge | None |
| `@gnomon-ui/theme` | Optional CSS variables and state tokens | None |

The core and renderer contracts are intentionally open so Svelte, Solid, other
renderers, and non-Three scenes can integrate without changing the data model.

## Run the demo

Requires Node.js 22 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://127.0.0.1:5203](http://127.0.0.1:5203).

## Validate

```bash
pnpm check
```

This builds ESM and declaration output for every package, lints and type-checks the
workspace, exports the static documentation site, and runs the state/API tests.

## React

```tsx
import { useState } from "react";
import type { SpatialItemRecord } from "@gnomon-ui/core";
import { Spatial } from "@gnomon-ui/react";

type CatalogItem = SpatialItemRecord & {
	name: string;
};

export function Catalog({ items }: { items: readonly CatalogItem[] }) {
	const [value, setValue] = useState(items[0]?.value ?? null);

	return (
		<Spatial.Root
			items={items}
			value={value}
			onValueChange={({ value: value_next }) => setValue(value_next)}
			loop
		>
			<Spatial.Scene asChild>
				<canvas aria-label="Project-owned spatial renderer" />
			</Spatial.Scene>
			<Spatial.Collection aria-label="Objects">
				{items.map((item) => (
					<Spatial.Item key={item.value} value={item.value}>
						{item.name}
					</Spatial.Item>
				))}
			</Spatial.Collection>
			<Spatial.Previous>Previous</Spatial.Previous>
			<Spatial.Next>Next</Spatial.Next>
		</Spatial.Root>
	);
}
```

## Vue

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { SpatialItemRecord } from "@gnomon-ui/core";
import { Spatial } from "@gnomon-ui/vue";

const { items } = defineProps<{
	items: readonly (SpatialItemRecord & { name: string })[];
}>();
const selected = ref(items[0]?.value ?? null);
</script>

<template>
	<Spatial.Root v-model="selected" :items="items" loop>
		<Spatial.Scene as="canvas" aria-label="Project-owned spatial renderer" />
		<Spatial.Collection aria-label="Objects">
			<Spatial.Item
				v-for="item in items"
				:key="item.value"
				:value="item.value"
			>
				{{ item.name }}
			</Spatial.Item>
		</Spatial.Collection>
	</Spatial.Root>
</template>
```

See [Framework adapters](docs/framework-adapters.md) for the shared contract and
renderer lifecycle.

## WebGL and fallback behavior

When WebGL is available, the demo mounts `SpatialDemoEngine`, renders procedural
Three.js objects, and reports raycast, drag, and wheel selection to the core store.
If context creation fails, the site keeps the semantic collection, keyboard
controls, framework examples, and a DOM representation active. The fallback is a
resilience path, not the default renderer.

## Build the static site

```bash
pnpm build
```

The site exports to `dist/`. Set `NEXT_PUBLIC_SITE_URL` before a production build
to generate absolute social metadata.

## Provenance

The first renderer foundation was derived from the MIT-licensed
[`mintdotgg/mint-playground`](https://github.com/mintdotgg/mint-playground/tree/main/experiences/complete-shelf).
Gnomon UI replaces its product, catalog, data, visual system, package architecture,
and renderer surface. See [Third-party notices](THIRD_PARTY_NOTICES.md).
