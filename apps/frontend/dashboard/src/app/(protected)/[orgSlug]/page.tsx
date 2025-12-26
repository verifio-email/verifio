"use client";

import { DashboardStatsSection } from "@fe/dashboard/components/dashboard-stats";
import { ExploreEndpointsSection } from "@fe/dashboard/components/explore-endpoints";
import { IntegrationsExamplesSection } from "@fe/dashboard/components/integrations-examples";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";

const endpoints = [
	{
		title: "Single Verify",
		description:
			"Verify individual emails instantly. Get detailed validation results.",
		href: "playground",
		icon: "check-circle",
	},
	{
		title: "Bulk Verify",
		description:
			"Upload and verify email lists in bulk. Process thousands efficiently.",
		href: "bulk",
		icon: "layers",
	},
	{
		title: "Domain Check",
		description:
			"Validate domain reputation and check MX records for any domain.",
		href: "domain",
		icon: "globe",
	},
	{
		title: "Real-time",
		description:
			"Verify emails on form submission with our real-time API endpoint.",
		href: "api-keys",
		icon: "clock",
		badge: "NEW",
	},
];

export default function Home() {
	const { activeOrganization } = useUserOrganization();

	return (
		<div className="flex-1 overflow-y-auto">
			{/* Explore Endpoints Section */}
			<ExploreEndpointsSection
				endpoints={endpoints}
				orgSlug={activeOrganization.slug}
			/>

			{/* Dashboard Stats Section */}
			<DashboardStatsSection />

			{/* Blank space before Integrations */}
			<div className="h-16 border-stroke-soft-200/50 border-b" />

			{/* Integrations and Example Projects Section */}
			<IntegrationsExamplesSection />
		</div>
	);
}
