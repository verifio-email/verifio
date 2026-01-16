"use client";

import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";

const useCases = [
	{
		id: "signup",
		icon: "user-plus" as const,
		title: "User signup & onboarding",
		description: "Verify at the point of entry",
		color: "primary",
	},
	{
		id: "leads",
		icon: "inbox" as const,
		title: "Lead capture forms",
		description: "Clean data from day one",
		color: "blue",
	},
	{
		id: "crm",
		icon: "users" as const,
		title: "CRM & marketing pipelines",
		description: "Protect sender reputation",
		color: "emerald",
	},
	{
		id: "marketplace",
		icon: "store" as const,
		title: "Marketplaces & communities",
		description: "Trust every user identity",
		color: "violet",
	},
	{
		id: "data",
		icon: "database" as const,
		title: "Data cleaning & enrichment",
		description: "Bulk verify at scale",
		color: "amber",
	},
];

const colorClasses = {
	primary: {
		bg: "bg-neutral-200/10",
		text: "text-text-strong-950",
		border: "border-stroke-soft-200/20",
		glow: "group-hover:shadow-neutral-200",
	},
	blue: {
		bg: "bg-blue-500/10",
		text: "text-blue-500",
		border: "border-blue-500/20",
		glow: "group-hover:shadow-blue-500/20",
	},
	emerald: {
		bg: "bg-emerald-500/10",
		text: "text-emerald-500",
		border: "border-emerald-500/20",
		glow: "group-hover:shadow-emerald-500/20",
	},
	violet: {
		bg: "bg-violet-500/10",
		text: "text-violet-500",
		border: "border-violet-500/20",
		glow: "group-hover:shadow-violet-500/20",
	},
	amber: {
		bg: "bg-amber-500/10",
		text: "text-amber-500",
		border: "border-amber-500/20",
		glow: "group-hover:shadow-amber-500/20",
	},
};

// Visual workflow for signup flow
function SignupFlowVisual() {
	return (
		<div className="relative h-full w-full">
			{/* Form card */}
			<motion.div
				className="absolute top-4 left-4 w-32 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 shadow-sm dark:border-gray-700 dark:bg-gray-900"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className="mb-2 flex items-center gap-1.5">
					<Icon name="user-plus" className="h-3 w-3 text-text-strong-950" />
					<span className="font-medium text-[9px] text-text-strong-950">
						Signup Form
					</span>
				</div>
				<div className="space-y-1.5">
					<div className="h-1.5 w-full rounded-full bg-stroke-soft-200" />
					<div className="h-1.5 w-3/4 rounded-full bg-stroke-soft-200" />
					<motion.div
						className="h-1.5 w-full rounded-full bg-neutral-200/30"
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
					/>
				</div>
			</motion.div>

			{/* Connecting line */}
			<svg className="absolute top-20 left-20 h-16 w-20">
				<motion.path
					d="M0 0 Q40 20 20 40"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeDasharray="4 4"
					className="text-text-strong-950/40"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 1, delay: 0.4 }}
				/>
			</svg>

			{/* Verify card */}
			<motion.div
				className="absolute right-4 bottom-4 rounded-lg border border-green-500/30 bg-green-500/5 p-2"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.6 }}
			>
				<div className="flex items-center gap-1.5">
					<div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
						<Icon name="check" className="h-2.5 w-2.5 text-white" />
					</div>
					<span className="font-medium text-[9px] text-green-600">
						Verified
					</span>
				</div>
			</motion.div>
		</div>
	);
}

// Visual workflow for CRM pipeline
function CrmPipelineVisual() {
	return (
		<div className="relative h-full w-full">
			{/* Pipeline stages */}
			<div className="absolute inset-x-4 top-4 flex items-center gap-1">
				{["Lead", "MQL", "SQL"].map((stage, i) => (
					<motion.div
						key={stage}
						className={`flex-1 rounded px-1.5 py-1 text-center text-[8px] ${
							i === 1
								? "border border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-600"
								: "bg-stroke-soft-200/50 text-text-sub-600"
						}`}
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 + i * 0.1 }}
					>
						{stage}
					</motion.div>
				))}
			</div>

			{/* Contact card */}
			<motion.div
				className="absolute right-4 bottom-4 left-4 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 dark:border-gray-700 dark:bg-gray-900"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="h-5 w-5 rounded-full bg-emerald-500/20" />
						<div>
							<div className="h-1.5 w-12 rounded-full bg-text-strong-950/60" />
							<div className="mt-1 h-1 w-16 rounded-full bg-stroke-soft-200" />
						</div>
					</div>
					<div className="flex items-center gap-1 rounded-full bg-green-500/10 px-1.5 py-0.5">
						<Icon name="check" className="h-2 w-2 text-green-500" />
						<span className="text-[7px] text-green-600">Valid</span>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

