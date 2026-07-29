"use client";

/*
THESIS: Component anatomy and spatial output are one system, not a marketing
hero followed by feature cards.
OWN-WORLD: Mineral surfaces, cobalt structure, acid status, aluminum display bases,
rulers, and square instrument controls.
STORY: Manipulate a real object, recognize the shared state contract, switch
framework syntax, and copy installation.
FIRST VIEWPORT: A 42/58 docs-and-live-scene split; Spatial.Item is registered
directly to the selected object.
FORM: Approved split docs + live demo, with the stage scale of Concept A.
*/

import {
	useEffect,
	useMemo,
	useRef,
	useState,
	type KeyboardEvent,
} from "react";
import { Spatial, useSpatial } from "@gnomon-ui/react";
import {
	mountSpatialRenderer,
	type SpatialRendererHost,
} from "@gnomon-ui/three";
import type {
	SpatialChangeDetails,
	SpatialChangeReason,
} from "@gnomon-ui/core";
import { demoItems, type DemoItem } from "./demo-items";
import {
	SpatialDemoEngine,
	type SpatialSceneAnchor,
} from "./SpatialDemoEngine";

type FrameworkName = "react" | "vue";
type DocsTab = "anatomy" | "props" | "events";
type PrimitiveName =
	| "root"
	| "scene"
	| "collection"
	| "item"
	| "label"
	| "next";

type EventEntry = {
	id: number;
	name: string;
	value: string;
};

const primitives: readonly {
	id: PrimitiveName;
	label: string;
	depth: number;
	description: string;
}[] = [
	{
		id: "root",
		label: "Spatial.Root",
		depth: 0,
		description: "Owns controlled or uncontrolled selection.",
	},
	{
		id: "scene",
		label: "Spatial.Scene",
		depth: 1,
		description: "Connects a renderer without owning its geometry.",
	},
	{
		id: "collection",
		label: "Spatial.Collection",
		depth: 1,
		description: "Defines orientation, order, and keyboard intent.",
	},
	{
		id: "item",
		label: "Spatial.Item",
		depth: 2,
		description: "Maps a semantic option to one spatial object.",
	},
	{
		id: "label",
		label: "Spatial.Label",
		depth: 2,
		description: "Mirrors selection in accessible DOM content.",
	},
	{
		id: "next",
		label: "Spatial.Next",
		depth: 1,
		description: "Advances through enabled items with loop rules.",
	},
] as const;

const prop_rows = [
	["value", "string | null", "Controlled selection"],
	["defaultValue", "string", "Initial uncontrolled value"],
	["orientation", "'horizontal' | 'vertical'", "Keyboard axis"],
	["loop", "boolean", "Wrap collection edges"],
] as const;

function getCodeLines(framework_name: FrameworkName, value_selected: string) {
	if (framework_name === "vue") {
		return [
			"import { ref } from 'vue'; import { Spatial } from '@gnomon-ui/vue'",
			`const selected = ref('${value_selected}')`,
			"<Spatial.Root v-model=\"selected\" :items=\"items\">",
			"  <Spatial.Scene as=\"canvas\" ref=\"scene\" />",
			"  <Spatial.Collection>",
			"    <Spatial.Item v-for=\"item in items\" :value=\"item.id\" />",
			"  </Spatial.Collection>",
			"  <Spatial.Label>{{ selected }}</Spatial.Label>",
			"  <Spatial.Next>Next</Spatial.Next>",
			"</Spatial.Root>",
		];
	}

	return [
		"import { Spatial } from '@gnomon-ui/react'",
		"",
		`<Spatial.Root items={items} value=\"${value_selected}\" onValueChange={handleChange}>`,
		"  <Spatial.Scene asChild><canvas ref={sceneRef} /></Spatial.Scene>",
		"  <Spatial.Collection>",
		"    {items.map((item) => (",
		"      <Spatial.Item key={item.id} value={item.id} />",
		"    ))}",
		"  </Spatial.Collection>",
		"  <Spatial.Label>{selected}</Spatial.Label>",
		"  <Spatial.Next>Next</Spatial.Next>",
		"</Spatial.Root>",
	];
}

