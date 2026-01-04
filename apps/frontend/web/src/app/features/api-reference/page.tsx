import type { Metadata } from "next";
import { ApiReferenceContent } from "./components/api-reference-content";

export const metadata: Metadata = {
	title:
		"Email Verification API - Real-Time Verification Email Service | Verifio",
	description:
		"Powerful email verification API for developers. Verify email addresses in real-time, reduce bounce rates by 98%, and protect sender reputation. Free email verification with instant results. Start verifying emails today.",
	openGraph: {
		title:
			"Email Verification API - Real-Time Verification Email Service | Verifio",
		description:
			"Powerful email verification API for developers. Verify email addresses in real-time, reduce bounce rates by 98%, and protect sender reputation. Free email verification with instant results.",
		type: "website",
	},
};

const ApiReferencePage = () => {
	return <ApiReferenceContent />;
};

export default ApiReferencePage;
