const routes_legacy = {
	"#adapters": "/docs/adapters/",
	"#anatomy": "/docs/primitives/",
	"#installation": "/docs/getting-started/",
	"#stage": "/examples/spatial-collection/",
} as const;

export function getRouteFromLegacyHash(hash_location: string) {
	return routes_legacy[hash_location as keyof typeof routes_legacy] ?? null;
}
