import { Icon } from "@verifio/ui/icon";

const problems = [
	{
		icon: "arrow-top-right-circle" as const,
		title: "High bounce rates.",
		description:
			"Invalid emails cause hard bounces, hurting sender reputation and deliverability scores.",
	},
	{
		icon: "alert-triangle" as const,
		title: "Spam flags & reputation damage.",
		description:
			"Sending to risky addresses triggers spam traps and blacklists that are hard to escape.",
	},
	{
		icon: "dollar" as const,
		title: "Wasted acquisition spend.",
		description:
			"Every invalid email is money spent on leads that will never convert or engage.",
	},
	{
		icon: "cross-circle" as const,
		title: "Broken onboarding flows.",
		description:
			"Users who can't receive emails drop off before activation, killing conversion.",
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
							<Icon name="alert-triangle" className="h-4 w-4 text-amber-500" />
							<span className="font-medium text-sm text-text-sub-600">
								Silent Growth Killer
							</span>
						</div>

						<h2 className="max-w-3xl font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Email quality silently kills growth
						</h2>
						<p className="mt-2 max-w-xl px-2 font-medium text-sm text-text-sub-600 leading-7 md:max-w-none md:px-0 md:text-base md:leading-8">
							Invalid and risky emails lead to bounce rates, spam flags, and
							wasted spend.
						</p>
					</div>

					{/* Problems Grid - 4 columns on desktop, 2 on tablet, 1 on mobile */}
					<div className="grid grid-cols-1 border-stroke-soft-100 border-b sm:grid-cols-2 lg:grid-cols-4">
						{problems.map((problem, index) => {
							const isLastColumn = index === problems.length - 1;

							return (
								<div
									key={index}
									className={`flex flex-col items-center px-6 py-8 text-center ${
										!isLastColumn
											? "border-stroke-soft-100 border-b sm:border-b lg:border-r lg:border-b-0"
											: "border-stroke-soft-100 border-b sm:border-b-0"
									} ${index === 1 ? "sm:border-r lg:border-r" : ""} ${index === 2 ? "sm:border-r-0 sm:border-b lg:border-r lg:border-b-0" : ""}`}
								>
									{/* Icon */}
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-stroke-soft-200/50 bg-bg-white-0">
										<Icon
											name={problem.icon}
											className="h-5 w-5 text-primary-base"
										/>
									</div>

									{/* Title & Description */}
									<p className="text-sm text-text-sub-600 leading-relaxed">
										<span className="font-semibold text-text-strong-950">
											{problem.title}
										</span>{" "}
										{problem.description}
									</p>
								</div>
							);
						})}
					</div>

					{/* Black Box Callout */}
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
	);
}

export default EmailQualityProblem;
