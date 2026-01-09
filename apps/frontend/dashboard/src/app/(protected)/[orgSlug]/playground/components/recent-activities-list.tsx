"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import {
	getStateColor,
	getStateIcon,
} from "@fe/dashboard/utils/verification-state";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import * as FileFormatIcon from "@verifio/ui/file-format-icon";
import { Icon } from "@verifio/ui/icon";
import useSWR from "swr";
import type { RecentActivity, VerificationResult } from "../types";
import { EmailAvatar } from "./email-avatar";

interface RecentActivitiesListProps {
	onShowResult?: (result: VerificationResult) => void;
}

// Fetcher function for SWR
const fetchActivities = async (): Promise<RecentActivity[]> => {
	const [historyRes, jobsRes] = await Promise.all([
		fetch("/api/verify/v1/history?limit=10", { credentials: "include" }),
		fetch("/api/verify/v1/jobs?limit=10", { credentials: "include" }),
	]);

	const [historyData, jobsData] = await Promise.all([
		historyRes.json(),
		jobsRes.json(),
	]);

	const newActivities: RecentActivity[] = [];

	if (historyData.success && historyData.data?.results) {
		const singleActivities = historyData.data.results.map(
			(item: {
				id: string;
				email: string;
				state: string;
				score: number;
				reason: string;
				result?: { duration?: number };
				createdAt: string;
			}) => ({
				type: "single" as const,
				id: item.id,
				email: item.email,
				result: {
					email: item.email,
					state: item.state,
					score: item.score,
					reason: item.reason,
					duration: item.result?.duration,
				} as VerificationResult,
				timestamp: new Date(item.createdAt),
			}),
		);
		newActivities.push(...singleActivities);
	}

	if (jobsData.success && jobsData.data?.jobs) {
		const bulkActivities: RecentActivity[] = jobsData.data.jobs.map(
			(job: {
				id: string;
				name: string | null;
				status: string;
				totalEmails: number;
				stats: {
					deliverable: number;
					undeliverable: number;
					risky: number;
					unknown: number;
					averageScore: number;
				} | null;
				createdAt: string;
			}) => ({
				type: "bulk" as const,
				id: job.id,
				name: job.name,
				totalEmails: job.totalEmails,
				status: job.status,
				stats: job.stats,
				timestamp: new Date(job.createdAt),
			}),
		);
		newActivities.push(...bulkActivities);
	}

	newActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
	return newActivities.slice(0, 10);
};

export const RecentActivitiesList = ({
	onShowResult,
}: RecentActivitiesListProps) => {
	const { push } = useUserOrganization();

	const { data: activities = [], isLoading } = useSWR<RecentActivity[]>(
		"/api/verify/recent-activities",
		fetchActivities,
		{
			revalidateOnFocus: true,
			refreshInterval: 30000, // Refresh every 30 seconds
		},
	);

	const handleActivityClick = (activity: RecentActivity) => {
		if (activity.type === "single") {
			if (activity.id && !activity.id.startsWith("local-")) {
				push(`/playground/verify/${activity.id}`);
			} else if (onShowResult) {
				onShowResult(activity.result);
			}
		} else {
			push(`/playground/bulk/${activity.id}`);
		}
	};

	return (
		<div className="overflow-hidden border-stroke-soft-100 border-b">
			<div className="mx-auto max-w-2xl">
				<div className="border-stroke-soft-100 border-r border-l">
					{/* Section Header */}
					<div className="relative px-6 py-4">
						<div className="flex items-center justify-between">
							<h2 className="font-semibold text-lg text-text-strong-950">
								Recent Verifications
							</h2>
							<Button.Root
								variant="neutral"
								mode="ghost"
								size="xsmall"
								onClick={() => push("/logs")}
							>
								View Logs
								<Button.Icon
									as={Icon}
									name="arrow-left"
									className="h-3 w-3 rotate-180"
								/>
							</Button.Root>
						</div>
						<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-100" />
					</div>

					{/* Stack of activities */}
					<div>
						{isLoading ? (
							<div className="flex flex-col items-center justify-center px-6 py-12">
								<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-base border-t-transparent" />
							</div>
						) : activities.length === 0 ? (
							<div className="flex flex-col items-center justify-center px-6 py-12">
								<Icon
									name="mail"
									className="mb-3 h-8 w-8 text-text-disabled-300"
								/>
								<p className="text-text-sub-600">No verifications yet</p>
								<p className="text-[13px] text-text-soft-400">
									Verify an email or upload a CSV to get started
								</p>
							</div>
						) : (
							activities.map((activity) => (
								<button
									key={activity.id}
									type="button"
									onClick={() => handleActivityClick(activity)}
									className="flex w-full items-center justify-between border-stroke-soft-200/50 border-b px-6 py-4 text-left transition-colors last:border-b-0 hover:bg-bg-weak-50"
								>
									<div className="flex items-center gap-3">
										{activity.type === "single" ? (
											<div
												className={cn(
													"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
													activity.result.state === "deliverable"
														? "bg-success-alpha-10"
														: activity.result.state === "risky"
															? "bg-warning-alpha-10"
															: "bg-error-alpha-10",
												)}
											>
												<EmailAvatar
													email={activity.email}
													className="h-5 w-5"
												/>
											</div>
										) : (
											<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-weak-50">
												<FileFormatIcon.Root
													format="CSV"
													color="green"
													className="h-4 w-4"
												/>
											</div>
										)}
										<div>
											<span className="font-mono text-sm text-text-strong-950">
												{activity.type === "single"
													? activity.email
													: activity.name || "Bulk Verification"}
											</span>
											{activity.type === "bulk" && (
												<p className="mt-0.5 text-text-soft-400 text-xs">
													{activity.totalEmails} emails
												</p>
											)}
										</div>
									</div>

									<div className="flex items-center gap-4">
										{activity.type === "single" ? (
											<>
												<span
													className={cn(
														"flex w-[110px] items-center gap-1.5 text-sm",
														getStateColor(activity.result.state),
													)}
												>
													<Icon
														name={getStateIcon(activity.result.state)}
														className="h-3.5 w-3.5 shrink-0"
													/>
													{activity.result.state}
												</span>
												<span
													className={cn(
														"font-bold tabular-nums",
														getStateColor(activity.result.state),
													)}
												>
													{activity.result.score}
												</span>
											</>
										) : (
											<>
												{activity.status === "completed" && activity.stats && (
													<div className="flex items-center gap-3 text-xs">
														<span className="text-success-base">
															{activity.stats.deliverable} passed
														</span>
														<span className="text-warning-base">
															{activity.stats.risky} risky
														</span>
														<span className="text-error-base">
															{activity.stats.undeliverable} failed
														</span>
													</div>
												)}
												{activity.status === "processing" && (
													<span className="flex items-center gap-1.5 text-sm text-warning-base">
														<Icon
															name="loader"
															className="h-3.5 w-3.5 shrink-0 animate-spin"
														/>
														processing
													</span>
												)}
												{activity.status === "failed" && (
													<span className="flex items-center gap-1.5 text-error-base text-sm">
														<Icon
															name="x-circle"
															className="h-3.5 w-3.5 shrink-0"
														/>
														failed
													</span>
												)}
											</>
										)}
									</div>
								</button>
							))
						)}
					</div>
					{/* Bottom border + spacer */}
					<div className="relative py-6">
						<div className="absolute top-0 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-100" />
					</div>
				</div>
			</div>
		</div>
	);
};
