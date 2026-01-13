"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";

const features = [
	{
		id: "transparent",
		title: "Transparent by default",
		description:
			"See the exact signals behind every decision — not just a pass/fail.",
		icon: "eye" as const,
	},
	{
		id: "open-source",
		title: "Open-source core",
		description:
			"Audit the logic, contribute improvements, or self-host the engine.",
		icon: "open-source" as const,
	},
	{
		id: "no-lock-in",
		title: "No lock-in",
		description:
			"Use our hosted API or run it yourself — same engine, same results.",
		icon: "cloud" as const,
	},
	{
		id: "infrastructure",
		title: "Infrastructure, not a tool",
		description: "Designed to sit inside your product and data pipelines.",
		icon: "layers" as const,
	},
];

// Animated SVG for Transparent visual
function TransparentVisual() {
	return (
		<div className="relative flex h-40 w-full items-center justify-center">
			<div className="relative">
				{/* Outer glow ring */}
				<motion.div
					className="-inset-8 absolute rounded-full"
					style={{
						background:
							"radial-gradient(circle, rgba(var(--primary-base-rgb), 0.15) 0%, transparent 70%)",
					}}
					animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
					transition={{
						duration: 3,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>

				{/* Scanning lines */}
				<svg className="-inset-6 absolute h-20 w-20" viewBox="0 0 80 80">
					<motion.line
						x1="10"
						y1="40"
						x2="70"
						y2="40"
						stroke="currentColor"
						strokeWidth="1"
						strokeDasharray="4 4"
						className="text-primary-base/40"
						animate={{ y1: [30, 50, 30], y2: [30, 50, 30] }}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					/>
				</svg>

				{/* Center eye icon */}
				<motion.div
					className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-base/20 bg-gradient-to-br from-primary-base/10 to-primary-base/5"
					whileHover={{ scale: 1.05 }}
					animate={{
						boxShadow: [
							"0 0 20px rgba(var(--primary-base-rgb), 0.2)",
							"0 0 30px rgba(var(--primary-base-rgb), 0.3)",
							"0 0 20px rgba(var(--primary-base-rgb), 0.2)",
						],
					}}
					transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
				>
					<Icon name="eye" className="h-7 w-7 text-primary-base" />
				</motion.div>

				{/* Signal rays */}
				{[0, 60, 120, 180, 240, 300].map((angle, i) => (
					<motion.div
						key={i}
						className="absolute h-0.5 w-4 rounded-full bg-gradient-to-r from-primary-base/60 to-transparent"
						style={{
							top: "50%",
							left: "50%",
							transformOrigin: "0 50%",
							transform: `rotate(${angle}deg) translateX(40px)`,
						}}
						animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.8, 1.2, 0.8] }}
						transition={{
							duration: 1.5,
							repeat: Number.POSITIVE_INFINITY,
							delay: i * 0.2,
						}}
					/>
				))}

				{/* Floating signal badges */}
				<motion.div
					className="-right-16 -top-2 absolute rounded-md border border-green-500/30 bg-green-500/10 px-2 py-1 font-mono text-[9px] text-green-500"
					animate={{ y: [0, -3, 0] }}
					transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
				>
					deliverable: true
				</motion.div>
				<motion.div
					className="-left-14 -bottom-2 absolute rounded-md border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 font-mono text-[9px] text-text-sub-600 dark:bg-gray-900/50"
					animate={{ y: [0, 3, 0] }}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						delay: 0.5,
					}}
				>
					score: 95
				</motion.div>
			</div>
		</div>
	);
}

// Animated SVG for Open Source visual
function OpenSourceVisual() {
	return (
		<div className="relative flex h-40 w-full items-center justify-center">
			<div className="relative">
				{/* GitHub-style repo card */}
				<motion.div
					className="rounded-xl border border-stroke-soft-200/30 bg-gradient-to-br from-bg-white-0 to-bg-soft-200/20 p-4 dark:from-gray-900/50 dark:to-gray-800/30"
					whileHover={{ scale: 1.02 }}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center gap-2">
						<Icon name="open-source" className="h-5 w-5 text-text-sub-600" />
						<span className="font-mono text-text-sub-600 text-xs">
							reloop-labs/
							<span className="font-semibold text-primary-base">verifio</span>
						</span>
					</div>

					{/* Stats row */}
					<div className="mt-3 flex items-center gap-4 font-mono text-[10px] text-text-sub-600/70">
						<motion.div
							className="flex items-center gap-1"
							animate={{ scale: [1, 1.1, 1] }}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								delay: 0,
							}}
						>
							<Icon name="star" className="h-3 w-3 text-amber-400" />
							<span>2.4k</span>
						</motion.div>
						<motion.div
							className="flex items-center gap-1"
							animate={{ scale: [1, 1.1, 1] }}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								delay: 0.3,
							}}
						>
							<svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
								<path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
							</svg>
							<span>156</span>
						</motion.div>
						<div className="flex items-center gap-1">
							<span className="h-2 w-2 rounded-full bg-blue-400" />
							<span>TypeScript</span>
						</div>
					</div>

					{/* License badge */}
					<div className="mt-3 flex gap-2">
						<span className="rounded-full bg-primary-base/20 px-2 py-0.5 font-mono font-semibold text-[8px] text-primary-base">
							MIT License
						</span>
						<span className="rounded-full bg-green-500/20 px-2 py-0.5 font-mono text-[8px] text-green-600">
							Active
						</span>
					</div>
				</motion.div>

				{/* Floating contribution indicator */}
				<motion.div
					className="-right-4 -top-3 absolute flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white"
					animate={{ scale: [1, 1.15, 1] }}
					transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
				>
					<Icon name="plus" className="h-4 w-4" />
				</motion.div>
			</div>
		</div>
	);
}

