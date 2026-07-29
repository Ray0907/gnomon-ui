import type { Metadata } from "next";
import Link from "next/link";
import { ReferenceShell } from "../../reference/ReferenceShell";

export const metadata: Metadata = {
	title: "Primitives — Gnomon UI",
	description:
		"Understand the semantic primitive anatomy shared by every Gnomon UI adapter.",
};

export default function PrimitivesPage() {
	return (
		<ReferenceShell
			active_route="primitives"
			eyebrow="FOUNDATIONS / COMPOSITION"
			links_on_page={[
				{ href: "#anatomy", label: "Primitive anatomy" },
				{ href: "#contract", label: "State contract" },
				{ href: "#accessibility", label: "Accessibility" },
			]}
			summary={
				"A small semantic tree coordinates selection and intent. Geometry, " +
				"materials, camera, and lighting remain project-owned."
			}
			title="Primitive anatomy"
		>
			<section id="anatomy">
				<h2>Compose behavior, not markup.</h2>
				<p>
					Each primitive owns one responsibility. Adapters preserve these
					relationships even when their framework syntax differs.
				</p>
				<dl className="reference-contract">
					<div>
						<dt>Spatial.Root</dt>
						<dd>Owns item order, selected value, orientation, and loop policy.</dd>
					</div>
					<div>
						<dt>Spatial.Scene</dt>
						<dd>Exposes the current snapshot to a project-owned renderer host.</dd>
					</div>
						<div>
							<dt>Spatial.Collection</dt>
							<dd>
								Owns listbox focus, active-descendant state, and keyboard intent.
							</dd>
						</div>
						<div>
							<dt>Spatial.Item</dt>
							<dd>
								Maps one unique value inside a collection to one spatial object.
							</dd>
					</div>
					<div>
						<dt>Previous / Next</dt>
						<dd>Move through valid items while respecting disabled boundaries.</dd>
					</div>
				</dl>
			</section>

			<section id="contract">
				<h2>One selected value.</h2>
				<p>
					Pointer, drag, wheel, and keyboard input all request changes through
					the same store. The renderer never creates a second source of truth.
				</p>
				<div className="reference-callout">
					<span>RULE 01</span>
						<p>
							If a scene can be selected with a pointer, its equivalent semantic
							item must expose the same unique value and state inside
							{" "}
							<code>Spatial.Collection</code>.
						</p>
				</div>
			</section>

			<section id="accessibility">
				<h2>Spatial does not mean inaccessible.</h2>
				<p>
					The collection keeps an active option discoverable, routes Home, End,
					and axis-specific arrow keys through core helpers, and mirrors state
					with stable <code>data-gnomon-*</code> attributes.
				</p>
				<Link className="reference-link" href="/examples/spatial-collection/">
					INSPECT THE EXAMPLE <span aria-hidden="true">→</span>
				</Link>
			</section>
		</ReferenceShell>
	);
}
