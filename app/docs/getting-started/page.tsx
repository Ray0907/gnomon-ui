import type { Metadata } from "next";
import Link from "next/link";
import { ReferenceShell } from "../../reference/ReferenceShell";

export const metadata: Metadata = {
	title: "Getting Started — Gnomon UI",
	description:
		"Install the Gnomon UI alpha packages for React, Vue, and Three.js.",
};

const code_setup = `pnpm add @gnomon-ui/core@next @gnomon-ui/react@next
pnpm add @gnomon-ui/three@next three`;

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
			eyebrow="START / NPM ALPHA"
			links_on_page={[
				{ href: "#run", label: "Install packages" },
				{ href: "#model", label: "Mental model" },
				{ href: "#next", label: "Choose an adapter" },
			]}
			summary={
				"Install the public alpha packages. Core owns interaction state; your " +
				"renderer continues to own every pixel in the scene."
			}
			title="Install Gnomon UI"
		>
			<section id="run">
				<h2>Install only what your scene needs.</h2>
				<p>
					The public <strong>v0.1 alpha</strong> is available on npm. Start
					with Core and one framework adapter. Add the Three.js lifecycle
					bridge only when the project renders a WebGL scene.
				</p>
				<pre className="reference-code" data-label="TERMINAL / REACT + WEBGL">
					<code>{code_setup}</code>
				</pre>
				<div className="reference-callout">
					<span>ALPHA</span>
					<p>
						Use the <code>@next</code> tag while APIs are still settling.
						Every package is ESM-only and includes TypeScript declarations.
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