function getHighlightedCodeLine(
	framework_name: FrameworkName,
	primitive_active: PrimitiveName,
) {
	const map_react: Record<PrimitiveName, number> = {
		root: 2,
		scene: 3,
		collection: 4,
		item: 6,
		label: 9,
		next: 10,
	};
	const map_vue: Record<PrimitiveName, number> = {
		root: 2,
		scene: 3,
		collection: 4,
		item: 5,
		label: 7,
		next: 8,
	};
	return framework_name === "react"
		? map_react[primitive_active]
		: map_vue[primitive_active];
}

function CubeMark() {
	return (
		<svg viewBox="0 0 32 32" aria-hidden="true">
			<path d="m16 2 12 7v14l-12 7-12-7V9l12-7Z" />
			<path d="m4 9 12 7 12-7M16 16v14" />
		</svg>
	);
}

function DirectionIcon({ direction }: { direction: "previous" | "next" }) {
	return (
		<svg viewBox="0 0 20 20" aria-hidden="true">
			{direction === "previous" ? (
				<path d="m12.5 4.5-5 5.5 5 5.5" />
			) : (
				<path d="m7.5 4.5 5 5.5-5 5.5" />
			)}
		</svg>
	);
}

function moveSegmentSelection<Option extends string>(
	event: KeyboardEvent<HTMLButtonElement>,
	options: readonly Option[],
	option_current: Option,
	setOption: (option_next: Option) => void,
) {
	const index_current = options.indexOf(option_current);
	let index_next = index_current;
	if (event.key === "ArrowRight") index_next = (index_current + 1) % options.length;
	else if (event.key === "ArrowLeft") {
		index_next = (index_current - 1 + options.length) % options.length;
	} else if (event.key === "Home") index_next = 0;
	else if (event.key === "End") index_next = options.length - 1;
	else return;
	event.preventDefault();
	const option_next = options[index_next];
	if (!option_next) return;
	setOption(option_next);
	const buttons_group = event.currentTarget.parentElement?.querySelectorAll("button");
	(buttons_group?.[index_next] as HTMLButtonElement | undefined)?.focus();
}

type RegistrationGeometry = {
	width: number;
	height: number;
	start_x: number;
	start_y: number;
	end_x: number;
	end_y: number;
};

function RegistrationLine({
	primitive_active,
	scene_anchor,
	is_visible,
}: {
	primitive_active: PrimitiveName;
	scene_anchor: SpatialSceneAnchor;
	is_visible: boolean;
}) {
	const [geometry, setGeometry] = useState<RegistrationGeometry | null>(null);
	const anchor_ref = useRef(scene_anchor);
	const update_ref = useRef<() => void>(() => undefined);

	useEffect(() => {
		anchor_ref.current = scene_anchor;
		update_ref.current();
	}, [scene_anchor]);

	useEffect(() => {
		if (!is_visible) return;
		const app_element = document.querySelector<HTMLElement>(".gnomon-app");
		const row_element = document.querySelector<HTMLElement>(
			`[data-primitive="${primitive_active}"]`,
		);
		const canvas_element = document.querySelector<HTMLCanvasElement>(
			'[data-testid="spatial-canvas"]',
		);
		if (!app_element || !row_element || !canvas_element) return;
		const app_target = app_element;
		const row_target = row_element;
		const canvas_target = canvas_element;

		function updateGeometry() {
			const bounds_app = app_target.getBoundingClientRect();
			const bounds_row = row_target.getBoundingClientRect();
			const bounds_canvas = canvas_target.getBoundingClientRect();
			const anchor_current = anchor_ref.current;
			setGeometry({
				width: bounds_app.width,
				height: bounds_app.height,
				start_x: bounds_row.right - bounds_app.left,
				start_y: bounds_row.top - bounds_app.top + bounds_row.height * 0.5,
				end_x:
					bounds_canvas.left -
					bounds_app.left +
					bounds_canvas.width * anchor_current.x,
				end_y:
					bounds_canvas.top -
					bounds_app.top +
					bounds_canvas.height * anchor_current.y,
			});
		}

		update_ref.current = updateGeometry;
		const observer_resize = new ResizeObserver(updateGeometry);
		observer_resize.observe(app_target);
		observer_resize.observe(row_target);
		observer_resize.observe(canvas_target);
		updateGeometry();
		return () => {
			update_ref.current = () => undefined;
			observer_resize.disconnect();
		};
	}, [is_visible, primitive_active]);

	if (!is_visible || !geometry) return null;
	const elbow_start = Math.min(
		geometry.start_x + 120,
		geometry.end_x - 80,
	);
	const elbow_end = geometry.end_x - 56;
	const path_line = [
		`M ${geometry.start_x} ${geometry.start_y}`,
		`H ${elbow_start}`,
		`L ${elbow_end} ${geometry.end_y}`,
		`H ${geometry.end_x}`,
	].join(" ");

	return (
		<svg
			className="registration-line"
			viewBox={`0 0 ${geometry.width} ${geometry.height}`}
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			<path d={path_line} />
			<circle cx={geometry.start_x} cy={geometry.start_y} r="4" />
			<circle cx={geometry.end_x} cy={geometry.end_y} r="4" />
		</svg>
	);
}

