"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { useCallback, useEffect, useState } from "react";

interface CreditData {
	monthly: {
		used: number;
		limit: number;
		remaining: number;
		percentage: number;
	};
	resetInfo: {
		periodStart: string;
		periodEnd: string;
		daysUntilReset: number;
	};
}

const UsagePage = () => {
	const { activeOrganization } = useUserOrganization();
	const { isCollapsed } = useSidebar();
	const [creditData, setCreditData] = useState<CreditData | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchCredits = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetch("/dashboard/api/credits", {
				credentials: "include",
			});
			const data = await response.json();
			if (data.success) {
				setCreditData(data.data);
			}
		} catch (error) {
			console.error("Failed to fetch credits:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCredits();
	}, [fetchCredits]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Header Section - Full width horizontal border */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className={cn(isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32")}>
					<div className="relative border-stroke-soft-200/50 border-r border-l">
						<div className="px-6 py-8">
							<h1 className="mb-2 font-medium text-2xl text-text-strong-950">
								Usage
							</h1>
							<p className="text-paragraph-md text-text-sub-600">
								Monitor your email verification credits
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Content Area with vertical borders extending to bottom */}
			<div className="flex-1 overflow-y-auto">
				<div
					className={cn(
						"h-full",
						isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32",
					)}
				>
					<div className="flex h-full flex-col border-stroke-soft-200/50 border-r border-l">
						{/* Billing Cycle Info */}
						<div className="border-stroke-soft-200/50 border-b">
							<div className="flex items-center gap-2 px-6 py-4">
								<Icon name="clock" className="h-4 w-4 text-text-sub-600" />
								<span className="font-mono text-sm text-text-sub-600">
									{creditData
										? `${formatDate(creditData.resetInfo.periodStart)} - ${formatDate(creditData.resetInfo.periodEnd)}`
										: "Loading..."}
								</span>
								<span className="text-text-disabled-300 text-xs">
									CURRENT CREDITS PERIOD
								</span>
							</div>
						</div>

						{/* Credit Cards Grid - Only 2 cards now */}
						<div className="border-stroke-soft-200/50">
							<div className="grid grid-cols-2">
								{/* Monthly Credits */}
								<div className="border-stroke-soft-200/50 border-r px-6 py-6">
									<div className="flex items-start justify-between">
										<div>
											<p className="mb-1 text-text-sub-600 text-xs uppercase tracking-wider">
												Monthly Credits
											</p>
											{loading ? (
												<div className="h-8 w-28 animate-pulse rounded bg-bg-weak-100" />
											) : (
												<p className="font-semibold text-3xl text-text-strong-950">
													{creditData?.monthly.used?.toLocaleString() ?? 0}
													<span className="ml-1 font-normal text-lg text-text-sub-600">
														/{" "}
														{creditData?.monthly.limit?.toLocaleString() ??
															"3,000"}
													</span>
												</p>
											)}
										</div>
										<Icon
											name="activity"
											className="h-5 w-5 text-text-sub-600"
										/>
									</div>
									{/* Progress Bar */}
									<div className="">
										<div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-weak-100">
											<div
												className={cn(
													"h-full rounded-full transition-all duration-500",
													(creditData?.monthly.percentage ?? 0) >= 90
														? "bg-error-base"
														: (creditData?.monthly.percentage ?? 0) >= 70
															? "bg-warning-base"
															: "bg-primary-base",
												)}
												style={{
													width: `${creditData?.monthly.percentage ?? 0}%`,
												}}
											/>
										</div>
										<p className="mt-2 text-text-soft-400 text-xs">
											{creditData?.monthly.remaining?.toLocaleString() ?? 3000}{" "}
											credits remaining
										</p>
									</div>
								</div>

								{/* Reset Timer */}
								<div className="px-6 py-6">
									<div className="flex items-start justify-between">
										<div>
											<p className="mb-1 text-text-sub-600 text-xs uppercase tracking-wider">
												Resets In
											</p>
											{loading ? (
												<div className="h-8 w-20 animate-pulse rounded bg-bg-weak-100" />
											) : (
												<p className="font-semibold text-3xl text-text-strong-950">
													{creditData?.resetInfo.daysUntilReset ?? 0}
													<span className="ml-1 font-normal text-lg text-text-sub-600">
														days
													</span>
												</p>
											)}
										</div>
										<Icon name="clock" className="h-5 w-5 text-text-sub-600" />
									</div>
									<div className="mt-4">
										<p className="text-text-soft-400 text-xs">
											Credits reset automatically at the end of your billing
											period
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Credit Usage Info Section - Box UI Pattern */}
						<div>
							<div className="relative flex items-center gap-2 px-6 py-4">
								<Icon name="info" className="h-4 w-4 text-text-sub-600" />
								<h3 className="font-medium text-label-md text-text-strong-950">
									How credits work
								</h3>
								{/* Top border extending to both edges */}
								<div className="absolute top-0 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-200/50" />
								{/* Bottom border extending to both edges */}
								<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
							</div>
							{/* Box UI Grid for credit info */}
							<div className="grid grid-cols-2">
								<div className="border-stroke-soft-200/50 border-r border-b px-6 py-4">
									<div className="flex items-center gap-3">
										<Icon name="mail" className="h-4 w-4 text-text-soft-400" />
										<span className="text-sm text-text-sub-600">
											Each email verification uses 1 credit
										</span>
									</div>
								</div>
								<div className="border-stroke-soft-200/50 border-b px-6 py-4">
									<div className="flex items-center gap-3">
										<Icon
											name="activity"
											className="h-4 w-4 text-text-soft-400"
										/>
										<span className="text-sm text-text-sub-600">
											Monthly limit: 3,000 credits for free users
										</span>
									</div>
								</div>
								<div className="border-stroke-soft-200/50 border-r px-6 py-4">
									<div className="flex items-center gap-3">
										<Icon
											name="refresh-cw"
											className="h-4 w-4 text-text-soft-400"
										/>
										<span className="text-sm text-text-sub-600">
											Credits reset at the end of each billing period
										</span>
									</div>
								</div>
								<div className="border-stroke-soft-200/50 px-6 py-4">
									<div className="flex items-center gap-3">
										<Icon
											name="alert-circle"
											className="h-4 w-4 text-text-soft-400"
										/>
										<span className="text-sm text-text-sub-600">
											Credits do not carry forward to the next month
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Recent Activity Link */}
						<div className="relative">
							{/* Top border extending to both edges */}
							<div className="absolute top-0 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-200/50" />
							<div className="grid grid-cols-2">
								<div className="border-stroke-soft-200/50 border-r px-6 py-5">
									<div className="flex items-center gap-3">
										<Icon
											name="file-text"
											className="h-4 w-4 text-text-soft-400"
										/>
										<div>
											<h3 className="font-medium text-sm text-text-strong-950">
												View Activity
											</h3>
											<p className="mt-0.5 text-text-sub-600 text-xs">
												Detailed logs of your API requests
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center px-6 py-5">
									<a
										href={`/dashboard/${activeOrganization.slug}/logs`}
										className="borderx-4 flex items-center gap-1.5 rounded border border-stroke-soft-200/50 px-2 py-1 text-sm text-text-sub-600 transition-all hover:border-text-sub-600 hover:text-text-strong-950"
									>
										<span>View Logs</span>
										<Icon name="arrow-right-rec" className="h-4 w-4" />
									</a>
								</div>
							</div>
							{/* Bottom border extending to both edges */}
							<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UsagePage;
