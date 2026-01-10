"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Smooth easing curves
const smoothEase = [0.4, 0, 0.2, 1] as const;
const elegantEase = [0.65, 0, 0.35, 1] as const;

// Animated counter
function AnimatedCounter({
	startValue,
	endValue,
	delay = 0,
	duration = 1500,
}: {
	startValue: number;
	endValue: number;
	delay?: number;
	duration?: number;
}) {
	const [displayValue, setDisplayValue] = useState(startValue);

	useEffect(() => {
		setDisplayValue(startValue);
		const timer = setTimeout(() => {
			const startTime = Date.now();
			const difference = startValue - endValue;

			const animate = () => {
				const elapsed = Date.now() - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const eased = 1 - (1 - progress) ** 3;
				setDisplayValue(Math.floor(startValue - eased * difference));

				if (progress < 1) {
					requestAnimationFrame(animate);
				}
			};
			requestAnimationFrame(animate);
		}, delay);

		return () => clearTimeout(timer);
	}, [startValue, endValue, delay, duration]);

	return <>{displayValue.toLocaleString()}</>;
}

// Invoice line item
function InvoiceRow({
	label,
	amount,
	isDeduction,
	delay,
	showStrike,
}: {
	label: string;
	amount: string;
	isDeduction?: boolean;
	delay: number;
	showStrike?: boolean;
}) {
	return (
		<motion.div
			className="flex items-center justify-between border-stroke-soft-200/40 border-b py-1.5 last:border-b-0"
			initial={{ opacity: 0, x: -10 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay, duration: 0.3, ease: smoothEase }}
		>
			<span className="text-[10px] text-text-sub-600/80">{label}</span>
			<motion.span
				className={`font-medium font-mono text-[10px] ${
					isDeduction ? "text-red-500" : "text-text-sub-600"
				} ${showStrike ? "line-through opacity-60" : ""}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: delay + 0.1, duration: 0.2 }}
			>
				{isDeduction ? "-" : ""}
				{amount}
			</motion.span>
		</motion.div>
	);
}

export function AnimatedWastedSpend() {
	const [animationKey, setAnimationKey] = useState(0);
	const [showDeductions, setShowDeductions] = useState(false);

	const handleHover = () => {
		setShowDeductions(false);
		setAnimationKey((prev) => prev + 1);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowDeductions(true);
		}, 1200);
		return () => clearTimeout(timer);
	}, [animationKey]);

	return (
		<div
			className="relative flex h-52 cursor-pointer items-center justify-center"
			onMouseEnter={handleHover}
		>
			<div className="relative w-56" key={animationKey}>
				{/* Invoice Card */}
				<motion.div
					className="rounded-xl border border-stroke-soft-200/60 bg-gradient-to-b from-bg-white-0 to-bg-weak-50/30 shadow-sm dark:border-gray-700/50 dark:from-gray-900 dark:to-gray-900/80"
					initial={{ opacity: 0, y: 10, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.4, ease: elegantEase }}
				>
					{/* Header */}
					<div className="flex items-center justify-between border-stroke-soft-200/40 border-b px-3 py-2">
						<div className="flex items-center gap-2">
							<motion.div
								className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.2, duration: 0.3, type: "spring" }}
							>
								<Icon name="wallet" className="h-3 w-3 text-text-sub-600" />
							</motion.div>
							<span className="font-medium text-[10px] text-text-sub-600 uppercase tracking-wide">
								Ad Spend
							</span>
						</div>
						<motion.span
							className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[8px] text-text-sub-600/70 dark:bg-gray-800"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							INV-2847
						</motion.span>
					</div>

					{/* Budget Display */}
					<div className="px-3 py-3">
						<motion.div
							className="mb-1 text-[9px] text-text-sub-600/60"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
						>
							Campaign Budget
						</motion.div>
						<motion.div
							className="font-bold font-mono text-2xl text-text-strong-950"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.4 }}
						>
							$
							<AnimatedCounter
								startValue={10000}
								endValue={showDeductions ? 7327 : 10000}
								delay={showDeductions ? 0 : 99999}
								duration={1800}
							/>
						</motion.div>
					</div>

					{/* Breakdown */}
					<div className="border-stroke-soft-200/40 border-t bg-bg-weak-50/30 px-3 py-2 dark:bg-gray-800/30">
						<motion.div
							className="mb-1.5 flex items-center gap-1"
							initial={{ opacity: 0 }}
							animate={{ opacity: showDeductions ? 1 : 0 }}
							transition={{ duration: 0.3 }}
						>
							<Icon
								name="alert-triangle"
								className="h-2.5 w-2.5 text-red-400"
							/>
							<span className="text-[8px] text-red-400 uppercase tracking-wide">
								Invalid Leads
							</span>
						</motion.div>

						{showDeductions && (
							<>
								<InvoiceRow
									label="Fake domains"
									amount="$847"
									isDeduction
									delay={0.1}
								/>
								<InvoiceRow
									label="Disposable emails"
									amount="$523"
									isDeduction
									delay={0.25}
								/>
								<InvoiceRow
									label="Typos & bounces"
									amount="$412"
									isDeduction
									delay={0.4}
								/>
								<InvoiceRow
									label="Role-based"
									amount="$891"
									isDeduction
									delay={0.55}
								/>
							</>
						)}
					</div>

					{/* Footer Total */}
					<motion.div
						className="flex items-center justify-between rounded-b-xl border-stroke-soft-200/40 border-t bg-red-50/50 px-3 py-2 dark:bg-red-950/20"
						initial={{ opacity: 0 }}
						animate={{ opacity: showDeductions ? 1 : 0 }}
						transition={{ delay: 0.8, duration: 0.4 }}
					>
						<div className="flex items-center gap-1.5">
							<motion.div
								animate={{ scale: [1, 1.1, 1] }}
								transition={{
									delay: 1.5,
									duration: 1.2,
									repeat: Number.POSITIVE_INFINITY,
									repeatDelay: 1.5,
								}}
							>
								<Icon name="trending-down" className="h-3 w-3 text-red-500" />
							</motion.div>
							<span className="font-medium text-[10px] text-red-600">
								Total Wasted
							</span>
						</div>
						<span className="font-bold font-mono text-red-500 text-sm">
							$2,673
						</span>
					</motion.div>
				</motion.div>

				{/* Bottom hint */}
				<motion.div
					className="mt-2 text-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: showDeductions ? 1 : 0 }}
					transition={{ delay: 1.2, duration: 0.4 }}
				>
					<span className="font-mono text-[8px] text-text-sub-600/50">
						27% of spend never converts
					</span>
				</motion.div>
			</div>
		</div>
	);
}

export default AnimatedWastedSpend;
