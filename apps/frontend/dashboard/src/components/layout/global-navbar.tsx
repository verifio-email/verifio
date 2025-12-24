"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { authClient } from "@verifio/auth/client";
import useSWR from "swr";
import { NavbarActions } from "./navbar-actions";
import { OrganizationSwitcher } from "./sidebar/organization-switcher";

interface Organization {
	id: string;
	name: string;
	slug: string;
	logo?: string | null;
}

export const GlobalNavbar = () => {
	const { activeOrganization, push } = useUserOrganization();
	const { refetch } = authClient.useSession();

	const { data: organizations } = useSWR(
		"organizations",
		async () => (await authClient.organization.list()).data ?? undefined,
	);

	const handleOrganizationChange = async (organization: Organization) => {
		await authClient.updateUser({
			activeOrganizationId: organization.id,
		});
		refetch();
		push(organization.slug, true);
	};

	return (
		<nav className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-stroke-soft-200 border-b px-4">
			{/* Left: Organization Switcher */}
			<div className="flex items-center gap-4">
				<OrganizationSwitcher
					organizations={organizations}
					activeOrganization={activeOrganization}
					onOrganizationChange={handleOrganizationChange}
					side="bottom"
				/>
			</div>

			{/* Right: Help, Docs, Feedback */}
			<NavbarActions />
		</nav>
	);
};
