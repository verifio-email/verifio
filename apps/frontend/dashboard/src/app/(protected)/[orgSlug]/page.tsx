"use client";

import { ApiKeyDisplay } from "@fe/dashboard/components/api-key-display";
import { ExploreEndpointsSection } from "@fe/dashboard/components/explore-endpoints";
import { ScrapedPagesChart } from "@fe/dashboard/components/scraped-pages-chart";
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
			<div>
				<ExploreEndpointsSection
					endpoints={endpoints}
					orgSlug={activeOrganization.slug}
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
				<ScrapedPagesChart />
				<ApiKeyDisplay />
			</div>
		</div>
	);
}
