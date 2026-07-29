import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { SpatialChangeReason } from "@gnomon-ui/core";
import type {
	SpatialRendererAdapter,
	SpatialRendererContext,
	SpatialRendererUpdate,
} from "@gnomon-ui/three";
import type { DemoItem, DemoItemKind } from "./demo-items";

type RuntimeItem = {
	data: DemoItem;
	root: THREE.Group;
	model: THREE.Group;
	pickTargets: THREE.Object3D[];
	angleBase: number;
	hover: number;
	targetHover: number;
};

type EngineContext = SpatialRendererContext<DemoItem>;

export type SpatialSceneAnchor = {
	x: number;
	y: number;
};

const color_mineral = new THREE.Color("#f4f5f1");
const color_cobalt = new THREE.Color("#173fff");
const radius_track = 3.18;
const depth_track = 1.72;
const clamp = THREE.MathUtils.clamp;

function createPhysicalMaterial(
	color_value: string,
	options: Partial<THREE.MeshPhysicalMaterialParameters> = {},
) {
	return new THREE.MeshPhysicalMaterial({
		color: color_value,
		roughness: 0.48,
		metalness: 0.04,
		...options,
	});
}

function configureMesh(
	mesh_object: THREE.Mesh,
	id_value: string,
	pick_targets: THREE.Object3D[],
) {
	mesh_object.castShadow = true;
	mesh_object.receiveShadow = true;
	mesh_object.userData.id_value = id_value;
	pick_targets.push(mesh_object);
}

function createDisplayBase(id_value: string, pick_targets: THREE.Object3D[]) {
	const material_metal = createPhysicalMaterial("#b8bdb8", {
		roughness: 0.3,
		metalness: 0.72,
	});
	const base_mesh = new THREE.Mesh(
		new RoundedBoxGeometry(1.18, 0.18, 0.82, 4, 0.035),
		material_metal,
	);
	base_mesh.position.y = 0.09;
	configureMesh(base_mesh, id_value, pick_targets);

	const inset_mesh = new THREE.Mesh(
		new RoundedBoxGeometry(0.9, 0.012, 0.59, 2, 0.01),
		createPhysicalMaterial("#ecf0eb", {
			roughness: 0.42,
			metalness: 0.32,
		}),
	);
	inset_mesh.position.y = 0.184;
	configureMesh(inset_mesh, id_value, pick_targets);

	const group_base = new THREE.Group();
	group_base.add(base_mesh, inset_mesh);
	return group_base;
}

function createBookModel(item_data: DemoItem, pick_targets: THREE.Object3D[]) {
	const group_model = new THREE.Group();
	const cover_mesh = new THREE.Mesh(
		new RoundedBoxGeometry(0.82, 1.24, 0.16, 5, 0.024),
		createPhysicalMaterial(item_data.color, {
			roughness: 0.31,
			clearcoat: 0.2,
			clearcoatRoughness: 0.52,
		}),
	);
	cover_mesh.position.y = 0.8;
	configureMesh(cover_mesh, item_data.id, pick_targets);

	const page_mesh = new THREE.Mesh(
		new RoundedBoxGeometry(0.755, 1.16, 0.145, 4, 0.018),
		createPhysicalMaterial("#e8eae4", { roughness: 0.86 }),
	);
	page_mesh.position.set(0.018, 0.8, 0.012);
	configureMesh(page_mesh, item_data.id, pick_targets);

	const jacket_mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(0.78, 1.2),
		createPhysicalMaterial(item_data.color, {
			roughness: 0.24,
			side: THREE.DoubleSide,
		}),
	);
	jacket_mesh.position.set(0, 0.8, 0.087);
	configureMesh(jacket_mesh, item_data.id, pick_targets);

	const circle_mesh = new THREE.Mesh(
		new THREE.CircleGeometry(0.17, 48),
		createPhysicalMaterial(item_data.accent, { roughness: 0.35 }),
	);
	circle_mesh.position.set(0.08, 0.84, 0.092);
	configureMesh(circle_mesh, item_data.id, pick_targets);

	const rule_mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(0.48, 0.012),
		createPhysicalMaterial(item_data.accent),
	);
	rule_mesh.position.set(-0.06, 0.39, 0.094);
	configureMesh(rule_mesh, item_data.id, pick_targets);
	group_model.add(cover_mesh, page_mesh, jacket_mesh, circle_mesh, rule_mesh);
	return group_model;
}

