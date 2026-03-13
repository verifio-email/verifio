"use client";

import { motion } from "framer-motion";

export function AnimatedBounce() {
	return (
		<div className="flex w-full flex-col items-center justify-center border-stroke-soft-100/60 border-t py-7 dark:border-stroke-soft-100/40">
			{/* Circular Progress (Score) */}
			<div className="relative mb-6 flex h-40 w-40 items-center justify-center">
				{/* Background Ring */}
				<svg className="-rotate-90 absolute inset-0 h-full w-full">
					<circle
						cx="80"
						cy="80"
						r="70"
						fill="none"
						stroke="currentColor"
						strokeWidth="12"
						className="text-orange-500/15"
					/>
					{/* Animated Progress Ring */}
					<motion.circle
						cx="80"
						cy="80"
						r="70"
						fill="none"
						stroke="currentColor"
						strokeWidth="12"
						strokeLinecap="round"
						className="text-orange-500"
						strokeDasharray="440"
						initial={{ strokeDashoffset: 440 }}
						animate={{ strokeDashoffset: 440 * (1 - 0.85) }} // 85% score
						transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
					/>
				</svg>

				<div className="flex flex-col items-center justify-center pt-2">
					<span className="font-semibold text-5xl text-text-strong-950 tracking-tighter">
						85
					</span>
				</div>
			</div>

			<div className="flex flex-col items-center text-center">
				<h5 className="mb-2 font-medium text-lg text-text-strong-950">Fair</h5>
				<p className="max-w-[250px] text-sm text-text-sub-600">
					Your bounce rate is higher than average. You need to clean your list.
				</p>

				{/* Legend */}
				<div className="mt-6 flex items-center justify-center gap-4 font-medium text-text-sub-600 text-xs">
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-red-500" /> Drop
					</div>
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Fair
					</div>
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-green-500" /> Good
					</div>
				</div>
			</div>
		</div>
	);
}

export default AnimatedBounce;
