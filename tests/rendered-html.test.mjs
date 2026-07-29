import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readRenderedPage() {
	return readFile(new URL("../dist/index.html", import.meta.url), "utf8");
}

async function readSources() {
	const paths_source = {
		core: "../packages/core/src/index.ts",
		react: "../packages/react/src/index.tsx",
		vue: "../packages/vue/src/index.ts",
		three: "../packages/three/src/index.ts",
		demo: "../app/GnomonDemo.tsx",
		engine: "../app/SpatialDemoEngine.ts",
		design: "../DESIGN.md",
		design_sidecar: "../.impeccable/design.json",
		product: "../PRODUCT.md",
	};
	return Object.fromEntries(
		await Promise.all(
			Object.entries(paths_source).map(async ([name_source, path_source]) => [
				name_source,
				await readFile(new URL(path_source, import.meta.url), "utf8"),
			]),
		),
	);
}

test("exports the Gnomon UI framework demo", async () => {
	const html = await readRenderedPage();
	assert.match(
		html,
		/<title>Gnomon UI — Accessible primitives for spatial interfaces<\/title>/i,
	);
	assert.match(html, /Accessible primitives for spatial interfaces/);
	assert.match(html, /Headless state\. Composable scenes/);
	assert.match(html, /data-testid="spatial-canvas"/);
	assert.match(html, /Spatial\.Root/);
	assert.match(html, /Spatial\.Collection/);
	assert.match(html, /Spatial\.Item/);
	assert.match(html, /REACT/);
	assert.match(html, /VUE/);
	assert.match(html, /CORE \/ FRAMEWORK AGNOSTIC/);
	assert.match(html, /Select Geometry Essentials/);
	assert.match(html, /Select Task Light 02/);
	assert.match(html, /Select Mineral Vessel/);
	assert.match(html, /pnpm add @gnomon-ui\/react @gnomon-ui\/three/);
	assert.match(html, /og:image/);
	assert.match(html, /\/social-card\.jpg/);
});

test("keeps core framework agnostic and ships React and Vue bindings", async () => {
	const sources = await readSources();
	assert.doesNotMatch(sources.core, /from ["']react["']/);
	assert.doesNotMatch(sources.core, /from ["']vue["']/);
	assert.match(sources.core, /createSpatialStore/);
	assert.match(sources.core, /getNavigationReason/);
	assert.match(sources.core, /data-state/);

	assert.match(sources.react, /from "@gnomon-ui\/core"/);
	assert.match(sources.react, /useSyncExternalStore/);
	assert.match(sources.react, /asChild/);
	assert.match(sources.react, /aria-activedescendant/);
	assert.match(sources.react, /SpatialScene/);
	assert.match(sources.react, /tabIndex=\{-1\}/);
	assert.match(sources.react, /data-gnomon-item/);

	assert.match(sources.vue, /from "@gnomon-ui\/core"/);
	assert.match(sources.vue, /provide\(spatial_key/);
	assert.match(sources.vue, /update:modelValue/);
	assert.match(sources.vue, /aria-activedescendant/);
	assert.match(sources.vue, /SpatialScene/);
	assert.match(sources.vue, /tabindex: -1/);
	assert.match(sources.vue, /data-gnomon-item/);

	assert.doesNotMatch(sources.three, /from ["']react["']/);
	assert.doesNotMatch(sources.three, /from ["']vue["']/);
	assert.match(sources.three, /SpatialRendererAdapter/);
	assert.match(sources.three, /dispose/);
});

test("uses one state contract for DOM controls and the live renderer", async () => {
	const sources = await readSources();
	assert.match(sources.demo, /<Spatial\.Root/);
	assert.match(sources.demo, /<Spatial\.Scene/);
	assert.match(sources.demo, /<Spatial\.Collection/);
	assert.match(sources.demo, /<Spatial\.Item/);
	assert.match(sources.demo, /<Spatial\.Previous/);
	assert.match(sources.demo, /<Spatial\.Next/);
	assert.match(sources.demo, /data-primitive=/);
	assert.match(sources.demo, /aria-pressed=/);
	assert.match(sources.demo, /mountSpatialRenderer/);
	assert.match(sources.demo, /new SpatialDemoEngine/);
	assert.match(sources.engine, /requestValue\(value_next/);
	assert.match(sources.engine, /onValueChange\(value_next, reason\)/);
	assert.match(sources.engine, /prefers-reduced-motion/);
	assert.match(sources.engine, /setPointerCapture/);
	assert.match(sources.engine, /onAnchorChange/);
	assert.match(sources.engine, /removeEventListener/);
	assert.match(sources.engine, /renderer\.dispose/);
});

test("records the approved product and visual direction", async () => {
	const sources = await readSources();
	assert.match(sources.product, /framework-agnostic core/i);
	assert.match(sources.product, /React and Vue bindings ship in v0\.1/);
	assert.match(sources.product, /books are one synthetic\s+dataset/i);
	assert.match(sources.design, /calibration laboratory/i);
	assert.match(sources.design, /42\/58 documentation and live-scene split/i);
	assert.match(sources.design, /registration line/i);
	assert.doesNotMatch(sources.design, /Continuous Editorial Shelf/);
	assert.match(sources.design_sidecar, /Design System: Gnomon UI/);
	assert.doesNotMatch(sources.design_sidecar, /The Complete Shelf/);
});

test("core navigation skips disabled items and supports controlled state", async () => {
	const {
		createSpatialStore,
		getAdjacentValue,
		getNavigationReason,
	} = await import("../packages/core/src/index.ts");
	const items = [
		{ value: "alpha" },
		{ value: "beta", disabled: true },
		{ value: "gamma" },
	];

	assert.equal(getAdjacentValue(items, "alpha", 1), "gamma");
	assert.equal(getAdjacentValue(items, "gamma", 1), "gamma");
	assert.equal(getAdjacentValue(items, "gamma", 1, true), "alpha");
	assert.equal(getNavigationReason("ArrowRight", "horizontal"), "next");
	assert.equal(getNavigationReason("ArrowRight", "horizontal", "rtl"), "previous");
	assert.equal(getNavigationReason("ArrowDown", "vertical"), "next");
	assert.equal(getNavigationReason("ArrowDown", "horizontal"), null);

	const changes = [];
	const store = createSpatialStore({
		items,
		value: "alpha",
		onValueChange: (details) => changes.push(details),
	});
	store.selectNext();
	assert.equal(store.getSnapshot().value, "alpha");
	assert.equal(changes[0].value, "gamma");
	assert.equal(changes[0].previousValue, "alpha");
	store.setOptions({ value: "gamma" });
	assert.equal(store.getSnapshot().value, "gamma");
});
