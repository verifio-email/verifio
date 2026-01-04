export const Scale = () => {
	const stats = [
		{ value: "10M+", label: "Emails verified daily" },
		{ value: "99.9%", label: "Accuracy rate" },
		{ value: "< 200ms", label: "Verification speed" },
		{ value: "99.9%", label: "API uptime" },
	];

	return (
		<div className="border-stroke-soft-200/50 border-t">
			<div className="mx-auto max-w-7xl border-stroke-soft-200/50 border-r border-l">
				<div className="flex items-center justify-between border-stroke-soft-200/50 border-b px-10 py-4">
					<span className="text-sm text-text-sub-600">
						[04] BUILT FOR SCALE
					</span>
					<span className="text-sm text-text-sub-600">/ FAST + ACCURATE</span>
				</div>
				<div className="relative">
					<div className="flex items-stretch pb-36">
						<div className="flex-1 space-y-8 py-20 pr-20 pl-10">
							<div className="space-y-4">
								<h2 className="max-w-3xl font-semibold text-3xl text-text-strong-950">
									Email Verification at Scale.{" "}
									<span className="text-text-sub-600 leading-8">
										Verifio verifies millions of emails daily with sub-200ms
										response times and 99.9% accuracy.
									</span>
								</h2>
							</div>
							<div className="grid max-w-sm grid-cols-2 gap-8 pt-8">
								{stats.map((stat, index) => (
									<div key={index} className="pr-8">
										<div className="space-y-2">
											<div className="border-stroke-soft-200/50 border-l-2 pl-4 font-semibold text-3xl text-text-strong-950">
												{stat.value}
											</div>
											<div className="pl-4 font-semibold text-sm text-text-sub-600">
												{stat.label}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="absolute top-20 right-0 bottom-0 left-0 overflow-hidden">
						<svg
							preserveAspectRatio="none"
							className="text-secondary-base"
							viewBox="0 0 1400 600"
						>
							<path
								d="M1400 1C1040.74 302.923 548.585 495.033 1 509.387"
								fill="none"
								stroke="currentColor"
								strokeWidth="1"
								strokeLinecap="round"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};
