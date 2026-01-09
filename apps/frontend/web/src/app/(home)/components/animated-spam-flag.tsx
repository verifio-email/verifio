"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useState } from "react";

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
				{/* Valid Email - left side */}
				<motion.div
					className="relative flex flex-col items-center"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
				>
					<motion.div
						className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-400/50 bg-green-50 dark:bg-green-950/30"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							delay: 0.2,
							duration: 0.3,
							type: "spring",
							stiffness: 300,
						}}
					>
						<Icon name="mail-single" className="h-4 w-4 text-green-500" />
					</motion.div>
					{/* Valid checkmark */}
					<motion.div
						className="-right-1 -top-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-green-500"
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.25, type: "spring" }}
					>
						<Icon name="check" className="h-2.5 w-2.5 text-white" />
					</motion.div>
					<motion.span
						className="mt-1.5 font-mono text-[8px] text-green-600"
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.3 }}
					>
						valid
					</motion.span>
				</motion.div>

				{/* Animated Arrow with gradient line */}
				<motion.div
					className="flex flex-col items-center gap-1"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7, duration: 0.3 }}
				>
					<motion.div
						className="h-px w-6 bg-gradient-to-r from-green-400/40 via-amber-400/60 to-red-400/40"
						initial={{ scaleX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
						style={{ transformOrigin: "left" }}
					/>
					<motion.div
						className="flex h-3 w-3 items-center justify-center"
						initial={{ x: -10, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 1.0, duration: 0.3 }}
					>
						<Icon name="arrow-right" className="h-3 w-3 text-text-sub-600/40" />
					</motion.div>
				</motion.div>

				{/* Block/Filter - center with pulsing rings */}
				<motion.div
					className="relative flex flex-col items-center"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 1.2, duration: 0.4, type: "spring" }}
				>
					{/* Warning pulse rings - animated */}
					<motion.div
						className="-inset-3 absolute rounded-lg border border-red-400/20"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{
							opacity: [0, 0.6, 0],
							scale: [0.9, 1.1, 1.2],
						}}
						transition={{
							delay: 1.6,
							duration: 1.5,
							repeat: Number.POSITIVE_INFINITY,
							repeatDelay: 0.5,
						}}
					/>
					<motion.div
						className="-inset-5 absolute rounded-lg border border-red-400/10 border-dashed"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{
							opacity: [0, 0.4, 0],
							scale: [0.85, 1.15, 1.3],
						}}
						transition={{
							delay: 1.8,
							duration: 1.8,
							repeat: Number.POSITIVE_INFINITY,
							repeatDelay: 0.3,
						}}
					/>

					<motion.div
						className="flex h-12 w-12 items-center justify-center rounded-lg border border-red-400/50 bg-red-50 dark:bg-red-950/30"
						initial={{ scale: 0, rotate: -10 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{
							delay: 1.3,
							duration: 0.4,
							type: "spring",
							stiffness: 200,
						}}
					>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.5, duration: 0.3 }}
						>
							<Icon name="shield-cross" className="h-5 w-5 text-red-500" />
						</motion.div>
					</motion.div>
					<motion.span
						className="mt-1.5 rounded bg-red-100 px-1.5 py-0.5 font-mono font-semibold text-[7px] text-red-600 dark:bg-red-950/50"
						initial={{ opacity: 0, y: -5, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ delay: 1.7, duration: 0.3, type: "spring" }}
					>
						BLOCKED
					</motion.span>
				</motion.div>

				{/* Bottom reputation indicator - animated */}
				<motion.div
					className="-bottom-10 -translate-x-1/2 absolute left-1/2 rounded border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 dark:bg-gray-900/50"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 2.0, duration: 0.4, ease: "easeOut" }}
				>
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 2.2, duration: 0.3 }}
							>
								<motion.div
									initial={{ color: "#22c55e" }}
									animate={{ color: "#ef4444" }}
									transition={{ delay: 2.6, duration: 0.6 }}
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
								transition={{ delay: 2.3, duration: 0.3 }}
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
									delay: 2.4,
									duration: 0.8,
									ease: [0.4, 0, 0.2, 1],
								}}
							/>
						</div>
						<div
							className="relative h-3 w-8 overflow-hidden text-center"
							style={{ perspective: "50px" }}
						>
							<motion.span
								className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-[8px] text-green-500"
								initial={{ rotateX: 0, opacity: 1 }}
								animate={{ rotateX: 90, opacity: 0 }}
								transition={{ delay: 2.8, duration: 0.25, ease: "easeIn" }}
								style={{
									transformOrigin: "center center",
									backfaceVisibility: "hidden",
								}}
							>
								HIGH
							</motion.span>
							<motion.span
								className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-[8px] text-red-500"
								initial={{ rotateX: -90, opacity: 0 }}
								animate={{ rotateX: 0, opacity: 1 }}
								transition={{ delay: 3.0, duration: 0.25, ease: "easeOut" }}
								style={{
									transformOrigin: "center center",
									backfaceVisibility: "hidden",
								}}
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
