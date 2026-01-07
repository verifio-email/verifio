"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { formatRelativeTime } from "@fe/dashboard/utils/time";
import { Icon } from "@verifio/ui/icon";
import { Skeleton } from "@verifio/ui/skeleton";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface ActivityLog {
	id: string;
	service: string;
	endpoint: string;
	method: string;
	resource_id: string | null;
	status: string;
	result: string | null;
	duration_ms: number | null;
	credits_used: number | null;
	created_at: string;
}

interface RecentActivityProps {
	apiKeyId: string;
}

export const RecentActivity = ({ apiKeyId }: RecentActivityProps) => {
	const { activeOrganization } = useUserOrganization();
	const [logs, setLogs] = useState<ActivityLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);

	const fetchLogs = useCallback(async () => {
		if (!activeOrganization?.id || !apiKeyId) return;

		setLoading(true);
		try {
			const params = new URLSearchParams();
			params.set("organization_id", activeOrganization.id);
			params.set("api_key_id", apiKeyId);
			params.set("limit", "5");
			params.set("page", "1");

			const response = await fetch(`/dashboard/api/logs?${params.toString()}`, {
				credentials: "include",
			});
			const data = await response.json();

			if (data.success) {
				setLogs(data.data);
				setTotal(data.pagination?.total || 0);
			}
		} catch (error) {
			console.error("Failed to fetch recent activity:", error);
		} finally {
			setLoading(false);
		}
	}, [activeOrganization?.id, apiKeyId]);

	useEffect(() => {
		fetchLogs();
	}, [fetchLogs]);

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "success":
				return (
					<span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700 text-xs">
						<div className="h-1.5 w-1.5 rounded-full bg-green-500" />
						Success
					</span>
				);
			case "failed":
				return (
					<span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-700 text-xs">
						<div className="h-1.5 w-1.5 rounded-full bg-red-500" />
						Failed
					</span>
				);
			case "error":
				return (
					<span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-700 text-xs">
						<div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
						Error
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700 text-xs">
						{status}
					</span>
				);
		}
	};

	return (
		<div>
			{/* Header */}
			<div className="relative">
				<div className="flex items-center justify-between px-5 py-4 lg:px-6">
					<div className="flex items-center gap-1.5">
						<Icon name="activity" className="h-3.5 w-3.5 text-text-sub-600" />
						<span className="font-medium text-[10px] text-text-sub-600 uppercase tracking-wider">
							Recent Activity
						</span>
						{!loading && total > 0 && (
							<span className="ml-1 rounded-full bg-bg-weak-100 px-1.5 py-0.5 text-[10px] text-text-sub-600">
								{total}
							</span>
						)}
					</div>
					{total > 5 && (
						<Link
							href={`/${activeOrganization?.slug}/logs?api_key_id=${apiKeyId}`}
							className="flex items-center gap-1 text-text-sub-600 text-xs transition-colors hover:text-text-strong-950"
						>
							View all
							<Icon name="arrow-right" className="h-3 w-3" />
						</Link>
					)}
				</div>
				<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
			</div>

			{/* Activity List */}
			{loading ? (
				<div>
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="relative flex items-center justify-between px-5 py-4 lg:px-6"
						>
							<div className="flex items-center gap-3">
								<Skeleton className="h-8 w-8 rounded-lg" />
								<div className="space-y-1.5">
									<Skeleton className="h-4 w-32 rounded" />
									<Skeleton className="h-3 w-24 rounded" />
								</div>
							</div>
							<Skeleton className="h-5 w-16 rounded-full" />
							<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
						</div>
					))}
				</div>
			) : logs.length === 0 ? (
				<div className="relative px-5 py-8 lg:px-6">
					<div className="flex flex-col items-center justify-center text-center">
						<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-bg-weak-50">
							<Icon name="file-text" className="h-5 w-5 text-text-sub-600" />
						</div>
						<p className="font-medium text-sm text-text-strong-950">
							No activity yet
						</p>
						<p className="mt-0.5 text-text-sub-600 text-xs">
							Activity will appear here when this API key is used
						</p>
					</div>
					<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
				</div>
			) : (
				<div>
					{logs.map((log) => (
						<div
							key={log.id}
							className="relative flex items-center justify-between px-5 py-3 transition-colors hover:bg-bg-weak-50/50 lg:px-6"
						>
							<div className="flex items-center gap-3">
								{/* Method Badge */}
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stroke-soft-200/40 bg-bg-weak-50">
									<span className="font-mono font-semibold text-[10px] text-text-sub-600">
										{log.method}
									</span>
								</div>

								<div>
									<div className="flex items-center gap-2">
										{log.resource_id && (
											<span className="font-medium text-sm text-text-strong-950">
												{log.resource_id}
											</span>
										)}
									</div>
									<div className="flex items-center gap-1.5 text-text-sub-600 text-xs">
										<span>{formatRelativeTime(log.created_at)}</span>
										{log.duration_ms !== null && (
											<>
												<span className="text-text-disabled-300">•</span>
												<span>{log.duration_ms}ms</span>
											</>
										)}
									</div>
								</div>
							</div>

							{getStatusBadge(log.status)}
							<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
						</div>
					))}
				</div>
			)}
		</div>
	);
};
