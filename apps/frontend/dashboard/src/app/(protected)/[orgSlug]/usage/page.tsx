"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { useCallback, useEffect, useState } from "react";

interface CreditData {
	daily: {
		used: number;
		limit: number;
		remaining: number;
		percentage: number;
	};
	monthly: {
		used: number;
		limit: number;
		remaining: number;
		percentage: number;
	};
	resetInfo: {
		dailyResetAt: string;
		monthlyResetAt: string;
		daysUntilMonthlyReset: number;
	};
	billingCycle: {
		start: string;
		end: string;
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
			const response = await fetch(
				`/dashboard/api/credits?organization_id=${activeOrganization.id}`,
				{ credentials: "include" },
			);
			const data = await response.json();
			if (data.success) {
				setCreditData(data.data);
			}
		} catch (error) {
			console.error("Failed to fetch credits:", error);
		} finally {
			setLoading(false);
		}
	}, [activeOrganization.id]);

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
								Monitor your email verification credits and usage
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
								<div className="h-1.5 w-1.5 rounded-full bg-primary-base" />
								<span className="font-mono text-sm text-text-sub-600">
									{creditData
										? `${formatDate(creditData.billingCycle.start)} - ${formatDate(creditData.billingCycle.end)}`
										: "Loading..."}
								</span>
								<span className="text-text-disabled-300 text-xs">
									CURRENT BILLING CYCLE
								</span>
							</div>
						</div>

						{/* Credit Cards Grid */}
						<div className="border-stroke-soft-200/50 border-b">
							<div className="grid grid-cols-3">
								{/* Daily Credits */}
								<div className="border-stroke-soft-200/50 border-r px-6 py-6">
									<div className="flex items-start justify-between">
										<div>
											<p className="mb-1 text-text-sub-600 text-xs uppercase tracking-wider">
												Daily Credits
											</p>
											{loading ? (
												<div className="h-8 w-24 animate-pulse rounded bg-bg-weak-100" />
											) : (
												<p className="font-semibold text-3xl text-text-strong-950">
													{creditData?.daily.used ?? 0}
													<span className="ml-1 font-normal text-lg text-text-sub-600">
														/ {creditData?.daily.limit ?? 100}
													</span>
												</p>
											)}
										</div>
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-alpha-10">
											<Icon
												name="activity"
												className="h-5 w-5 text-primary-base"
											/>
										</div>
									</div>
									{/* Progress Bar */}
									<div className="mt-4">
										<div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-weak-100">
											<div
												className={cn(
													"h-full rounded-full transition-all duration-500",
													(creditData?.daily.percentage ?? 0) >= 90
														? "bg-error-base"
														: (creditData?.daily.percentage ?? 0) >= 70
															? "bg-warning-base"
															: "bg-primary-base",
												)}
												style={{
													width: `${creditData?.daily.percentage ?? 0}%`,
												}}
											/>
										</div>
										<p className="mt-2 text-text-soft-400 text-xs">
											{creditData?.daily.remaining ?? 100} credits remaining
											today
										</p>
									</div>
								</div>

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
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-alpha-10">
											<Icon
												name="calendar"
												className="h-5 w-5 text-success-base"
											/>
										</div>
									</div>
									{/* Progress Bar */}
									<div className="mt-4">
										<div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-weak-100">
											<div
												className={cn(
													"h-full rounded-full transition-all duration-500",
													(creditData?.monthly.percentage ?? 0) >= 90
														? "bg-error-base"
														: (creditData?.monthly.percentage ?? 0) >= 70
															? "bg-warning-base"
															: "bg-success-base",
												)}
												style={{
													width: `${creditData?.monthly.percentage ?? 0}%`,
												}}
											/>
										</div>
										<p className="mt-2 text-text-soft-400 text-xs">
											{creditData?.monthly.remaining?.toLocaleString() ?? 3000}{" "}
											credits remaining this month
										</p>
									</div>
								</div>

								{/* Reset Timer */}
								<div className="px-6 py-6">
									<div className="flex items-start justify-between">
										<div>
											<p className="mb-1 text-text-sub-600 text-xs uppercase tracking-wider">
												Monthly Reset
											</p>
											{loading ? (
												<div className="h-8 w-20 animate-pulse rounded bg-bg-weak-100" />
											) : (
												<p className="font-semibold text-3xl text-text-strong-950">
													{creditData?.resetInfo.daysUntilMonthlyReset ?? 0}
													<span className="ml-1 font-normal text-lg text-text-sub-600">
														days
													</span>
												</p>
											)}
										</div>
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-alpha-10">
											<Icon
												name="clock"
												className="h-5 w-5 text-warning-base"
											/>
										</div>
									</div>
									<div className="mt-4">
										<p className="text-text-soft-400 text-xs">
											Credits reset on the 1st of each month at midnight UTC
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Info Section */}
						<div className="border-stroke-soft-200/50 border-b">
							<div className="px-6 py-5">
								<h3 className="mb-4 font-medium text-label-md text-text-strong-950">
									Credit Usage
								</h3>
								<div className="rounded-lg border border-stroke-soft-200/50 bg-bg-weak-50/50 p-4">
									<div className="flex items-start gap-3">
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-alpha-10">
											<Icon name="info" className="h-4 w-4 text-primary-base" />
										</div>
										<div>
											<p className="mb-2 font-medium text-sm text-text-strong-950">
												How credits work
											</p>
											<ul className="space-y-1 text-sm text-text-sub-600">
												<li className="flex items-center gap-2">
													<div className="h-1 w-1 rounded-full bg-text-sub-600" />
													Each email verification uses 1 credit
												</li>
												<li className="flex items-center gap-2">
													<div className="h-1 w-1 rounded-full bg-text-sub-600" />
													Daily limit: 100 credits (resets at midnight UTC)
												</li>
												<li className="flex items-center gap-2">
													<div className="h-1 w-1 rounded-full bg-text-sub-600" />
													Monthly limit: 3,000 credits (resets on the 1st)
												</li>
												<li className="flex items-center gap-2">
													<div className="h-1 w-1 rounded-full bg-text-sub-600" />
													Credits do not carry forward to the next month
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Recent Activity Link */}
						<div className="px-6 py-5">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-label-md text-text-strong-950">
										View Activity
									</h3>
									<p className="mt-1 text-sm text-text-sub-600">
										See detailed logs of your API requests and credit usage
									</p>
								</div>
								<a
									href={`/${activeOrganization.slug}/logs`}
									className="flex items-center gap-1.5 rounded-lg bg-bg-weak-50 px-3 py-2 text-sm text-text-sub-600 ring-1 ring-stroke-soft-200/50 transition-all hover:bg-bg-soft-200"
								>
									<span>View Logs</span>
									<Icon name="arrow-right" className="h-4 w-4" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UsagePage;
