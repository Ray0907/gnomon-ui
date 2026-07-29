import {
	computed,
	defineComponent,
	h,
	inject,
	mergeProps,
	onBeforeUnmount,
	provide,
	ref,
	useId as getVueId,
	watch,
	type InjectionKey,
	type PropType,
	type Ref,
} from "vue";
import {
	createSpatialStore,
	getAdjacentValue,
	getItemState,
	getNavigationReason,
	getSpatialItemId,
	type SpatialItemRecord,
	type SpatialOrientation,
	type SpatialStore,
} from "@gnomon-ui/core";

type SpatialVueContext = {
	store: SpatialStore;
	revision: Ref<number>;
	id_base: string;
};

type SpatialVueCollectionContext = {
	element_collection: Ref<HTMLElement | null>;
	id_base: string;
};

const spatial_key: InjectionKey<SpatialVueContext> = Symbol("GnomonSpatial");
const spatial_collection_key: InjectionKey<SpatialVueCollectionContext> = Symbol(
	"GnomonSpatialCollection",
);

function getSpatialContext(component_name: string) {
	const context_value = inject(spatial_key, null);
	if (!context_value) {
		throw new Error(`${component_name} must be used inside Spatial.Root.`);
	}
	return context_value;
}

function getSpatialCollectionContext(component_name: string) {
	const context_value = inject(spatial_collection_key, null);
	if (!context_value) {
		throw new Error(`${component_name} must be used inside Spatial.Collection.`);
	}
	return context_value;
}

function getSpatialBindings() {
	const context_value = getSpatialContext("useSpatial");
	const snapshot = computed(() => {
		void context_value.revision.value;
		return context_value.store.getSnapshot();
	});
	return {
		snapshot,
		value: computed(() => snapshot.value.value),
		idBase: context_value.id_base,
		setValue: context_value.store.setValue,
		selectNext: context_value.store.selectNext,
		selectPrevious: context_value.store.selectPrevious,
		selectFirst: context_value.store.selectFirst,
		selectLast: context_value.store.selectLast,
	};
}

