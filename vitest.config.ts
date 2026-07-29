import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@gnomon-ui/core": fileURLToPath(
				new URL("./packages/core/src/index.ts", import.meta.url),
			),
		},
	},
	test: {
		environment: "jsdom",
		include: ["tests/**/*.test.{ts,tsx}"],
	},
});
