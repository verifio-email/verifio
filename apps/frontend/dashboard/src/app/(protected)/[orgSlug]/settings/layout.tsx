"use client";
import { SettingsSidebar } from "./components/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Header Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-32">
					<div className="relative border-stroke-soft-200/50 border-r border-l">
						<div className="px-6 py-8">
							<h1 className="mb-2 font-medium text-2xl text-text-strong-950">
								Settings
							</h1>
							<p className="text-paragraph-md text-text-sub-600">
								Manage your team, billing, and account preferences
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content Area with Sidebar - This needs to stretch */}
			<div className="flex-1">
				<div className="h-full px-32">
					<div className="grid h-full grid-cols-1 lg:grid-cols-[220px_1fr]">
						{/* Vertical Sidebar */}
						<div className="relative hidden h-full border-stroke-soft-200/50 border-l lg:block">
							<div className="sticky top-0 p-4">
								<SettingsSidebar />
							</div>
						</div>

						{/* Content Area - with right border */}
						<div className="relative flex h-full flex-col border-stroke-soft-200/50 border-r border-l">
							{children}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Layout;
