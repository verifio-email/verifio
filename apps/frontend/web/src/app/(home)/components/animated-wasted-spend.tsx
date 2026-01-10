"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useState } from "react";

// Smooth easing curves
const smoothEase = [0.4, 0, 0.2, 1] as const;
const elegantEase = [0.65, 0, 0.35, 1] as const;

export function AnimatedWastedSpend() {
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
				{/* Main spending visualization */}
				<div className="flex items-center gap-6">
					{/* Budget allocation visual */}
					<motion.div
						className="flex flex-col items-center gap-2"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, ease: elegantEase }}
					>
						{/* Total budget indicator */}
						<motion.div
							className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-primary-base/40 bg-gradient-to-br from-bg-white-0 to-bg-weak-50/50 dark:from-gray-900/50 dark:to-gray-800/50"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.1, duration: 0.4, ease: smoothEase }}
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3, duration: 0.4, ease: smoothEase }}
							>
								<Icon name="wallet" className="h-6 w-6 text-primary-base" />
							</motion.div>

							{/* Animated money amount */}
							<motion.div
								className="-bottom-2 absolute rounded-md border border-primary-base/30 bg-bg-white-0 px-1.5 py-0.5 font-mono font-semibold text-[9px] text-primary-base"
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.4, ease: smoothEase }}
							>
								$10,000
							</motion.div>
						</motion.div>
					</motion.div>

					{/* Flow arrow with splitting effect */}
					<motion.div
						className="flex flex-col items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.4 }}
					>
						<motion.div
							className="h-px w-8 bg-gradient-to-r from-text-sub-600/30 to-text-sub-600/10"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ delay: 0.7, duration: 0.4, ease: elegantEase }}
							style={{ transformOrigin: "left" }}
						/>
						<motion.div
							className="mt-1 flex h-4 w-4 items-center justify-center"
							initial={{ x: -10, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ delay: 0.9, duration: 0.3, ease: smoothEase }}
						>
							<Icon
								name="arrow-right"
								className="h-3 w-3 text-text-sub-600/40"
							/>
						</motion.div>
					</motion.div>

					{/* Right side - Stacked bar visualization */}
					<motion.div
						className="flex items-center gap-4"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 1.0, duration: 0.5, ease: elegantEase }}
					>
						{/* Vertical stacked bar */}
						<motion.div
							className="relative flex h-24 w-10 flex-col overflow-hidden rounded-lg border border-stroke-soft-200/60"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 1.1, duration: 0.4, ease: smoothEase }}
						>
							{/* Valid portion (80%) - Green */}
							<motion.div
								className="relative flex items-center justify-center bg-gradient-to-b from-green-400 to-green-500"
								initial={{ height: 0 }}
								animate={{ height: "80%" }}
								transition={{ delay: 1.3, duration: 0.8, ease: elegantEase }}
							>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 1.8, duration: 0.3 }}
								>
									<Icon name="check" className="h-3.5 w-3.5 text-white" />
								</motion.div>
							</motion.div>

							{/* Wasted portion (20%) - Red with animation */}
							<motion.div
								className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-red-400 to-red-500"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 2.1, duration: 0.4 }}
							>
								{/* Drain animation effect */}
								<motion.div
									className="absolute inset-0 bg-gradient-to-b from-red-500/0 via-red-600/30 to-red-600/60"
									animate={{
										opacity: [0.3, 0.7, 0.3],
									}}
									transition={{
										delay: 2.5,
										duration: 1.5,
										repeat: Number.POSITIVE_INFINITY,
										ease: "easeInOut",
									}}
								/>
								<motion.div
									initial={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 2.3, duration: 0.3, type: "spring" }}
								>
									<Icon name="x-close" className="h-3 w-3 text-white" />
								</motion.div>
							</motion.div>
						</motion.div>

						{/* Labels column */}
						<div className="flex flex-col gap-3">
							{/* Valid label */}
							<motion.div
								className="flex flex-col"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 1.5, duration: 0.4, ease: smoothEase }}
							>
								<div className="flex items-center gap-1.5">
									<div className="h-2 w-2 rounded-sm bg-green-500" />
									<span className="font-medium text-[10px] text-text-strong-950">
										$8,000
									</span>
								</div>
								<span className="mt-0.5 font-mono text-[8px] text-green-600">
									converting leads
								</span>
							</motion.div>

							{/* Divider */}
							<motion.div
								className="h-px w-16 bg-stroke-soft-200/40"
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{ delay: 1.8, duration: 0.4, ease: elegantEase }}
								style={{ transformOrigin: "left" }}
							/>

							{/* Wasted label */}
							<motion.div
								className="flex flex-col"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 2.0, duration: 0.4, ease: smoothEase }}
							>
								<div className="flex items-center gap-1.5">
									<motion.div
										className="h-2 w-2 rounded-sm bg-red-500"
										animate={{ opacity: [1, 0.5, 1] }}
										transition={{
											delay: 2.6,
											duration: 1.2,
											repeat: Number.POSITIVE_INFINITY,
										}}
									/>
									<span className="font-medium text-[10px] text-text-strong-950 line-through decoration-red-400/60">
										$2,000
									</span>
								</div>
								<div className="mt-0.5 flex items-center gap-1">
									<motion.div
										animate={{ y: [0, 2, 0] }}
										transition={{
											delay: 2.8,
											duration: 1,
											repeat: Number.POSITIVE_INFINITY,
										}}
									>
										<Icon
											name="trending-down"
											className="h-2.5 w-2.5 text-red-500"
										/>
									</motion.div>
									<span className="font-mono text-[8px] text-red-500">
										wasted spend
									</span>
								</div>
							</motion.div>
						</div>

						{/* Percentage badge */}
						<motion.div
							className="flex flex-col items-center"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 2.4, duration: 0.4, ease: smoothEase }}
						>
							{/* Subtle pulse glow */}
							<motion.div
								className="absolute rounded-full"
								style={{
									width: "50px",
									height: "50px",
									background:
										"radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)",
								}}
								animate={{
									opacity: [0, 0.8, 0],
									scale: [0.8, 1.4, 0.8],
								}}
								transition={{
									delay: 2.8,
									duration: 2,
									ease: smoothEase,
									repeat: Number.POSITIVE_INFINITY,
									repeatDelay: 0.5,
								}}
							/>

							<motion.div
								className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-red-400/50 bg-red-50 font-bold font-mono text-red-600 text-sm dark:bg-red-950/40"
								initial={{ rotate: -15 }}
								animate={{ rotate: 0 }}
								transition={{ delay: 2.5, duration: 0.4, type: "spring" }}
							>
								20%
							</motion.div>
							<motion.span
								className="mt-1.5 rounded bg-red-100 px-1.5 py-0.5 font-mono font-semibold text-[7px] text-red-600 uppercase dark:bg-red-950/50"
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 2.7, duration: 0.3, ease: smoothEase }}
							>
								Lost
							</motion.span>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default AnimatedWastedSpend;