// Animated SVG for No Lock-in visual
function NoLockInVisual() {
	return (
		<div className="relative flex h-40 w-full items-center justify-center">
			<div className="relative flex items-center gap-4">
				{/* Cloud hosted option */}
				<motion.div
					className="flex flex-col items-center gap-2"
					animate={{ y: [0, -3, 0] }}
					transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
				>
					<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-base/30 bg-gradient-to-br from-primary-base/10 to-primary-base/5">
						<Icon name="cloud" className="h-6 w-6 text-primary-base" />
					</div>
					<span className="font-mono text-[9px] text-text-sub-600">Hosted</span>
				</motion.div>

				{/* Bidirectional arrows */}
				<div className="flex flex-col items-center gap-1">
					<motion.svg
						width="32"
						height="24"
						viewBox="0 0 32 24"
						className="text-primary-base/60"
						animate={{ x: [0, 2, 0] }}
						transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
					>
						<path
							d="M0 8 L24 8 L18 2 M24 8 L18 14"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</motion.svg>
					<span className="rounded-full bg-green-500/20 px-2 py-0.5 font-mono font-semibold text-[8px] text-green-600">
						same results
					</span>
					<motion.svg
						width="32"
						height="24"
						viewBox="0 0 32 24"
						className="text-primary-base/60"
						animate={{ x: [0, -2, 0] }}
						transition={{
							duration: 1.5,
							repeat: Number.POSITIVE_INFINITY,
							delay: 0.5,
						}}
					>
						<path
							d="M32 16 L8 16 L14 10 M8 16 L14 22"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</motion.svg>
				</div>

				{/* Self-hosted option */}
				<motion.div
					className="flex flex-col items-center gap-2"
					animate={{ y: [0, 3, 0] }}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						delay: 0.5,
					}}
				>
					<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-stroke-soft-200/40 bg-gradient-to-br from-bg-white-0 to-bg-soft-200/20 dark:from-gray-900/50 dark:to-gray-800/30">
						<Icon name="home" className="h-6 w-6 text-text-sub-600" />
					</div>
					<span className="font-mono text-[9px] text-text-sub-600">
						Self-host
					</span>
				</motion.div>
			</div>
		</div>
	);
}

