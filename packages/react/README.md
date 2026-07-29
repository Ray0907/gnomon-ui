# @gnomon-ui/react

React compound components and hooks for Gnomon UI.

```bash
pnpm add @gnomon-ui/core@next @gnomon-ui/react@next
```

```tsx
import { Spatial } from "@gnomon-ui/react";

<Spatial.Root items={items} defaultValue={items[0]?.value}>
	<Spatial.Scene>{(snapshot) => <Scene value={snapshot.value} />}</Spatial.Scene>
	<Spatial.Collection aria-label="Objects">
		{items.map((item) => (
			<Spatial.Item key={item.value} value={item.value}>
				{item.label}
			</Spatial.Item>
		))}
	</Spatial.Collection>
</Spatial.Root>;
```

The React adapter includes controlled and uncontrolled state, `asChild`
composition, semantic collection attributes, and keyboard navigation.

This is an alpha release. See the
[adapter guide](https://ray0907.github.io/gnomon-ui/docs/adapters/) and
[source](https://github.com/Ray0907/gnomon-ui).
