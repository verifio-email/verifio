import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Verify Gmail Email Address | Free Gmail Email Checker Tool",
	description:
		"Verify Gmail email addresses instantly with our free tool. Check if Gmail addresses are valid, active, and can receive messages. No signup required.",
	keywords:
		"verify gmail email address, gmail email checker, check gmail address, gmail email validation, verify gmail account",
	alternates: {
		canonical: "https://verifio.email/tools/verify-gmail-email-address",
	},
	openGraph: {
		title: "Verify Gmail Email Address - Free Gmail Email Checker",
		description:
			"Instantly verify if a Gmail email address is valid and active. Check syntax, domain status, and mailbox existence for @gmail.com addresses.",
		url: "https://verifio.email/tools/verify-gmail-email-address",
		siteName: "Verifio",
		type: "website",
	},
};

export default function GmailVerifyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