// Animated SVG for Infrastructure visual
function InfrastructureVisual() {
	return (
		<div className="relative flex h-40 w-full items-center justify-center">
			<div className="relative">
				{/* Data pipeline visualization */}
				<div className="flex items-center gap-2">
					{/* Input nodes */}
					<div className="flex flex-col gap-2">
						{["inbox", "users", "database"].map((icon, i) => (
							<motion.div
								key={i}
								className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke-soft-200/30 bg-bg-white-0 dark:bg-gray-900/50"
								animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
								transition={{
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									delay: i * 0.3,
								}}
							>
								<Icon
									name={icon as "inbox" | "users" | "database"}
									className="h-4 w-4 text-text-sub-600"
								/>
							</motion.div>
						))}
					</div>

					{/* Connecting lines */}
					<svg
						width="40"
						height="80"
						viewBox="0 0 40 80"
						className="text-primary-base/40"
					>
						<motion.path
							d="M0 12 Q20 12 40 40"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeDasharray="4 4"
							animate={{ pathLength: [0, 1] }}
							transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
						/>
						<motion.path
							d="M0 40 L40 40"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeDasharray="4 4"
							animate={{ pathLength: [0, 1] }}
							transition={{
								duration: 1.5,
								repeat: Number.POSITIVE_INFINITY,
								delay: 0.2,
							}}
						/>
						<motion.path
							d="M0 68 Q20 68 40 40"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeDasharray="4 4"
							animate={{ pathLength: [0, 1] }}
							transition={{
								duration: 1.5,
								repeat: Number.POSITIVE_INFINITY,
								delay: 0.4,
							}}
						/>
					</svg>

					{/* Center processing node */}
					<motion.div
						className="relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary-base/40 bg-gradient-to-br from-primary-base/20 to-primary-base/5"
						animate={{
							boxShadow: [
								"0 0 15px rgba(var(--primary-base-rgb), 0.2)",
								"0 0 25px rgba(var(--primary-base-rgb), 0.4)",
								"0 0 15px rgba(var(--primary-base-rgb), 0.2)",
							],
						}}
						transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
					>
						<Icon name="layers" className="h-6 w-6 text-primary-base" />
						<motion.div
							className="-bottom-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white"
							animate={{ scale: [1, 1.2, 1] }}
							transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
						>
							<Icon name="check" className="h-3 w-3" />
						</motion.div>
					</motion.div>

					{/* Output arrow */}
					<svg
						width="40"
						height="40"
						viewBox="0 0 40 40"
						className="text-primary-base"
					>
						<motion.path
							d="M0 20 L30 20 L24 14 M30 20 L24 26"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							animate={{ x: [0, 4, 0] }}
							transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
						/>
					</svg>

					{/* Output node */}
					<motion.div
						className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10"
						animate={{ scale: [1, 1.05, 1] }}
						transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
					>
						<Icon name="check" className="h-5 w-5 text-green-500" />
					</motion.div>
				</div>
			</div>
		</div>
	);
}

const visualComponents = {
	transparent: TransparentVisual,
	"open-source": OpenSourceVisual,
	"no-lock-in": NoLockInVisual,
	infrastructure: InfrastructureVisual,
};

export function OpenSourceDifference() {
	return (
		<div className="border-stroke-soft-100 border-t border-b">
			<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
				{/* Sticky Header */}
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100 border-b bg-bg-white-0 px-4 py-4 md:px-10">
					<span className="text-text-sub-600 text-xs">
						[03] THE OPEN-SOURCE DIFFERENCE
					</span>
					<span className="text-text-sub-600 text-xs">/ BUILT DIFFERENTLY</span>
				</div>

				{/* Hero Title Section */}
				<div className="flex flex-col items-center gap-6 border-stroke-soft-100 border-b px-6 py-12 text-center md:px-10 md:py-16">
					{/* Heading */}
					<div className="space-y-3">
						<h2 className="font-semibold text-2xl text-text-strong-950 md:text-4xl">
							Built <span className="text-primary-base">differently</span> from
							<br className="hidden md:block" /> traditional email verifiers
						</h2>
						<p className="mx-auto max-w-lg text-sm text-text-sub-600 md:text-base">
							We believe in transparency, flexibility, and giving you complete
							control over your infrastructure.
						</p>
					</div>
				</div>

				{/* Feature Cards - 2x2 Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2">
					{features.map((feature, index) => {
						const VisualComponent =
							visualComponents[feature.id as keyof typeof visualComponents];
						const isBottomRow = index >= 2;
						const isRightColumn = index % 2 === 1;

						return (
							<motion.div
								key={feature.id}
								className={`group relative flex flex-col p-6 transition-all duration-300 md:p-8 ${
									!isRightColumn ? "md:border-stroke-soft-100 md:border-r" : ""
								} ${
									!isBottomRow
										? "border-stroke-soft-100 border-b"
										: "border-stroke-soft-100 border-b md:border-b-0"
								}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								whileHover={{
									backgroundColor: "rgba(var(--primary-base-rgb), 0.02)",
								}}
							>
								{/* Hover glow effect */}
								<div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
									<div className="absolute inset-0 bg-gradient-to-br from-primary-base/5 via-transparent to-transparent" />
								</div>

								{/* Visual element */}
								<div className="relative mb-4 overflow-hidden">
									<VisualComponent />
								</div>

								{/* Content */}
								<div className="relative mt-auto space-y-2">
									<h3 className="font-semibold text-lg text-text-strong-950 transition-colors duration-300 group-hover:text-primary-base">
										{feature.title}
									</h3>
									<p className="text-sm text-text-sub-600 leading-relaxed">
										{feature.description}
									</p>
								</div>

								{/* Corner accent on hover */}
								<div className="absolute right-0 bottom-0 h-16 w-16 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
									<svg viewBox="0 0 64 64" className="text-primary-base/20">
										<circle cx="64" cy="64" r="48" fill="currentColor" />
									</svg>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default OpenSourceDifference;
