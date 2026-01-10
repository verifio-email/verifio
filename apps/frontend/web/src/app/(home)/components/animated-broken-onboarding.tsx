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
	const [moveSection, setMoveSection] = useState(false);

	const handleHover = () => {
		setShowCheck(false);
		setMoveSection(false);
		setAnimationKey((prev) => prev + 1);
	};

	// Reset showCheck when animationKey changes, then set it after 2 seconds
	useEffect(() => {
		setShowCheck(false);
		setMoveSection(false);
		const timer = setTimeout(() => {
			setShowCheck(true);
		}, 2000);
		return () => clearTimeout(timer);
	}, [animationKey]);

	// After showCheck becomes true, wait 0.5s then move section
	useEffect(() => {
		if (showCheck) {
			const timer = setTimeout(() => {
				setMoveSection(true);
			}, 2500);
			return () => clearTimeout(timer);
		}
	}, [showCheck]);

	return (
		<div
			className="relative flex h-64 cursor-pointer items-center justify-center"
			onMouseEnter={handleHover}
		>
			{/* Timeline and connection elements - appear after section moves left */}

			<div
				className="relative flex w-full max-w-md flex-col items-center"
				key={animationKey}
			>
				{/* API Endpoint Badge - starts centered, moves left after success shows */}
				<motion.div
					className="mb-6"
					initial={{ opacity: 0, y: 10, x: 0 }}
					animate={{ opacity: 1, y: 0, x: moveSection ? -70 : 0 }}
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
						animate={{ x: moveSection ? -70 : 0 }}
						transition={{ duration: 0.6, ease: elegantEase }}
					>
						<motion.div
							className="relative flex h-16 w-16 items-center justify-center"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3, duration: 0.5, ease: smoothEase }}
						>
							<motion.div
								className="absolute inset-0 rounded-full border"
								initial={{ borderColor: "rgba(156, 163, 175, 0.20)" }}
								animate={{
									borderColor: showCheck
										? ["rgba(156, 163, 175, 0.20)", "rgba(34, 197, 94, 0.20)"]
										: "rgba(156, 163, 175, 0.20)",
								}}
								transition={{ delay: 0.5, duration: 0.4, ease: smoothEase }}
							/>
							<motion.div
								className="z-10 flex h-10 w-10 items-center justify-center rounded-full border"
								initial={{
									scale: 0.8,
									opacity: 0,
									borderColor: "rgba(156, 163, 175, 0.5)",
								}}
								animate={{
									scale: 1,
									opacity: 1,
									borderColor: showCheck
										? ["rgba(156, 163, 175, 0.5)", "rgba(34, 197, 94, 0.5)"]
										: "rgba(156, 163, 175, 0.5)",
								}}
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
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 animate-spin text-text-sub-600"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M21 12a9 9 0 1 1-6.219-8.56" />
											</svg>
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
												className="h-4 w-4 text-success-base"
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
							transition={{ duration: 0.4, ease: smoothEase, delay: 1 }}
						>
							Success
						</motion.div>
					</motion.div>

					{/* Email Verification Circle - appears on right after section moves */}
					<motion.div
						className="absolute flex flex-col items-center"
						initial={{ x: 0, opacity: 0 }}
						animate={{ x: moveSection ? 70 : 0, opacity: moveSection ? 1 : 0 }}
						transition={{ delay: 0.6, duration: 0.5, ease: elegantEase }}
					>
						{/* Outer ring */}
						<motion.div
							className="relative flex h-16 w-16 items-center justify-center"
							initial={{ scale: 0.8 }}
							animate={{ scale: moveSection ? 1 : 0.8 }}
							transition={{ delay: 0.7, duration: 0.4, ease: smoothEase }}
						>
							<motion.div
								className="absolute inset-0 rounded-full border"
								initial={{ borderColor: "rgba(156, 163, 175, 0.12)" }}
								animate={{
									borderColor: moveSection
										? ["rgba(156, 163, 175, 0.12)", "rgba(239, 68, 68, 0.16)"]
										: "rgba(156, 163, 175, 0.12)",
								}}
								transition={{ delay: 1.0, duration: 0.5 }}
							/>

							{/* Inner circle with icon */}
							<motion.div
								className="flex h-10 w-10 items-center justify-center rounded-full border"
								initial={{
									borderColor: "rgba(156, 163, 175, 0.5)",
								}}
								animate={{
									borderColor: moveSection
										? ["rgba(156, 163, 175, 0.5)", "rgba(239, 68, 68, 0.5)"]
										: "rgba(156, 163, 175, 0.5)",
								}}
								transition={{ delay: 1.0, duration: 0.5 }}
							>
								<motion.div
									initial={{ opacity: 0, scale: 0 }}
									animate={{
										opacity: moveSection ? 1 : 0,
										scale: moveSection ? 1 : 0,
									}}
									transition={{ delay: 0.9, duration: 0.3, ease: smoothEase }}
								>
									<motion.div
										animate={{
											color: moveSection ? ["#6b7280", "#ef4444"] : "#6b7280",
										}}
										transition={{ delay: 1.0, duration: 0.5 }}
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
							animate={{ opacity: moveSection ? 1 : 0 }}
							transition={{ delay: 1.2, duration: 0.4 }}
						>
							Email Failed
						</motion.div>
					</motion.div>

					{/* Traveling dot along the timeline */}
					{moveSection && (
						<motion.div
							className="absolute top-8 h-1.5 w-1.5 rounded-full bg-green-500 shadow-green-500/50 shadow-sm"
							initial={{ x: -70, opacity: 0 }}
							animate={{
								x: [-70, 0, 0],
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
					<motion.div
						className="absolute top-8 flex items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: moveSection ? 1 : 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						{/* Left dots */}
						<div className="mr-20 flex items-center gap-2">
							{[0, 1, 2].map((i) => (
								<motion.div
									key={`left-${i}`}
									className="h-1 w-1 rounded-full bg-success-base/20 dark:bg-success-base/25"
									initial={{ opacity: 0, scale: 0 }}
									animate={{
										opacity: moveSection ? 1 : 0,
										scale: moveSection ? 1 : 0,
									}}
									transition={{
										delay: 0.3 + i * 0.1,
										duration: 0.3,
										ease: smoothEase,
									}}
								/>
							))}
						</div>

						{/* Center line */}
						<motion.div
							className="h-px w-8 bg-gradient-to-r from-success-base/20 via-success-base/30 to-success-base/20"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: moveSection ? 1 : 0 }}
							transition={{ delay: 0.4, duration: 0.5, ease: elegantEase }}
						/>

						{/* Center connector dot */}
						<motion.div
							className="mx-1 h-1.5 w-1.5 rounded-full border border-stroke-soft-200/30 dark:border-gray-600/50 dark:bg-gray-900"
							initial={{ scale: 0 }}
							animate={{ scale: moveSection ? 1 : 0 }}
							transition={{ delay: 0.6, duration: 0.3, ease: smoothEase }}
						/>

						{/* Right line - dashed to show broken connection */}
						<motion.div
							className="h-px w-7 border-red-400/20 border-t border-dashed"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: moveSection ? 1 : 0 }}
							transition={{ delay: 0.8, duration: 0.5, ease: elegantEase }}
							style={{ transformOrigin: "left" }}
						/>

						{/* Right dots - faded to show failure */}
						<div className="ml-20 flex items-center gap-2">
							{[0, 1, 2].map((i) => (
								<motion.div
									key={`right-${i}`}
									className="h-1 w-1 rounded-full bg-red-400/15"
									initial={{ opacity: 0, scale: 0 }}
									animate={{
										opacity: moveSection ? 1 : 0,
										scale: moveSection ? 1 : 0,
									}}
									transition={{
										delay: 1.0 + i * 0.1,
										duration: 0.3,
										ease: smoothEase,
									}}
								/>
							))}
						</div>
					</motion.div>
				</div>

				{/* Bottom status message */}
				<motion.div
					className="mt-4 flex items-center gap-2"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: moveSection ? 1 : 0, y: moveSection ? 0 : 10 }}
					transition={{ delay: 1.4, duration: 0.5, ease: elegantEase }}
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
