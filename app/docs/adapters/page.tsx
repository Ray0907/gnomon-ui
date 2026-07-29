import type { Metadata } from "next";
import { ReferenceShell } from "../../reference/ReferenceShell";

export const metadata: Metadata = {
	title: "Adapters — Gnomon UI",
	description:
		"Compare the shared contract across Gnomon UI core, React, Vue, and Three.js adapters.",
};

const code_renderer = `mountSpatialRenderer(host, ({ onValueChange }) => ({
  setValue(value, update) {
    scene.moveTo(value, { immediate: update?.immediate })
  },
  dispose() {
    scene.destroy()
  },
}))`;

export default function AdaptersPage() {
	return (
		<ReferenceShell
			active_route="adapters"
			eyebrow="INTEGRATION / SHARED CONTRACT"
			links_on_page={[
				{ href: "#contract", label: "Shared contract" },
				{ href: "#frameworks", label: "React and Vue" },
				{ href: "#renderer", label: "Three / WebGL" },
			]}
			summary={
				"Framework bindings translate composition conventions. Renderer " +
				"bindings translate lifecycle. Neither may fork interaction state."
			}
			title="One contract, every framework"
		>
			<section id="contract">
				<h2>Core is the fixed point.</h2>
				<p>
					<code>@gnomon-ui/core</code> has no React, Vue, or Three dependency.
					It owns ordered items, selection, disabled-state rules, and input
					reasons.
				</p>
				<dl className="reference-contract">
					<div>
						<dt>Core</dt>
						<dd>State, keyboard intent, subscriptions, and data-state values.</dd>
					</div>
					<div>
						<dt>React</dt>
						<dd>Spatial primitives, asChild composition, and external-store sync.</dd>
					</div>
					<div>
						<dt>Vue</dt>
						<dd>Matching primitives, v-model, provide/inject, and scoped slots.</dd>
					</div>
					<div>
						<dt>Three</dt>
						<dd>Renderer mount, value updates, pointer reports, and disposal.</dd>
					</div>
				</dl>
			</section>

			<section id="frameworks">
				<h2>React and Vue stay equivalent.</h2>
				<p>
					Both adapters emit the same semantic attributes and preserve
					controlled and uncontrolled state. Choose syntax based on the host
					application, not capability.
				</p>
				<div className="reference-callout">
					<span>PARITY</span>
					<p>
						React <code>value</code> and Vue <code>v-model</code> both map to
						the same core <code>setOptions</code> contract.
					</p>
				</div>
			</section>

			<section id="renderer">
				<h2>WebGL is optional.</h2>
				<p>
					The Three adapter is deliberately small. A renderer accepts a value,
					reports pointer-derived selection, and cleans up. Gnomon never owns
					your geometry, camera, or scene graph.
				</p>
				<pre className="reference-code" data-label="THREE / RENDERER ADAPTER">
					<code>{code_renderer}</code>
				</pre>
			</section>
		</ReferenceShell>
	);
}
