import type { Metadata } from "next";
import { SignupPage } from "./signup-page";

export const metadata: Metadata = {
	title: "Sign Up | Verifio",
	description:
		"Create your Verifio account and start verifying email addresses in real-time. Free tier includes 100 verifications per month.",
	openGraph: {
		title: "Sign Up | Verifio",
		description:
			"Create your Verifio account and start verifying email addresses in real-time. Free tier includes 100 verifications per month.",
		url: "https://verifio.email/dashboard/signup",
		siteName: "Verifio",
		type: "website",
		// Images auto-generated from opengraph-image.tsx
	},
	twitter: {
		card: "summary_large_image",
		title: "Sign Up | Verifio",
		description:
			"Create your Verifio account and start verifying email addresses in real-time. Free tier includes 100 verifications per month.",
		// Images auto-generated from opengraph-image.tsx
	},
};

export default function Page() {
	return <SignupPage />;
}
