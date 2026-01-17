import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import DotPattern from "@verifio/web/components/dot-pattern";

const flowSteps = [
	{
		id: "syntax",
		icon: "text-input" as const,
		title: "Syntax & domain validation",
		badge: "Format Check",
		badgeColor: "primary",
		description: "Checks formatting and domain structure",
		status: "✓ Validated",
		statusColor: "green",
	},
	{
		id: "mx-dns",
		icon: "search" as const,
		title: "MX & DNS resolution",
		badge: "DNS Lookup",
		badgeColor: "blue",
		description: "Confirms mail servers exist and are reachable",
		status: "✓ Resolved",
		statusColor: "green",
	},
	{
		id: "smtp",
		icon: "message" as const,
		title: "SMTP handshake",
		badge: "Verification",
		badgeColor: "emerald",
		description: "Verifies mailbox availability without sending an email",
		status: "✓ Verified",
		statusColor: "green",
	},
	{
		id: "risk",
		icon: "shield-check" as const,
		title: "Risk & confidence aggregation",
		badge: "Analysis",
		badgeColor: "violet",
		description: "Combines signals into an explainable result",
		status: "✓ Scored",
		statusColor: "green",
	},
];

const sidebarItems = [
	{ label: "Syntax validation", active: false },
	{ label: "MX record lookup", active: false },
	{ label: "SMTP verification", active: true },
	{ label: "Disposable detection", active: false },
	{ label: "Catch-all detection", active: false },
	{ label: "Risk scoring", active: false },
];

const badgeColors = {
	primary:
		"bg-text-strong-950/10 text-text-strong-950 border-stroke-soft-200/20",
	blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
	emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
	violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
};

const iconBgColors = {
	primary: "bg-text-strong-950/10 text-text-strong-950",
	blue: "bg-blue-500/10 text-blue-500",
	emerald: "bg-emerald-500/10 text-emerald-500",
	violet: "bg-violet-500/10 text-violet-500",
};

function FlowNode({
	step,
	isLast,
}: {
	step: (typeof flowSteps)[0];
	isLast: boolean;
}) {
	return (
		<div className="relative flex flex-col items-center">
			{/* Status badge above card */}
			<div className="mb-2 flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1 text-green-600 text-xs">
				<span className="font-medium">{step.status}</span>
			</div>

			{/* Main Card */}
			<div className="relative w-72 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-sm transition-all hover:border-stroke-soft-200/30 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
				{/* Card Header */}
				<div className="flex items-start gap-3">
					{/* Icon */}
					<div
						className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBgColors[step.badgeColor as keyof typeof iconBgColors]}`}
					>
						<Icon name={step.icon} className="h-5 w-5" />
					</div>

					<div className="flex-1">
						{/* Title and Badge */}
						<div className="flex items-center gap-2">
							<h4 className="font-semibold text-sm text-text-strong-950">
								{step.title}
							</h4>
						</div>

						{/* Badge */}
						<span
							className={`mt-1.5 inline-flex rounded-full border px-2 py-0.5 font-medium text-[10px] ${badgeColors[step.badgeColor as keyof typeof badgeColors]}`}
						>
							{step.badge}
						</span>
					</div>
				</div>

				{/* Description */}
				<p className="mt-3 text-text-sub-600 text-xs leading-relaxed">
					{step.description}
				</p>

				{/* Connection dot at bottom */}
				{!isLast && (
					<div className="-bottom-2 -translate-x-1/2 absolute left-1/2 z-10 h-3 w-3 rounded-full border-2 border-bg-white-0 bg-text-strong-950 dark:border-gray-900" />
				)}
			</div>

			{/* Connecting line to next card */}
			{!isLast && (
				<div className="relative h-12 w-px">
					<div className="absolute inset-0 bg-gradient-to-b from-neutral-400 to-neutral-200" />
				</div>
			)}
		</div>
	);
}

function SidebarPanel() {
	return (
		<div className="w-56 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
			<div className="mb-3 flex items-center gap-2 text-text-sub-600 text-xs">
				<Icon name="layers" className="h-4 w-4" />
				<span>Verification signals</span>
			</div>

			<div className="space-y-1">
				{sidebarItems.map((item) => (
					<div
						key={item.label}
						className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
							item.active
								? "border border-stroke-soft-200/20 bg-text-strong-950/5 font-medium text-text-strong-950"
								: "text-text-sub-600 hover:bg-bg-soft-200/50"
						}`}
					>
						<Icon
							name={item.active ? "check-circle" : "circle"}
							className="h-3.5 w-3.5"
						/>
						{item.label}
					</div>
				))}
			</div>

			{/* 3D Illustration placeholder */}
			<div className="mt-4 flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-50">
				<div className="relative">
					{/* Simple 3D cube illustration */}
					<svg
						width="48"
						height="48"
						viewBox="0 0 48 48"
						className="text-text-strong-950"
					>
						<path
							d="M24 4L4 16v16l20 12 20-12V16L24 4z"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinejoin="round"
						/>
						<path
							d="M4 16l20 12M24 28l20-12M24 28v16"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinejoin="round"
							opacity={0.5}
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}

