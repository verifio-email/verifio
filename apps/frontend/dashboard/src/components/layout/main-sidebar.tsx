"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import * as Kbd from "@verifio/ui/kbd";
import { Logo } from "@verifio/ui/logo";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MainNavigation, UserMenuDropdown } from "./sidebar";

interface MainSidebarProps {
	className?: string;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({ className }) => {
	const { user, activeOrganization } = useUserOrganization();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

	useEffect(() => {
		try {
			const saved = localStorage.getItem("isSidebarCollapsed");
			if (saved !== null) {
				setIsSidebarCollapsed(saved === "true");
			}
		} catch {}
	}, []);

	const toggleSidebarCollapse = () => {
		setIsSidebarCollapsed((prev) => {
			const next = !prev;
			try {
				localStorage.setItem("isSidebarCollapsed", String(next));
			} catch {}
			return next;
		});
	};

	const handleSearchClick = () => {
		// TODO: Implement search functionality
		console.log("Search clicked");
	};

	return (
		<motion.div
			className={cn(
				"sticky top-0 z-10 flex h-screen flex-col border-stroke-soft-200 border-r",
				isSidebarCollapsed ? "w-14" : "w-64",
				className,
			)}
			animate={{ width: isSidebarCollapsed ? 56 : 255 }}
			transition={{ duration: 0.2, ease: "easeInOut" }}
		>
			{/* Header - Logo and App Name */}
			<div className="flex h-16 items-center gap-2 border-stroke-soft-200 border-b px-4">
				<Logo className="h-7 w-7 shrink-0 rounded-md" />
				<AnimatePresence mode="wait">
					{!isSidebarCollapsed && (
						<motion.span
							className="font-semibold text-lg text-text-strong-950"
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}
							transition={{ duration: 0.15 }}
						>
							Verifio
						</motion.span>
					)}
				</AnimatePresence>
			</div>

			{/* Search Bar */}
			<div className="border-stroke-soft-200 border-b px-3 py-2">
				<div
					className={cn(
						"relative flex h-10 w-full items-center rounded-lg bg-bg-soft-200",
						isSidebarCollapsed ? "justify-center px-0" : "px-3",
					)}
				>
					<Icon name="search" className="h-4 w-4 shrink-0 text-text-sub-600" />
					<AnimatePresence mode="wait">
						{!isSidebarCollapsed && (
							<motion.div
								className="flex flex-1 items-center"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								transition={{ duration: 0.15 }}
							>
								<input
									type="text"
									placeholder="Search"
									className="ml-2 flex-1 bg-transparent text-sm text-text-strong-950 placeholder:text-text-sub-600 focus:outline-none"
									onClick={handleSearchClick}
								/>
								<Kbd.Root className="-translate-y-1/2 absolute top-1/2 right-2 rounded bg-bg-soft-200 px-1.5 py-1.5 font-medium text-[11px] text-text-sub-600">
									⌘K
								</Kbd.Root>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Main Navigation */}
			<div className="flex-1 overflow-y-auto p-3">
				<MainNavigation
					organizationSlug={activeOrganization.slug}
					isCollapsed={isSidebarCollapsed}
				/>
			</div>

			{/* Bottom Section - User Menu and Collapse */}
			<div>
				{/* User Menu */}
				<div className="px-3 pb-2">
					<UserMenuDropdown
						user={user}
						organizationSlug={activeOrganization.slug}
						isCollapsed={isSidebarCollapsed}
					/>
				</div>

				{/* Collapse Button */}
				<div className="border-stroke-soft-200 border-t px-3 py-2">
					<Button.Root
						mode="ghost"
						size="small"
						onClick={toggleSidebarCollapse}
						className={cn(
							"flex w-full items-center gap-2 text-text-sub-600",
							isSidebarCollapsed ? "justify-center" : "justify-start px-2",
						)}
						title={isSidebarCollapsed ? "Expand" : "Collapse"}
					>
						<Icon
							name={isSidebarCollapsed ? "chevron-right" : "chevron-left"}
							className="h-4 w-4 shrink-0"
						/>
						<AnimatePresence mode="wait">
							{!isSidebarCollapsed && (
								<motion.span
									className="text-sm"
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.15 }}
								>
									Collapse
								</motion.span>
							)}
						</AnimatePresence>
					</Button.Root>
				</div>
			</div>
		</motion.div>
	);
};
