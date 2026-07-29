import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "../site-config";

export type ReferenceRoute =
	| "getting-started"
	| "primitives"
	| "adapters"
	| "spatial-collection";

type OnPageLink = {
	href: `#${string}`;
	label: string;
};

type ReferenceShellProps = {
	active_route: ReferenceRoute;
	children: ReactNode;
	eyebrow: string;
	links_on_page: OnPageLink[];
	summary: string;
	title: string;
};

const routes_reference = [
	{
		group: "START",
		href: "/docs/getting-started/",
		key: "getting-started",
		label: "Getting Started",
	},
	{
		group: "FOUNDATIONS",
		href: "/docs/primitives/",
		key: "primitives",
		label: "Primitives",
	},
	{
		group: "INTEGRATION",
		href: "/docs/adapters/",
		key: "adapters",
		label: "Adapters",
	},
	{
		group: "EXAMPLES",
		href: "/examples/spatial-collection/",
		key: "spatial-collection",
		label: "Spatial Collection",
	},
] as const;

function getCubeMark() {
	return (
		<svg viewBox="0 0 32 32" aria-hidden="true">
			<path d="m16 2 12 7v14l-12 7-12-7V9l12-7Z" />
			<path d="m4 9 12 7 12-7M16 16v14" />
		</svg>
	);
}

function getReferenceNav(active_route: ReferenceRoute, label_nav: string) {
	return (
		<nav aria-label={label_nav}>
			{routes_reference.map((route_current, index_route) => {
				const group_previous = routes_reference[index_route - 1]?.group;
				return (
					<div className="reference-nav-entry" key={route_current.key}>
						{route_current.group !== group_previous ? (
							<span className="reference-nav-label">
								{route_current.group}
							</span>
						) : null}
						<Link
							href={route_current.href}
							aria-current={
								route_current.key === active_route ? "page" : undefined
							}
						>
							<span>{String(index_route + 1).padStart(2, "0")}</span>
							{route_current.label}
						</Link>
					</div>
				);
			})}
		</nav>
	);
}

export function ReferenceShell({
	active_route,
	children,
	eyebrow,
	links_on_page,
	summary,
	title,
}: ReferenceShellProps) {
	const index_active = routes_reference.findIndex(
		(route_current) => route_current.key === active_route,
	);
	const route_previous = routes_reference[index_active - 1];
	const route_next = routes_reference[index_active + 1];

	return (
		<main className="reference-page">
			<header className="reference-header">
				<Link className="reference-brand" href="/" aria-label="Gnomon UI home">
					<span>{getCubeMark()}</span>
					<strong>GNOMON UI</strong>
					<small>DOCS / v0.1</small>
				</Link>
				<nav className="reference-global-nav" aria-label="Global navigation">
					<Link href="/docs/primitives/">Primitives</Link>
					<Link href="/docs/adapters/">Adapters</Link>
					<Link href="/examples/spatial-collection/">Example</Link>
				</nav>
				<a className="reference-source" href={siteConfig.repository}>
					GITHUB
					<span aria-hidden="true">↗</span>
				</a>
			</header>

			<details className="reference-mobile-sections">
				<summary>
					<span>SECTIONS</span>
					<span aria-hidden="true">+</span>
				</summary>
				{getReferenceNav(active_route, "Documentation sections")}
			</details>

			<div className="reference-grid">
				<aside className="reference-local">
					<span className="reference-rail-title">DOCUMENTATION</span>
					{getReferenceNav(active_route, "Documentation")}
					<p>
						<span>STATUS</span>
						<strong>
							<i />
							PROTOTYPE / ACTIVE
						</strong>
					</p>
				</aside>

				<article className="reference-article">
					<header className="reference-intro">
						<p>
							<span>{eyebrow}</span>
							<span>GN / {String(index_active + 1).padStart(2, "0")}</span>
						</p>
						<h1>{title}</h1>
						<div>
							<p>{summary}</p>
							<span aria-hidden="true">X / Y / Z</span>
						</div>
					</header>

					<div className="reference-content">{children}</div>

					<nav className="reference-pager" aria-label="Guide pagination">
						{route_previous ? (
							<Link href={route_previous.href} rel="prev">
								<span>PREVIOUS</span>
								<strong>← {route_previous.label}</strong>
							</Link>
						) : (
							<span aria-hidden="true" />
						)}
						{route_next ? (
							<Link href={route_next.href} rel="next">
								<span>NEXT</span>
								<strong>{route_next.label} →</strong>
							</Link>
						) : (
							<span aria-hidden="true" />
						)}
					</nav>
				</article>

				<aside className="reference-index">
					<span>ON THIS PAGE</span>
					<nav aria-label="On this page">
						{links_on_page.map((link_current, index_link) => (
							<a href={link_current.href} key={link_current.href}>
								<span>{String(index_link + 1).padStart(2, "0")}</span>
								{link_current.label}
							</a>
						))}
					</nav>
				</aside>
			</div>
		</main>
	);
}
