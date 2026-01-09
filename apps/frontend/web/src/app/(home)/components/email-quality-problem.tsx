import { Icon } from "@verifio/ui/icon";

const problems = [
	{
		icon: "arrow-up-right" as const,
		title: "High Bounce Rates",
		description:
			"Invalid emails cause hard bounces, hurting sender reputation and deliverability.",
		stat: "15%",
		statLabel: "avg. bounce rate with unverified lists",
	},
	{
		icon: "alert-triangle" as const,
		title: "Spam Flags & Reputation Damage",
		description:
			"Sending to risky addresses triggers spam traps and blacklists.",
		stat: "3x",
		statLabel: "higher spam complaints",
	},
	{
		icon: "dollar-circle" as const,
		title: "Wasted Acquisition Spend",
		description:
			"Every invalid email is money spent on leads that will never convert.",
		stat: "20%",
		statLabel: "of marketing budget wasted",
	},
	{
		icon: "x-circle" as const,
		title: "Broken Onboarding Flows",
		description: "Users who can't receive emails drop off before activation.",
		stat: "40%",
		statLabel: "drop-off at email verification",
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
							<br className="hidden md:block" />
							Most tools are black boxes — you never know why an email passed or
							failed.
						</p>
					</div>

					{/* Problems Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2">
						{problems.map((problem, index) => {
							const isRightColumn = index % 2 === 1;
							const isLastRow = index >= problems.length - 2;

							return (
								<div
									key={index}
									className={`group relative flex flex-col p-6 md:p-8 ${
										!isRightColumn
											? "md:border-stroke-soft-100 md:border-r"
											: ""
									} ${
										!isLastRow
											? "border-stroke-soft-100 border-b"
											: "border-stroke-soft-100 border-b md:border-b-0"
									}`}
								>
									{/* Icon */}
									<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-stroke-soft-200/50 bg-bg-white-0">
										<Icon
											name={problem.icon}
											className="h-5 w-5 text-text-sub-600"
										/>
									</div>

									{/* Title */}
									<h3 className="mb-2 font-semibold text-base text-text-strong-950">
										{problem.title}
									</h3>

									{/* Description */}
									<p className="mb-4 text-sm text-text-sub-600 leading-relaxed">
										{problem.description}
									</p>

									{/* Stat */}
									<div className="mt-auto flex items-baseline gap-2 rounded-lg border border-stroke-soft-100 bg-bg-white-50 px-3 py-2">
										<span className="text-xl font-bold text-red-500">
											{problem.stat}
										</span>
										<span className="text-xs text-text-sub-600">
											{problem.statLabel}
										</span>
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