function ResultCard() {
	return (
		<div className="mt-4 w-72 rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-green-500/10 p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
						<Icon name="check" className="h-5 w-5" />
					</div>
					<div>
						<div className="font-semibold text-sm text-text-strong-950">
							Deliverable
						</div>
						<div className="text-text-sub-600 text-xs">
							Confidence:{" "}
							<span className="font-semibold text-green-600">95%</span>
						</div>
					</div>
				</div>
				<div className="rounded-full bg-green-500/20 px-3 py-1 font-semibold text-green-600 text-xs">
					PASS
				</div>
			</div>
		</div>
	);
}

export function HowItWorks() {
	return (
		<div className="border-stroke-soft-100/60 border-t border-b dark:border-stroke-soft-100/40">
			<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l dark:border-stroke-soft-100/40">
				{/* Sticky Header */}
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-4 dark:border-stroke-soft-100/40">
					<span className="text-text-sub-600 text-xs">[04] HOW IT WORKS</span>
					<span className="text-text-sub-600 text-xs">/ OPENLY</span>
				</div>

				{/* Hero Title Section */}
				<div className="flex flex-col items-center gap-4 border-stroke-soft-100/60 border-b px-6 py-10 text-center md:py-12 dark:border-stroke-soft-100/40">
					{/* Heading */}
					<div className="space-y-2">
						<h2 className="font-semibold text-2xl text-text-sub-600 md:text-3xl">
							How email verification{" "}
							<span className="text-text-strong-950">works</span>
						</h2>
						<p className="mx-auto max-w-md text-sm text-text-sub-600">
							Every step is transparent. All logic lives in our open-source
							core.
						</p>
					</div>
				</div>

				{/* Flowchart Section - 3 columns with borders */}
				<div className="flex h-full items-stretch border-stroke-soft-100 dark:border-stroke-soft-100/60">
					{/* Column 1: Left side content label */}
					<div className="hidden flex-1 border-stroke-soft-100/60 border-r px-6 py-12 md:block md:px-10 md:py-16 dark:border-stroke-soft-200/40">
						<div className="sticky top-[106px]">
							<h3 className="font-semibold text-lg text-text-strong-950">
								Verify everything
							</h3>
							<p className="mt-2 font-medium text-text-sub-600 leading-relaxed">
								No black boxes. See the exact signals behind every decision —
								not just a pass/fail.
							</p>
							<Button.Root
								variant="neutral"
								mode="stroke"
								size="xsmall"
								asChild
								className="mt-4"
							>
								<a href="/docs/api">
									Explore API docs
									<Button.Icon
										as={Icon}
										name="arrow-left"
										className="h-3 w-3 rotate-180"
									/>
								</a>
							</Button.Root>
						</div>
					</div>

					{/* Column 2: Main Flowchart */}
					<div className="relative flex flex-1 flex-col items-center border-stroke-soft-100/60 border-r px-6 py-12 md:px-10 md:py-16 dark:border-stroke-soft-100/40">
						<DotPattern className="absolute inset-0 top-2 right-1 left-3 z-0" />
						<div className="mb-4 flex items-center gap-2 text-text-sub-600 text-xs">
							<Icon name="flash" className="h-3.5 w-3.5" />
							<span>Verification Pipeline</span>
							<div className="rounded-full bg-text-strong-950/10 px-2 py-0.5 font-medium text-[10px] text-text-strong-950">
								Automated
							</div>
						</div>

						{/* Flow Steps */}
						{flowSteps.map((step, index) => (
							<FlowNode
								key={step.id}
								step={step}
								isLast={index === flowSteps.length - 1}
							/>
						))}

						{/* Final Result */}
						<ResultCard />

						{/* Add more button */}
						<div className="mt-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-stroke-soft-200 border-dashed transition-all hover:scale-110 hover:border-stroke-soft-200/50 hover:bg-text-strong-950/5">
							<Icon name="plus" className="h-4 w-4 text-text-sub-600" />
						</div>
					</div>

					{/* Column 3: Sidebar */}
					<div className="hidden flex-1 px-6 py-12 md:block md:px-10 md:py-16">
						<div className="sticky top-[106px]">
							<SidebarPanel />
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex flex-col items-center gap-3 border-stroke-soft-100/60 border-t px-6 py-8 text-center md:px-10 md:py-10 dark:border-stroke-soft-100/40">
					<div className="flex items-center gap-2">
						<Icon name="open-source" className="h-5 w-5 text-text-strong-950" />
						<span className="font-semibold text-text-strong-950">
							All logic lives in the open-source code
						</span>
					</div>
					<a
						href="https://github.com/reloop-labs/verifio"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-white-0 px-5 py-2 font-medium text-sm text-text-strong-950 transition-all hover:scale-[1.02] hover:bg-bg-soft-200 active:scale-[0.98]"
					>
						<Icon name="open-source" className="h-4 w-4" />
						View on GitHub
					</a>
				</div>
			</div>
		</div>
	);
}

export default HowItWorks;
