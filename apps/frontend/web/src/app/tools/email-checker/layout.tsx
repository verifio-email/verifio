import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Free Email Verifier | Verify Email Address Free | Email Checker Free",
	description:
		"Verify email addresses instantly with our free email verification tool. Check syntax, MX records, disposable domains, and SMTP. No signup required. 99% accuracy rate.",
	keywords:
		"free email verifier, email verification free, verify email address free, email checker free, email validation, check email validity, email address verification",
	alternates: {
		canonical: "https://verifio.email/tools/email-checker",
	},
	openGraph: {
		title: "Free Email Verifier - Verify Email Addresses Instantly",
		description:
			"Check if an email address is valid in seconds. Free email verification tool with syntax, MX, and SMTP checks.",
		url: "https://verifio.email/tools/email-checker",
		siteName: "Verifio",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Free Email Verification Tool",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Email Verifier | Verify Email Address Free",
		description:
			"Instantly verify any email address. Check syntax, MX records, disposable domains, and more — completely free.",
		images: ["/og-image.png"],
	},
};

export default function EmailCheckerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
