import type { Metadata } from "next";
import "./globals.css";
import { IconsSprite } from "@verifio/ui/icon";
import { Footer } from "@verifio/web/components/footer";
import { Header } from "@verifio/web/components/header";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
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
					<Footer />
					<IconsSprite />
				</ThemeProvider>
			</body>
		</html>
	);
}
