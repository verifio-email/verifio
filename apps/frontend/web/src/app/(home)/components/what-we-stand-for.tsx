import { Icon } from "@verifio/ui/icon";

const promises = [
	{
		number: "01",
		title: "99% Accuracy Guarantee",
		description:
			"Industry-leading verification accuracy that outperforms competitors.",
		visual: "accuracy" as const,
	},
	{
		number: "02",
		title: "Sub-200ms Response",
		description:
			"Real-time email verification that won't slow down your flows.",
		visual: "speed" as const,
	},
	{
		number: "03",
		title: "Zero Data Retention",
		description:
			"Your email lists are never stored. We verify and forget immediately.",
		visual: "privacy" as const,
	},
	{
		number: "04",
		title: "Transparent Pricing",
		description:
			"No hidden fees, no surprise charges. Pay only for what you verify.",
		visual: "pricing" as const,
	},
	{
		number: "05",
		title: "Always Up-to-Date",
		description:
			"Algorithms continuously updated to catch the latest spam domains.",
		visual: "updates" as const,
	},
	{
		number: "06",
		title: "Developer Obsessed",
		description:
			"Built by developers, for developers. First-class SDKs and docs.",
		visual: "developer" as const,
	},
	{
		number: "07",
		title: "Free 3K Credits Monthly",
		description:
			"Start verifying immediately with 3,000 free credits every month.",
		visual: "freeCredits" as const,
	},
	{
		number: "08",
		title: "No Charge on Failures",
		description:
			"If we can't verify an email, you don't get charged. Simple as that.",
		visual: "noCharge" as const,
	},
	{
		number: "09",
		title: "Open Source",
		description: "Fully transparent codebase. Audit, contribute, or self-host.",
		visual: "openSource" as const,
	},
];

// Decorative SVG components for each card
function AccuracyVisual() {
	return (
		<div className="relative flex h-44 items-center justify-start">
			{/* Code snippet visual */}
			<div className="rounded-lg border border-stroke-soft-200/30 bg-bg-white-0 p-3 font-mono text-[10px] shadow-sm dark:border-stroke-soft-200/20 dark:bg-gray-900/50">
				<div className="text-text-strong-950">POST</div>
				<div className="mt-1 text-text-sub-600">
					/verify/<span className="text-text-strong-950">{"email"}</span>
				</div>
				<div className="mt-2 space-y-0.5 text-text-sub-600/70">
					<div>curl --request POST \</div>
					<div className="pl-2">
						--url https://api.verifio.email/
						<span className="text-text-strong-950">v1</span>
					</div>
					<div className="pl-2">--header 'Authorization: ***'</div>
					<div className="pl-2">
						--data '{"{"}"email": "..."{"}"}'
					</div>
				</div>
			</div>
			{/* Decorative corner dots */}
			<div className="absolute top-4 left-2 h-1 w-1 rounded-full bg-stroke-soft-200/40" />
			<div className="absolute bottom-4 left-2 h-1 w-1 rounded-full bg-stroke-soft-200/40" />
		</div>
	);
}

function SpeedVisual() {
	return (
		<div className="relative flex h-44 items-center justify-center">
			{/* Concentric circles with icon */}
			<div className="relative">
				{/* Outer rings */}
				<div className="-inset-10 absolute rounded-full border border-stroke-soft-200/20 border-dashed" />
				<div className="-inset-6 absolute rounded-full border border-stroke-soft-200/30" />
				<div className="-inset-3 absolute rounded-full border border-stroke-soft-200/50" />

				{/* Center icon */}
				<div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-stroke-soft-200/60 bg-text-strong-950/10">
					<Icon name="rocket" className="h-5 w-5 text-text-strong-950" />
				</div>

				{/* Floating label */}
				<div className="-right-12 -translate-y-1/2 absolute top-1/2 rounded-md border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 font-mono text-[10px] text-text-sub-600 dark:border-stroke-soft-200/20 dark:bg-gray-900/50">
					&lt;200ms
				</div>
			</div>
		</div>
	);
}

function PrivacyVisual() {
	return (
		<div className="relative flex h-44 items-center justify-center">
			<div className="relative">
				{/* GET endpoint label */}
				<div className="-top-10 absolute right-0 rounded-md border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 font-mono text-[10px] dark:border-stroke-soft-200/20 dark:bg-gray-900/50">
					<span className="text-green-500">GET</span>{" "}
					<span className="text-text-sub-600">/privacy</span>
				</div>

				{/* Center shield icon */}
				<div className="flex h-12 w-12 items-center justify-center rounded-full border border-stroke-soft-200/40 bg-bg-white-0 dark:bg-gray-900/50">
					<Icon name="shield-check" className="h-5 w-5 text-text-sub-600" />
				</div>

				{/* Connection lines */}
				<svg className="-inset-12 absolute" viewBox="0 0 96 96">
					<line
						x1="0"
						y1="48"
						x2="36"
						y2="48"
						stroke="currentColor"
						strokeWidth="1"
						strokeDasharray="3 3"
						className="text-stroke-soft-200/40"
					/>
					<line
						x1="60"
						y1="48"
						x2="96"
						y2="48"
						stroke="currentColor"
						strokeWidth="1"
						strokeDasharray="3 3"
						className="text-stroke-soft-200/40"
					/>
					<line
						x1="48"
						y1="0"
						x2="48"
						y2="36"
						stroke="currentColor"
						strokeWidth="1"
						strokeDasharray="3 3"
						className="text-stroke-soft-200/40"
					/>
					<line
						x1="48"
						y1="60"
						x2="48"
						y2="96"
						stroke="currentColor"
						strokeWidth="1"
						strokeDasharray="3 3"
						className="text-stroke-soft-200/40"
					/>
				</svg>

				{/* Corner dots */}
				<div className="-bottom-6 -left-6 absolute h-1.5 w-1.5 rounded-full border border-stroke-soft-200/40 bg-bg-white-0" />
				<div className="-right-6 -bottom-6 absolute h-1.5 w-1.5 rounded-full border border-stroke-soft-200/40 bg-bg-white-0" />
			</div>
		</div>
	);
}

