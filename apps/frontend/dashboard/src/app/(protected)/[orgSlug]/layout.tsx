import { AdaptiveLayout } from "@fe/dashboard/components/layout/adaptive-layout";
import { CreateOrganizationModal } from "@fe/dashboard/components/organization/create-organization";
import { UserOrganizationProvider } from "@fe/dashboard/providers/org-provider";
import { SidebarProvider } from "@fe/dashboard/providers/sidebar-provider";
import { Toaster } from "@verifio/ui/toast";

const OrgLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<UserOrganizationProvider>
			<SidebarProvider>
				<AdaptiveLayout>
					{children}
					<CreateOrganizationModal />
					<Toaster />
				</AdaptiveLayout>
			</SidebarProvider>
		</UserOrganizationProvider>
	);
};

export default OrgLayout;