function createLampModel(item_data: DemoItem, pick_targets: THREE.Object3D[]) {
	const group_model = new THREE.Group();
	const material_dark = createPhysicalMaterial(item_data.color, {
		roughness: 0.25,
		metalness: 0.6,
	});
	const base_mesh = new THREE.Mesh(
		new THREE.CylinderGeometry(0.31, 0.34, 0.13, 48),
		material_dark,
	);
	base_mesh.position.y = 0.25;
	configureMesh(base_mesh, item_data.id, pick_targets);

	const stem_mesh = new THREE.Mesh(
		new THREE.CylinderGeometry(0.032, 0.045, 0.76, 24),
		material_dark,
	);
	stem_mesh.position.y = 0.67;
	configureMesh(stem_mesh, item_data.id, pick_targets);

	const shade_mesh = new THREE.Mesh(
		new THREE.SphereGeometry(0.34, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
		material_dark,
	);
	shade_mesh.position.y = 1.08;
	shade_mesh.scale.y = 0.58;
	configureMesh(shade_mesh, item_data.id, pick_targets);

	const light_mesh = new THREE.Mesh(
		new THREE.CircleGeometry(0.27, 40),
		createPhysicalMaterial("#fff8d7", {
			emissive: "#fff0ad",
			emissiveIntensity: 0.7,
			side: THREE.DoubleSide,
		}),
	);
	light_mesh.position.y = 1.078;
	light_mesh.rotation.x = Math.PI / 2;
	configureMesh(light_mesh, item_data.id, pick_targets);
	group_model.add(base_mesh, stem_mesh, shade_mesh, light_mesh);
	return group_model;
}

function createVesselModel(item_data: DemoItem, pick_targets: THREE.Object3D[]) {
	const points_profile = [
		new THREE.Vector2(0.18, 0),
		new THREE.Vector2(0.34, 0.12),
		new THREE.Vector2(0.43, 0.48),
		new THREE.Vector2(0.35, 0.85),
		new THREE.Vector2(0.18, 1.05),
		new THREE.Vector2(0.16, 1.22),
		new THREE.Vector2(0.25, 1.25),
	];
	const vessel_mesh = new THREE.Mesh(
		new THREE.LatheGeometry(points_profile, 64),
		createPhysicalMaterial(item_data.color, {
			roughness: 0.78,
			clearcoat: 0.06,
		}),
	);
	vessel_mesh.position.y = 0.2;
	configureMesh(vessel_mesh, item_data.id, pick_targets);
	const group_model = new THREE.Group();
	group_model.add(vessel_mesh);
	return group_model;
}

function createDeviceModel(item_data: DemoItem, pick_targets: THREE.Object3D[]) {
	const group_model = new THREE.Group();
	const shell_mesh = new THREE.Mesh(
		new RoundedBoxGeometry(0.93, 0.7, 0.52, 6, 0.07),
		createPhysicalMaterial(item_data.color, {
			roughness: 0.35,
			metalness: 0.32,
		}),
	);
	shell_mesh.position.y = 0.56;
	configureMesh(shell_mesh, item_data.id, pick_targets);

	const screen_mesh = new THREE.Mesh(
		new RoundedBoxGeometry(0.68, 0.3, 0.025, 4, 0.04),
		createPhysicalMaterial("#10120f", {
			roughness: 0.18,
			emissive: "#07112b",
			emissiveIntensity: 0.55,
		}),
	);
	screen_mesh.position.set(0, 0.62, 0.275);
	configureMesh(screen_mesh, item_data.id, pick_targets);

	for (let index_button = 0; index_button < 3; index_button += 1) {
		const button_mesh = new THREE.Mesh(
			new THREE.CylinderGeometry(0.028, 0.028, 0.018, 20),
			createPhysicalMaterial(
				index_button === 0 ? "#b8f500" : item_data.accent,
				{ emissive: index_button === 0 ? "#456800" : "#000000" },
			),
		);
		button_mesh.rotation.x = Math.PI / 2;
		button_mesh.position.set(-0.19 + index_button * 0.19, 0.38, 0.281);
		configureMesh(button_mesh, item_data.id, pick_targets);
		group_model.add(button_mesh);
	}
	group_model.add(shell_mesh, screen_mesh);
	return group_model;
}

function createTextileModel(item_data: DemoItem, pick_targets: THREE.Object3D[]) {
	const group_model = new THREE.Group();
	for (let index_fold = 0; index_fold < 4; index_fold += 1) {
		const fold_mesh = new THREE.Mesh(
			new RoundedBoxGeometry(
				1.02 - index_fold * 0.025,
				0.18,
				0.7,
				5,
				0.065,
			),
			createPhysicalMaterial(item_data.color, {
				roughness: 0.94,
				sheen: 0.45,
				sheenColor: new THREE.Color(item_data.accent),
			}),
		);
		fold_mesh.position.set(
			index_fold % 2 === 0 ? -0.03 : 0.03,
			0.3 + index_fold * 0.17,
			0,
		);
		fold_mesh.rotation.y = (index_fold - 1.5) * 0.025;
		configureMesh(fold_mesh, item_data.id, pick_targets);
		group_model.add(fold_mesh);
	}
	return group_model;
}

function createBlocksModel(item_data: DemoItem, pick_targets: THREE.Object3D[]) {
	const group_model = new THREE.Group();
	const positions_block = [
		[-0.32, 0.35, 0],
		[0, 0.35, 0],
		[0.32, 0.35, 0],
		[-0.16, 0.67, 0],
		[0.16, 0.67, 0],
		[0, 0.99, 0],
	] as const;
	positions_block.forEach((position_block, index_block) => {
		const block_mesh = new THREE.Mesh(
			new RoundedBoxGeometry(0.29, 0.29, 0.29, 3, 0.025),
			createPhysicalMaterial(
				index_block === positions_block.length - 1
					? item_data.accent
					: item_data.color,
				{ roughness: 0.58 },
			),
		);
		block_mesh.position.set(
			position_block[0],
			position_block[1],
			position_block[2],
		);
		configureMesh(block_mesh, item_data.id, pick_targets);
		group_model.add(block_mesh);
	});
	return group_model;
}

const model_factories: Record<
	DemoItemKind,
	(item_data: DemoItem, pick_targets: THREE.Object3D[]) => THREE.Group
> = {
	book: createBookModel,
	lamp: createLampModel,
	vessel: createVesselModel,
	device: createDeviceModel,
	textile: createTextileModel,
	blocks: createBlocksModel,
};

function getAngleDelta(angle_target: number, angle_current: number) {
	return Math.atan2(
		Math.sin(angle_target - angle_current),
		Math.cos(angle_target - angle_current),
	);
}

function getPointerPosition(
	event: PointerEvent,
	canvas_element: HTMLCanvasElement,
) {
	const bounds_canvas = canvas_element.getBoundingClientRect();
	return new THREE.Vector2(
		((event.clientX - bounds_canvas.left) / bounds_canvas.width) * 2 - 1,
		-((event.clientY - bounds_canvas.top) / bounds_canvas.height) * 2 + 1,
	);
}

export class SpatialDemoEngine
	implements SpatialRendererAdapter<DemoItem>
{
	private canvas_element: HTMLCanvasElement;
	private context_engine: EngineContext;
	private renderer: THREE.WebGLRenderer;
	private scene = new THREE.Scene();
	private camera: THREE.PerspectiveCamera;
	private group_track = new THREE.Group();
	private items_runtime: RuntimeItem[] = [];
	private pick_targets: THREE.Object3D[] = [];
	private raycaster = new THREE.Raycaster();
	private box_selection = new THREE.Box3();
	private helper_selection: THREE.Box3Helper;
	private observer_resize: ResizeObserver;
	private frame_animation = 0;
	private time_last = 0;
	private time_wheel = 0;
	private id_pointer: number | null = null;
	private x_pointer_start = 0;
	private x_pointer_last = 0;
	private distance_pointer = 0;
	private rotation_current = 0;
	private rotation_target = 0;
	private value_selected: string | null;
	private prefers_reduced_motion: boolean;
	private onAnchorChange?: (anchor_next: SpatialSceneAnchor) => void;
	private anchor_previous = new THREE.Vector2(-1, -1);
	private time_anchor = 0;
	private is_disposed = false;

	constructor(
		context_engine: EngineContext,
		onAnchorChange?: (anchor_next: SpatialSceneAnchor) => void,
	) {
		this.context_engine = context_engine;
		this.onAnchorChange = onAnchorChange;
		this.canvas_element = context_engine.canvas;
		this.value_selected = context_engine.value ?? context_engine.items[0]?.id ?? null;
		this.prefers_reduced_motion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		this.renderer = this.createRenderer();
		this.camera = this.createCamera();
		this.helper_selection = new THREE.Box3Helper(
			this.box_selection,
			color_cobalt,
		);
		this.observer_resize = new ResizeObserver(this.handleResize);
		this.setupScene();
		this.createCollection(context_engine.items);
		this.bindEvents();
		this.handleResize();
		this.observer_resize.observe(this.canvas_element);
		this.setValue(this.value_selected);
		this.renderFrame(0);
		this.context_engine.onReady();
		this.context_engine.onStatus(
			`Scene ready · ${context_engine.items.length} objects`,
		);
	}

	private createRenderer() {
		const context_webgl =
			this.canvas_element.getContext("webgl2", {
				alpha: false,
				antialias: true,
				powerPreference: "high-performance",
			}) ??
			this.canvas_element.getContext("webgl", {
				alpha: false,
				antialias: true,
				powerPreference: "high-performance",
			});
		if (!context_webgl) {
			throw new Error("WebGL is unavailable in this browser.");
		}
		const renderer = new THREE.WebGLRenderer({
			canvas: this.canvas_element,
			context: context_webgl,
			antialias: true,
			alpha: false,
			powerPreference: "high-performance",
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.08;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;
		return renderer;
	}

	private createCamera() {
		const camera = new THREE.PerspectiveCamera(31, 1, 0.08, 40);
		camera.position.set(0, 3.7, 7.4);
		camera.lookAt(0, 0.72, 0);
		return camera;
	}

	private setupScene() {
		this.scene.background = color_mineral;
		this.scene.fog = new THREE.Fog("#f4f5f1", 8.4, 16);
		this.scene.add(this.group_track, this.helper_selection);
		this.addLights();
		this.addFloor();
		this.addTrack();
	}

	private addLights() {
		const hemisphere = new THREE.HemisphereLight("#ffffff", "#bac1b9", 2.7);
		const key_light = new THREE.DirectionalLight("#ffffff", 4.8);
		key_light.position.set(-4.4, 7.2, 5.4);
		key_light.castShadow = true;
		key_light.shadow.mapSize.set(2048, 2048);
		key_light.shadow.camera.left = -6;
		key_light.shadow.camera.right = 6;
		key_light.shadow.camera.top = 5;
		key_light.shadow.camera.bottom = -3;
		const rim_light = new THREE.DirectionalLight("#b9c8ff", 2.2);
		rim_light.position.set(4.8, 3.2, -4);
		this.scene.add(hemisphere, key_light, rim_light);
	}

	private addFloor() {
		const floor_mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(24, 20),
			createPhysicalMaterial("#edf0eb", {
				roughness: 0.92,
				metalness: 0,
			}),
		);
		floor_mesh.rotation.x = -Math.PI / 2;
		floor_mesh.position.y = -0.015;
		floor_mesh.receiveShadow = true;
		this.scene.add(floor_mesh);
	}

	private addTrack() {
		const track_mesh = new THREE.Mesh(
			new THREE.TorusGeometry(radius_track, 0.028, 10, 180),
			createPhysicalMaterial("#aeb4ae", {
				roughness: 0.28,
				metalness: 0.76,
			}),
		);
		track_mesh.rotation.x = Math.PI / 2;
		track_mesh.scale.z = depth_track / radius_track;
		track_mesh.position.y = 0.022;
		track_mesh.receiveShadow = true;
		this.scene.add(track_mesh);

		for (let index_tick = 0; index_tick < 48; index_tick += 1) {
			const angle_tick = (index_tick / 48) * Math.PI * 2;
			const tick_mesh = new THREE.Mesh(
				new THREE.BoxGeometry(0.012, 0.008, index_tick % 6 === 0 ? 0.2 : 0.1),
				createPhysicalMaterial("#858b85", {
					roughness: 0.45,
					metalness: 0.56,
				}),
			);
			tick_mesh.position.set(
				Math.sin(angle_tick) * radius_track,
				0.035,
				Math.cos(angle_tick) * depth_track,
			);
			tick_mesh.rotation.y = angle_tick;
			this.scene.add(tick_mesh);
		}
	}

	private createCollection(items_data: readonly DemoItem[]) {
		items_data.forEach((item_data, index_item) => {
			const pick_targets: THREE.Object3D[] = [];
			const root_item = new THREE.Group();
			const model_item = model_factories[item_data.kind](
				item_data,
				pick_targets,
			);
			root_item.add(createDisplayBase(item_data.id, pick_targets), model_item);
			this.group_track.add(root_item);
			this.pick_targets.push(...pick_targets);
			this.items_runtime.push({
				data: item_data,
				root: root_item,
				model: model_item,
				pickTargets: pick_targets,
				angleBase: (index_item / items_data.length) * Math.PI * 2,
				hover: 0,
				targetHover: 0,
			});
		});
	}

	private bindEvents() {
		this.canvas_element.addEventListener("pointerdown", this.handlePointerDown);
		this.canvas_element.addEventListener("pointermove", this.handlePointerMove);
		this.canvas_element.addEventListener("pointerup", this.handlePointerUp);
		this.canvas_element.addEventListener("pointercancel", this.handlePointerUp);
		this.canvas_element.addEventListener("wheel", this.handleWheel, {
			passive: false,
		});
	}

	private unbindEvents() {
		this.canvas_element.removeEventListener("pointerdown", this.handlePointerDown);
		this.canvas_element.removeEventListener("pointermove", this.handlePointerMove);
		this.canvas_element.removeEventListener("pointerup", this.handlePointerUp);
		this.canvas_element.removeEventListener("pointercancel", this.handlePointerUp);
		this.canvas_element.removeEventListener("wheel", this.handleWheel);
	}

	private getPickedValue(event: PointerEvent) {
		const pointer_position = getPointerPosition(event, this.canvas_element);
		this.raycaster.setFromCamera(pointer_position, this.camera);
		const hit_target = this.raycaster.intersectObjects(this.pick_targets)[0];
		return hit_target?.object.userData.id_value as string | undefined;
	}

	private requestValue(value_next: string, reason: SpatialChangeReason) {
		this.setValue(value_next);
		this.context_engine.onValueChange(value_next, reason);
	}

	private requestAdjacent(direction: 1 | -1, reason: SpatialChangeReason) {
		const index_current = this.items_runtime.findIndex(
			(item_runtime) => item_runtime.data.id === this.value_selected,
		);
		if (index_current < 0) return;
		const index_next =
			(index_current + direction + this.items_runtime.length) %
			this.items_runtime.length;
		const item_next = this.items_runtime[index_next];
		if (item_next) this.requestValue(item_next.data.id, reason);
	}

	private handlePointerDown = (event: PointerEvent) => {
		if (this.id_pointer !== null) return;
		this.id_pointer = event.pointerId;
		this.x_pointer_start = event.clientX;
		this.x_pointer_last = event.clientX;
		this.distance_pointer = 0;
		this.canvas_element.setPointerCapture(event.pointerId);
		this.canvas_element.dataset.dragging = "true";
	};

	private handlePointerMove = (event: PointerEvent) => {
		if (this.id_pointer === event.pointerId) {
			const distance_step = event.clientX - this.x_pointer_last;
			this.distance_pointer += Math.abs(distance_step);
			this.x_pointer_last = event.clientX;
			if (Math.abs(event.clientX - this.x_pointer_start) > 46) {
				const direction = event.clientX < this.x_pointer_start ? 1 : -1;
				this.requestAdjacent(direction, "pointer");
				this.x_pointer_start = event.clientX;
			}
			return;
		}

		const value_hovered = this.getPickedValue(event);
		this.items_runtime.forEach((item_runtime) => {
			item_runtime.targetHover =
				item_runtime.data.id === value_hovered ? 1 : 0;
		});
		this.canvas_element.style.cursor = value_hovered ? "pointer" : "grab";
	};

	private handlePointerUp = (event: PointerEvent) => {
		if (this.id_pointer !== event.pointerId) return;
		if (this.distance_pointer < 7) {
			const value_picked = this.getPickedValue(event);
			if (value_picked) this.requestValue(value_picked, "pointer");
		}
		if (this.canvas_element.hasPointerCapture(event.pointerId)) {
			this.canvas_element.releasePointerCapture(event.pointerId);
		}
		this.id_pointer = null;
		delete this.canvas_element.dataset.dragging;
	};

	private handleWheel = (event: WheelEvent) => {
		event.preventDefault();
		const time_now = performance.now();
		if (time_now - this.time_wheel < 280) return;
		this.time_wheel = time_now;
		const movement_primary =
			Math.abs(event.deltaX) > Math.abs(event.deltaY)
				? event.deltaX
				: event.deltaY;
		this.requestAdjacent(movement_primary > 0 ? 1 : -1, "pointer");
	};

	private handleResize = () => {
		const width_canvas = Math.max(this.canvas_element.clientWidth, 1);
		const height_canvas = Math.max(this.canvas_element.clientHeight, 1);
		this.camera.aspect = width_canvas / height_canvas;
		this.camera.fov = width_canvas < 640 ? 38 : 31;
		this.camera.position.y = width_canvas < 640 ? 4.1 : 3.7;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width_canvas, height_canvas, false);
	};

	private updateItems(delta_time: number) {
		const factor_motion = this.prefers_reduced_motion ? 1 : 1 - Math.exp(-7 * delta_time);
		const angle_delta = getAngleDelta(
			this.rotation_target,
			this.rotation_current,
		);
		this.rotation_current += angle_delta * factor_motion;

		for (const item_runtime of this.items_runtime) {
			const angle_item = item_runtime.angleBase + this.rotation_current;
			const depth_item = (Math.cos(angle_item) + 1) * 0.5;
			const is_selected = item_runtime.data.id === this.value_selected;
			item_runtime.hover = THREE.MathUtils.damp(
				item_runtime.hover,
				item_runtime.targetHover,
				14,
				delta_time,
			);
			const scale_target =
				(is_selected ? 1.13 : 0.68 + depth_item * 0.18) +
				item_runtime.hover * 0.045;
			const scale_current = THREE.MathUtils.damp(
				item_runtime.root.scale.x,
				scale_target,
				9,
				delta_time,
			);
			item_runtime.root.position.set(
				Math.sin(angle_item) * radius_track,
				THREE.MathUtils.damp(
					item_runtime.root.position.y,
					is_selected ? 0.08 : 0,
					10,
					delta_time,
				),
				Math.cos(angle_item) * depth_track - 0.38,
			);
			item_runtime.root.scale.setScalar(scale_current);
			item_runtime.root.rotation.y = THREE.MathUtils.damp(
				item_runtime.root.rotation.y,
				-Math.sin(angle_item) * 0.34,
				9,
				delta_time,
			);
		}
	}

	private updateSelectionBox() {
		const item_selected = this.items_runtime.find(
			(item_runtime) => item_runtime.data.id === this.value_selected,
		);
		if (!item_selected) {
			this.helper_selection.visible = false;
			return;
		}
		this.box_selection.setFromObject(item_selected.model);
		this.box_selection.expandByScalar(0.055);
		this.helper_selection.visible = true;
	}

	private updateSelectionAnchor(time_now: number) {
		if (!this.onAnchorChange || time_now - this.time_anchor < 32) return;
		this.time_anchor = time_now;
		const center_selection = this.box_selection
			.getCenter(new THREE.Vector3())
			.project(this.camera);
		const anchor_next = new THREE.Vector2(
			clamp((center_selection.x + 1) * 0.5, 0, 1),
			clamp((1 - center_selection.y) * 0.5, 0, 1),
		);
		if (anchor_next.distanceToSquared(this.anchor_previous) < 0.000004) return;
		this.anchor_previous.copy(anchor_next);
		this.onAnchorChange({
			x: anchor_next.x,
			y: anchor_next.y,
		});
	}

	private renderFrame = (time_now: number) => {
		if (this.is_disposed) return;
		const delta_time = clamp((time_now - this.time_last) / 1000, 0, 0.05);
		this.time_last = time_now;
		this.updateItems(delta_time);
		this.updateSelectionBox();
		this.renderer.render(this.scene, this.camera);
		this.updateSelectionAnchor(time_now);
		this.frame_animation = requestAnimationFrame(this.renderFrame);
	};

	setItems() {
		throw new Error(
			"SpatialDemoEngine collection shape is immutable after mount.",
		);
	}

	setValue(value_next: string | null, update?: SpatialRendererUpdate) {
		const index_next = this.items_runtime.findIndex(
			(item_runtime) => item_runtime.data.id === value_next,
		);
		if (index_next < 0) return;
		this.value_selected = value_next;
		const angle_target = -this.items_runtime[index_next]!.angleBase;
		this.rotation_target =
			this.rotation_current +
			getAngleDelta(angle_target, this.rotation_current);
		if (this.prefers_reduced_motion || update?.immediate) {
			this.rotation_current = this.rotation_target;
		}
	}

	dispose() {
		if (this.is_disposed) return;
		this.is_disposed = true;
		cancelAnimationFrame(this.frame_animation);
		this.observer_resize.disconnect();
		this.unbindEvents();
		this.scene.traverse((object_scene) => {
			if (!(object_scene instanceof THREE.Mesh)) return;
			object_scene.geometry.dispose();
			const materials = Array.isArray(object_scene.material)
				? object_scene.material
				: [object_scene.material];
			materials.forEach((material_item) => material_item.dispose());
		});
		this.renderer.dispose();
	}
}
