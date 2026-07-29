import type { SpatialChangeReason } from "@gnomon-ui/core";

export type SpatialRendererContext<Item> = {
	canvas: HTMLCanvasElement;
	items: readonly Item[];
	value: string | null;
	onReady: () => void;
	onStatus: (status: string) => void;
	onValueChange: (value: string, reason: SpatialChangeReason) => void;
};

export type SpatialRendererUpdate = {
	reason?: SpatialChangeReason;
	immediate?: boolean;
};

export type SpatialRendererAdapter<Item> = {
	setItems?: (items: readonly Item[]) => void;
	setValue: (value: string | null, update?: SpatialRendererUpdate) => void;
	dispose: () => void;
};

export type SpatialRendererFactory<Item> = (
	context: SpatialRendererContext<Item>,
) => SpatialRendererAdapter<Item>;

export type SpatialRendererHost<Item> = {
	setItems: (items: readonly Item[]) => void;
	setValue: (value: string | null, update?: SpatialRendererUpdate) => void;
	dispose: () => void;
};

export function mountSpatialRenderer<Item>(
	context: SpatialRendererContext<Item>,
	createRenderer: SpatialRendererFactory<Item>,
): SpatialRendererHost<Item> {
	let items_current = context.items;
	let value_current = context.value;
	let adapter_current = createRenderer(context);
	let is_disposed = false;

	return {
		setItems(items_next) {
			if (is_disposed || items_next === items_current) return;
			items_current = items_next;
			adapter_current.setItems?.(items_next);
		},
		setValue(value_next, update) {
			if (is_disposed || value_next === value_current) return;
			value_current = value_next;
			adapter_current.setValue(value_next, update);
		},
		dispose() {
			if (is_disposed) return;
			is_disposed = true;
			adapter_current.dispose();
			adapter_current = null as never;
		},
	};
}
