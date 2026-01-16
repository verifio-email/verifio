import { Icon } from "@verifio/ui/icon";

const features = [
	{
		id: "transparent",
		title: "Transparent by default",
		description:
			"See the exact signals behind every decision — not just a pass/fail.",
		icon: "eye-outline" as const,
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

export function OpenSourceDifference() {
	return (
		<div className="border-stroke-soft-100/60 border-t border-b dark:border-stroke-soft-100/40">
			<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l dark:border-stroke-soft-100/40">
				<div className="grid grid-cols-1 items-center gap-8 px-6 py-12 md:grid-cols-2 md:px-10 md:py-16">
					{/* Left side - Text content */}
					<div className="space-y-3">
						<h2 className="font-semibold text-text-sub-600 text-xl md:text-2xl">
							<span className="text-text-strong-950">Built differently</span>{" "}
							from traditional email verifiers.
						</h2>
						<p className="text-sm text-text-sub-600 md:text-base">
							We believe in transparency, flexibility, and giving you complete
							control over your infrastructure.
						</p>
					</div>

					{/* Right side - Feature icons */}
					<div className="flex items-center justify-start gap-6 md:justify-end md:gap-10">
						{features.map((feature) => (
							<div
								key={feature.id}
								className="flex flex-col items-center gap-2"
							>
								<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-stroke-soft-200/40 bg-bg-white-0 dark:bg-transparent">
									<Icon
										name={feature.icon}
										className="h-5 w-5 text-text-sub-600/70"
									/>
								</div>
								<div className="flex items-center gap-1.5">
									<span className="h-1.5 w-1.5 rounded-full bg-text-sub-600/50" />
									<span className="max-w-[60px] text-center text-[10px] text-text-sub-600 leading-tight">
										{feature.title.split(" ")[0]}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default OpenSourceDifference;
