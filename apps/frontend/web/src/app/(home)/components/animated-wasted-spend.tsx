"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Smooth easing curves
const smoothEase = [0.4, 0, 0.2, 1] as const;
const elegantEase = [0.65, 0, 0.35, 1] as const;

// Animated counter component
function AnimatedCounter({
	value,
	delay = 0,
}: {
	value: number;
	delay?: number;
}) {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			const duration = 1500;
			const startTime = Date.now();

			const animate = () => {
				const elapsed = Date.now() - startTime;
				const progress = Math.min(elapsed / duration, 1);
				// Ease out cubic
				const eased = 1 - (1 - progress) ** 3;
				setDisplayValue(Math.floor(eased * value));

				if (progress < 1) {
					requestAnimationFrame(animate);
				}
			};
			requestAnimationFrame(animate);
		}, delay);

		return () => clearTimeout(timer);
	}, [value, delay]);

	return <>{displayValue.toLocaleString()}</>;
}

// Floating money particle
function FloatingMoney({
	delay,
	startX,
	direction,
}: {
	delay: number;
	startX: number;
	direction: "up" | "down";
}) {
	return (
		<motion.div
			className="absolute font-bold font-mono text-sm"
			initial={{
				x: startX,
				y: direction === "up" ? 60 : -20,
				opacity: 0,
				scale: 0.5,
			}}
			animate={{
				y: direction === "up" ? -40 : 80,
				opacity: [0, 1, 1, 0],
				scale: [0.5, 1, 1, 0.3],
				x: startX + (Math.random() - 0.5) * 30,
			}}
			transition={{
				delay,
				duration: 2,
				ease: elegantEase,
			}}
		>
			<span
				className={
					direction === "up"
						? "text-green-500"
						: "text-red-500 line-through opacity-60"
				}
			>
				$
			</span>
		</motion.div>
	);
}

// Email envelope that transforms
function TransformingEmail({ delay, index }: { delay: number; index: number }) {
	const positions = [
		{ x: -60, y: -25 },
		{ x: -35, y: 15 },
		{ x: 60, y: -20 },
		{ x: 45, y: 25 },
		{ x: 0, y: -35 },
	];

	const pos = positions[index % positions.length] ?? { x: 0, y: 0 };
	const isInvalid = index >= 3;

	return (
		<motion.div
			className="absolute"
			initial={{ x: pos.x, y: pos.y, opacity: 0, scale: 0 }}
			animate={{
				opacity: 1,
				scale: 1,
			}}
			transition={{ delay, duration: 0.4, ease: smoothEase }}
		>
			<motion.div
				className={`flex h-7 w-7 items-center justify-center rounded-md border transition-all duration-500 ${
					isInvalid
						? "border-red-400/60 bg-red-50/80 dark:bg-red-950/40"
						: "border-green-400/60 bg-green-50/80 dark:bg-green-950/40"
				}`}
				initial={{ rotate: -10 }}
				animate={{ rotate: isInvalid ? [0, 5, -5, 0] : 0 }}
				transition={{
					delay: delay + 0.3,
					duration: 0.4,
					ease: smoothEase,
				}}
			>
				<Icon
					name="mail-single"
					className={`h-3.5 w-3.5 ${isInvalid ? "text-red-500" : "text-green-500"}`}
				/>
				{isInvalid && (
					<motion.div
						className="-bottom-0.5 -right-0.5 absolute"
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: delay + 0.5, duration: 0.3 }}
					>
						<Icon name="x-close" className="h-2.5 w-2.5 text-red-600" />
					</motion.div>
				)}
			</motion.div>
		</motion.div>
	);
}

