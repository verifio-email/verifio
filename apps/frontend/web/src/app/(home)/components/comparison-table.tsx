"use client";

import { Icon } from "@verifio/ui/icon";
import { Logo } from "@verifio/ui/logo";

const comparisonData = [
	{
		feature: "Open-source core",
		verifio: true,
		traditional: false,
	},
	{
		feature: "Explainable results",
		verifio: true,
		traditional: false,
	},
	{
		feature: "Self-host option",
		verifio: true,
		traditional: false,
	},
	{
		feature: "API & SDK first",
		verifio: true,
		traditional: "Partial",
	},
	{
		feature: "Free tier available",
		verifio: true,
		traditional: "Limited",
	},
];

function StatusCell({ value }: { value: boolean | string }) {
	if (value === true) {
		return <Icon name="check" className="h-4 w-4" />;
	}

	if (value === false) {
		return <span className="text-error-base text-lg">×</span>;
	}

	// Partial/Limited case
	return <span className="text-sm text-text-sub-600">{value}</span>;
}

export function ComparisonTable() {
	return (
		<div className="border-stroke-soft-100 border-t border-b">
			<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
				<div className="overflow-x-auto">
					<table className="w-full">
						{/* Header */}
						<thead>
							<tr className="border-stroke-soft-200/50 border-b">
								{/* Title column */}
								<th className="w-[40%] border-stroke-soft-200/50 border-r px-6 py-8 text-left align-top md:px-8">
									<h3 className="font-semibold text-text-strong-950 text-xl">
										The Verifio Difference
									</h3>
									<p className="mt-2 max-w-xs font-medium text-sm text-text-sub-600 leading-relaxed">
										Built from the ground up with transparency and flexibility
										in mind.
									</p>
								</th>

								{/* Verifio column header */}
								<th className="w-[30%] border-stroke-soft-200/50 border-r bg-neutral-alpha-10/50 px-4 py-6 text-center">
									<div className="flex flex-col items-center gap-2">
										<div className="flex h-9 w-9 items-center justify-center">
											<Logo />
										</div>
										<span className="font-semibold">Verifio</span>
									</div>
								</th>

								{/* Traditional column header */}
								<th className="w-[30%] px-4 py-6 text-center">
									<div className="flex flex-col items-center gap-2">
										<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stroke-soft-200/50">
											<Icon
												name="database"
												className="h-4.5 w-4.5 text-text-sub-600"
											/>
										</div>
										<span className="font-medium text-text-sub-600">
											Traditional
										</span>
									</div>
								</th>
							</tr>
						</thead>

						{/* Body */}
						<tbody>
							{comparisonData.map((row, index) => (
								<tr
									key={row.feature}
									className={`transition-colors hover:bg-bg-soft-200/30 ${
										index !== comparisonData.length - 1
											? "border-stroke-soft-200/50 border-b"
											: ""
									}`}
								>
									{/* Feature name */}
									<td className="border-stroke-soft-200/50 border-r px-6 py-4 md:px-8">
										<span className="font-medium text-sm text-text-strong-950">
											{row.feature}
										</span>
									</td>

									{/* Verifio value */}
									<td className="flex items-center justify-center border-stroke-soft-200/50 border-r bg-neutral-alpha-10/50 px-4 py-5">
										<StatusCell value={row.verifio} />
									</td>

									{/* Traditional value */}
									<td className="px-4 py-3 text-center">
										<StatusCell value={row.traditional} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default ComparisonTable;
