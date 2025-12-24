"use client";

import { mainNavigation } from "@fe/dashboard/constants";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
	const [isHovering, setIsHovering] = useState(false);
	const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
	const pathname = usePathname();

	// Track positions for smooth animation
	const [activePos, setActivePos] = useState({ top: 0, height: 40 });
	const [hoverPos, setHoverPos] = useState({ top: 0, height: 40 });

	const pathWithoutSlug = pathname.replace(/^\/[^/]+/, "") || "/";
	const activeIndex = mainNavigation.findIndex((item) => {
		if (item.path === "/") return pathWithoutSlug === "/";
		return pathWithoutSlug.startsWith(item.path);
	});

	// Update active position when activeIndex changes or on mount
	useEffect(() => {
		if (activeIndex >= 0) {
			const activeItem = itemRefs.current[activeIndex];
			if (activeItem) {
				setActivePos({
					top: activeItem.offsetTop,
					height: activeItem.offsetHeight,
				});
			}
		}
	}, [activeIndex]);

	// Update hover position when hoverIdx changes
	useEffect(() => {
		if (hoverIdx !== null && hoverIdx !== activeIndex) {
			const hoverItem = itemRefs.current[hoverIdx];
			if (hoverItem) {
				setHoverPos({
					top: hoverItem.offsetTop,
					height: hoverItem.offsetHeight,
				});
			}
		}
	}, [hoverIdx, activeIndex]);

	const isActive = (index: number) => index === activeIndex;
	const showHoverIndicator =
		isHovering && hoverIdx !== null && hoverIdx !== activeIndex;

	return (
		<div className="relative">
			{/* Active item sliding background - primary color */}
			{activeIndex >= 0 && (
				<AnimatedHoverBackground
					top={activePos.top}
					height={activePos.height}
					isActive={true}
					isPrimary={true}
					zIndex={1}
				/>
			)}

			{/* Hover preview background - neutral color - slides smoothly */}
			<AnimatedHoverBackground
				top={hoverPos.top}
				height={hoverPos.height}
				isVisible={showHoverIndicator}
				zIndex={0}
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
									onMouseEnter={() => {
										setHoverIdx(index);
										setIsHovering(true);
									}}
									onMouseLeave={() => {
										setIsHovering(false);
									}}
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
