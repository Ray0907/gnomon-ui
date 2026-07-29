export type SpatialOrientation = "horizontal" | "vertical";

export type SpatialChangeReason =
	| "item"
	| "next"
	| "previous"
	| "first"
	| "last"
	| "pointer"
	| "keyboard"
	| "programmatic";

export type SpatialItemRecord = {
	value: string;
	disabled?: boolean;
	textValue?: string;
};

export type SpatialChangeDetails = {
	value: string;
	previousValue: string | null;
	reason: SpatialChangeReason;
};

export type SpatialSnapshot = {
	value: string | null;
	items: readonly SpatialItemRecord[];
	orientation: SpatialOrientation;
	loop: boolean;
};

export type SpatialStoreOptions = {
	items: readonly SpatialItemRecord[];
	value?: string | null;
	defaultValue?: string | null;
	orientation?: SpatialOrientation;
	loop?: boolean;
	onValueChange?: (details: SpatialChangeDetails) => void;
};

export type SpatialStore = {
	getSnapshot: () => SpatialSnapshot;
	subscribe: (listener: () => void) => () => void;
	setOptions: (options: Partial<SpatialStoreOptions>) => void;
	setValue: (value: string, reason?: SpatialChangeReason) => void;
	selectNext: (reason?: SpatialChangeReason) => void;
	selectPrevious: (reason?: SpatialChangeReason) => void;
	selectFirst: (reason?: SpatialChangeReason) => void;
	selectLast: (reason?: SpatialChangeReason) => void;
};

type NavigationDirection = 1 | -1;

function getEnabledItems(items: readonly SpatialItemRecord[]) {
	return items.filter((item_record) => !item_record.disabled);
}

export function getInitialValue(options: SpatialStoreOptions) {
	const items_enabled = getEnabledItems(options.items);
	const value_requested = options.value ?? options.defaultValue;
	const has_requested = items_enabled.some(
		(item_record) => item_record.value === value_requested,
	);
	return has_requested ? (value_requested ?? null) : (items_enabled[0]?.value ?? null);
}

export function getAdjacentValue(
	items: readonly SpatialItemRecord[],
	value_current: string | null,
	direction: NavigationDirection,
	loop = false,
) {
	const items_enabled = getEnabledItems(items);
	if (items_enabled.length === 0) return null;

	const index_current = items_enabled.findIndex(
		(item_record) => item_record.value === value_current,
	);
	const index_fallback = direction === 1 ? -1 : items_enabled.length;
	const index_source = index_current === -1 ? index_fallback : index_current;
	const index_next = index_source + direction;

	if (loop) {
		const index_wrapped =
			(index_next + items_enabled.length) % items_enabled.length;
		return items_enabled[index_wrapped]?.value ?? null;
	}

	return items_enabled[Math.max(0, Math.min(index_next, items_enabled.length - 1))]
		?.value ?? null;
}

export function getNavigationReason(
	key_pressed: string,
	orientation: SpatialOrientation,
	direction_text: "ltr" | "rtl" = "ltr",
): SpatialChangeReason | null {
	if (key_pressed === "Home") return "first";
	if (key_pressed === "End") return "last";

	if (orientation === "vertical") {
		if (key_pressed === "ArrowDown") return "next";
		if (key_pressed === "ArrowUp") return "previous";
		return null;
	}

	if (key_pressed === "ArrowRight") {
		return direction_text === "rtl" ? "previous" : "next";
	}
	if (key_pressed === "ArrowLeft") {
		return direction_text === "rtl" ? "next" : "previous";
	}
	return null;
}

export function getItemState(value_item: string, snapshot: SpatialSnapshot) {
	const item_record = snapshot.items.find(
		(item_candidate) => item_candidate.value === value_item,
	);
	return {
		"data-state": snapshot.value === value_item ? "active" : "inactive",
		"data-disabled": item_record?.disabled ? "" : undefined,
		"data-orientation": snapshot.orientation,
	} as const;
}

export function createSpatialStore(options_initial: SpatialStoreOptions): SpatialStore {
	let options_current = { ...options_initial };
	let value_internal = getInitialValue(options_initial);
	let snapshot_current = createSnapshot();
	const listeners = new Set<() => void>();

	function isControlled() {
		return options_current.value !== undefined;
	}

	function getValue() {
		return isControlled() ? (options_current.value ?? null) : value_internal;
	}

	function createSnapshot(): SpatialSnapshot {
		return {
			value: getValue(),
			items: options_current.items,
			orientation: options_current.orientation ?? "horizontal",
			loop: options_current.loop ?? false,
		};
	}

	function notify() {
		snapshot_current = createSnapshot();
		listeners.forEach((listener) => listener());
	}

	function setOptions(options_next: Partial<SpatialStoreOptions>) {
		const snapshot_before = snapshot_current;
		options_current = { ...options_current, ...options_next };
		if (!isControlled()) {
			const values_enabled = getEnabledItems(options_current.items);
			const value_exists = values_enabled.some(
				(item_record) => item_record.value === value_internal,
			);
			if (!value_exists) value_internal = values_enabled[0]?.value ?? null;
		}
		const snapshot_next = createSnapshot();
		const has_snapshot_change =
			snapshot_before.value !== snapshot_next.value ||
			snapshot_before.items !== snapshot_next.items ||
			snapshot_before.orientation !== snapshot_next.orientation ||
			snapshot_before.loop !== snapshot_next.loop;
		if (has_snapshot_change) {
			notify();
		}
	}

	function setValue(
		value_next: string,
		reason: SpatialChangeReason = "programmatic",
	) {
		const item_next = options_current.items.find(
			(item_record) => item_record.value === value_next,
		);
		if (!item_next || item_next.disabled || value_next === getValue()) return;

		const value_previous = getValue();
		if (!isControlled()) value_internal = value_next;
		options_current.onValueChange?.({
			value: value_next,
			previousValue: value_previous,
			reason,
		});
		if (!isControlled()) notify();
	}

	function selectBoundary(position: "first" | "last", reason: SpatialChangeReason) {
		const items_enabled = getEnabledItems(options_current.items);
		const item_target =
			position === "first" ? items_enabled[0] : items_enabled.at(-1);
		if (item_target) setValue(item_target.value, reason);
	}

	function selectAdjacent(
		direction: NavigationDirection,
		reason: SpatialChangeReason,
	) {
		const value_next = getAdjacentValue(
			options_current.items,
			getValue(),
			direction,
			options_current.loop,
		);
		if (value_next) setValue(value_next, reason);
	}

	return {
		getSnapshot: () => snapshot_current,
		subscribe(listener) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		setOptions,
		setValue,
		selectNext: (reason = "next") => selectAdjacent(1, reason),
		selectPrevious: (reason = "previous") => selectAdjacent(-1, reason),
		selectFirst: (reason = "first") => selectBoundary("first", reason),
		selectLast: (reason = "last") => selectBoundary("last", reason),
	};
}
