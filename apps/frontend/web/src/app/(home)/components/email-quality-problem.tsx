import { Icon } from "@verifio/ui/icon";
import { DotPattern } from "@verifio/web/components/dot-pattern";
import { AnimatedBounce } from "./animated-bounce";
import { AnimatedBrokenOnboarding } from "./animated-broken-onboarding";
import { AnimatedSpamFlag } from "./animated-spam-flag";
import { AnimatedWastedSpend } from "./animated-wasted-spend";

// Unique visual components for each problem
function BounceRateVisual() {
	return <AnimatedBounce />;
}

function SpamFlagVisual() {
	return <AnimatedSpamFlag />;
}

function WastedSpendVisual() {
	return <AnimatedWastedSpend />;
}

function BrokenOnboardingVisual() {
	return <AnimatedBrokenOnboarding />;
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
		<div className="border-stroke-soft-100/60 border-t border-b dark:border-stroke-soft-100/40">
			<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l dark:border-stroke-soft-100/40">
				{/* Section Header */}
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-4 dark:border-stroke-soft-100/40">
					<span className="text-text-sub-600 text-xs">[01] THE PROBLEM</span>
					<span className="text-text-sub-600 text-xs">/ EMAIL QUALITY</span>
				</div>

				{/* Main Content */}
				<div className="flex flex-col">
					{/* Hero Text */}
					<div className="flex flex-col items-center justify-center border-stroke-soft-100/60 border-b px-4 py-8 text-center md:p-10 dark:border-stroke-soft-100/40">
						<div className="space-y-3">
							<h2 className="font-semibold text-3xl text-text-sub-600 md:text-4xl">
								Email quality silently{" "}
								<span className="text-text-strong-950">kills growth</span>
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
											? "md:border-stroke-soft-100/60 md:border-r dark:border-stroke-soft-100/40"
											: ""
									} ${
										!isLastRow
											? "border-stroke-soft-100/60 border-b dark:border-stroke-soft-100/40"
											: "border-stroke-soft-100/60 border-b md:border-b-0 dark:border-stroke-soft-100/40"
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
					<div className="relative border-stroke-soft-100/60 border-t py-10 dark:border-stroke-soft-100/40">
						<DotPattern className="absolute inset-0 top-2 right-1 left-3 z-0" />

						<div className="flex flex-col items-center justify-center px-4 py-8 text-center md:p-10">
							<div className="relative mx-auto max-w-2xl">
								{/* Quote marks */}
								<div className="-top-2 -left-4 md:-left-8 absolute font-serif text-4xl text-stroke-soft-200">
									"
								</div>
								<div className="-right-4 -bottom-4 md:-right-8 absolute font-serif text-4xl text-stroke-soft-200">
									"
								</div>

								<p className="font-medium text-base text-text-strong-950 italic md:text-lg">
									Most verification tools are black boxes —
									<span className="text-text-strong-950">
										{" "}
										you never know why
									</span>{" "}
									an email passed or failed.
								</p>
							</div>

							<div className="mt-6 flex items-center gap-2">
								<Icon
									name="lightbulb"
									className="h-4 w-4 text-text-strong-950"
								/>
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