export function AnimatedWastedSpend() {
	const [animationKey, setAnimationKey] = useState(0);

	const handleHover = () => {
		setAnimationKey((prev) => prev + 1);
	};

	return (
		<div
			className="relative flex h-48 cursor-pointer items-center justify-center overflow-hidden"
			onMouseEnter={handleHover}
		>
			<div className="relative" key={animationKey}>
				{/* Floating money particles */}
				<FloatingMoney delay={0.8} startX={-50} direction="up" />
				<FloatingMoney delay={1.0} startX={50} direction="up" />
				<FloatingMoney delay={1.2} startX={0} direction="up" />
				<FloatingMoney delay={1.6} startX={30} direction="down" />
				<FloatingMoney delay={1.8} startX={-20} direction="down" />

				{/* Central money counter display */}
				<motion.div
					className="relative z-10 flex flex-col items-center"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, ease: elegantEase }}
				>
					{/* Main counter card */}
					<motion.div
						className="relative overflow-hidden rounded-2xl border border-stroke-soft-200/50 bg-gradient-to-b from-bg-white-0 to-bg-weak-50/30 px-8 py-5 shadow-lg dark:border-gray-700/50 dark:from-gray-900/80 dark:to-gray-800/60"
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5, ease: elegantEase }}
					>
						{/* Subtle gradient overlay */}
						<div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-red-500/3 to-transparent" />

						{/* Counter display */}
						<div className="relative flex flex-col items-center gap-1">
							<motion.span
								className="font-medium text-[10px] text-text-sub-600/70 uppercase tracking-wide"
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4, duration: 0.4 }}
							>
								Money Wasted
							</motion.span>

							<motion.div
								className="flex items-baseline gap-0.5"
								initial={{ opacity: 0.5 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5, duration: 0.4 }}
							>
								<span className="font-bold font-mono text-2xl text-red-500">
									$<AnimatedCounter value={2847} delay={600} />
								</span>
							</motion.div>

							{/* Wasted rate indicator */}
							<motion.div
								className="mt-1 flex items-center gap-1.5"
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1.8, duration: 0.4 }}
							>
								<motion.div
									className="flex items-center gap-1 rounded-full bg-red-100/80 px-2 py-0.5 dark:bg-red-900/30"
									animate={{
										scale: [1, 1.03, 1],
									}}
									transition={{
										delay: 2.5,
										duration: 1.5,
										repeat: Number.POSITIVE_INFINITY,
									}}
								>
									<Icon
										name="trending-down"
										className="h-2.5 w-2.5 text-red-500"
									/>
									<span className="font-mono font-semibold text-[9px] text-red-600">
										23%
									</span>
								</motion.div>
								<span className="font-mono text-[8px] text-text-sub-600/60">
									of budget
								</span>
							</motion.div>
						</div>

						{/* Drain line effect */}
						<motion.div
							className="absolute right-0 bottom-0 left-0 h-0.5 origin-left"
							style={{
								background:
									"linear-gradient(90deg, transparent, #ef4444 50%, transparent)",
							}}
							initial={{ scaleX: 0 }}
							animate={{ scaleX: [0, 1, 0] }}
							transition={{
								delay: 2.2,
								duration: 2,
								ease: elegantEase,
								repeat: Number.POSITIVE_INFINITY,
								repeatDelay: 1,
							}}
						/>
					</motion.div>

					{/* Floating email icons around the counter */}
					{[0, 1, 2, 3, 4].map((i) => (
						<TransformingEmail key={i} delay={0.8 + i * 0.15} index={i} />
					))}
				</motion.div>

				{/* Bottom call-to-action hint */}
				<motion.div
					className="-bottom-8 -translate-x-1/2 absolute left-1/2 whitespace-nowrap"
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 2.5, duration: 0.5 }}
				>
					<span className="font-mono text-[9px] text-text-sub-600/60">
						Stop paying for{" "}
						<motion.span
							className="font-semibold text-red-500"
							animate={{ opacity: [1, 0.6, 1] }}
							transition={{
								duration: 1.5,
								repeat: Number.POSITIVE_INFINITY,
							}}
						>
							dead emails
						</motion.span>
					</span>
				</motion.div>
			</div>
		</div>
	);
}

export default AnimatedWastedSpend;