// Visual workflow for data cleaning
function DataCleaningVisual() {
	return (
		<div className="relative h-full w-full">
			{/* Batch processing */}
			<motion.div
				className="absolute top-4 left-4 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 dark:border-gray-700 dark:bg-gray-900"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				<div className="mb-1.5 flex items-center gap-1.5">
					<Icon name="database" className="h-3 w-3 text-amber-500" />
					<span className="font-medium text-[8px] text-text-strong-950">
						10k emails
					</span>
				</div>
				<div className="flex gap-0.5">
					{[1, 2, 3, 4, 5].map((_, i) => (
						<motion.div
							key={i}
							className="h-4 w-1.5 rounded-full bg-amber-500/60"
							animate={{ scaleY: [0.5, 1, 0.5] }}
							transition={{
								duration: 1,
								repeat: Number.POSITIVE_INFINITY,
								delay: i * 0.1,
							}}
							style={{ transformOrigin: "bottom" }}
						/>
					))}
				</div>
			</motion.div>

			{/* Result stats */}
			<motion.div
				className="absolute right-4 bottom-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2"
				initial={{ opacity: 0, x: 10 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.5 }}
			>
				<div className="space-y-1 text-[8px]">
					<div className="flex items-center justify-between gap-4">
						<span className="text-text-sub-600">Valid</span>
						<span className="font-medium text-green-600">8,234</span>
					</div>
					<div className="flex items-center justify-between gap-4">
						<span className="text-text-sub-600">Invalid</span>
						<span className="font-medium text-red-500">1,766</span>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

function UseCaseCard({
	useCase,
	index,
	visual,
}: {
	useCase: (typeof useCases)[0];
	index: number;
	visual?: React.ReactNode;
}) {
	const colors = colorClasses[useCase.color as keyof typeof colorClasses];

	return (
		<motion.div
			className={`group relative flex flex-col overflow-hidden rounded-xl border border-stroke-soft-200 bg-bg-white-0 transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 ${colors.glow}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
			whileHover={{ y: -4 }}
		>
			{/* Visual area */}
			{visual && (
				<div className="relative h-32 border-stroke-soft-200 border-b bg-gradient-to-br from-bg-soft-200/30 to-transparent dark:border-gray-700 dark:from-gray-800/30">
					{visual}
				</div>
			)}

			{/* Content */}
			<div className="flex flex-1 flex-col p-4">
				<div className="flex items-center gap-3">
					<div
						className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.bg}`}
					>
						<Icon name={useCase.icon} className={`h-4 w-4 ${colors.text}`} />
					</div>
					<div>
						<h4 className="font-semibold text-sm text-text-strong-950">
							{useCase.title}
						</h4>
						<p className="text-text-sub-600 text-xs">{useCase.description}</p>
					</div>
				</div>
			</div>

			{/* Hover indicator */}
			<motion.div
				className={`absolute bottom-0 left-0 h-0.5 w-full ${colors.bg}`}
				initial={{ scaleX: 0 }}
				whileHover={{ scaleX: 1 }}
				transition={{ duration: 0.3 }}
				style={{ transformOrigin: "left" }}
			/>
		</motion.div>
	);
}

function FeaturesList() {
	const features = [
		{ icon: "check-circle" as const, label: "Real-time verification" },
		{ icon: "layers" as const, label: "Batch processing" },
		{ icon: "code-box" as const, label: "API & SDK access" },
		{ icon: "webhook" as const, label: "Webhook support" },
		{ icon: "open-source" as const, label: "Self-host option" },
	];

	return (
		<motion.div
			className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 dark:border-gray-700 dark:bg-gray-900"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className="mb-3 flex items-center gap-2">
				<Icon name="puzzle" className="h-4 w-4 text-text-strong-950" />
				<span className="font-medium text-text-strong-950 text-xs">
					Works with your stack
				</span>
			</div>

			<div className="space-y-1.5">
				{features.map((feature, i) => (
					<motion.div
						key={feature.label}
						className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-text-sub-600 text-xs transition-colors hover:bg-neutral-200/5 hover:text-text-strong-950"
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.5 + i * 0.05 }}
					>
						<Icon name={feature.icon} className="h-3.5 w-3.5" />
						{feature.label}
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}

function IntegrationCards() {
	return (
		<motion.div
			className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 dark:border-gray-700 dark:bg-gray-900"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: 0.6 }}
		>
			<div className="mb-3 flex items-center gap-2">
				<Icon name="flash" className="h-4 w-4 text-emerald-500" />
				<span className="font-medium text-text-strong-950 text-xs">
					Instant integration
				</span>
			</div>

			{/* Integration example */}
			<div className="space-y-2">
				<motion.div
					className="rounded-lg border border-stroke-soft-200/20 bg-neutral-200/5 p-2"
					animate={{ scale: [1, 1.02, 1] }}
					transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
				>
					<div className="flex items-center gap-2">
						<Icon name="code-box" className="h-4 w-4 text-text-strong-950" />
						<span className="font-medium text-[10px] text-text-strong-950">
							verifio.verify()
						</span>
						<span className="ml-auto rounded-full bg-green-500/20 px-1.5 py-0.5 font-medium text-[8px] text-green-600">
							AI
						</span>
					</div>
					<p className="mt-1 text-[9px] text-text-sub-600">
						Verify email in real-time
					</p>
				</motion.div>

				<div className="flex items-center gap-2">
					<div className="h-px flex-1 bg-stroke-soft-200" />
					<span className="text-[8px] text-text-sub-600">returns</span>
					<div className="h-px flex-1 bg-stroke-soft-200" />
				</div>

				<motion.div
					className="rounded-lg border border-green-500/20 bg-green-500/5 p-2"
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
				>
					<div className="flex items-center gap-2">
						<div className="h-5 w-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500" />
						<div>
							<div className="font-medium text-[10px] text-text-strong-950">
								Valid Email
							</div>
							<div className="flex items-center gap-1 text-[8px] text-text-sub-600">
								<span>Score:</span>
								<span className="font-medium text-green-600">95</span>
							</div>
						</div>
					</div>
				</motion.div>

				<div className="flex items-center gap-1 text-[9px] text-text-strong-950">
					<Icon name="flash" className="h-3 w-3" />
					<span>AI is typing...</span>
				</div>
			</div>
		</motion.div>
	);
}

export function UseCases() {
	return (
		<div className="border-stroke-soft-100 border-t border-b">
			<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
				{/* Sticky Header */}
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100 border-b bg-bg-white-0 px-4 py-4 md:px-10">
					<span className="text-text-sub-600 text-xs">[05] USE CASES</span>
					<span className="text-text-sub-600 text-xs">
						/ BUILT FOR REAL PRODUCTS
					</span>
				</div>

				{/* Main Content - Stacked Full-Width Rows */}
				<div className="divide-y divide-stroke-soft-200">
					{/* Row 1: Verify at every touchpoint */}
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						{/* Left - Description */}
						<div className="flex items-center p-6 md:p-10">
							<div>
								<h3 className="font-semibold text-text-strong-950 text-xl">
									Verify at every touchpoint
								</h3>
								<p className="mt-2 max-w-sm text-sm text-text-sub-600 leading-relaxed">
									From user signup to data pipelines, Verifio fits seamlessly
									into your existing workflows.
								</p>
							</div>
						</div>
						{/* Right - Visual Content */}
						<div className="space-y-4 border-stroke-soft-200 border-t bg-bg-soft-200/30 p-6 md:border-t-0 md:border-l md:p-8">
							<SignupFlowVisual />
							<UseCaseCard useCase={useCases[0]!} index={0} />
							<UseCaseCard useCase={useCases[1]!} index={1} />
						</div>
					</motion.div>

					{/* Row 2: Clean pipelines, better results */}
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						{/* Left - Description */}
						<div className="flex items-center p-6 md:p-10">
							<div>
								<h3 className="font-semibold text-text-strong-950 text-xl">
									Clean pipelines, better results
								</h3>
								<p className="mt-2 max-w-sm text-sm text-text-sub-600 leading-relaxed">
									Turn ideas into real-life systems with precise, step-by-step
									email verification.
								</p>
							</div>
						</div>
						{/* Right - Visual Content */}
						<div className="space-y-4 border-stroke-soft-200 border-t bg-bg-soft-200/30 p-6 md:border-t-0 md:border-l md:p-8">
							<CrmPipelineVisual />
							<UseCaseCard useCase={useCases[2]!} index={2} />
							<UseCaseCard useCase={useCases[3]!} index={3} />
							<DataCleaningVisual />
						</div>
					</motion.div>

					{/* Row 3: Extend your functionality */}
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						{/* Left - Description */}
						<div className="flex items-center p-6 md:p-10">
							<div>
								<h3 className="font-semibold text-text-strong-950 text-xl">
									Extend your functionality
								</h3>
								<p className="mt-2 max-w-sm text-sm text-text-sub-600 leading-relaxed">
									Build new features, automations, and data pipelines with our
									flexible API.
								</p>
							</div>
						</div>
						{/* Right - Visual Content */}
						<div className="space-y-4 border-stroke-soft-200 border-t bg-bg-soft-200/30 p-6 md:border-t-0 md:border-l md:p-8">
							<FeaturesList />
							<IntegrationCards />
						</div>
					</motion.div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-center gap-3 border-stroke-soft-100 border-t bg-gradient-to-r from-transparent via-neutral-50 to-transparent px-6 py-6 text-center">
					<motion.p
						className="text-sm text-text-sub-600"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
					>
						If email quality matters to your product,{" "}
						<span className="font-semibold text-text-strong-950">
							Verifio fits
						</span>
						.
					</motion.p>
				</div>
			</div>
		</div>
	);
}

export default UseCases;
