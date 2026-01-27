import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Disposable Email API Playground | Interactive Demo | Verifio",
	description:
		"Interactive playground demonstrating disposable email detection. Test emails, explore providers, and see real-time detection in action.",
	keywords:
		"disposable email detector, email verification demo, API playground, test disposable emails",
	alternates: {
		canonical: "https://verifio.email/tools/disposable-api-playground",
	},
	openGraph: {
		title: "Disposable Email API Playground - Interactive Demo",
		description:
			"Test disposable email detection in real-time. Explore 72K+ disposable email providers with our interactive demo.",
		url: "https://verifio.email/tools/disposable-api-playground",
		siteName: "Verifio",
		type: "website",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
