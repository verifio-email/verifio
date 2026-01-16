import { Icon } from "@verifio/ui/icon";

const features = [
	{
		id: "transparent",
		title: "Transparent",
		description: "See the exact signals behind every decision",
		icon: "eye-outline" as const,
	},
	{
		id: "open-source",
		title: "Open-source",
		description: "Audit, contribute, or self-host the engine",
		icon: "open-source" as const,
	},
	{
		id: "no-lock-in",
		title: "No Lock-in",
		description: "Use our API or run it yourself",
		icon: "cloud" as const,
	},
	{
		id: "infrastructure",
		title: "Infrastructure",
		description: "Built to sit inside your data pipelines",
		icon: "layers" as const,
	},
];

export function OpenSourceDifference() {
	return (
		<div className="border-stroke-soft-100/60 border-t border-b dark:border-stroke-soft-100/40">
			<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l dark:border-stroke-soft-100/40">
				{/* Header section */}
				<div className="px-6 py-12 md:px-10 md:py-16">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="font-semibold text-text-sub-600 text-xl md:text-2xl">
							<span className="text-text-strong-950">Built differently</span>{" "}
							from traditional email verifiers.
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:text-base">
							We believe in transparency, flexibility, and giving you complete
							control over your infrastructure.
						</p>
					</div>
				</div>

				{/* Features grid */}
				<div className="grid grid-cols-2 border-stroke-soft-100/60 border-t md:grid-cols-4 dark:border-stroke-soft-100/40">
					{features.map((feature, index) => (
						<div
							key={feature.id}
							className={`flex flex-col items-center gap-3 px-4 py-8 text-center md:px-6 md:py-10 ${
								index !== features.length - 1
									? "border-stroke-soft-100/60 border-r dark:border-stroke-soft-100/40"
									: ""
							} ${index < 2 ? "border-stroke-soft-100/60 border-b md:border-b-0 dark:border-stroke-soft-100/40" : ""}`}
						>
							<div className="flex h-10 w-10 items-center justify-center rounded-lg">
								<Icon
									name={feature.icon}
									className="h-5 w-5 text-text-sub-600"
								/>
							</div>
							<div className="space-y-1">
								<h3 className="font-medium text-sm text-text-strong-950">
									{feature.title}
								</h3>
								<p className="text-text-sub-600 text-xs leading-relaxed">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default OpenSourceDifference;
