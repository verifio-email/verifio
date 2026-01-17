import type { Metadata } from "next";
import { AcceptInvitationPage } from "./accept-invitation-page";

export const metadata: Metadata = {
	title: "Accept Invitation | Verifio",
	description:
		"Accept your team invitation to join an organization on Verifio and start collaborating on email verification.",
	openGraph: {
		title: "Accept Invitation | Verifio",
		description:
			"Accept your team invitation to join an organization on Verifio and start collaborating on email verification.",
		url: "https://verifio.email/dashboard/accept-invitation",
		siteName: "Verifio",
		type: "website",
		// Images auto-generated from opengraph-image.tsx
	},
	twitter: {
		card: "summary_large_image",
		title: "Accept Invitation | Verifio",
		description:
			"Accept your team invitation to join an organization on Verifio and start collaborating on email verification.",
		// Images auto-generated from opengraph-image.tsx
	},
	robots: {
		index: false,
		follow: false,
	},
};

export default function Page() {
	return <AcceptInvitationPage />;
}
