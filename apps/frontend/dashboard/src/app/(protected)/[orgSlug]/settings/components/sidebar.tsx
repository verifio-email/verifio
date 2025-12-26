"use client";
import { AnimatedHoverBackground } from "@fe/dashboard/components/layout/sidebar/animated-hover-background";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const list = [
	{
		title: "General",
		path: "/settings",
		iconName: "gear",
	},
	{
		title: "Account",
		path: "/settings/account",
		iconName: "user",
	},
	{
		title: "Team",
		path: "/settings/team",
		iconName: "users",
	},
	{
		title: "Security",
		path: "/settings/security",
		iconName: "shield-check",
	},
	{
		title: "Appearance",
		path: "/settings/appearance",
		iconName: "swatch-book",
	},
];

export const SettingsSidebar = () => {
	const pathname = usePathname();
	const { activeOrganization } = useUserOrganization();
	const [hoverIdx, setHoverIdx] = useState<number | null>(null);
	const [isHovering, setIsHovering] = useState(false);
	const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

	// Track positions for smooth animation
	const [activePos, setActivePos] = useState({ top: 0, height: 40 });
	const [hoverPos, setHoverPos] = useState({ top: 0, height: 40 });

	// Extract path without org slug
	const pathWithoutSlug = pathname.replace(/^\/[^/]+/, "") || "/";

	// Match current path to list items
	const isActive = (itemPath: string) => {
		if (itemPath === "/settings") {
			return pathWithoutSlug === "/settings" || pathWithoutSlug === "/";
		}
		return (
			pathWithoutSlug === itemPath || pathWithoutSlug.startsWith(itemPath + "/")
		);
	};

	// Find active index
	const activeIndex = list.findIndex((item) => isActive(item.path));

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

	const showHoverIndicator =
		isHovering && hoverIdx !== null && hoverIdx !== activeIndex;

	return (
		<nav className="relative">
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
			<div className="relative z-10 space-y-1.5">
				{list.map(({ path, title, iconName }, index) => {
					const active = index === activeIndex;
					return (
						<Link
							key={path}
							ref={(el) => {
								itemRefs.current[index] = el;
							}}
							href={`/${activeOrganization.slug}${path}`}
							onMouseEnter={() => {
								setHoverIdx(index);
								setIsHovering(true);
							}}
							onMouseLeave={() => {
								setIsHovering(false);
							}}
							className={cn(
								"group relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left transition-all",
								"active:scale-[0.98]",
								active
									? "text-primary-darker"
									: "text-text-sub-600 hover:text-text-strong-950",
							)}
						>
							<div className="flex h-10 flex-shrink-0 items-center justify-center">
								<Icon
									name={iconName}
									className={cn(
										"h-4 w-4 transition-all",
										active
											? "text-primary-darker"
											: "text-text-soft-400 group-hover:text-text-sub-600",
									)}
								/>
							</div>
							<span
								className={cn(
									"flex-1 text-sm transition-all",
									active
										? "font-medium text-primary-darker"
										: "text-text-sub-600 group-hover:text-text-strong-950",
								)}
							>
								{title}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};
