# @gnomon-ui/vue

Vue components and composables for Gnomon UI.

```bash
pnpm add @gnomon-ui/core@next @gnomon-ui/vue@next
```

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Spatial } from "@gnomon-ui/vue";

const selected = ref("alpha");
const items = [{ value: "alpha" }, { value: "beta" }];
</script>

<template>
	<Spatial.Root v-model="selected" :items="items">
		<Spatial.Collection aria-label="Objects">
			<Spatial.Item v-for="item in items" :key="item.value" :value="item.value" />
		</Spatial.Collection>
	</Spatial.Root>
</template>
```

The Vue adapter mirrors the React contract through `v-model`, scoped slots, and
semantic collection attributes.

This is an alpha release. See the
[adapter guide](https://ray0907.github.io/gnomon-ui/docs/adapters/) and
[source](https://github.com/Ray0907/gnomon-ui).
