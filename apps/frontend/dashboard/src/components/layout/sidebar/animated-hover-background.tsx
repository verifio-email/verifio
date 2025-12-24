"use client";

import { cn } from "@verifio/ui/cn";
import { AnimatePresence, motion } from "motion/react";

interface AnimatedHoverBackgroundProps {
	rect: DOMRect | undefined;
	tabElement: HTMLElement | undefined;
	className?: string;
	isDanger?: boolean;
	isPrimary?: boolean;
	/** When true, renders as active item indicator with spring animation */
	isActive?: boolean;
}

export const AnimatedHoverBackground: React.FC<
	AnimatedHoverBackgroundProps
> = ({
	rect,
	tabElement,
	className,
	isDanger = false,
	isPrimary = false,
	isActive = false,
}) => {
	if (!rect || !tabElement) return null;

	// Use offsetTop/offsetLeft for position relative to parent container
	const left = tabElement.offsetLeft;
	const top = tabElement.offsetTop;

	// Active indicator uses spring animation and doesn't fade in/out
	if (isActive) {
		return (
			<motion.div
				className={cn(
					"pointer-events-none absolute top-0 left-0 origin-top rounded-xl",
					isDanger
						? "bg-red-alpha-10"
						: isPrimary
							? "bg-primary-alpha-10"
							: "bg-primary-alpha-10",
					className,
				)}
				initial={false}
				animate={{
					width: rect.width,
					height: rect.height,
					left,
					top,
					opacity: 1,
				}}
				transition={{
					type: "spring",
					stiffness: 500,
					damping: 35,
				}}
			/>
		);
	}

	// Hover indicator with fade animation
	return (
		<AnimatePresence>
			{rect && (
				<motion.div
					className={cn(
						"pointer-events-none absolute top-0 left-0 origin-top rounded-xl",
						isDanger
							? "bg-red-alpha-10"
							: isPrimary
								? "bg-primary-alpha-10"
								: "bg-neutral-alpha-10",
						className,
					)}
					initial={{
						width: rect.width,
						height: rect.height,
						left,
						top,
						opacity: 0,
						scale: 0.95,
					}}
					animate={{
						width: rect.width,
						height: rect.height,
						left,
						top,
						opacity: 1,
						scale: 1,
					}}
					exit={{
						opacity: 0,
						scale: 0.95,
						width: rect.width,
						height: rect.height,
						left,
						top,
					}}
					transition={{
						type: "spring",
						stiffness: 500,
						damping: 35,
					}}
				/>
			)}
		</AnimatePresence>
	);
};
