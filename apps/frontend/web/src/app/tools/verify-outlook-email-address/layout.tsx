import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Verify Outlook Email Address | Free Outlook Email Checker Tool",
	description:
		"Verify Outlook email addresses instantly. Check if Outlook/Hotmail addresses are valid and active. Free tool with no signup.",
	keywords:
		"verify outlook email address, outlook email checker, check outlook address, hotmail email verification",
	alternates: {
		canonical: "https://verifio.email/tools/verify-outlook-email-address",
	},
};

export default function OutlookVerifyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
