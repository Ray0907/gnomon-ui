import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
