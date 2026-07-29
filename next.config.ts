import type { NextConfig } from "next";

const path_base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
	basePath: path_base,
	output: "export",
	distDir: "dist",
	trailingSlash: true,
	transpilePackages: [
		"@gnomon-ui/core",
		"@gnomon-ui/react",
		"@gnomon-ui/three",
		"@gnomon-ui/theme",
	],
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
