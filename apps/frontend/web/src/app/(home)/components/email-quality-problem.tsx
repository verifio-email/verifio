import { Icon } from "@verifio/ui/icon";
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
		id: "bounce",
		theme: {
			text: "text-orange-500",
			bg: "bg-orange-50 dark:bg-orange-500/10",
			icon: "alert-triangle",
		},
		category: "Deliverability protection",
		headline: "Stop hard bounces before they damage your sender reputation.",
		features: [
			"Real-time syntax validation",
			"Domain & MX record verification",
			"Catch-all domain scoring",
		],
		Visual: BounceRateVisual,
	},
	{
		id: "spam",
		theme: {
			text: "text-purple-500",
			bg: "bg-purple-50 dark:bg-purple-500/10",
			icon: "shield-cross",
		},
		category: "Spam trap detection",
		headline: "Identify and block risky addresses that trigger blacklists.",
		features: [
			"Honeypot trap detection",
			"Disposable email blocking",
			"Role-based address flagging",
		],
		Visual: SpamFlagVisual,
	},
	{
		id: "spend",
		theme: {
			text: "text-green-500",
			bg: "bg-green-50 dark:bg-green-500/10",
			icon: "wallet",
		},
		category: "Marketing ROI",
		headline: "Stop wasting acquisition spend on fake or invalid leads.",
		features: [
			"Verify leads at signup",
			"Clean existing email lists",
			"Improve campaign conversion",
		],
		Visual: WastedSpendVisual,
	},
	{
		id: "onboarding",
		theme: {
			text: "text-blue-500",
			bg: "bg-blue-50 dark:bg-blue-500/10",
			icon: "users",
		},
		category: "Onboarding tracking",
		headline:
			"Fix broken activation flows caused by failed verification emails.",
		features: [
			"Track activation drop-offs",
			"Prevent typo signups",
			"Increase user retention",
		],
		Visual: BrokenOnboardingVisual,
	},
];

export function EmailQualityProblem() {
	return (
		<div className="border-stroke-soft-100/60 border-t border-b dark:border-stroke-soft-100/40">
			<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l dark:border-stroke-soft-100/40">
				{/* Section Header */}
				<div className="sticky top-[65.5px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-4 dark:border-stroke-soft-100/40">
					<span className="text-text-sub-600 text-xs">[01] THE PROBLEM</span>
					<span className="text-text-sub-600 text-xs">/ EMAIL QUALITY</span>
				</div>

				{/* Main Content */}
				<div className="flex flex-col">
					{/* Hero Text */}
					<div className="flex flex-col items-center justify-center px-4 py-16 text-center md:px-10 md:py-24">
						<div className="flex max-w-3xl flex-col items-center gap-4">
							<h2 className="title-h2 font-semibold tracking-tight">
								Email quality silently kills growth.
							</h2>
							<p className="max-w-2xl text-base text-text-sub-600 md:text-lg">
								Invalid and risky emails lead to bounce rates, spam flags, and
								wasted spend. Protect your platform with real-time verification.
							</p>
						</div>
					</div>

					{/* Problems Grid - Cards Layout */}
					<div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-4 pb-20 md:grid-cols-2 md:px-10">
						{problems.map((problem) => {
							const Visual = problem.Visual;

							return (
								<div
									key={problem.id}
									className="group flex flex-col justify-between overflow-hidden rounded-[32px] bg-bg-weak-50 shadow-sm dark:bg-bg-weak-50/5"
								>
									{/* Card Header Content */}
									<div className="flex flex-col p-8 md:p-10">
										{/* Icon & Category */}
										<div className="mb-4 flex flex-col items-start gap-4">
											<div
												className={`flex h-10 w-10 items-center justify-center rounded-full ${problem.theme.bg}`}
											>
												<Icon
													name={problem.theme.icon}
													className={`h-5 w-5 ${problem.theme.text}`}
												/>
											</div>
											<h3
												className={`font-medium text-xl ${problem.theme.text}`}
											>
												{problem.category}
											</h3>
										</div>

										{/* Headline */}
										<h4 className="mb-6 font-semibold text-2xl text-text-strong-950 leading-tight tracking-tight md:text-3xl">
											{problem.headline}
										</h4>

										{/* Feature List */}
										<ul className="mb-8 flex flex-col gap-3">
											{problem.features.map((feature, i) => (
												<li
													key={i}
													className="flex items-center gap-3 text-sm text-text-sub-600 md:text-base"
												>
													<div
														className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${problem.theme.bg}`}
													>
														<Icon
															name="check"
															className={`h-2.5 w-2.5 ${problem.theme.text}`}
														/>
													</div>
													{feature}
												</li>
											))}
										</ul>

										{/* Learn More Button Placeholder */}
										<div className="flex w-fit items-center gap-2 rounded-full border border-stroke-soft-200/60 bg-bg-white-0 px-4 py-2 font-medium text-sm text-text-strong-950 shadow-sm transition-colors hover:bg-bg-weak-50 dark:bg-gray-900">
											Learn more{" "}
											<Icon name="chevron-right" className="h-3 w-3" />
										</div>
									</div>

									{/* Visual Element at bottom */}
									<div className="mt-auto px-4 pb-4 md:px-6 md:pb-6">
										<Visual />
									</div>
								</div>
							);
						})}
					</div>

					{/* Bottom Callout (Softened) */}
					<div className="relative border-stroke-soft-100/60 border-t py-16 dark:border-stroke-soft-100/40">
						<div className="flex flex-col items-center justify-center px-4 text-center md:px-10">
							<div className="mx-auto max-w-3xl space-y-4">
								<h3 className="font-semibold text-2xl text-text-strong-950 tracking-tight md:text-3xl">
									Stop guessing with black-box verification.
								</h3>
								<p className="mx-auto max-w-xl text-text-sub-600 md:text-lg">
									Verifio gives you complete transparency. See every check,
									every API signal, and the exact reason an email passed or
									failed.
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
