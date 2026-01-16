import { Icon } from "@verifio/ui/icon";

interface ResponseHeaderProps {
	email: string;
	score: number;
}

export function ResponseHeader({ email, score }: ResponseHeaderProps) {
	const getScoreData = (score: number) => {
		if (score >= 80) {
			return {
				label: "Deliverable",
				color: "text-green-700 dark:text-green-400",
				bgColor: "bg-green-50 dark:bg-green-950/30",
				borderColor: "border-green-200 dark:border-green-800",
				dotColor: "bg-green-500",
				icon: "verified" as const,
				iconColor: "text-green-600 dark:text-green-500",
			};
		}
		if (score >= 60) {
			return {
				label: "Risky",
				color: "text-blue-700 dark:text-blue-400",
				bgColor: "bg-blue-50 dark:bg-blue-950/30",
				borderColor: "border-blue-200 dark:border-blue-800",
				dotColor: "bg-blue-500",
				icon: "alert-circle" as const,
				iconColor: "text-blue-600 dark:text-blue-500",
			};
		}
		if (score >= 40) {
			return {
				label: "Undeliverable",
				color: "text-orange-700 dark:text-orange-400",
				bgColor: "bg-orange-50 dark:bg-orange-950/30",
				borderColor: "border-orange-200 dark:border-orange-800",
				dotColor: "bg-orange-500",
				icon: "alert-triangle" as const,
				iconColor: "text-orange-600 dark:text-orange-500",
			};
		}
		return {
			label: "Invalid",
			color: "text-red-700 dark:text-red-400",
			bgColor: "bg-red-50 dark:bg-red-950/30",
			borderColor: "border-red-200 dark:border-red-800",
			dotColor: "bg-red-500",
			icon: "x-circle" as const,
			iconColor: "text-red-600 dark:text-red-500",
		};
	};

	const scoreData = getScoreData(score);

	return (
		<div className="flex items-center justify-between border-stroke-soft-100 border-b px-6 py-4">
			<div className="flex items-center gap-4">
				{/* Avatar */}
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-text-strong-950 font-semibold text-2xl text-white shadow-sm">
					{email.charAt(0).toUpperCase()}
				</div>

				{/* Email Info */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<span className="-mt-1.5 font-semibold text-2xl text-text-strong-950">
							{email}
						</span>
						<Icon
							name={scoreData.icon}
							className={`h-6 w-6 ${scoreData.iconColor}`}
						/>
					</div>
				</div>
			</div>

			{/* Custom Score Indicator */}
			<div className="flex items-center gap-3">
				<div
					className={`flex items-center gap-2.5 rounded-full px-4 py-1 ${scoreData.dotColor} shadow-sm`}
				>
					<span className="font-bold text-2xl text-white tabular-nums">
						{score}
					</span>
				</div>
			</div>
		</div>
	);
}
