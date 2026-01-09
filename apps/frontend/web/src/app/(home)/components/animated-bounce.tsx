"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useState } from "react";

export function AnimatedBounce() {
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
				<svg
					width="120"
					height="100"
					viewBox="0 0 120 100"
					fill="none"
					className="text-error-base"
				>
					{/* Ground line */}
					<motion.path
						d="M20 80H100"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						className="opacity-80"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
					/>

					{/* First bounce arc */}
					<motion.path
						d="M30 75C30 75 35 50 50 50C65 50 70 75 70 75"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeDasharray="2 6"
						className="opacity-60"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
					/>

					{/* Second bounce arc (going up) */}
					<motion.path
						d="M70 75C70 75 80 35 95 20"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeDasharray="2 6"
						className="opacity-60"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
					/>
				</svg>
				<motion.div className="-right-[80px] -top-6 absolute flex items-center gap-2">
					<motion.div
						className="flex h-10 w-10 items-center justify-center rounded-full border border-error-base/40 border-dashed bg-bg-white-0"
						initial={{ scale: 0, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						transition={{
							delay: 1.2,
							duration: 0.4,
							type: "spring",
						}}
					>
						<Icon name="mail-single" className="h-4 w-4 text-error-base" />
					</motion.div>
					<motion.div
						className="rounded-md border border-error-base/30 border-dashed bg-error-lighter px-2 py-1 font-mono text-[10px] text-error-base dark:bg-error-dark/30"
						initial={{ opacity: 0, x: -10, scale: 0.9 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						transition={{
							delay: 1.45,
							duration: 0.35,
							ease: [0.25, 0.46, 0.45, 0.94],
						}}
					>
						15% avg
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

export default AnimatedBounce;
