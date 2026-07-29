# @gnomon-ui/three

Framework-neutral renderer lifecycle for Gnomon UI and Three.js.

```bash
pnpm add @gnomon-ui/core@next @gnomon-ui/three@next three
```

```ts
import { mountSpatialRenderer } from "@gnomon-ui/three";

const renderer = mountSpatialRenderer(host, (context) => ({
	setValue(value, update) {
		scene.moveTo(value, { immediate: update?.immediate });
	},
	dispose() {
		scene.destroy();
	},
}));
```

The adapter coordinates mount, value updates, pointer-derived selection, and
cleanup. Your project continues to own geometry, materials, camera, lighting,
and the scene graph.

This is an alpha release. See the
[adapter guide](https://ray0907.github.io/gnomon-ui/docs/adapters/) and
[source](https://github.com/Ray0907/gnomon-ui).