const SpatialRoot = defineComponent({
	name: "SpatialRoot",
	props: {
		items: {
			type: Array as PropType<readonly SpatialItemRecord[]>,
			required: true,
		},
		modelValue: {
			type: String as PropType<string | null | undefined>,
			default: undefined,
		},
		defaultValue: {
			type: String as PropType<string | null>,
			default: null,
		},
		orientation: {
			type: String as PropType<SpatialOrientation>,
			default: "horizontal",
		},
		loop: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["update:modelValue", "valueChange"],
	setup(props, { slots, emit }) {
		const id_base = getVueId();
		const revision = ref(0);
		const store = createSpatialStore({
			items: props.items,
			value: props.modelValue,
			defaultValue: props.defaultValue,
			orientation: props.orientation,
			loop: props.loop,
			onValueChange(details) {
				emit("update:modelValue", details.value);
				emit("valueChange", details);
			},
		});
		const unsubscribe = store.subscribe(() => {
			revision.value += 1;
		});
		provide(spatial_key, { store, revision, id_base });
		onBeforeUnmount(unsubscribe);

		watch(
			() => [
				props.items,
				props.modelValue,
				props.orientation,
				props.loop,
			] as const,
			([items, value, orientation, loop]) => {
				store.setOptions({ items, value, orientation, loop });
			},
		);

		return () => slots.default?.();
	},
});

const SpatialScene = defineComponent({
	name: "SpatialScene",
	inheritAttrs: false,
	props: {
		as: { type: String, default: "div" },
	},
	setup(props, { attrs, slots }) {
		const spatial = getSpatialBindings();
		return () =>
			h(
				props.as,
				{ ...attrs, "data-gnomon-scene": "" },
				slots.default?.(spatial.snapshot.value),
			);
	},
});

const SpatialCollection = defineComponent({
	name: "SpatialCollection",
	inheritAttrs: false,
	props: {
		as: { type: String, default: "div" },
	},
	setup(props, { attrs, slots }) {
		const spatial = getSpatialBindings();
		const id_collection = getVueId();
		const element_collection = ref<HTMLElement | null>(null);
		const id_base = `${spatial.idBase}-${id_collection}`;
		provide(spatial_collection_key, { element_collection, id_base });

		function handleKeyDown(event: KeyboardEvent) {
			if (event.defaultPrevented) return;
			const element_current = event.currentTarget as HTMLElement;
			const direction_text =
				getComputedStyle(element_current).direction === "rtl" ? "rtl" : "ltr";
			const reason = getNavigationReason(
				event.key,
				spatial.snapshot.value.orientation,
				direction_text,
			);
			if (!reason) return;
			event.preventDefault();
			if (reason === "next") spatial.selectNext("keyboard");
			if (reason === "previous") spatial.selectPrevious("keyboard");
			if (reason === "first") spatial.selectFirst("keyboard");
			if (reason === "last") spatial.selectLast("keyboard");
		}

		return () =>
			h(
				props.as,
				mergeProps(attrs, {
					ref: element_collection,
					role: "listbox",
					tabindex: attrs.tabindex ?? 0,
					"aria-activedescendant": spatial.snapshot.value.value !== null
						? getSpatialItemId(id_base, spatial.snapshot.value.value)
						: undefined,
					"aria-orientation": spatial.snapshot.value.orientation,
					"data-orientation": spatial.snapshot.value.orientation,
					"data-gnomon-collection": "",
					onKeydown: handleKeyDown,
				}),
				slots.default?.(),
			);
	},
});

const SpatialItem = defineComponent({
	name: "SpatialItem",
	inheritAttrs: false,
	props: {
		as: { type: String, default: "button" },
		value: { type: String, required: true },
		disabled: { type: Boolean, default: false },
	},
	setup(props, { attrs, slots }) {
		const spatial = getSpatialBindings();
		const { element_collection, id_base } =
			getSpatialCollectionContext("Spatial.Item");
		return () => {
			const snapshot = spatial.snapshot.value;
			const item_record = snapshot.items.find(
				(item_candidate) => item_candidate.value === props.value,
			);
			const is_disabled = props.disabled || item_record?.disabled || false;
			const is_active = snapshot.value === props.value;
			return h(
				props.as,
				mergeProps(attrs, {
					...getItemState(props.value, snapshot),
					type: props.as === "button" ? "button" : undefined,
					id: getSpatialItemId(id_base, props.value),
					role: "option",
					disabled: props.as === "button" ? is_disabled : undefined,
					"aria-disabled": is_disabled || undefined,
					"aria-selected": is_active,
					tabindex: -1,
					"data-gnomon-item": "",
					"data-gnomon-value": props.value,
					onClick: (event: MouseEvent) => {
						if (is_disabled) return;
						if (!event.defaultPrevented) {
							spatial.setValue(props.value, "item");
						}
						element_collection.value?.focus({ preventScroll: true });
					},
				}),
				slots.default?.({ active: is_active }),
			);
		};
	},
});

function createDirectionComponent(direction: "previous" | "next") {
	return defineComponent({
		name: direction === "next" ? "SpatialNext" : "SpatialPrevious",
		inheritAttrs: false,
		props: {
			as: { type: String, default: "button" },
			disabled: { type: Boolean, default: false },
		},
		setup(props, { attrs, slots }) {
			const spatial = getSpatialBindings();
			return () => {
				const snapshot = spatial.snapshot.value;
				const direction_step = direction === "next" ? 1 : -1;
				const value_next = getAdjacentValue(
					snapshot.items,
					snapshot.value,
					direction_step,
					snapshot.loop,
				);
				const is_disabled =
					props.disabled ||
					value_next === null ||
					value_next === snapshot.value;
				return h(
					props.as,
					mergeProps(attrs, {
						type: props.as === "button" ? "button" : undefined,
						disabled: props.as === "button" ? is_disabled : undefined,
						"aria-disabled": is_disabled || undefined,
						"data-disabled": is_disabled ? "" : undefined,
						"data-gnomon-direction": direction,
						onClick: (event: MouseEvent) => {
							if (event.defaultPrevented || is_disabled) return;
							if (direction === "next") spatial.selectNext();
							else spatial.selectPrevious();
						},
					}),
					slots.default?.(),
				);
			};
		},
	});
}

const SpatialLabel = defineComponent({
	name: "SpatialLabel",
	inheritAttrs: false,
	props: {
		as: { type: String, default: "span" },
	},
	setup(props, { attrs, slots }) {
		const spatial = getSpatialBindings();
		return () =>
			h(
				props.as,
				{ ...attrs, "data-gnomon-label": "" },
				slots.default?.(spatial.snapshot.value),
			);
	},
});

const SpatialPrevious = createDirectionComponent("previous");
const SpatialNext = createDirectionComponent("next");

export const Spatial = {
	Root: SpatialRoot,
	Scene: SpatialScene,
	Collection: SpatialCollection,
	Item: SpatialItem,
	Previous: SpatialPrevious,
	Next: SpatialNext,
	Label: SpatialLabel,
};

export {
	getSpatialBindings as useSpatial,
	SpatialCollection,
	SpatialItem,
	SpatialLabel,
	SpatialNext,
	SpatialPrevious,
	SpatialRoot,
	SpatialScene,
};
