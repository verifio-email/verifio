import type { Metadata } from "next";
import { LoginPage } from "./login-page";

export const metadata: Metadata = {
	title: "Login | Verifio",
	description:
		"Sign in to your Verifio account to access real-time email verification, analytics, and API management.",
	openGraph: {
		title: "Login | Verifio",
		description:
			"Sign in to your Verifio account to access real-time email verification, analytics, and API management.",
		url: "https://verifio.email/dashboard/login",
		siteName: "Verifio",
		type: "website",
		// Images auto-generated from opengraph-image.tsx
	},
	twitter: {
		card: "summary_large_image",
		title: "Login | Verifio",
		description:
			"Sign in to your Verifio account to access real-time email verification, analytics, and API management.",
		// Images auto-generated from opengraph-image.tsx
	},
};

export default function Page() {
	return <LoginPage />;
}
