import { cleanup as cleanupReact, render as renderReact } from "@testing-library/react";
import { cleanup as cleanupVue, render as renderVue } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createSpatialStore, type SpatialItemRecord } from "@gnomon-ui/core";
import { Spatial as ReactSpatial } from "../packages/react/src/index";
import { Spatial as VueSpatial } from "../packages/vue/src/index";
import { afterEach, describe, expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

const items_fixture: readonly SpatialItemRecord[] = [
	{ value: "alpha" },
	{ value: "beta" },
	{ value: "gamma" },
];

afterEach(() => {
	cleanupReact();
	cleanupVue();
});

describe("React adapter", () => {
	test("keeps collection focus aligned after pointer and keyboard input", async () => {
		const user = userEvent.setup();
		renderReact(
			<ReactSpatial.Root items={items_fixture} defaultValue="alpha">
				<ReactSpatial.Collection aria-label="Objects">
					{items_fixture.map((item_record) => (
						<ReactSpatial.Item
							key={item_record.value}
							value={item_record.value}
							asChild
						>
							<button type="button">{item_record.value}</button>
						</ReactSpatial.Item>
					))}
				</ReactSpatial.Collection>
			</ReactSpatial.Root>,
		);

		const collection = document.querySelector('[role="listbox"]');
		const option_beta = document.querySelector(
			'[role="option"][data-gnomon-value="beta"]',
		);
		expect(collection).toBeInstanceOf(HTMLElement);
		expect(option_beta).toBeInstanceOf(HTMLElement);

		await user.click(option_beta as HTMLElement);
		expect(document.activeElement).toBe(collection);

		await user.keyboard("{ArrowRight}");
		const option_gamma = document.querySelector(
			'[role="option"][data-gnomon-value="gamma"]',
		);
		expect(option_gamma?.getAttribute("aria-selected")).toBe("true");
		expect(collection?.getAttribute("aria-activedescendant")).toBe(option_gamma?.id);
		expect(document.activeElement).toBe(collection);
	});

	test("creates a valid active-descendant ID for international values", () => {
		const value_international = "مرحبا 世界";
		renderReact(
			<ReactSpatial.Root
				items={[{ value: value_international }]}
				defaultValue={value_international}
			>
				<ReactSpatial.Collection aria-label="International objects">
					<ReactSpatial.Item value={value_international}>
						International
					</ReactSpatial.Item>
				</ReactSpatial.Collection>
			</ReactSpatial.Root>,
		);

		const collection = document.querySelector('[role="listbox"]');
		const option = document.querySelector('[role="option"]');
		expect(option?.id).not.toMatch(/\s/u);
		expect(collection?.getAttribute("aria-activedescendant")).toBe(option?.id);
	});
});

describe("Vue adapter", () => {
	test("composes consumer events and lets preventDefault cancel selection", async () => {
		const user = userEvent.setup();
		const handle_click = vi.fn((event: MouseEvent) => event.preventDefault());
		const handle_keydown = vi.fn((event: KeyboardEvent) => event.preventDefault());
		const handle_direction = vi.fn((event: MouseEvent) => event.preventDefault());
		const Harness = defineComponent({
			setup() {
				return () =>
					h(
						VueSpatial.Root,
						{ items: items_fixture, defaultValue: "alpha" },
						{
							default: () => [
								h(
									VueSpatial.Collection,
									{
										"aria-label": "Objects",
										onKeydown: handle_keydown,
									},
									{
										default: () =>
											items_fixture.map((item_record) =>
												h(
													VueSpatial.Item,
													{
														value: item_record.value,
														onClick:
															item_record.value === "beta"
																? handle_click
																: undefined,
													},
													{ default: () => item_record.value },
												),
											),
									},
								),
								h(
									VueSpatial.Next,
									{ onClick: handle_direction },
									{ default: () => "Next" },
								),
							],
						},
					);
			},
		});
		renderVue(Harness);

		const collection = document.querySelector('[role="listbox"]');
		const option_alpha = document.querySelector(
			'[role="option"][data-gnomon-value="alpha"]',
		);
		const option_beta = document.querySelector(
			'[role="option"][data-gnomon-value="beta"]',
		);
		expect(collection).toBeInstanceOf(HTMLElement);
		expect(option_beta).toBeInstanceOf(HTMLElement);

		await user.click(option_beta as HTMLElement);
		expect(handle_click).toHaveBeenCalledOnce();
		expect(option_alpha?.getAttribute("aria-selected")).toBe("true");
		expect(document.activeElement).toBe(collection);

		await user.keyboard("{ArrowRight}");
		expect(handle_keydown).toHaveBeenCalledOnce();
		expect(option_alpha?.getAttribute("aria-selected")).toBe("true");

		const direction_next = document.querySelector(
			'[data-gnomon-direction="next"]',
		);
		await user.click(direction_next as HTMLElement);
		expect(handle_direction).toHaveBeenCalledOnce();
		expect(option_alpha?.getAttribute("aria-selected")).toBe("true");
	});

	test("keeps collection focus aligned after selecting an item", async () => {
		const user = userEvent.setup();
		const Harness = defineComponent({
			setup() {
				return () =>
					h(
						VueSpatial.Root,
						{ items: items_fixture, defaultValue: "alpha" },
						{
							default: () =>
								h(
									VueSpatial.Collection,
									{ "aria-label": "Objects" },
									{
										default: () =>
											items_fixture.map((item_record) =>
												h(
													VueSpatial.Item,
													{ value: item_record.value },
													{ default: () => item_record.value },
												),
											),
									},
								),
						},
					);
			},
		});
		renderVue(Harness);

		const collection = document.querySelector('[role="listbox"]');
		const option_beta = document.querySelector(
			'[role="option"][data-gnomon-value="beta"]',
		);
		await user.click(option_beta as HTMLElement);
		expect(document.activeElement).toBe(collection);
	});
});

describe("core value invariants", () => {
	test("supports an empty-string value during adjacent navigation", () => {
		const changes: string[] = [];
		const store = createSpatialStore({
			items: [{ value: "alpha" }, { value: "" }],
			defaultValue: "alpha",
			onValueChange: ({ value }) => changes.push(value),
		});
		store.selectNext();
		expect(store.getSnapshot().value).toBe("");
		expect(changes).toEqual([""]);
	});

	test("rejects duplicate item values", () => {
		expect(() =>
			createSpatialStore({
				items: [{ value: "duplicate" }, { value: "duplicate" }],
			}),
		).toThrow(/unique values/i);
	});
});