function PricingVisual() {
	return (
		<div className="relative flex h-44 items-center justify-center">
			<div className="relative">
				{/* Price breakdown visual */}
				<div className="rounded-lg border border-stroke-soft-200/30 bg-bg-white-0 p-3 font-mono text-[10px] dark:border-stroke-soft-200/20 dark:bg-gray-900/50">
					<div className="flex items-center gap-2 text-text-sub-600">
						<Icon name="dollar" className="h-3 w-3 text-text-strong-950" />
						<span>0.001</span>
						<span className="text-text-sub-600/50">/email</span>
					</div>
					<div className="mt-2 space-y-1">
						<div className="flex justify-between gap-4">
							<span className="text-text-sub-600/60">1,000</span>
							<span className="text-text-strong-950">$0</span>
						</div>
						<div className="flex justify-between gap-4">
							<span className="text-text-sub-600/60">10,000</span>
							<span className="text-text-sub-600">$9</span>
						</div>
						<div className="flex justify-between gap-4">
							<span className="text-text-sub-600/60">100,000</span>
							<span className="text-text-sub-600">$49</span>
						</div>
					</div>
				</div>
				{/* Checkmark indicator */}
				<div className="-right-2 -top-2 absolute flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
					<Icon name="check" className="h-3 w-3 text-white" />
				</div>
			</div>
		</div>
	);
}

function UpdatesVisual() {
	return (
		<div className="relative flex h-44 items-center justify-center">
			<div className="relative">
				{/* Rotating arrows animation concept */}
				<div className="-inset-8 absolute rounded-full border border-stroke-soft-200/30 border-dashed" />

				{/* Center icon with circle */}
				<div className="flex h-12 w-12 items-center justify-center rounded-full border border-stroke-soft-200/40 bg-bg-white-0 dark:bg-gray-900/50">
					<Icon name="refresh-cw" className="h-5 w-5 text-text-strong-950" />
				</div>

				{/* Update indicators */}
				<div className="-left-14 -translate-y-1/2 absolute top-1/2 rounded border border-stroke-soft-200/30 bg-bg-white-0 px-1.5 py-0.5 font-mono text-[9px] text-green-500 dark:bg-gray-900/50">
					v2.4.1
				</div>
				<div className="-right-10 -translate-y-1/2 absolute top-1/2 font-mono text-[9px] text-text-sub-600/40">
					v2.4.0
				</div>

				{/* Arrow indicators */}
				<div className="-top-6 -translate-x-1/2 absolute left-1/2 text-text-strong-950">
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M12 19V5M5 12l7-7 7 7" />
					</svg>
				</div>
			</div>
		</div>
	);
}

