import type { Metadata } from "next";
import "./globals.css";
import { IconsSprite } from "@verifio/ui/icon";
import { Footer } from "@verifio/web/components/footer";
import { Header } from "@verifio/web/components/header";
import Script from "next/script";
import { ThemeProvider } from "next-themes";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://verifio.email";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: "Verifio - 99.9% Accurate Email Verification Platform | Free API",
	description:
		"Validate email addresses in real-time with 99.9% accuracy. Free email verification API that reduces bounce rates and protects sender reputation. Open-source and developer-friendly.",
	openGraph: {
		title: "99.9% Accurate Email Verification Platform | Verifio",
		description:
			"Validate emails in real-time with our free, open-source API. Reduce bounce rates by 98% and protect your sender reputation.",
		url: "https://verifio.com",
		siteName: "Verifio",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Verifio - Email Verification Platform",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "99.9% Accurate Email Verification Platform",
		description:
			"Free email verification API with real-time validation and 99.9% accuracy. Open-source and developer-friendly.",
		images: ["/twitter-card.png"],
	},
	other: {
		"ahrefs-site-verification":
			"b7c3e5b12601a4c0718faa39cd851493cf35110caf5f0a8c6f9724b4968be38f",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={"bg-bg-white-0 text-text-strong-950 antialiased"}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					{children}
					<div className="h-10" />
					<Footer />
					<IconsSprite />
				</ThemeProvider>
				<Script
					src="https://analytics.ahrefs.com/analytics.js"
					data-key="ti5gDNA17haJjb3IBUHy2g"
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}
