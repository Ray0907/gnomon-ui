import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo";
import "@fontsource-variable/jetbrains-mono";
import "@gnomon-ui/theme/styles.css";
import "./globals.css";
import "./reference/reference.css";
import { siteConfig } from "./site-config";

const url_site = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
const url_social = new URL("social-card.jpg", url_site).toString();

export const metadata: Metadata = {
	metadataBase: new URL(url_site),
	title: siteConfig.title,
	description: siteConfig.description,
	applicationName: siteConfig.applicationName,
	category: "developer tools",
	alternates: {
		canonical: siteConfig.url,
	},
	openGraph: {
		title: siteConfig.title,
		description: siteConfig.description,
		type: "website",
		url: siteConfig.url,
		siteName: siteConfig.applicationName,
		images: [
			{
				url: url_social,
				width: 1200,
				height: 630,
				alt: siteConfig.socialImageAlt,
				type: "image/jpeg",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.title,
		description: siteConfig.description,
		images: [url_social],
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#f4f5f1",
	colorScheme: "light",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
