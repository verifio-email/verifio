import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Email List Health Calculator | Free List Analysis | Verifio",
	description:
		"Analyze your email list health for free. Check up to 50 emails for deliverability, disposable addresses, and quality score.",
	keywords:
		"email list health, email list checker, email quality score, clean email list, email list analysis",
	alternates: {
		canonical: "https://verifio.email/tools/list-health-calculator",
	},
	openGraph: {
		title: "Email List Health Calculator - Free List Analysis",
		description:
			"Upload your email list and get instant health scoring, risk analysis, and deliverability insights. Check up to 50 emails free.",
		url: "https://verifio.email/tools/list-health-calculator",
		siteName: "Verifio",
		type: "website",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
