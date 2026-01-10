"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useState } from "react";

// Smooth easing curves
const smoothEase = [0.4, 0, 0.2, 1] as const;
const elegantEase = [0.65, 0, 0.35, 1] as const;

export function AnimatedBrokenOnboarding() {
	const [animationKey, setAnimationKey] = useState(0);

	const handleHover = () => {
		setAnimationKey((prev) => prev + 1);
	};

	return (
		<div
			className="relative flex h-44 cursor-pointer items-center justify-center"
			onMouseEnter={handleHover}
		>
			<div className="relative" key={animationKey}>
				{/* User flow with break */}
				<div className="flex items-center gap-2">
					{/* Step 1: Signup - Success */}
					<motion.div
						className="flex flex-col items-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: elegantEase }}
					>
						<motion.div
							className="relative flex h-10 w-10 items-center justify-center rounded-full border border-green-400/50 bg-green-50 dark:bg-green-950/30"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.1, duration: 0.4, ease: smoothEase }}
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3, duration: 0.3, ease: smoothEase }}
							>
								<Icon name="user" className="h-4 w-4 text-green-500" />
							</motion.div>

							{/* Success checkmark */}
							<motion.div
								className="-right-0.5 -top-0.5 absolute flex h-4 w-4 items-center justify-center rounded-full bg-green-500"
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 0.5, duration: 0.3, ease: smoothEase }}
							>
								<Icon name="check" className="h-2.5 w-2.5 text-white" />
							</motion.div>
						</motion.div>
						<motion.span
							className="mt-1.5 font-mono text-[9px] text-green-500"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4, duration: 0.3 }}
						>
							signup
						</motion.span>
					</motion.div>

					{/* Arrow 1 - Animated flow */}
					<motion.div
						className="flex items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.3 }}
					>
						<motion.div
							className="h-px w-6 bg-gradient-to-r from-green-400/60 to-green-400/30"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ delay: 0.7, duration: 0.4, ease: elegantEase }}
							style={{ transformOrigin: "left" }}
						/>
						<motion.div
							initial={{ x: -5, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ delay: 0.9, duration: 0.3, ease: smoothEase }}
						>
							<Icon
								name="chevron-right"
								className="h-3 w-3 text-green-400/60"
							/>
						</motion.div>
					</motion.div>

					{/* Step 2: Email verify - BROKEN */}
					<motion.div
						className="flex flex-col items-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.0, duration: 0.5, ease: elegantEase }}
					>
						<motion.div
							className="relative flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/50 bg-amber-50 dark:bg-amber-950/30"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{
								scale: 1,
								opacity: 1,
								borderColor: [
									"rgba(251, 191, 36, 0.5)",
									"rgba(239, 68, 68, 0.5)",
								],
								backgroundColor: [
									"rgba(254, 243, 199, 1)",
									"rgba(254, 226, 226, 1)",
								],
							}}
							transition={{
								scale: { delay: 1.1, duration: 0.4, ease: smoothEase },
								opacity: { delay: 1.1, duration: 0.4 },
								borderColor: { delay: 1.6, duration: 0.5, ease: smoothEase },
								backgroundColor: {
									delay: 1.6,
									duration: 0.5,
									ease: smoothEase,
								},
							}}
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{
									opacity: 1,
									scale: 1,
									color: ["#f59e0b", "#ef4444"],
								}}
								transition={{
									opacity: { delay: 1.3, duration: 0.3 },
									scale: { delay: 1.3, duration: 0.3, ease: smoothEase },
									color: { delay: 1.6, duration: 0.5 },
								}}
								className="text-amber-500"
							>
								<Icon name="mail" className="h-4 w-4" />
							</motion.div>

							{/* Loading then X animation */}
							<motion.div
								className="-right-0.5 -top-0.5 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500"
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 1.8, duration: 0.3, ease: smoothEase }}
							>
								<motion.div
									initial={{ rotate: 0, opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 1.9, duration: 0.2 }}
								>
									<Icon name="x" className="h-2.5 w-2.5 text-white" />
								</motion.div>
							</motion.div>
						</motion.div>
						<motion.span
							className="mt-1.5 font-mono text-[9px]"
							initial={{ opacity: 0, color: "#f59e0b" }}
							animate={{ opacity: 1, color: ["#f59e0b", "#ef4444"] }}
							transition={{
								opacity: { delay: 1.2, duration: 0.3 },
								color: { delay: 1.6, duration: 0.5 },
							}}
						>
							verify
						</motion.span>
					</motion.div>

					{/* Broken arrow - dashed and fading */}
					<motion.div
						className="flex items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.4 }}
						transition={{ delay: 2.0, duration: 0.4 }}
					>
						<motion.div
							className="h-px w-6 border-text-sub-600/30 border-t border-dashed"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ delay: 2.1, duration: 0.4, ease: elegantEase }}
							style={{ transformOrigin: "left" }}
						/>
						<motion.div
							initial={{ x: -5, opacity: 0 }}
							animate={{ x: 0, opacity: 0.4 }}
							transition={{ delay: 2.3, duration: 0.3, ease: smoothEase }}
						>
							<Icon
								name="chevron-right"
								className="h-3 w-3 text-text-sub-600/30"
							/>
						</motion.div>
					</motion.div>

					{/* Step 3: Activate - Never reached */}
					<motion.div
						className="flex flex-col items-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 0.4, y: 0 }}
						transition={{ delay: 2.2, duration: 0.5, ease: elegantEase }}
					>
						<motion.div
							className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke-soft-200/30 bg-bg-white-0 dark:bg-gray-800/50"
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{ delay: 2.3, duration: 0.4, ease: smoothEase }}
						>
							<Icon name="check" className="h-4 w-4 text-text-sub-600/50" />
						</motion.div>
						<motion.span
							className="mt-1.5 font-mono text-[9px] text-text-sub-600/50"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 2.4, duration: 0.3 }}
						>
							activate
						</motion.span>
					</motion.div>
				</div>

				{/* Drop-off stat - animated count up */}
				<motion.div
					className="-bottom-9 -translate-x-1/2 absolute left-1/2 rounded border border-stroke-soft-200/30 bg-bg-white-0 px-3 py-1.5 dark:bg-gray-900/50"
					initial={{ opacity: 0, y: 10, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ delay: 2.6, duration: 0.5, ease: elegantEase }}
				>
					<div className="flex items-center gap-1.5">
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 2.8, duration: 0.3, ease: smoothEase }}
						>
							<Icon name="trending-down" className="h-3 w-3 text-red-500" />
						</motion.div>
						<span className="font-mono text-[9px]">
							<motion.span
								className="font-semibold text-red-500"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 2.9, duration: 0.3 }}
							>
								40%
							</motion.span>
							<motion.span
								className="text-text-sub-600/60"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 3.0, duration: 0.3 }}
							>
								{" "}
								user drop-off
							</motion.span>
						</span>
					</div>
				</motion.div>

				{/* Floating users being lost - subtle animation */}
				<motion.div
					className="-right-4 absolute top-0"
					initial={{ opacity: 0, x: -10, y: 5 }}
					animate={{ opacity: 1, x: 0, y: 0 }}
					transition={{ delay: 2.5, duration: 0.5, ease: elegantEase }}
				>
					<motion.div
						className="flex items-center gap-1 rounded-md border border-red-200/50 bg-red-50/80 px-1.5 py-1 dark:border-red-400/20 dark:bg-red-950/50"
						animate={{
							y: [0, -3, 0],
						}}
						transition={{
							delay: 3.0,
							duration: 2,
							ease: smoothEase,
							repeat: Number.POSITIVE_INFINITY,
							repeatDelay: 0.5,
						}}
					>
						<Icon name="user-x" className="h-3 w-3 text-red-400" />
						<span className="font-mono text-[7px] text-red-500">lost</span>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

export default AnimatedBrokenOnboarding;
