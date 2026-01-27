import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Email Deliverability Tester | Free Email Deliverability Test | Verifio",
	description:
		"Test if your domain is properly configured for email deliverability. Check DNS, MX records, SPF, DKIM, and DMARC configuration for free.",
	keywords:
		"email deliverability test, check MX records, SPF record checker, DMARC record test, email DNS checker, email deliverability tools",
	alternates: {
		canonical: "https://verifio.email/tools/deliverability-tester",
	},
	openGraph: {
		title: "Email Deliverability Tester - Free Email Deliverability Test",
		description:
			"Test if your domain is properly configured for email deliverability. Check DNS, MX records, SPF, DKIM, and DMARC configuration.",
		url: "https://verifio.email/tools/deliverability-tester",
		siteName: "Verifio",
		type: "website",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
