import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Catch-All Domain Checker | Accept-All Detection | Verifio",
	description:
		"Check if a domain is configured as catch-all (accept-all). Detect catch-all domains with SMTP testing and understand the implications.",
	keywords:
		"catch-all domain checker, accept-all domain test, catch-all email detection, catch-all smtp test",
	alternates: {
		canonical: "https://verifio.email/tools/catchall-checker",
	},
	openGraph: {
		title: "Catch-All Domain Checker - Accept-All Detection",
		description:
			"Test if a domain is catch-all (accept-all). SMTP-based detection with confidence levels and detailed analysis.",
		url: "https://verifio.email/tools/catchall-checker",
		siteName: "Verifio",
		type: "website",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
