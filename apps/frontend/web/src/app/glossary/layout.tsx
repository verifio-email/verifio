import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Email Verification Glossary | Terminology & Definitions",
	description:
		"Complete glossary of email verification terminology. Learn about SMTP, MX records, disposable emails, bounce rates, deliverability, and more. Comprehensive guide for email marketers.",
	keywords:
		"email verification glossary, email terminology, email marketing terms, smtp definition, mx records, bounce rate, email deliverability",
	alternates: {
		canonical: "https://verifio.email/glossary",
	},
	openGraph: {
		title: "Email Verification Glossary - Complete Terminology Guide",
		description:
			"Master email verification terminology with our comprehensive glossary. Definitions for SMTP, MX records, bounce rates, deliverability, and more.",
		url: "https://verifio.email/glossary",
		siteName: "Verifio",
		type: "website",
	},
};

export default function GlossaryLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
