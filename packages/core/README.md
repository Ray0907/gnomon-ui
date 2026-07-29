# @gnomon-ui/core

Framework-agnostic state and interaction contracts for spatial interfaces.

```bash
pnpm add @gnomon-ui/core@next
```

```ts
import { createSpatialStore } from "@gnomon-ui/core";

const store = createSpatialStore({
	items: [{ value: "alpha" }, { value: "beta" }],
	defaultValue: "alpha",
	loop: true,
});

store.selectNext();
```

Core owns ordered items, controlled or uncontrolled selection, disabled-state
rules, keyboard intent, and subscriptions. It has no React, Vue, or renderer
dependency. Each item value is a unique identity; duplicate values throw before
the store can publish an ambiguous snapshot.

This is an alpha release. See the
[Gnomon UI documentation](https://ray0907.github.io/gnomon-ui/docs/primitives/)
and [source](https://github.com/Ray0907/gnomon-ui).
