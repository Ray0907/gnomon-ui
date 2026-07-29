"use client";

import {
	createContext,
	Children,
	cloneElement,
	forwardRef,
	isValidElement,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
	type ButtonHTMLAttributes,
	type ElementType,
	type HTMLAttributes,
	type KeyboardEvent,
	type ReactNode,
	type Ref,
} from "react";
import {
	createSpatialStore,
	getAdjacentValue,
	getItemState,
	getNavigationReason,
	getSpatialItemId,
	type SpatialChangeDetails,
	type SpatialItemRecord,
	type SpatialOrientation,
	type SpatialSnapshot,
	type SpatialStore,
} from "@gnomon-ui/core";

type EventHandler = (...arguments_event: unknown[]) => void;
type ElementProps = Record<string, unknown> & {
	className?: string;
	onClick?: EventHandler;
};

type SpatialContextValue = {
	store: SpatialStore;
	id_base: string;
};

type SpatialCollectionContextValue = {
	element_collection: React.RefObject<HTMLElement | null>;
	id_base: string;
};

const SpatialContext = createContext<SpatialContextValue | null>(null);
const SpatialCollectionContext =
	createContext<SpatialCollectionContextValue | null>(null);

function composeRefs(
	ref_forwarded: React.ForwardedRef<HTMLElement>,
	ref_child: React.Ref<HTMLElement> | undefined,
) {
	return (node_element: HTMLElement | null) => {
		for (const ref_item of [ref_forwarded, ref_child]) {
			if (typeof ref_item === "function") ref_item(node_element);
			else if (ref_item) ref_item.current = node_element;
		}
	};
}

function mergeSlotProps(props_child: ElementProps, props_slot: ElementProps) {
	const props_merged = { ...props_child, ...props_slot };
	for (const key_name of Object.keys(props_slot)) {
		if (!key_name.startsWith("on")) continue;
		const handler_child = props_child[key_name] as EventHandler | undefined;
		const handler_slot = props_slot[key_name] as EventHandler | undefined;
		if (!handler_child || !handler_slot) continue;
		props_merged[key_name] = (...arguments_event: unknown[]) => {
			handler_child(...arguments_event);
			handler_slot(...arguments_event);
		};
	}
	if (props_child.className && props_slot.className) {
		props_merged.className = `${props_child.className} ${props_slot.className}`;
	}
	return props_merged;
}

const Slot = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
	function Slot({ children, ...props_slot }, ref_forwarded) {
		const child_element = Children.only(children);
		if (!isValidElement<ElementProps>(child_element)) return null;
		const props_merged = mergeSlotProps(
			child_element.props as unknown as ElementProps,
			props_slot as unknown as ElementProps,
		);
		return cloneElement(child_element, {
			...props_merged,
			ref: composeRefs(
				ref_forwarded,
				(child_element.props as { ref?: React.Ref<HTMLElement> }).ref,
			),
		});
	},
);

function useSpatialContext(component_name: string) {
	const context_value = useContext(SpatialContext);
	if (!context_value) {
		throw new Error(`${component_name} must be used inside Spatial.Root.`);
	}
	return context_value;
}

function useSpatialCollectionContext(component_name: string) {
	const context_value = useContext(SpatialCollectionContext);
	if (!context_value) {
		throw new Error(`${component_name} must be used inside Spatial.Collection.`);
	}
	return context_value;
}

export function useSpatial() {
	const { store } = useSpatialContext("useSpatial");
	const snapshot = useSyncExternalStore(
		store.subscribe,
		store.getSnapshot,
		store.getSnapshot,
	);
	return useMemo(
		() => ({
			...snapshot,
			setValue: store.setValue,
			selectNext: store.selectNext,
			selectPrevious: store.selectPrevious,
			selectFirst: store.selectFirst,
			selectLast: store.selectLast,
		}),
		[snapshot, store],
	);
}

export type SpatialRootProps = {
	children: ReactNode;
	items: readonly SpatialItemRecord[];
	value?: string | null;
	defaultValue?: string | null;
	orientation?: SpatialOrientation;
	loop?: boolean;
	onValueChange?: (details: SpatialChangeDetails) => void;
};

function SpatialRoot({
	children,
	items,
	value,
	defaultValue,
	orientation = "horizontal",
	loop = false,
	onValueChange,
}: SpatialRootProps) {
	const id_base = useId();
	const [store] = useState(() =>
		createSpatialStore({
			items,
			value,
			defaultValue,
			orientation,
			loop,
			onValueChange,
		}),
	);

	useEffect(() => {
		store.setOptions({
			items,
			value,
			orientation,
			loop,
			onValueChange,
		});
	}, [items, loop, onValueChange, orientation, store, value]);

	const context_value = useMemo(
		() => ({ store, id_base }),
		[id_base, store],
	);
	return (
		<SpatialContext.Provider value={context_value}>
			{children}
		</SpatialContext.Provider>
	);
}

export type SpatialCollectionProps = HTMLAttributes<HTMLElement> & {
	asChild?: boolean;
};

export type SpatialSceneProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
	children:
		| ReactNode
		| ((snapshot: SpatialSnapshot) => ReactNode);
	asChild?: boolean;
};

const SpatialScene = forwardRef<HTMLElement, SpatialSceneProps>(
	function SpatialScene(
		{ asChild = false, children, ...props_scene },
		ref_forwarded,
	) {
		const spatial = useSpatial();
		const Component: ElementType = asChild ? Slot : "div";
		const content =
			typeof children === "function" ? children(spatial) : children;
		return (
			<Component
				{...props_scene}
				ref={ref_forwarded as Ref<HTMLDivElement>}
				data-gnomon-scene=""
			>
				{content}
			</Component>
		);
	},
);

