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
	const [hoverIdx, setHoverIdx] = useState<number | undefined>(undefined);
	const buttonRefs = useRef<HTMLAnchorElement[]>([]);
	const pathname = usePathname();

	const pathWithoutSlug = pathname.replace(/^\/[^/]+/, "") || "/";
	const activeIndex = mainNavigation.findIndex((item) => {
		if (item.path === "/") return pathWithoutSlug === "/";
		return pathWithoutSlug.startsWith(item.path);
	});

	// Only show hover background for non-active items
	const isHoveringNonActive =
		hoverIdx !== undefined && hoverIdx !== activeIndex;
	const currentIdx = isHoveringNonActive ? hoverIdx : undefined;
	const currentTab =
		currentIdx !== undefined ? buttonRefs.current[currentIdx] : undefined;
	const currentRect = currentTab?.getBoundingClientRect();
	const isActive = (index: number) => index === activeIndex;

	return (
		<div className="relative">
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
									if (el) {
										buttonRefs.current[index] = el;
									}
								}}
								onPointerEnter={() => setHoverIdx(index)}
								onPointerLeave={() => setHoverIdx(undefined)}
								className={cn(
									"flex h-11 items-center gap-2 rounded-lg px-2 py-5 text-left transition-colors",
									isCollapsed ? "justify-center" : "justify-start",
									active
										? "bg-primary-alpha-10 text-primary-base"
										: "text-text-sub-600",
									!active &&
										!currentRect &&
										currentIdx === index &&
										"bg-neutral-alpha-10",
								)}
								title={isCollapsed ? label : undefined}
							>
								<Icon
									name={iconName}
									className={cn(
										"h-[17px] w-[17px] shrink-0",
										active && "text-primary-darker",
									)}
								/>
								<AnimatePresence mode="wait">
									{!isCollapsed && (
										<motion.span
											className={cn("text-sm", active && "text-primary-darker")}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -10 }}
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

			<AnimatedHoverBackground rect={currentRect} tabElement={currentTab} />
		</div>
	);
};
