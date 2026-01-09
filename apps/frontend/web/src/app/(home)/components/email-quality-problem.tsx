import { Icon } from "@verifio/ui/icon";
import { AnimatedBounce } from "./animated-bounce";
import { AnimatedSpamFlag } from "./animated-spam-flag";

// Unique visual components for each problem
function BounceRateVisual() {
	return <AnimatedBounce />;
}

function SpamFlagVisual() {
	return <AnimatedSpamFlag />;
}

function WastedSpendVisual() {
	return (
		<div className="relative flex h-44 items-center justify-center">
			<div className="relative">
				{/* Money drain visual */}
				<div className="rounded-lg border border-stroke-soft-200/30 bg-bg-white-0 p-3 font-mono text-[10px] dark:bg-gray-900/50">
					<div className="flex items-center justify-between gap-4 border-stroke-soft-200/20 border-b pb-2">
						<span className="text-text-sub-600">spend.total</span>
						<span className="text-text-strong-950">$10,000</span>
					</div>
					<div className="mt-2 space-y-1">
						<div className="flex items-center justify-between gap-4">
							<span className="text-text-sub-600/60">valid_emails</span>
							<span className="text-green-500">$8,000</span>
						</div>
						<div className="flex items-center justify-between gap-4">
							<span className="text-text-sub-600/60">invalid_emails</span>
							<span className="text-red-500 line-through">$2,000</span>
						</div>
					</div>
				</div>

				{/* Percentage badge */}
				<div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 font-mono text-[10px] font-semibold text-red-600 dark:bg-red-950/50">
					20%
				</div>
			</div>
		</div>
	);
}

function BrokenOnboardingVisual() {
	return (
		<div className="relative flex h-44 items-center justify-center">
			<div className="relative">
				{/* User flow with break */}
				<div className="flex items-center gap-2">
					{/* Step 1: Signup */}
					<div className="flex flex-col items-center">
						<div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-400/50 bg-green-50 dark:bg-green-950/30">
							<Icon name="user" className="h-3.5 w-3.5 text-green-500" />
						</div>
						<span className="mt-1 font-mono text-[8px] text-text-sub-600/60">
							signup
						</span>
					</div>

					{/* Arrow */}
					<div className="h-px w-4 bg-green-400/40" />

					{/* Step 2: Email verify - BROKEN */}
					<div className="flex flex-col items-center">
						<div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-red-400/50 bg-red-50 dark:bg-red-950/30">
							<Icon name="mail" className="h-3.5 w-3.5 text-red-500" />
							<div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
								<Icon name="x" className="h-2.5 w-2.5 text-white" />
							</div>
						</div>
						<span className="mt-1 font-mono text-[8px] text-red-400">
							verify
						</span>
					</div>

					{/* Broken arrow */}
					<div className="h-px w-4 border-t border-dashed border-text-sub-600/30" />

					{/* Step 3: Activate - Never reached */}
					<div className="flex flex-col items-center opacity-40">
						<div className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke-soft-200/30 bg-bg-white-0">
							<Icon name="check" className="h-3.5 w-3.5 text-text-sub-600" />
						</div>
						<span className="mt-1 font-mono text-[8px] text-text-sub-600/60">
							activate
						</span>
					</div>
				</div>

				{/* Drop-off stat */}
				<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 font-mono text-[9px] dark:bg-gray-900/50">
					<span className="text-red-500 font-semibold">40%</span>
					<span className="text-text-sub-600/60"> drop-off</span>
				</div>
			</div>
		</div>
	);
}

const problems = [
	{
		number: "01",
		title: "High bounce rates.",
		description:
			"Invalid emails cause hard bounces, hurting sender reputation and deliverability scores.",
		Visual: BounceRateVisual,
	},
	{
		number: "02",
		title: "Spam flags & reputation damage.",
		description:
			"Sending to risky addresses triggers spam traps and blacklists that are hard to escape.",
		Visual: SpamFlagVisual,
	},
	{
		number: "03",
		title: "Wasted acquisition spend.",
		description:
			"Every invalid email is money spent on leads that will never convert or engage.",
		Visual: WastedSpendVisual,
	},
	{
		number: "04",
		title: "Broken onboarding flows.",
		description:
			"Users who can't receive emails drop off before activation, killing conversion.",
		Visual: BrokenOnboardingVisual,
	},
];

