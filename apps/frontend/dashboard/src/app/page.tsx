"use client";
import { authClient } from "@verifio/auth/client";
import Spinner from "@verifio/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

const Home = () => {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const activeOrganizationId = session?.user.activeOrganizationId;
	const { data: organizations, isLoading: organizationsLoading } = useSWR(
		"organizations",
		async () => (await authClient.organization.list()).data,
	);

	useEffect(() => {
		const handleRedirect = async () => {
			if (!isPending && !organizationsLoading && organizations && session) {
				if (!organizations || organizations.length === 0) {
					// Org should be auto-created on signup, if not found yet, stay loading
					return;
				}
				if (!activeOrganizationId) {
					const firstOrg = organizations[0];
					if (firstOrg?.slug) {
						await authClient.organization.setActive({
							organizationId: firstOrg.id,
						});
						await authClient.updateUser({
							activeOrganizationId: firstOrg.id,
						});
						router.push(`/${firstOrg.slug}`);
					}
					return;
				}
				const activeOrg = organizations.find(
					(org) => org.id === activeOrganizationId,
				);
				if (activeOrg?.slug) {
					router.push(`/${activeOrg.slug}`);
				}
			} else {
				if (!isPending) {
					router.push("/login");
				}
			}
		};

		handleRedirect();
	}, [
		isPending,
		organizationsLoading,
		organizations,
		activeOrganizationId,
		router,
	]);

	return (
		<div className="flex h-screen items-center justify-center">
			<Spinner />
		</div>
	);
};

export default Home;
