import type { Metadata } from "next";
import { ForgotPasswordPage } from "./forgot-password-page";

export const metadata: Metadata = {
	title: "Forgot Password | Verifio",
	description:
		"Reset your Verifio password. Enter your email address and we'll send you instructions to create a new password.",
	openGraph: {
		title: "Forgot Password | Verifio",
		description:
			"Reset your Verifio password. Enter your email address and we'll send you instructions to create a new password.",
		url: "https://verifio.email/dashboard/forgot-password",
		siteName: "Verifio",
		type: "website",
		// Images auto-generated from opengraph-image.tsx
	},
	twitter: {
		card: "summary_large_image",
		title: "Forgot Password | Verifio",
		description:
			"Reset your Verifio password. Enter your email address and we'll send you instructions to create a new password.",
		// Images auto-generated from opengraph-image.tsx
	},
};

export default function Page() {
	return <ForgotPasswordPage />;
}
