import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Company Email Verification | Verify Business Email Addresses",
	description:
		"Verify company and business email addresses instantly. Check if corporate emails are valid. Free B2B email verification tool.",
	keywords:
		"company email verification, business email verification, verify corporate email, b2b email validation",
	alternates: {
		canonical: "https://verifio.email/tools/verify-company-domain-email",
	},
};

export default function CompanyDomainVerifyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
