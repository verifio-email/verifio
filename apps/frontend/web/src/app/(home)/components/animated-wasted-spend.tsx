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

					{/* Split visualization - Valid vs Invalid */}
					<div className="flex flex-col gap-3">
						{/* Valid emails - gets the money */}
						<motion.div
							className="flex items-center gap-2"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 1.0, duration: 0.5, ease: elegantEase }}
						>
							<motion.div
								className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-400/50 bg-green-50 dark:bg-green-950/30"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 1.1, duration: 0.4, ease: smoothEase }}
							>
								<motion.div
									initial={{ opacity: 0, rotate: -20 }}
									animate={{ opacity: 1, rotate: 0 }}
									transition={{ delay: 1.3, duration: 0.3, ease: smoothEase }}
								>
									<Icon name="mail-single" className="h-4 w-4 text-green-500" />
								</motion.div>
							</motion.div>

							{/* Money going to valid */}
							<motion.div
								className="flex flex-col"
								initial={{ opacity: 0, x: -8 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 1.4, duration: 0.4, ease: smoothEase }}
							>
								<div className="flex items-center gap-1.5">
									<span className="font-mono text-[8px] text-text-sub-600/60">
										valid
									</span>
									<motion.span
										className="font-mono font-semibold text-[10px] text-green-500"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 1.6, duration: 0.3 }}
									>
										$8,000
									</motion.span>
								</div>
								{/* Progress bar for valid */}
								<div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-gray-200/50 dark:bg-gray-700/50">
									<motion.div
										className="h-full rounded-full bg-green-400"
										initial={{ width: 0 }}
										animate={{ width: "80%" }}
										transition={{
											delay: 1.5,
											duration: 0.6,
											ease: elegantEase,
										}}
									/>
								</div>
							</motion.div>
						</motion.div>

						{/* Invalid emails - wasted money */}
						<motion.div
							className="flex items-center gap-2"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 1.3, duration: 0.5, ease: elegantEase }}
						>
							<motion.div
								className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-red-400/50 bg-red-50 dark:bg-red-950/30"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 1.4, duration: 0.4, ease: smoothEase }}
							>
								<motion.div
									initial={{ opacity: 0, rotate: 20 }}
									animate={{ opacity: 1, rotate: 0 }}
									transition={{ delay: 1.6, duration: 0.3, ease: smoothEase }}
								>
									<Icon name="mail-single" className="h-4 w-4 text-red-500" />
								</motion.div>

								{/* Animated drain effect */}
								<motion.div
									className="-bottom-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500"
									initial={{ scale: 0, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										delay: 1.8,
										duration: 0.3,
										ease: smoothEase,
									}}
								>
									<Icon
										name="trending-down"
										className="h-2.5 w-2.5 text-white"
									/>
								</motion.div>
							</motion.div>

							{/* Money wasted */}
							<motion.div
								className="flex flex-col"
								initial={{ opacity: 0, x: -8 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 1.7, duration: 0.4, ease: smoothEase }}
							>
								<div className="flex items-center gap-1.5">
									<span className="font-mono text-[8px] text-text-sub-600/60">
										invalid
									</span>
									<motion.span
										className="font-mono font-semibold text-[10px] text-red-500 line-through decoration-red-400/60"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 1.9, duration: 0.3 }}
									>
										$2,000
									</motion.span>
								</div>
								{/* Progress bar for invalid - with drain effect */}
								<div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-gray-200/50 dark:bg-gray-700/50">
									<motion.div
										className="h-full rounded-full bg-red-400"
										initial={{ width: 0 }}
										animate={{ width: "20%" }}
										transition={{
											delay: 1.8,
											duration: 0.6,
											ease: elegantEase,
										}}
									/>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</div>

				{/* Wasted percentage indicator - pulsing badge */}
				<motion.div
					className="-right-8 -top-4 absolute flex flex-col items-center"
					initial={{ opacity: 0, scale: 0.8, y: 10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ delay: 2.2, duration: 0.5, ease: elegantEase }}
				>
					{/* Subtle pulse glow */}
					<motion.div
						className="-m-2 absolute inset-0 rounded-full"
						style={{
							background:
								"radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)",
						}}
						initial={{ opacity: 0, scale: 1 }}
						animate={{
							opacity: [0, 0.6, 0],
							scale: [1, 1.3, 1],
						}}
						transition={{
							delay: 2.5,
							duration: 1.8,
							ease: smoothEase,
							repeat: Number.POSITIVE_INFINITY,
							repeatDelay: 0.8,
						}}
					/>

					<motion.div
						className="flex h-9 w-9 items-center justify-center rounded-full border border-red-400/50 bg-red-100 font-bold font-mono text-[11px] text-red-600 dark:bg-red-950/60"
						initial={{ rotate: -10 }}
						animate={{ rotate: 0 }}
						transition={{ delay: 2.3, duration: 0.4, ease: smoothEase }}
					>
						20%
					</motion.div>

					<motion.span
						className="mt-1 font-medium font-mono text-[7px] text-red-500/80"
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 2.6, duration: 0.3, ease: smoothEase }}
					>
						WASTED
					</motion.span>
				</motion.div>

				{/* Bottom insight label */}
				<motion.div
					className="-bottom-7 -translate-x-1/2 absolute left-1/2 rounded border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 dark:bg-gray-900/50"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 2.8, duration: 0.5, ease: elegantEase }}
				>
					<div className="flex items-center gap-1.5">
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 3.0, duration: 0.3, ease: smoothEase }}
						>
							<Icon name="alert-circle" className="h-3 w-3 text-amber-500" />
						</motion.div>
						<motion.span
							className="font-mono text-[8px] text-text-sub-600"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 3.1, duration: 0.3 }}
						>
							sending to{" "}
							<span className="font-semibold text-red-500">dead leads</span>
						</motion.span>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default AnimatedWastedSpend;