export function EmailQualityProblem() {
	return (
		<div className="border-stroke-soft-100 border-t border-b">
			<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
				{/* Section Header */}
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100 border-b bg-bg-white-0 px-4 py-4 md:px-10">
					<span className="text-text-sub-600 text-xs">[01] THE PROBLEM</span>
					<span className="text-text-sub-600 text-xs">/ EMAIL QUALITY</span>
				</div>

				{/* Main Content */}
				<div className="flex flex-col">
					{/* Hero Text */}
					<div className="flex flex-col items-center justify-center border-stroke-soft-100 border-b px-4 py-8 text-center md:p-10">
						{/* Warning Badge */}
						<div className="mb-4 flex items-center gap-1.5 md:mb-6">
							<Icon
								name="alert-triangle"
								className="h-4 w-4 text-primary-base"
							/>
							<span className="font-medium text-sm text-text-sub-600">
								Silent Growth Killer
							</span>
						</div>

						<div className="space-y-3">
							<h2 className="font-semibold text-3xl text-text-strong-950 md:text-4xl">
								Email quality silently{" "}
								<span className="text-primary-base">kills growth</span>
							</h2>
							<p className="mx-auto max-w-md text-text-sub-600">
								Invalid and risky emails lead to bounce rates, spam flags, and
								wasted spend.
							</p>
						</div>
					</div>

					{/* Problems Grid - 2x2 with unique visuals */}
					<div className="grid grid-cols-1 md:grid-cols-2">
						{problems.map((problem, index) => {
							const isRightColumn = index % 2 === 1;
							const isLastRow = index >= problems.length - 2;
							const Visual = problem.Visual;

							return (
								<div
									key={index}
									className={`group relative flex flex-col p-6 transition-colors duration-300 hover:bg-bg-weak-50/40 ${
										!isRightColumn
											? "md:border-stroke-soft-100 md:border-r"
											: ""
									} ${
										!isLastRow
											? "border-stroke-soft-100 border-b"
											: "border-stroke-soft-100 border-b md:border-b-0"
									}`}
								>
									{/* Number indicator */}
									<div className="mb-4 font-mono text-text-sub-600/60 text-xs">
										[ {problem.number} ]
									</div>

									{/* Visual element */}
									<div className="mb-6">
										<Visual />
									</div>

									{/* Description */}
									<div className="mt-auto space-y-1">
										<h3 className="font-semibold text-sm text-text-strong-950">
											{problem.title}
										</h3>
										<p className="text-text-sub-600 text-xs leading-relaxed">
											{problem.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>

					{/* Black Box Callout */}
					<div className="border-stroke-soft-100 border-t">
						<div className="flex flex-col items-center justify-center px-4 py-8 text-center md:p-10">
							<div className="relative mx-auto max-w-2xl">
								{/* Quote marks */}
								<div className="absolute -top-2 -left-4 font-serif text-4xl text-stroke-soft-200 md:-left-8">
									"
								</div>
								<div className="absolute -right-4 -bottom-4 font-serif text-4xl text-stroke-soft-200 md:-right-8">
									"
								</div>

								<p className="text-base font-medium italic text-text-strong-950 md:text-lg">
									Most verification tools are black boxes —
									<span className="text-primary-base"> you never know why</span>{" "}
									an email passed or failed.
								</p>
							</div>

							<div className="mt-6 flex items-center gap-2">
								<Icon name="lightbulb" className="h-4 w-4 text-primary-base" />
								<span className="text-sm text-text-sub-600">
									Verifio shows you every check, every signal, every reason.
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EmailQualityProblem;
