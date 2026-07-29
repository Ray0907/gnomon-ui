export type DemoItemKind =
	| "book"
	| "lamp"
	| "vessel"
	| "device"
	| "textile"
	| "blocks";

export type DemoItem = {
	id: string;
	label: string;
	kind: DemoItemKind;
	category: string;
	color: string;
	accent: string;
	dimensions: string;
	description: string;
};

export const demoItems: readonly DemoItem[] = [
	{
		id: "book-07",
		label: "Geometry Essentials",
		kind: "book",
		category: "Editorial object",
		color: "#173fff",
		accent: "#ff3f24",
		dimensions: "160 × 240 × 28 mm",
		description: "A procedural hardcover with an authored material slot.",
	},
	{
		id: "lamp-02",
		label: "Task Light 02",
		kind: "lamp",
		category: "Lighting object",
		color: "#171a18",
		accent: "#e9ece7",
		dimensions: "Ø 180 × 420 mm",
		description: "A multipart object rendered by the same collection contract.",
	},
	{
		id: "vessel-04",
		label: "Mineral Vessel",
		kind: "vessel",
		category: "Ceramic object",
		color: "#d9ddd7",
		accent: "#173fff",
		dimensions: "Ø 210 × 360 mm",
		description: "A lathed form that proves geometry is implementation-owned.",
	},
	{
		id: "device-09",
		label: "Signal Receiver",
		kind: "device",
		category: "Electronic object",
		color: "#dfe3df",
		accent: "#10120f",
		dimensions: "220 × 160 × 140 mm",
		description: "A compact device with nested meshes and one selection value.",
	},
	{
		id: "book-01",
		label: "Material Studies",
		kind: "book",
		category: "Editorial object",
		color: "#f1f2ed",
		accent: "#10120f",
		dimensions: "148 × 220 × 24 mm",
		description: "A quieter edition using the same renderer and state contract.",
	},
	{
		id: "textile-03",
		label: "Fold Study",
		kind: "textile",
		category: "Material object",
		color: "#26384d",
		accent: "#b8f500",
		dimensions: "420 × 310 × 90 mm",
		description: "A soft stack approximated with procedural rounded geometry.",
	},
	{
		id: "blocks-06",
		label: "Assembly 06",
		kind: "blocks",
		category: "Modular object",
		color: "#c59b5d",
		accent: "#173fff",
		dimensions: "300 × 280 × 240 mm",
		description: "Independent pieces grouped into one accessible collection item.",
	},
	{
		id: "book-12",
		label: "Forms for Thinking",
		kind: "book",
		category: "Editorial object",
		color: "#161816",
		accent: "#f4f5f1",
		dimensions: "170 × 250 × 31 mm",
		description: "A dark edition that keeps state legible without changing APIs.",
	},
] as const;
