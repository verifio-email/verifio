"use client";

import { Icon } from "@verifio/ui/icon";

const channels = [
	{
		name: "Google Ads",
		icon: "google",
		total: 4500,
		wasted: 950,
		width: "w-[85%]",
		color: "text-green-600",
	},
	{
		name: "Facebook",
		icon: "facebook",
		total: 3200,
		wasted: 640,
		width: "w-[65%]",
		color: "text-green-600",
	},
	{
		name: "LinkedIn",
		icon: "linkedin",
		total: 1800,
		wasted: 280,
		width: "w-[40%]",
		color: "text-green-600",
	},
	{
		name: "Twitter",
		icon: "twitter",
		total: 950,
		wasted: 110,
		width: "w-[25%]",
		color: "text-green-600",
	},
];

export function AnimatedWastedSpend() {
	return (
		<div className="flex w-full flex-col pt-2">
			{/* Header */}
			<div className="mb-4 flex items-center justify-between font-medium text-[10px] text-text-sub-600 md:text-xs">
				<span className="w-1/3">CHANNEL</span>
				<span className="w-1/3 text-center">WASTED SPEND</span>
				<span className="w-1/3 text-right">TOTAL</span>
			</div>

			{/* Channels List */}
			<div className="flex flex-col gap-3">
				{channels.map((channel, i) => (
					<div
						key={i}
						className="group flex items-center justify-between rounded-xl border border-transparent p-2 transition-colors hover:border-stroke-soft-200/50 hover:bg-bg-white-0 dark:hover:bg-gray-800/50"
					>
						{/* Channel Name */}
						<div className="flex w-1/3 items-center gap-2">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-stroke-soft-200/30">
								{/* Placeholder for brand icon */}
								<span className="font-semibold text-[10px] text-text-sub-600 uppercase md:text-xs">
									{channel.name[0]}
								</span>
							</div>
							<span className="font-medium text-text-strong-950 text-xs md:text-sm">
								{channel.name}
							</span>
						</div>

						{/* Wasted Bar Indicator */}
						<div className="flex w-1/3 items-center justify-center">
							<div className="relative h-2 w-full max-w-[120px] rounded-full bg-stroke-soft-200/30">
								<div
									className={`absolute top-0 left-0 h-full rounded-full bg-green-500 ${channel.width}`}
								/>
							</div>
						</div>

						{/* Amount Column */}
						<div className="flex w-1/3 items-center justify-end gap-3 text-right">
							<span className="font-mono font-semibold text-green-600 text-xs md:text-sm">
								-${channel.wasted}
							</span>
						</div>
					</div>
				))}
			</div>

			<div className="mt-4 flex items-center justify-between border-stroke-soft-200/50 border-t pt-4">
				<div className="flex items-center gap-2">
					<Icon name="trending-down" className="h-4 w-4 text-green-600" />
					<span className="font-medium text-sm text-text-strong-950">
						Total Wasted Spend
					</span>
				</div>
				<span className="font-bold font-mono text-green-600 text-lg">
					-$1,980{" "}
					<span className="font-medium text-text-sub-600 text-xs line-through">
						($10,450)
					</span>
				</span>
			</div>
		</div>
	);
}

export default AnimatedWastedSpend;
