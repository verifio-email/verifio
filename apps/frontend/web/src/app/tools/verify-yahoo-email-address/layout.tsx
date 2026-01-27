import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Verify Yahoo Email Address | Free Yahoo Email Checker Tool",
	description:
		"Verify Yahoo email addresses instantly. Check if Yahoo Mail addresses are valid and active. Free tool with no signup required.",
	keywords:
		"verify yahoo email address, yahoo email checker, check yahoo address, yahoo email validation",
	alternates: {
		canonical: "https://verifio.email/tools/verify-yahoo-email-address",
	},
};

export default function YahooVerifyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
