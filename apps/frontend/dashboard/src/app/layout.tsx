import type { Metadata } from "next";
import "./globals.css";
import SWRProvider from "@fe/dashboard/providers/swr.config";
import { IconsSprite } from "@verifio/ui/icon";
import * as Tooltip from "@verifio/ui/tooltip";
import { Geist_Mono, Outfit } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const openRunde = localFont({
	src: [
		{
			path: "../../public/font/openRunde/OpenRunde-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/font/openRunde/OpenRunde-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/font/openRunde/OpenRunde-Semibold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../../public/font/openRunde/OpenRunde-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-open-runde",
	display: "swap",
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
	weight: "600",
});
const baseUrl =
	process.env.NEXT_PUBLIC_APP_URL || "https://verifio.email/dashboard";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: "Verifio Dashboard",
	description: "Verifio Dashboard",
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
		<html lang="en" suppressHydrationWarning className={openRunde.variable}>
			<body
				className={`${geistMono.variable} ${outfit.variable} bg-bg-white-0 font-sans text-text-strong-950 antialiased`}
				style={{ fontFamily: "var(--font-open-runde)" }}
			>
				<NuqsAdapter>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<SWRProvider>
							<Tooltip.Provider>{children}</Tooltip.Provider>
							<IconsSprite />
							<Script
								src="https://analytics.ahrefs.com/analytics.js"
								data-key="ti5gDNA17haJjb3IBUHy2g"
								strategy="afterInteractive"
							/>
						</SWRProvider>
					</ThemeProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