const SpatialCollection = forwardRef<HTMLElement, SpatialCollectionProps>(
	function SpatialCollection(
		{ asChild = false, onKeyDown, ...props_collection },
		ref_forwarded,
	) {
		const { id_base } = useSpatialContext("Spatial.Collection");
		const spatial = useSpatial();
		const id_collection = useId();
		const element_collection = useRef<HTMLElement>(null);
		const id_base_collection = `${id_base}-${id_collection}`;
		const Component: ElementType = asChild ? Slot : "div";
		const context_collection = useMemo(
			() => ({
				element_collection,
				id_base: id_base_collection,
			}),
			[id_base_collection],
		);

		function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
			onKeyDown?.(event);
			if (event.defaultPrevented) return;
			const direction_text =
				getComputedStyle(event.currentTarget).direction === "rtl"
					? "rtl"
					: "ltr";
			const reason = getNavigationReason(
				event.key,
				spatial.orientation,
				direction_text,
			);
			if (!reason) return;
			event.preventDefault();
			if (reason === "next") spatial.selectNext("keyboard");
			if (reason === "previous") spatial.selectPrevious("keyboard");
			if (reason === "first") spatial.selectFirst("keyboard");
			if (reason === "last") spatial.selectLast("keyboard");
		}

		return (
			<SpatialCollectionContext.Provider value={context_collection}>
				<Component
					{...props_collection}
					ref={composeRefs(ref_forwarded, element_collection)}
					role="listbox"
					tabIndex={props_collection.tabIndex ?? 0}
					aria-activedescendant={
						spatial.value !== null
							? getSpatialItemId(id_base_collection, spatial.value)
							: undefined
					}
					aria-orientation={spatial.orientation}
					data-orientation={spatial.orientation}
					data-gnomon-collection=""
					onKeyDown={handleKeyDown}
				/>
			</SpatialCollectionContext.Provider>
		);
	},
);

export type SpatialItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	value: string;
	asChild?: boolean;
};

const SpatialItem = forwardRef<HTMLElement, SpatialItemProps>(
	function SpatialItem(
		{ value, asChild = false, disabled, onClick, ...props_item },
		ref_forwarded,
	) {
		const { element_collection, id_base } =
			useSpatialCollectionContext("Spatial.Item");
		const spatial = useSpatial();
		const item_record = spatial.items.find(
			(item_candidate) => item_candidate.value === value,
		);
		const is_disabled = disabled ?? item_record?.disabled ?? false;
		const is_active = spatial.value === value;
		const Component: ElementType = asChild ? Slot : "button";

		function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
			onClick?.(event);
			if (is_disabled) return;
			if (!event.defaultPrevented) spatial.setValue(value, "item");
			element_collection.current?.focus({ preventScroll: true });
		}

		return (
			<Component
				{...props_item}
				{...getItemState(value, spatial)}
				ref={ref_forwarded as Ref<HTMLButtonElement>}
				id={getSpatialItemId(id_base, value)}
				type={asChild ? undefined : "button"}
				role="option"
				aria-selected={is_active}
				aria-disabled={is_disabled || undefined}
				disabled={asChild ? undefined : is_disabled}
				tabIndex={-1}
				data-gnomon-item=""
				data-gnomon-value={value}
				onClick={handleClick}
			/>
		);
	},
);

type DirectionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	asChild?: boolean;
};

function createDirectionButton(direction: "previous" | "next") {
	return forwardRef<HTMLElement, DirectionButtonProps>(function DirectionButton(
		{ asChild = false, disabled, onClick, ...props_button },
		ref_forwarded,
	) {
		const spatial = useSpatial();
		const direction_step = direction === "next" ? 1 : -1;
		const value_next = getAdjacentValue(
			spatial.items,
			spatial.value,
			direction_step,
			spatial.loop,
		);
		const is_disabled =
			disabled || value_next === null || value_next === spatial.value;
		const Component: ElementType = asChild ? Slot : "button";

		function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
			onClick?.(event);
			if (event.defaultPrevented || is_disabled) return;
			if (direction === "next") spatial.selectNext();
			else spatial.selectPrevious();
		}

		return (
			<Component
				{...props_button}
				ref={ref_forwarded as Ref<HTMLButtonElement>}
				type={asChild ? undefined : "button"}
				disabled={asChild ? undefined : is_disabled}
				aria-disabled={is_disabled || undefined}
				data-disabled={is_disabled ? "" : undefined}
				data-gnomon-direction={direction}
				onClick={handleClick}
			/>
		);
	});
}

const SpatialPrevious = createDirectionButton("previous");
const SpatialNext = createDirectionButton("next");

export type SpatialLabelProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
	children:
		| ReactNode
		| ((snapshot: SpatialSnapshot) => ReactNode);
	asChild?: boolean;
};

const SpatialLabel = forwardRef<HTMLElement, SpatialLabelProps>(
	function SpatialLabel(
		{ asChild = false, children, ...props_label },
		ref_forwarded,
	) {
		const spatial = useSpatial();
		const Component: ElementType = asChild ? Slot : "span";
		const content =
			typeof children === "function" ? children(spatial) : children;
		return (
			<Component
				{...props_label}
				ref={ref_forwarded}
				data-gnomon-label=""
			>
				{content}
			</Component>
		);
	},
);

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
	SpatialCollection,
	SpatialItem,
	SpatialLabel,
	SpatialNext,
	SpatialPrevious,
	SpatialRoot,
	SpatialScene,
};