function DocsHeader() {
	return (
		<header className="gnomon-header">
			<a className="brand-lockup" href="#top" aria-label="Gnomon UI home">
				<span className="brand-mark">
					<CubeMark />
				</span>
				<span>GNOMON UI</span>
				<small>v0.1</small>
			</a>
			<nav className="primary-nav" aria-label="Primary navigation">
				<a href="#anatomy">Primitives</a>
				<a href="#adapters">Adapters</a>
				<a href="#stage">Example</a>
			</nav>
			<div className="header-readout" aria-label="Project status">
				<span>
					<i />
					CORE / FRAMEWORK AGNOSTIC
				</span>
				<a href="#installation">GET STARTED</a>
			</div>
		</header>
	);
}

function IntroPanel({
	framework_name,
	setFramework,
}: {
	framework_name: FrameworkName;
	setFramework: (framework_name: FrameworkName) => void;
}) {
	return (
		<section className="docs-intro" id="top" aria-labelledby="page-title">
			<div className="intro-kicker">
				<span>OPEN-SOURCE UI PRIMITIVES</span>
				<span aria-hidden="true">X / Y / Z</span>
			</div>
			<h1 id="page-title">Accessible primitives for spatial interfaces.</h1>
			<div className="intro-footer">
				<p>
					Headless state. Composable scenes.
					<br />
					Your framework. Your rendering.
				</p>
				<div className="framework-switch" id="adapters">
					<span>ADAPTER</span>
					<div role="group" aria-label="Framework adapter">
						{(["react", "vue"] as const).map((framework_option) => (
							<button
								key={framework_option}
								type="button"
								aria-pressed={framework_name === framework_option}
								data-state={
									framework_name === framework_option ? "active" : "inactive"
								}
								onClick={() => setFramework(framework_option)}
								onKeyDown={(event) =>
									moveSegmentSelection(
										event,
										["react", "vue"] as const,
										framework_name,
										setFramework,
									)
								}
							>
								{framework_option === "react" ? "React" : "Vue"}
							</button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function AnatomyPanel({
	tab_active,
	setTab,
	primitive_active,
	setPrimitive,
	events,
}: {
	tab_active: DocsTab;
	setTab: (tab_name: DocsTab) => void;
	primitive_active: PrimitiveName;
	setPrimitive: (primitive_name: PrimitiveName) => void;
	events: readonly EventEntry[];
}) {
	const primitive_selected = primitives.find(
		(primitive_item) => primitive_item.id === primitive_active,
	)!;

	return (
		<section className="docs-workbench" id="anatomy" aria-label="Primitive anatomy">
			<div className="docs-tabs" role="tablist" aria-label="Primitive reference">
				{(["anatomy", "props", "events"] as const).map((tab_name) => (
					<button
						key={tab_name}
						id={`tab-${tab_name}`}
						type="button"
						role="tab"
						aria-selected={tab_active === tab_name}
						aria-controls={`panel-${tab_name}`}
						tabIndex={tab_active === tab_name ? 0 : -1}
						data-state={tab_active === tab_name ? "active" : "inactive"}
						onClick={() => setTab(tab_name)}
						onKeyDown={(event) =>
							moveSegmentSelection(
								event,
								["anatomy", "props", "events"] as const,
								tab_active,
								setTab,
							)
						}
					>
						{tab_name}
					</button>
				))}
			</div>

			<div
				className="docs-tab-panel"
				id={`panel-${tab_active}`}
				role="tabpanel"
				aria-labelledby={`tab-${tab_active}`}
			>
				{tab_active === "anatomy" ? (
					<div className="anatomy-layout">
						<div className="primitive-tree">
							{primitives.map((primitive_item) => (
								<button
									key={primitive_item.id}
									type="button"
									className="primitive-row"
									data-primitive={primitive_item.id}
									style={
										{
											"--primitive-depth": primitive_item.depth,
										} as React.CSSProperties
									}
									data-state={
										primitive_active === primitive_item.id
											? "active"
											: "inactive"
									}
									onClick={() => setPrimitive(primitive_item.id)}
								>
									<span className="primitive-glyph" aria-hidden="true">
										{primitive_item.id === "item" ? "●" : "◇"}
									</span>
									<span>{primitive_item.label}</span>
									<i aria-hidden="true" />
								</button>
							))}
						</div>
						<div className="primitive-note" aria-live="polite">
							<span>{primitive_selected.label}</span>
							<p>{primitive_selected.description}</p>
						</div>
					</div>
				) : null}

				{tab_active === "props" ? (
					<div className="props-table">
						{prop_rows.map(([name_prop, type_prop, detail_prop]) => (
							<div key={name_prop}>
								<code>{name_prop}</code>
								<span>{type_prop}</span>
								<p>{detail_prop}</p>
							</div>
						))}
					</div>
				) : null}

				{tab_active === "events" ? (
					<div className="events-list">
						{events.length > 0 ? (
							events.map((event_entry) => (
								<div key={event_entry.id}>
									<span>EVENT</span>
									<code>{event_entry.name}</code>
									<strong>→ {event_entry.value}</strong>
								</div>
							))
						) : (
							<div className="events-empty">
								<span>WAITING</span>
								<p>Select an object to inspect the shared event stream.</p>
							</div>
						)}
					</div>
				) : null}
			</div>
		</section>
	);
}

function CodePanel({
	framework_name,
	setFramework,
	value_selected,
	primitive_active,
}: {
	framework_name: FrameworkName;
	setFramework: (framework_name: FrameworkName) => void;
	value_selected: string;
	primitive_active: PrimitiveName;
}) {
	const [copy_status, setCopyStatus] = useState<"idle" | "copied" | "error">(
		"idle",
	);
	const command_install =
		framework_name === "react"
			? "pnpm add @gnomon-ui/react @gnomon-ui/three"
			: "pnpm add @gnomon-ui/vue @gnomon-ui/three";
	const lines_code = getCodeLines(framework_name, value_selected);
	const line_highlighted = getHighlightedCodeLine(
		framework_name,
		primitive_active,
	);

	async function copyInstallCommand() {
		try {
			await navigator.clipboard.writeText(command_install);
			setCopyStatus("copied");
			window.setTimeout(() => setCopyStatus("idle"), 1600);
		} catch {
			setCopyStatus("error");
		}
	}

	return (
		<section className="code-panel" id="installation" aria-label="Installation and code">
			<div className="code-toolbar">
				<div role="group" aria-label="Code framework">
					{(["react", "vue"] as const).map((framework_option) => (
						<button
							key={framework_option}
							type="button"
							aria-pressed={framework_name === framework_option}
							data-state={
								framework_name === framework_option ? "active" : "inactive"
							}
							onClick={() => setFramework(framework_option)}
							onKeyDown={(event) =>
								moveSegmentSelection(
									event,
									["react", "vue"] as const,
									framework_name,
									setFramework,
								)
							}
						>
							{framework_option === "react" ? "REACT" : "VUE"}
						</button>
					))}
				</div>
				<span>CONTROLLED STATE / TYPESCRIPT</span>
			</div>
			<div className="code-lines" aria-label={`${framework_name} code example`}>
				{lines_code.map((line_code, index_line) => (
					<div
						key={`${index_line}-${line_code}`}
						data-state={
							index_line === line_highlighted ? "highlighted" : "default"
						}
					>
						<span>{String(index_line + 1).padStart(2, "0")}</span>
						<code>{line_code || " "}</code>
					</div>
				))}
			</div>
			<div className="install-row">
				<span>INSTALL</span>
				<code>{command_install}</code>
				<button
					type="button"
					onClick={copyInstallCommand}
					aria-label="Copy install command"
				>
					{copy_status === "copied"
						? "COPIED"
						: copy_status === "error"
							? "COPY UNAVAILABLE"
							: "COPY"}
				</button>
			</div>
		</section>
	);
}

function SceneCanvas({
	items,
	reason_last,
	setStatus,
	setReady,
	setReason,
	setFailure,
	setAnchor,
}: {
	items: readonly DemoItem[];
	reason_last: SpatialChangeReason;
	setStatus: (status_message: string) => void;
	setReady: (is_ready: boolean) => void;
	setReason: (reason: SpatialChangeReason) => void;
	setFailure: (has_failed: boolean) => void;
	setAnchor: (anchor_next: SpatialSceneAnchor) => void;
}) {
	const canvas_ref = useRef<HTMLCanvasElement>(null);
	const host_ref = useRef<SpatialRendererHost<DemoItem> | null>(null);
	const spatial = useSpatial();
	const spatial_ref = useRef(spatial);

	useEffect(() => {
		spatial_ref.current = spatial;
	}, [spatial]);

	useEffect(() => {
		if (!canvas_ref.current) return;
		let host_scene: SpatialRendererHost<DemoItem> | null = null;
		try {
			host_scene = mountSpatialRenderer(
				{
					canvas: canvas_ref.current,
					items,
					value: spatial_ref.current.value,
					onReady: () => {
						setFailure(false);
						setReady(true);
					},
					onStatus: setStatus,
					onValueChange: (value_next, reason) => {
						setReason(reason);
						spatial_ref.current.setValue(value_next, reason);
					},
				},
				(context_scene) => new SpatialDemoEngine(context_scene, setAnchor),
			);
			host_ref.current = host_scene;
		} catch {
			setReady(false);
			setFailure(true);
			setStatus("WebGL unavailable · semantic controls remain active");
		}
		return () => {
			host_scene?.dispose();
			host_ref.current = null;
		};
	}, [items, setAnchor, setFailure, setReady, setReason, setStatus]);

	useEffect(() => {
		host_ref.current?.setValue(spatial.value, {
			reason: reason_last,
			immediate: reason_last === "keyboard",
		});
	}, [reason_last, spatial.value]);

	function handleKeyDown(event: KeyboardEvent<HTMLCanvasElement>) {
		if (event.key === "ArrowRight" || event.key === "ArrowDown") {
			event.preventDefault();
			setReason("keyboard");
			spatial.selectNext("keyboard");
		}
		if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
			event.preventDefault();
			setReason("keyboard");
			spatial.selectPrevious("keyboard");
		}
		if (event.key === "Home") {
			event.preventDefault();
			setReason("keyboard");
			spatial.selectFirst("keyboard");
		}
		if (event.key === "End") {
			event.preventDefault();
			setReason("keyboard");
			spatial.selectLast("keyboard");
		}
	}

	return (
		<canvas
			ref={canvas_ref}
			className="scene-canvas"
			data-testid="spatial-canvas"
			role="application"
			tabIndex={0}
			aria-label={`Interactive spatial collection of ${items.length} objects. Drag, scroll, click an object, or use arrow keys to change selection.`}
			aria-describedby="scene-help"
			onKeyDown={handleKeyDown}
		/>
	);
}

function SceneFallback({
	items,
	value_selected,
}: {
	items: readonly DemoItem[];
	value_selected: string | null;
}) {
	return (
		<div className="scene-fallback" role="img" aria-label="Spatial collection fallback">
			<div className="fallback-track" aria-hidden="true">
				{items.map((item_data, index_item) => (
					<div
						key={item_data.id}
						className="fallback-object"
						data-kind={item_data.kind}
						data-state={
							item_data.id === value_selected ? "active" : "inactive"
						}
						style={
							{
								"--object-color": item_data.color,
								"--object-accent": item_data.accent,
								"--object-index": index_item,
							} as React.CSSProperties
						}
					>
						<span className="fallback-model">
							<i />
						</span>
						<span className="fallback-base" />
						<small>{item_data.id}</small>
					</div>
				))}
			</div>
			<p>
				<span>RENDERER FALLBACK</span>
				<strong>Selection and accessibility state remain fully active.</strong>
			</p>
		</div>
	);
}

function AxisGizmo() {
	return (
		<div className="axis-gizmo" aria-hidden="true">
			<span className="axis-y">Y</span>
			<span className="axis-x">X</span>
			<span className="axis-z">Z</span>
			<i />
		</div>
	);
}

function LiveStage({
	items,
	reason_last,
	setReason,
	setAnchor,
}: {
	items: readonly DemoItem[];
	reason_last: SpatialChangeReason;
	setReason: (reason: SpatialChangeReason) => void;
	setAnchor: (anchor_next: SpatialSceneAnchor) => void;
}) {
	const spatial = useSpatial();
	const [is_ready, setReady] = useState(false);
	const [has_renderer_error, setRendererError] = useState(false);
	const [status_scene, setStatus] = useState("Initializing renderer");
	const item_selected =
		items.find((item_data) => item_data.id === spatial.value) ?? items[0]!;

	return (
		<Spatial.Scene asChild>
			<section className="stage-panel" id="stage" aria-label="Live spatial demo">
			<div className="stage-status">
				<span>
					<i
						data-state={
							is_ready || has_renderer_error ? "ready" : "loading"
						}
					/>
					{has_renderer_error
						? "FALLBACK / DOM"
						: is_ready
							? "LIVE / WEBGL"
							: "LOADING / WEBGL"}
				</span>
				<span>COLLECTION / {String(items.length).padStart(2, "0")}</span>
				<span>
					STATE / <strong>SELECTED</strong>
				</span>
			</div>

			<div className="stage-viewport">
				<SceneCanvas
					items={items}
					reason_last={reason_last}
					setStatus={setStatus}
					setReady={setReady}
					setReason={setReason}
					setFailure={setRendererError}
					setAnchor={setAnchor}
				/>
				{has_renderer_error ? (
					<SceneFallback items={items} value_selected={spatial.value} />
				) : null}
				<div className="stage-title" aria-hidden="true">
					<span>PRIMITIVES</span>
					<span>IN SPACE</span>
				</div>
				<AxisGizmo />
				<div className="measure-horizontal" aria-hidden="true">
					<span>160</span>
				</div>
				<div className="measure-vertical" aria-hidden="true">
					<span>240</span>
				</div>
				<div className="selected-readout" aria-hidden="true">
					<span>SELECTED OBJECT</span>
					<strong>{item_selected.id}</strong>
				</div>

				<Spatial.Collection
					className="object-index"
					aria-label="Demo object collection"
				>
					{items.map((item_data, index_item) => (
						<Spatial.Item
							key={item_data.id}
							value={item_data.id}
							asChild
						>
							<button
								type="button"
								aria-label={`Select ${item_data.label}`}
								title={item_data.label}
							>
								<span>{String(index_item + 1).padStart(2, "0")}</span>
								<i />
							</button>
						</Spatial.Item>
					))}
				</Spatial.Collection>

				<aside className="selection-inspector" aria-label="Selected item">
					<div className="inspector-heading">
						<span>SELECTED ITEM</span>
						<i aria-hidden="true" />
					</div>
					<Spatial.Label className="inspector-id">
						{({ value }) => value ?? "No selection"}
					</Spatial.Label>
					<p className="inspector-state">
						DATA-STATE: <strong>active</strong>
					</p>
					<dl>
						<div>
							<dt>TYPE</dt>
							<dd>{item_selected.kind}</dd>
						</div>
						<div>
							<dt>SIZE</dt>
							<dd>{item_selected.dimensions}</dd>
						</div>
						<div>
							<dt>INPUT</dt>
							<dd>{reason_last}</dd>
						</div>
					</dl>
					<div className="inspector-actions">
						<Spatial.Previous asChild>
							<button type="button" aria-label="Previous object">
								<DirectionIcon direction="previous" />
								<span>PREV</span>
							</button>
						</Spatial.Previous>
						<Spatial.Next asChild>
							<button type="button" aria-label="Next object">
								<DirectionIcon direction="next" />
								<span>NEXT</span>
							</button>
						</Spatial.Next>
					</div>
				</aside>

				<p className="scene-help" id="scene-help">
					<span>{status_scene}</span>
					<span>DRAG · SCROLL · ARROW KEYS</span>
				</p>
			</div>
			</section>
		</Spatial.Scene>
	);
}

export function GnomonDemo() {
	const records_spatial = useMemo(
		() => demoItems.map((item_data) => ({ value: item_data.id })),
		[],
	);
	const [value_selected, setSelected] = useState(demoItems[0]!.id);
	const [framework_name, setFramework] = useState<FrameworkName>("react");
	const [tab_active, setTab] = useState<DocsTab>("anatomy");
	const [primitive_active, setPrimitive] =
		useState<PrimitiveName>("item");
	const [reason_last, setReason] =
		useState<SpatialChangeReason>("programmatic");
	const [scene_anchor, setSceneAnchor] = useState<SpatialSceneAnchor>({
		x: 0.58,
		y: 0.5,
	});
	const [events, setEvents] = useState<EventEntry[]>([]);

	function handleValueChange(details: SpatialChangeDetails) {
		setSelected(details.value);
		setReason(details.reason);
		setEvents((events_current) => [
			{
				id: performance.now(),
				name: "onValueChange",
				value: details.value,
			},
			...events_current,
		].slice(0, 3));
	}

	return (
		<Spatial.Root
			items={records_spatial}
			value={value_selected}
			onValueChange={handleValueChange}
			orientation="horizontal"
			loop
		>
			<main className="gnomon-app">
				<DocsHeader />
				<div className="gnomon-main">
					<aside className="docs-panel">
						<IntroPanel
							framework_name={framework_name}
							setFramework={setFramework}
						/>
						<AnatomyPanel
							tab_active={tab_active}
							setTab={setTab}
							primitive_active={primitive_active}
							setPrimitive={setPrimitive}
							events={events}
						/>
						<CodePanel
							framework_name={framework_name}
							setFramework={setFramework}
							value_selected={value_selected}
							primitive_active={primitive_active}
						/>
					</aside>
					<LiveStage
						items={demoItems}
						reason_last={reason_last}
						setReason={setReason}
						setAnchor={setSceneAnchor}
					/>
				</div>
				<RegistrationLine
					primitive_active={primitive_active}
					scene_anchor={scene_anchor}
					is_visible={tab_active === "anatomy"}
				/>
				<p className="sr-only" aria-live="polite">
					Selected {value_selected}. Input source: {reason_last}.
				</p>
			</main>
		</Spatial.Root>
	);
}
