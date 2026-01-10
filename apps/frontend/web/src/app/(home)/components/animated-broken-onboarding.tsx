"use client";

import { Icon } from "@verifio/ui/icon";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Smooth easing curves
const smoothEase = [0.4, 0, 0.2, 1] as const;
const elegantEase = [0.65, 0, 0.35, 1] as const;

export function AnimatedBrokenOnboarding() {
	const [animationKey, setAnimationKey] = useState(0);
	const [showCheck, setShowCheck] = useState(false);

	const handleHover = () => {
		setShowCheck(false);
		setAnimationKey((prev) => prev + 1);
	};

	// Reset showCheck when animationKey changes, then set it after 2 seconds
	useEffect(() => {
		setShowCheck(false);
		const timer = setTimeout(() => {
			setShowCheck(true);
		}, 2000);
		return () => clearTimeout(timer);
	}, [animationKey]);

	return (
		<div
			className="relative flex h-64 cursor-pointer items-center justify-center"
			onMouseEnter={handleHover}
		>
			<div
				className="relative flex w-full max-w-md flex-col items-center"
				key={animationKey}
			>
				{/* API Endpoint Badge - starts centered, moves left after user check appears */}
				<motion.div
					className="mb-6"
					initial={{ opacity: 0, y: 10, x: 0 }}
					animate={{ opacity: 1, y: 0, x: showCheck ? -70 : 0 }}
					transition={{
						opacity: { duration: 0.5, ease: elegantEase },
						y: { duration: 0.5, ease: elegantEase },
						x: { duration: 0.6, ease: elegantEase },
					}}
				>
					<div className="rounded-full border border-stroke-soft-100 px-3 py-1 font-medium text-[10px] text-text-sub-600">
						New user signup
					</div>
				</motion.div>
				<div className="relative flex h-24 w-full items-center justify-center">
					<motion.div
						className="absolute flex flex-col items-center"
						initial={{ x: 0 }}
						animate={{ x: showCheck ? -70 : 0 }}
						transition={{ duration: 0.6, ease: elegantEase }}
					>
						<motion.div
							className="relative flex h-16 w-16 items-center justify-center"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3, duration: 0.5, ease: smoothEase }}
						>
							<div className="absolute inset-0 rounded-full border border-stroke-soft-200/30 dark:border-gray-700/50" />
							<motion.div
								className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke-soft-200/50 bg-bg-white-0 dark:border-gray-600/50 dark:bg-gray-800"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 0.5, duration: 0.4, ease: smoothEase }}
							>
								<AnimatePresence mode="wait">
									{!showCheck ? (
										<motion.div
											key="spinner"
											initial={{ opacity: 0, scale: 0 }}
											animate={{ opacity: 1, scale: 1, rotate: 360 }}
											exit={{ opacity: 0, scale: 0 }}
											transition={{
												opacity: {
													delay: 0.7,
													duration: 0.3,
													ease: smoothEase,
												},
												scale: { delay: 0.7, duration: 0.3, ease: smoothEase },
											}}
										>
											<Icon
												name="refresh-cw"
												className="h-4 w-4 animate-spin text-text-sub-600 dark:text-gray-400"
											/>
										</motion.div>
									) : (
										<motion.div
											key="check"
											initial={{ opacity: 0, scale: 0 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ duration: 0.3, ease: smoothEase }}
										>
											<Icon
												name="user-check"
												className="h-4 w-4 text-success-base dark:text-green-400"
											/>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						</motion.div>
						{/* Success message - only shows after check appears */}
						<motion.div
							className="mt-2 rounded-full border border-success-base/40 bg-success-base/10 px-2 py-0.5 font-medium text-[10px] text-success-base"
							initial={{ opacity: 0, y: -5 }}
							animate={{ opacity: showCheck ? 1 : 0, y: showCheck ? 0 : -5 }}
							transition={{ duration: 0.4, ease: smoothEase }}
						>
							Success
						</motion.div>
					</motion.div>

					{/* Timeline and connection elements - appear after section moves left */}
					<motion.div
						className="absolute top-8 flex items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: showCheck ? 1 : 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
					>
						{/* Left dots */}
						<div className="mr-2 flex items-center gap-2">
							{[0, 1, 2].map((i) => (
								<motion.div
									key={`left-${i}`}
									className="h-1 w-1 rounded-full bg-stroke-soft-200/40 dark:bg-gray-600/50"
									initial={{ opacity: 0, scale: 0 }}
									animate={{
										opacity: showCheck ? 1 : 0,
										scale: showCheck ? 1 : 0,
									}}
									transition={{
										delay: 0.5 + i * 0.1,
										duration: 0.3,
										ease: smoothEase,
									}}
								/>
							))}
						</div>

						{/* Center line */}
						<motion.div
							className="h-px w-20 bg-gradient-to-r from-stroke-soft-200/40 via-stroke-soft-200/60 to-stroke-soft-200/40 dark:from-gray-600/40 dark:via-gray-600/60 dark:to-gray-600/40"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: showCheck ? 1 : 0 }}
							transition={{ delay: 0.6, duration: 0.5, ease: elegantEase }}
						/>

						{/* Center connector dot */}
						<motion.div
							className="mx-1 h-1.5 w-1.5 rounded-full border border-stroke-soft-200/60 bg-bg-white-0 dark:border-gray-600 dark:bg-gray-900"
							initial={{ scale: 0 }}
							animate={{ scale: showCheck ? 1 : 0 }}
							transition={{ delay: 0.8, duration: 0.3, ease: smoothEase }}
						/>

						{/* Right line - dashed to show broken connection */}
						<motion.div
							className="h-px w-20 border-red-400/40 border-t border-dashed"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: showCheck ? 1 : 0 }}
							transition={{ delay: 1.0, duration: 0.5, ease: elegantEase }}
							style={{ transformOrigin: "left" }}
						/>

						{/* Right dots - faded to show failure */}
						<div className="ml-2 flex items-center gap-2">
							{[0, 1, 2].map((i) => (
								<motion.div
									key={`right-${i}`}
									className="h-1 w-1 rounded-full bg-red-400/30"
									initial={{ opacity: 0, scale: 0 }}
									animate={{
										opacity: showCheck ? 1 : 0,
										scale: showCheck ? 1 : 0,
									}}
									transition={{
										delay: 1.2 + i * 0.1,
										duration: 0.3,
										ease: smoothEase,
									}}
								/>
							))}
						</div>
					</motion.div>

					{/* Email Verification Circle - appears on right after section moves */}
					<motion.div
						className="absolute flex flex-col items-center"
						initial={{ x: 0, opacity: 0 }}
						animate={{ x: showCheck ? 70 : 0, opacity: showCheck ? 1 : 0 }}
						transition={{ delay: 0.8, duration: 0.5, ease: elegantEase }}
					>
						{/* Outer ring */}
						<motion.div
							className="relative flex h-16 w-16 items-center justify-center"
							initial={{ scale: 0.8 }}
							animate={{ scale: showCheck ? 1 : 0.8 }}
							transition={{ delay: 0.9, duration: 0.4, ease: smoothEase }}
						>
							<motion.div
								className="absolute inset-0 rounded-full border"
								initial={{ borderColor: "rgba(156, 163, 175, 0.3)" }}
								animate={{
									borderColor: showCheck
										? ["rgba(156, 163, 175, 0.3)", "rgba(239, 68, 68, 0.4)"]
										: "rgba(156, 163, 175, 0.3)",
								}}
								transition={{ delay: 1.2, duration: 0.5 }}
							/>

							{/* Inner circle with icon */}
							<motion.div
								className="flex h-10 w-10 items-center justify-center rounded-full border bg-bg-white-0 dark:bg-gray-800"
								initial={{
									borderColor: "rgba(156, 163, 175, 0.5)",
								}}
								animate={{
									borderColor: showCheck
										? ["rgba(156, 163, 175, 0.5)", "rgba(239, 68, 68, 0.5)"]
										: "rgba(156, 163, 175, 0.5)",
								}}
								transition={{ delay: 1.2, duration: 0.5 }}
							>
								<motion.div
									initial={{ opacity: 0, scale: 0 }}
									animate={{
										opacity: showCheck ? 1 : 0,
										scale: showCheck ? 1 : 0,
									}}
									transition={{ delay: 1.1, duration: 0.3, ease: smoothEase }}
								>
									<motion.div
										animate={{
											color: showCheck ? ["#6b7280", "#ef4444"] : "#6b7280",
										}}
										transition={{ delay: 1.2, duration: 0.5 }}
										className="text-gray-500"
									>
										<Icon name="mail-single" className="h-4 w-4" />
									</motion.div>
								</motion.div>
							</motion.div>
						</motion.div>
						<motion.div
							className="mt-2 rounded-full border border-error-base/40 bg-error-base/10 px-2 py-0.5 font-medium text-[10px] text-error-base"
							initial={{ opacity: 0 }}
							animate={{ opacity: showCheck ? 1 : 0 }}
							transition={{ delay: 1.4, duration: 0.4 }}
						>
							Email Failed
						</motion.div>
					</motion.div>

					{/* Traveling dot along the timeline */}
					{showCheck && (
						<motion.div
							className="absolute top-8 h-1.5 w-1.5 rounded-full bg-green-500 shadow-green-500/50 shadow-sm"
							initial={{ x: -60, opacity: 0 }}
							animate={{
								x: [-60, 0, 0],
								opacity: [0, 1, 0],
								backgroundColor: ["#22c55e", "#22c55e", "#ef4444"],
							}}
							transition={{
								delay: 1.6,
								duration: 1.0,
								ease: smoothEase,
								times: [0, 0.6, 1],
								repeat: Number.POSITIVE_INFINITY,
								repeatDelay: 2,
							}}
						/>
					)}
				</div>

				{/* Bottom status message */}
				<motion.div
					className="mt-4 flex items-center gap-2"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: showCheck ? 1 : 0, y: showCheck ? 0 : 10 }}
					transition={{ delay: 1.6, duration: 0.5, ease: elegantEase }}
				>
					<div className="flex items-center gap-1.5 rounded border border-red-500/30 bg-red-500/5 px-2.5 py-1">
						<motion.div
							animate={{ opacity: [1, 0.5, 1] }}
							transition={{
								delay: 2,
								duration: 1.5,
								repeat: Number.POSITIVE_INFINITY,
							}}
						>
							<Icon name="alert-circle" className="h-3 w-3 text-red-500" />
						</motion.div>
						<span className="font-mono text-[10px] text-red-500/90">
							verification email not sent — low score detected
						</span>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default AnimatedBrokenOnboarding;
