import type { Metadata } from "next";
import Link from "next/link";
import { ReferenceShell } from "../../reference/ReferenceShell";

export const metadata: Metadata = {
	title: "Getting Started — Gnomon UI",
	description:
		"Clone the Gnomon UI workspace and run the spatial primitive demo locally.",
};

const code_setup = `git clone https://github.com/Ray0907/gnomon-ui.git
cd gnomon-ui
pnpm install
pnpm dev`;

const code_model = `<Spatial.Root items={items} value={selected} onValueChange={setSelected}>
  <Spatial.Scene asChild>
    <canvas ref={sceneRef} />
  </Spatial.Scene>
  <Spatial.Collection>
    {items.map((item) => (
      <Spatial.Item key={item.id} value={item.id} />
    ))}
  </Spatial.Collection>
</Spatial.Root>`;

export default function GettingStartedPage() {
	return (
		<ReferenceShell
			active_route="getting-started"
			eyebrow="START / LOCAL WORKSPACE"
			links_on_page={[
				{ href: "#run", label: "Run locally" },
				{ href: "#model", label: "Mental model" },
				{ href: "#next", label: "Choose an adapter" },
			]}
			summary={
				"Start with the public workspace today. Core owns interaction state; " +
				"your renderer owns every pixel in the scene."
			}
			title="Run Gnomon UI locally"
		>
			<section id="run">
				<h2>One workspace, four packages.</h2>
				<p>
					The current <strong>v0.1 prototype</strong> ships as a pnpm
					workspace. Clone it to inspect the core contract, React and Vue
					bindings, and the Three.js renderer adapter together.
				</p>
				<pre className="reference-code" data-label="TERMINAL / LOCAL PREVIEW">
					<code>{code_setup}</code>
				</pre>
				<div className="reference-callout">
					<span>STATUS</span>
					<p>
						The workspace is runnable now. Registry packages are the next
						release step, so this guide does not pretend an unpublished install
						command is available.
					</p>
				</div>
			</section>

			<section id="model">
				<h2>Keep state semantic.</h2>
				<p>
					<code>Spatial.Root</code> owns ordered items, selection, and keyboard
					intent. <code>Spatial.Scene</code> hands the same snapshot to a DOM,
					Canvas, or WebGL renderer without coupling the core to graphics.
				</p>
				<pre className="reference-code" data-label="REACT / CONTROLLED STATE">
					<code>{code_model}</code>
				</pre>
			</section>

			<section id="next">
				<h2>Choose the thinnest adapter.</h2>
				<p>
					Use React or Vue for framework composition, core directly for a
					custom binding, and Three only when a renderer needs a lifecycle
					bridge.
				</p>
				<Link className="reference-link" href="/docs/adapters/">
					COMPARE ADAPTERS <span aria-hidden="true">→</span>
				</Link>
			</section>
		</ReferenceShell>
	);
}
