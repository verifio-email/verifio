import { cn } from "@verifio/ui/cn";
import { ReloopLogo } from "@verifio/ui/logo";

export default function Company() {
	const companies = [
		{
			name: "Reloop",
			logo: (
				<div className="flex items-center">
					<ReloopLogo className="h-12 w-12" />
					<span className="font-semibold text-sm text-text-strong-950">
						Reloop
					</span>
				</div>
			),
		},
		{
			name: "Sketch",
			logo: (
				<img
					src="https://www.cloudsketcher.com/images/CloudSketcherNoBG.png"
					alt=""
					className="h-12"
				/>
			),
		},
	];

	return (
		<section className="relative border-stroke-soft-100 border-t border-b">
			{/* Top border extending to viewport edges */}

			<div className="relative mx-auto max-w-5xl flex-1 border-stroke-soft-100 border-r border-l">
				<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
					<span className="text-text-sub-600 text-xs">[02] COMPANY</span>
					<span className="text-text-sub-600 text-xs">
						/ TRUSTED BY INDUSTRY LEADERS
					</span>
				</div>

				<div className="mx-auto max-w-5xl px-4 pt-12 md:px-10 md:pt-20">
					<div className="mb-12 space-y-4 text-center md:mb-16">
						<h2 className="font-semibold text-3xl text-text-strong-950">
							Trusted by Businesses Worldwide
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-text-sub-600">
							Companies of all sizes use Verifio to verify email addresses,
							reduce bounce rates, and protect their sender reputation.
						</p>
					</div>
				</div>
				<div className="pb-12 md:pb-20">
					<div className="border-stroke-soft-100 border-t border-b px-4 md:px-10">
						<div className="mx-auto grid max-w-lg grid-cols-2 gap-0 border-stroke-soft-100 border-r border-l">
							{companies.map((company, index) => (
								<div
									key={index}
									className={cn(
										"flex min-h-[120px] flex-col items-center justify-center border-stroke-soft-100 border-r p-8",
										{
											"border-r-0": index === companies.length - 1,
										},
									)}
								>
									{company.logo}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
