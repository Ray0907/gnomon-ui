import type { Metadata } from "next";
import Link from "next/link";
import { ReferenceShell } from "../../reference/ReferenceShell";

export const metadata: Metadata = {
	title: "Spatial Collection Example — Gnomon UI",
	description:
		"A runnable Gnomon UI spatial collection with equivalent pointer and keyboard selection.",
};

const code_collection = `<Spatial.Root items={objects} value={selected}>
  <Spatial.Scene>{(snapshot) => <Scene value={snapshot.value} />}</Spatial.Scene>
  <Spatial.Collection aria-label="Demo objects">
    {objects.map((object) => (
      <Spatial.Item key={object.id} value={object.id} />
    ))}
  </Spatial.Collection>
</Spatial.Root>`;

export default function SpatialCollectionPage() {
	return (
		<ReferenceShell
			active_route="spatial-collection"
			eyebrow="EXAMPLE / POINTER + KEYBOARD"
			links_on_page={[
				{ href: "#preview", label: "Spatial Collection" },
				{ href: "#source", label: "Source relationship" },
				{ href: "#inputs", label: "Input parity" },
			]}
			summary={
				"Eight synthetic objects, one semantic collection, and one selected " +
				"value shared by DOM controls and a Three.js scene."
			}
			title="Spatial Collection"
		>
			<section id="preview">
				<h2>Selection is the registration point.</h2>
				<p>
					The homepage example connects primitive anatomy, source code, semantic
					controls, and rendered output to the same active item.
				</p>
				<div className="reference-example-frame">
					<div className="reference-example-copy">
						<span>OUTPUT / SELECTED</span>
						<strong>Calibration Assembly</strong>
						<p>OBJECT 01 / 08 · VALUE specimen-01</p>
						<Link className="reference-link" href="/#stage">
							RUN WEBGL SCENE <span aria-hidden="true">→</span>
						</Link>
					</div>
					<div className="reference-example-output" aria-hidden="true">
						<span>GN / SCENE PREVIEW</span>
						<i className="reference-specimen" />
					</div>
				</div>
			</section>

			<section id="source">
				<h2>The scene consumes state.</h2>
				<p>
					The rendered object never becomes the authoritative selection.
					Pointer events request a value change; the root publishes the result
					back to every consumer.
				</p>
				<pre className="reference-code" data-label="REACT / SPATIAL COLLECTION">
					<code>{code_collection}</code>
				</pre>
			</section>

			<section id="inputs">
				<h2>Every input reaches the same result.</h2>
				<p>
					Drag or wheel the scene, click an object, use Previous and Next, or
					focus the collection and press an arrow key. The status, inspector,
					code highlight, and scene remain synchronized.
				</p>
			</section>
		</ReferenceShell>
	);
}
