"use client";

import { cn } from "@verifio/ui/cn";
import { motion } from "motion/react";

interface AnimatedHoverBackgroundProps {
	/** Position from top of container */
	top: number;
	/** Height of the indicator */
	height: number;
	/** Whether the indicator should be visible */
	isVisible?: boolean;
	/** Custom className */
	className?: string;
	/** Use danger color (red) */
	isDanger?: boolean;
	/** Use primary color instead of neutral */
	isPrimary?: boolean;
	/** When true, always visible (for active item indicator) */
	isActive?: boolean;
	/** Z-index for layering */
	zIndex?: number;
}

/**
 * Animated background indicator that slides smoothly between positions.
 * Always stays mounted to enable smooth position transitions.
 * Use isVisible to fade in/out without remounting.
 */
export const AnimatedHoverBackground: React.FC<
	AnimatedHoverBackgroundProps
> = ({
	top,
	height,
	isVisible = true,
	className,
	isDanger = false,
	isPrimary = false,
	isActive = false,
	zIndex = 0,
}) => {
	// Determine background color
	const bgColor = isDanger
		? "bg-red-alpha-10"
		: isPrimary || isActive
			? "bg-primary-alpha-10"
			: "bg-neutral-alpha-10";

	// Active indicators are always visible
	const shouldShow = isActive ? true : isVisible;

	return (
		<motion.div
			className={cn(
				"pointer-events-none absolute right-0 left-0 rounded-lg",
				bgColor,
				className,
			)}
			initial={false}
			animate={{
				top,
				height,
				opacity: shouldShow ? 1 : 0,
			}}
			transition={{
				type: "spring",
				stiffness: 500,
				damping: 35,
				opacity: { duration: 0.15 },
			}}
			style={{ zIndex }}
		/>
	);
};
