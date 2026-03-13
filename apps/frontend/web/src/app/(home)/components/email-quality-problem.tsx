import { Icon } from "@verifio/ui/icon";
import type React from "react";
import { AnimatedBounce } from "./animated-bounce";
import { AnimatedSpamFlag } from "./animated-spam-flag";

// Unique visual components for each problem
function BounceRateVisual() {
	return <AnimatedBounce />;
}

function SpamFlagVisual() {
	return <AnimatedSpamFlag />;
}

type Problem = {
	id: string;
	theme: { text: string; bg: string; icon: string };
	category: string;
	headline: string;
	features: string[];
	Visual?: React.ComponentType;
};

const problems: Problem[] = [
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
		headline: "Identify and block risky email addresses.",
		features: [
			"Honeypot trap detection",
			"Disposable email blocking",
			"Role-based address flagging",
		],
		Visual: SpamFlagVisual,
	},
	{
		id: "onboarding",
		theme: {
			text: "text-blue-500",
			bg: "bg-blue-50 dark:bg-blue-500/10",
			icon: "users",
		},
		category: "Onboarding tracking",
		headline: "Fix broken activation flows caused by failed emails.",
		features: [
			"Track activation drop-offs",
			"Prevent typo signups",
			"Increase user retention",
		],
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
					<div className="flex flex-col items-center justify-center border-stroke-soft-100/60 border-b px-4 py-8 text-center md:p-10 dark:border-stroke-soft-100/40">
						<h2 className="max-w-3xl font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Email quality kills growth.
						</h2>
						<p className="mt-3 max-w-sm text-sm text-text-sub-600 md:text-base">
							Invalid and risky emails lead to bounce rates, spam flags, and
							wasted spend.
						</p>
					</div>

					{/* Problems Grid - Cards Layout */}
					<div className="grid grid-cols-1 md:grid-cols-2">
						{problems.map((problem, index) => {
							const isRightColumn = index % 2 === 1;
							const isLastRow = index >= problems.length - 2;
							const Visual = problem.Visual;

							return (
								<div
									key={problem.id}
									className={`flex flex-col justify-between ${
										!isRightColumn
											? "md:border-stroke-soft-100/60 md:border-r dark:border-stroke-soft-100/40"
											: ""
									} ${
										!isLastRow
											? "border-stroke-soft-100/60 border-b dark:border-stroke-soft-100/40"
											: "border-stroke-soft-100/60 border-b md:border-b-0 dark:border-stroke-soft-100/40"
									}`}
								>
									{/* Inner structure (transparent bg) */}
									<div className="group flex h-full flex-col overflow-hidden">
										{/* Card Header Content */}
										<div className="flex flex-col px-6 pt-6 md:px-8 md:pt-8">
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
										</div>
										{Visual && <Visual />}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default EmailQualityProblem;
