"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useState } from "react";

// Smooth easing curves
const smoothEase = [0.4, 0, 0.2, 1] as const;
const elegantEase = [0.65, 0, 0.35, 1] as const;

export function AnimatedSpamFlag() {
	const [animationKey, setAnimationKey] = useState(0);

	const handleHover = () => {
		setAnimationKey((prev) => prev + 1);
	};

	return (
		<div
			className="relative flex h-44 cursor-pointer items-center justify-center"
			onMouseEnter={handleHover}
		>
			<div className="relative flex items-center gap-6" key={animationKey}>
				{/* Valid Email - left side with smooth fade-slide */}
				<motion.div
					className="relative flex flex-col items-center"
					initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
					animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
					transition={{ duration: 0.6, ease: elegantEase }}
				>
					<motion.div
						className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-400/50 bg-green-50 shadow-green-500/10 shadow-lg dark:bg-green-950/30"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							delay: 0.2,
							duration: 0.5,
							ease: smoothEase,
						}}
					>
						<motion.div
							initial={{ rotate: -45, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							transition={{ delay: 0.4, duration: 0.4, ease: elegantEase }}
						>
							<Icon name="mail-single" className="h-4 w-4 text-green-500" />
						</motion.div>
					</motion.div>
					{/* Valid checkmark - smooth expand with glow */}
					<motion.div
						className="-right-1 -top-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-green-500 shadow-green-500/40 shadow-md"
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.4, ease: smoothEase }}
					>
						<motion.div
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.3, ease: "easeOut" }}
						>
							<Icon name="check" className="h-2.5 w-2.5 text-white" />
						</motion.div>
					</motion.div>
					<motion.span
						className="mt-1.5 font-mono text-[8px] text-green-600"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.9, duration: 0.4, ease: smoothEase }}
					>
						valid
					</motion.span>
				</motion.div>

				{/* Animated Arrow with scanning line effect */}
				<motion.div
					className="flex flex-col items-center gap-1"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.0, duration: 0.4, ease: smoothEase }}
				>
					<motion.div
						className="relative h-px w-6 overflow-hidden bg-gradient-to-r from-green-400/30 via-amber-400/50 to-red-400/30"
						initial={{ scaleX: 0, opacity: 0 }}
						animate={{ scaleX: 1, opacity: 1 }}
						transition={{ delay: 1.1, duration: 0.5, ease: elegantEase }}
						style={{ transformOrigin: "left" }}
					>
						{/* Scanning light effect */}
						<motion.div
							className="absolute inset-y-0 w-2 bg-gradient-to-r from-transparent via-white/80 to-transparent"
							initial={{ x: "-100%" }}
							animate={{ x: "600%" }}
							transition={{
								delay: 1.4,
								duration: 0.8,
								ease: "linear",
								repeat: 2,
								repeatDelay: 0.2,
							}}
						/>
					</motion.div>
					<motion.div
						className="flex h-3 w-3 items-center justify-center"
						initial={{ x: -8, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 1.3, duration: 0.4, ease: smoothEase }}
					>
						<Icon name="arrow-right" className="h-3 w-3 text-text-sub-600/40" />
					</motion.div>
				</motion.div>

				{/* Block/Filter - center with smooth glow rings */}
				<motion.div
					className="relative flex flex-col items-center rounded-xl border border-error-base/20 border-dashed p-3"
					initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
					animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
					transition={{ delay: 1.5, duration: 0.5, ease: elegantEase }}
				>
					{/* Subtle pulse glow effect */}
					<motion.div
						className="-inset-2 absolute rounded-lg"
						style={{
							background:
								"radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)",
						}}
						initial={{ opacity: 0, scale: 1 }}
						animate={{
							opacity: [0, 0.6, 0],
							scale: [1, 1.05, 1],
						}}
						transition={{
							delay: 1.9,
							duration: 1.5,
							ease: smoothEase,
							repeat: Number.POSITIVE_INFINITY,
							repeatDelay: 1.0,
						}}
					/>

					<motion.div
						className="flex h-12 w-12 items-center justify-center rounded-lg border border-red-400/50 bg-red-50 shadow-lg shadow-red-500/20 dark:bg-red-950/30"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							delay: 1.6,
							duration: 0.5,
							ease: smoothEase,
						}}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 1.8, duration: 0.4, ease: smoothEase }}
						>
							<Icon name="shield-cross" className="h-5 w-5 text-red-500" />
						</motion.div>
					</motion.div>
					<motion.span
						className="mt-1.5 rounded bg-red-100 px-1.5 py-0.5 font-mono font-semibold text-[7px] text-red-600 shadow-sm dark:bg-red-950/50"
						initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
						animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
						transition={{ delay: 2.0, duration: 0.4, ease: smoothEase }}
					>
						BLOCKED
					</motion.span>
				</motion.div>

				{/* Bottom reputation indicator - smooth slide up */}
				<motion.div
					className="-bottom-10 -translate-x-1/2 absolute left-1/2 rounded border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 shadow-black/5 shadow-lg dark:bg-gray-900/50"
					initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ delay: 2.3, duration: 0.5, ease: elegantEase }}
				>
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1">
							<motion.div
								initial={{ opacity: 0, x: -5 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 2.5, duration: 0.4, ease: smoothEase }}
							>
								<motion.div
									initial={{ color: "#22c55e", rotate: 0 }}
									animate={{ color: "#ef4444", rotate: 0 }}
									transition={{ delay: 2.9, duration: 0.8, ease: elegantEase }}
								>
									<Icon
										name="trending-down"
										className="h-3 w-3"
										style={{ color: "inherit" }}
									/>
								</motion.div>
							</motion.div>
							<motion.span
								className="font-mono text-[8px] text-text-sub-600"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 2.6, duration: 0.4, ease: smoothEase }}
							>
								sender_reputation
							</motion.span>
						</div>
						<div className="h-1.5 w-12 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
							<motion.div
								className="h-full rounded-full"
								initial={{ width: "100%", backgroundColor: "#22c55e" }}
								animate={{ width: "25%", backgroundColor: "#ef4444" }}
								transition={{
									delay: 2.7,
									duration: 1.2,
									ease: elegantEase,
								}}
							/>
						</div>
						<div
							className="relative h-3 w-8 overflow-hidden text-center"
							style={{ perspective: "50px" }}
						>
							<motion.span
								className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-[8px] text-green-500"
								initial={{ y: 0, opacity: 1, filter: "blur(0px)" }}
								animate={{ y: -12, opacity: 0, filter: "blur(2px)" }}
								transition={{ delay: 3.2, duration: 0.35, ease: smoothEase }}
							>
								HIGH
							</motion.span>
							<motion.span
								className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-[8px] text-red-500"
								initial={{ y: 12, opacity: 0, filter: "blur(2px)" }}
								animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
								transition={{ delay: 3.4, duration: 0.35, ease: smoothEase }}
							>
								LOW
							</motion.span>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default AnimatedSpamFlag;
