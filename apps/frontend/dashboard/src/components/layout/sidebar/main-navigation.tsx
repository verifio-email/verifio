"use client";

import { mainNavigation } from "@fe/dashboard/constants";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { AnimatedHoverBackground } from "./animated-hover-background";

interface MainNavigationProps {
	organizationSlug: string;
	isCollapsed?: boolean;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({
	organizationSlug,
	isCollapsed = false,
}) => {
	const [hoverIdx, setHoverIdx] = useState<number | null>(null);
	const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
	const pathname = usePathname();

	const pathWithoutSlug = pathname.replace(/^\/[^/]+/, "") || "/";
	const activeIndex = mainNavigation.findIndex((item) => {
		if (item.path === "/") return pathWithoutSlug === "/";
		return pathWithoutSlug.startsWith(item.path);
	});

	// Get active tab element and rect
	const activeTab = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
	const activeRect = activeTab?.getBoundingClientRect();

	// Get hover tab element and rect (only for non-active items)
	const isHoveringNonActive = hoverIdx !== null && hoverIdx !== activeIndex;
	const hoverTab = isHoveringNonActive ? itemRefs.current[hoverIdx] : null;
	const hoverRect = hoverTab?.getBoundingClientRect();

	const isActive = (index: number) => index === activeIndex;

	return (
		<div className="relative">
			{/* Active item sliding background - primary color */}
			<AnimatedHoverBackground
				rect={activeRect}
				tabElement={activeTab ?? undefined}
				isActive={true}
				isPrimary={true}
			/>

			{/* Hover preview background - neutral color */}
			<AnimatedHoverBackground
				rect={hoverRect}
				tabElement={hoverTab ?? undefined}
				isActive={false}
			/>

			{/* Navigation items */}
			<div className="relative z-10 space-y-1">
				{mainNavigation.map(
					({ path, label, iconName, hasSeparatorAbove }, index) => {
						const href = `/${organizationSlug}${path}`;
						const active = isActive(index);

						return (
							<div key={path + index}>
								{hasSeparatorAbove && (
									<div className="my-2 border-stroke-soft-200 border-t" />
								)}
								<Link
									href={href}
									ref={(el) => {
										itemRefs.current[index] = el;
									}}
									onPointerEnter={() => setHoverIdx(index)}
									onPointerLeave={() => setHoverIdx(null)}
									className={cn(
										"group relative flex h-10 w-full items-center gap-2 rounded-xl px-2 transition-all",
										"active:scale-[0.98]",
										isCollapsed ? "justify-center" : "justify-start",
										active
											? "text-primary-darker"
											: "text-text-sub-600 hover:text-text-strong-950",
									)}
									title={isCollapsed ? label : undefined}
								>
									{/* Icon container */}
									<div className="flex h-10 w-8 shrink-0 items-center justify-center">
										<Icon
											name={iconName}
											className={cn(
												"h-4 w-4 transition-colors",
												active
													? "text-primary-darker"
													: "text-text-soft-400 group-hover:text-text-sub-600",
											)}
										/>
									</div>
									<AnimatePresence mode="wait">
										{!isCollapsed && (
											<motion.span
												className={cn(
													"truncate text-sm transition-colors",
													active && "text-primary-darker",
												)}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.15 }}
											>
												{label}
											</motion.span>
										)}
									</AnimatePresence>
								</Link>
							</div>
						);
					},
				)}
			</div>
		</div>
	);
};
