"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
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
							className="font-normal text-text-strong-950 text-xl"
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
			<div className="border-stroke-soft-200 border-b px-2 py-2">
				<button
					type="button"
					onClick={handleSearchClick}
					className={cn(
						"relative z-10 flex h-10 w-full items-center overflow-hidden rounded-xl transition-all",
						"border border-transparent bg-neutral-alpha-10 hover:bg-neutral-alpha-16",
						"text-text-sub-600 hover:text-text-strong-950 active:scale-[0.98]",
						isSidebarCollapsed ? "justify-center px-0" : "",
					)}
				>
					<div className="flex h-10 w-10 shrink-0 items-center justify-center">
						<Icon name="search" className="h-4 w-4 text-text-sub-600" />
					</div>
					<AnimatePresence mode="wait">
						{!isSidebarCollapsed && (
							<motion.div
								className="flex flex-1 items-center pr-3"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.15 }}
								style={{ opacity: 1 }}
							>
								<span className="flex-1 text-left text-[13px] leading-[16px]">
									Search
								</span>
								<kbd className="rounded bg-neutral-alpha-10 px-1.5 py-0.5 font-mono text-xs">
									⌘K
								</kbd>
							</motion.div>
						)}
					</AnimatePresence>
				</button>
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
