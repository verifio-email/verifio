"use client";

import { cn } from "@verifio/ui/cn";
import { GlobalNavbar } from "./global-navbar";
import { MainSidebar } from "./main-sidebar";

interface AdaptiveLayoutProps {
	children: React.ReactNode;
	className?: string;
}

export const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
	children,
	className,
}) => {
	return (
		<div className={cn("flex min-h-screen", className)}>
			{/* Sidebar */}
			<MainSidebar />

			{/* Main Content with Navbar */}
			<div className="flex flex-1 flex-col">
				<GlobalNavbar />
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
};