function DeveloperVisual() {
	return (
		<div className="relative flex h-44 items-center justify-center">
			<div className="relative">
				{/* SDK badges */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<div className="rounded border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 font-mono text-[10px] text-text-sub-600 dark:bg-gray-900/50">
							npm i @verifio/sdk
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="rounded border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 font-mono text-[10px] text-text-sub-600 dark:bg-gray-900/50">
							pip install verifio
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="rounded border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 font-mono text-[10px] text-text-sub-600 dark:bg-gray-900/50">
							go get verifio/sdk-go
						</div>
					</div>
				</div>

				{/* User icon */}
				<div className="-right-4 -top-4 absolute flex h-8 w-8 items-center justify-center rounded-full border border-stroke-soft-200/40 bg-text-strong-950/10">
					<Icon name="users" className="h-4 w-4 text-text-strong-950" />
				</div>
			</div>
		</div>
	);
}

function FreeCreditsVisual() {
	return (
		<div className="relative flex h-44 items-center justify-center">
			<div className="relative">
				{/* Gift box visual */}
				<div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-stroke-soft-200/40 border-dashed bg-text-strong-950/10">
					<Icon name="gift" className="h-7 w-7 text-text-strong-950" />
				</div>

				{/* Credit counter */}
				<div className="-right-6 -top-4 absolute rounded-md border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 font-mono text-[10px] dark:bg-gray-900/50">
					<span className="font-semibold text-text-strong-950">3,000</span>
					<span className="text-text-sub-600/60"> /mo</span>
				</div>

				{/* Free badge */}
				<div className="-bottom-3 -translate-x-1/2 absolute left-1/2 rounded-full bg-green-500 px-3 py-0.5 font-semibold text-[9px] text-white uppercase">
					Free
				</div>
			</div>
		</div>
	);
}

function NoChargeVisual() {
	return (
		<div className="relative flex h-44 items-center justify-center">
			<div className="relative">
				{/* Failed verification visual */}
				<div className="rounded-lg border border-stroke-soft-200/30 bg-bg-white-0 p-3 font-mono text-[10px] dark:bg-gray-900/50">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 rounded-full bg-amber-400" />
						<span className="text-text-sub-600">unknown@domain.xyz</span>
					</div>
					<div className="mt-2 flex items-center gap-1 text-text-sub-600/60">
						<span>Status:</span>
						<span className="text-amber-500">unverifiable</span>
					</div>
					<div className="mt-1 flex items-center gap-1">
						<span className="text-text-sub-600/60">Credits:</span>
						<span className="text-text-sub-600/40 line-through">-1</span>
						<span className="font-semibold text-green-500">$0</span>
					</div>
				</div>

				{/* Check indicator */}
				<div className="-right-2 -top-2 absolute flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
					<Icon name="check" className="h-3 w-3 text-white" />
				</div>
			</div>
		</div>
	);
}

function OpenSourceVisual() {
	return (
		<div className="relative flex h-44 items-center justify-center">
			<div className="relative">
				{/* GitHub-style repo visual */}
				<div className="rounded-lg border border-stroke-soft-200/30 bg-bg-white-0 p-3 dark:bg-gray-900/50">
					<div className="flex items-center gap-2">
						<Icon name="open-source" className="h-4 w-4 text-text-sub-600" />
						<span className="font-mono text-[10px] text-text-sub-600">
							verifio/<span className="text-text-strong-950">core</span>
						</span>
					</div>
					<div className="mt-2 flex items-center gap-3 font-mono text-[9px] text-text-sub-600/60">
						<div className="flex items-center gap-1">
							<Icon name="star" className="h-3 w-3" />
							<span>2.4k</span>
						</div>
						<div className="flex items-center gap-1">
							<svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
								<path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
							</svg>
							<span>89</span>
						</div>
					</div>
					<div className="mt-2 flex gap-1">
						<span className="rounded bg-text-strong-950/20 px-1.5 py-0.5 font-mono text-[8px] text-text-strong-950">
							MIT
						</span>
						<span className="rounded bg-green-500/20 px-1.5 py-0.5 font-mono text-[8px] text-green-600">
							TypeScript
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

const visualComponents = {
	accuracy: AccuracyVisual,
	speed: SpeedVisual,
	privacy: PrivacyVisual,
	pricing: PricingVisual,
	updates: UpdatesVisual,
	developer: DeveloperVisual,
	freeCredits: FreeCreditsVisual,
	noCharge: NoChargeVisual,
	openSource: OpenSourceVisual,
};

export function WhatWeStandFor() {
	return (
		<div className="border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-t border-b">
			<div className="mx-auto max-w-5xl border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-r border-l">
				<div className="sticky top-[65.5px] z-20 flex items-center justify-between border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-b bg-bg-white-0 px-10 py-4">
					<span className="text-text-sub-600 text-xs">
						[04] WHAT WE STAND FOR
					</span>
					<span className="text-text-sub-600 text-xs">/ OUR PROMISE</span>
				</div>

				{/* Title Section */}
				<div className="flex flex-col items-center gap-6 border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-b px-10 py-16 text-center">
					{/* Heading */}
					<div className="space-y-3">
						<h2 className="font-semibold text-3xl text-text-sub-600 md:text-4xl">
							Why <span className="text-text-strong-950">teams</span> choose
							<br />
							<span className="text-text-strong-950">Verifio</span>
						</h2>
						<p className="mx-auto max-w-md text-text-sub-600">
							Everything you need to verify emails with confidence.
						</p>
					</div>
				</div>

				{/* Promise Cards - 3x3 Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3">
					{promises.map((promise, index) => {
						const VisualComponent = visualComponents[promise.visual];
						const isLastRow = index >= 6;
						const isRightEdge = (index + 1) % 3 === 0;

						return (
							<div
								key={index}
								className={`group relative flex flex-col p-6 ${!isRightEdge ? "md:border-stroke-soft-100/60 dark:border-stroke-soft-100/40 md:border-r" : ""
									} ${!isLastRow
										? "border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-b"
										: "border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-b md:border-b-0"
									}`}
							>
								{/* Number indicator */}
								<div className="mb-4 font-mono text-text-sub-600/60 text-xs">
									[ {promise.number} ]
								</div>

								{/* Visual element */}
								<div className="mb-6">
									<VisualComponent />
								</div>

								{/* Description */}
								<div className="mt-auto space-y-1">
									<h3 className="font-semibold text-sm text-text-strong-950">
										{promise.title}
									</h3>
									<p className="text-text-sub-600 text-xs leading-relaxed">
										{promise.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default WhatWeStandFor;
