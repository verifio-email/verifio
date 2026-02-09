"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import { cn } from "@verifio/ui/cn";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	LogsFilterBar,
	LogsHeader,
	LogsList,
	LogsPagination,
	LogsStates,
	LogsTableHeader,
} from "./components";
import type { LogsFilters as LogsFiltersType } from "./logs-filter-dropdown";
import type { ActivityLog, BulkJobInfo, VerificationEnrichment } from "./types";

const HOURS_IN_DAY = 24;
const DEFAULT_PAGE_LIMIT = 20;

type LogsResponse = {
	success: boolean;
	data: ActivityLog[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		total_pages: number;
	};
};

const LogsPage = () => {
	const { isCollapsed } = useSidebar();
	const { activeOrganization, push } = useUserOrganization();
	const [logs, setLogs] = useState<ActivityLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: DEFAULT_PAGE_LIMIT,
		total: 0,
		total_pages: 0,
	});

	// Verification map for enrichment data
	const [verificationMap] = useState<Map<string, VerificationEnrichment>>(
		new Map(),
	);

	// Bulk job info for enriching bulk verification logs
	const [bulkJobMap, setBulkJobMap] = useState<Map<string, BulkJobInfo>>(
		new Map(),
	);

	// Filters
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<LogsFiltersType>({
		status: [],
		verificationState: [],
		services: [],
		dateRange: "3d",
	});

	// Helper to calculate date range
	const getDateRange = useCallback((dateRange: string) => {
		if (dateRange === "all") return null;

		const hoursMap: Record<string, number> = {
			"24h": HOURS_IN_DAY,
			"3d": 3 * HOURS_IN_DAY,
			"7d": 7 * HOURS_IN_DAY,
			"30d": 30 * HOURS_IN_DAY,
		};

		const hours = hoursMap[dateRange] ?? 3 * HOURS_IN_DAY;
		const now = new Date();

		return {
			from: new Date(now.getTime() - hours * 60 * 60 * 1000),
			to: now,
		};
	}, []);

	const fetchLogs = useCallback(
		async (page = 1) => {
			setLoading(true);
			setError(null);

			try {
				const params = new URLSearchParams();
				params.set("organization_id", activeOrganization.id);
				params.set("page", String(page));
				params.set("limit", String(pagination.limit));

				if (filters.services.length > 0) {
					params.set("service", filters.services.join(","));
				}

				if (filters.status.length > 0) {
					params.set("status", filters.status.join(","));
				}

				const dateRange = getDateRange(filters.dateRange);
				if (dateRange) {
					params.set("from", dateRange.from.toISOString());
					params.set("to", dateRange.to.toISOString());
				}

				const response = await fetch(
					`/api/logs/v1/query?${params.toString()}`,
					{
						credentials: "include",
					},
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data: LogsResponse = await response.json();

				if (data.success) {
					setLogs(data.data);
					setPagination(data.pagination);
				} else {
					throw new Error("Failed to fetch logs");
				}
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to fetch logs";
				setError(message);
				console.error("Failed to fetch logs:", err);
			} finally {
				setLoading(false);
			}
		},
		[activeOrganization.id, filters, pagination.limit, getDateRange],
	);

	// Fetch logs on mount and when filters change
	useEffect(() => {
		fetchLogs(1);
	}, [fetchLogs]);

	// Fetch bulk job names when logs contain bulk verification entries
	useEffect(() => {
		const bulkJobIds = logs
			.filter((log) => log.resource_id?.startsWith("vj_"))
			.map((log) => log.resource_id as string)
			.filter((id, index, self) => self.indexOf(id) === index);

		if (bulkJobIds.length === 0) return;

		const missingIds = bulkJobIds.filter((id) => !bulkJobMap.has(id));
		if (missingIds.length === 0) return;

		const fetchBulkJobNames = async () => {
			try {
				const newMap = new Map(bulkJobMap);
				await Promise.all(
					missingIds.map(async (jobId) => {
						try {
							const response = await fetch(
								`/api/verify/v1/bulk-jobs/${jobId}`,
								{
									credentials: "include",
								},
							);
							const data = await response.json();
							if (data.success && data.data) {
								newMap.set(jobId, {
									jobId: data.data.id,
									name: data.data.name,
									totalEmails: data.data.totalEmails ?? data.data.total ?? 0,
									status: data.data.status,
								});
							}
						} catch (error) {
							console.error(`Failed to fetch bulk job ${jobId}:`, error);
						}
					}),
				);
				setBulkJobMap(newMap);
			} catch (error) {
				console.error("Failed to fetch bulk job names:", error);
			}
		};

		fetchBulkJobNames();
	}, [logs, bulkJobMap]);

	// Client-side filtering for search
	const filteredLogs = useMemo(() => {
		let result = logs;

		if (search.trim()) {
			const searchLower = search.toLowerCase();
			result = result.filter(
				(log) =>
					log.endpoint.toLowerCase().includes(searchLower) ||
					(log.resource_id?.toLowerCase().includes(searchLower) ?? false),
			);
		}

		return result;
	}, [logs, search]);

	// Navigation handler
	const handleLogNavigate = useCallback(
		(log: ActivityLog) => {
			if (log.resource_id?.startsWith("vj_")) {
				push(`/bulk/${log.resource_id}`);
				return;
			}

			const enrichment = log.resource_id
				? verificationMap.get(log.resource_id)
				: undefined;
			if (enrichment?.resultId) {
				push(`/playground/verify/${enrichment.resultId}`);
			}
		},
		[push, verificationMap],
	);

	const formatDate = useCallback((dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}, []);

	const handleToggleExpand = useCallback(
		(logId: string) => {
			setExpandedLogId(expandedLogId === logId ? null : logId);
		},
		[expandedLogId],
	);

	const handleFiltersChange = useCallback(
		(newFilters: LogsFiltersType) => {
			setFilters(newFilters);
			fetchLogs(1);
		},
		[fetchLogs],
	);

	const handlePageSizeChange = useCallback(
		(size: number) => {
			setPagination((prev) => ({ ...prev, limit: size }));
			fetchLogs(1);
		},
		[fetchLogs],
	);

	const handleResetFilters = useCallback(() => {
		setFilters({
			status: [],
			verificationState: [],
			services: [],
			dateRange: "3d",
		});
		fetchLogs(1);
	}, [fetchLogs]);

	return (
		<div className="h-full overflow-hidden">
			<div
				className={cn(
					"h-full",
					isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32",
				)}
			>
				<div className="h-full border-stroke-soft-200/50 border-r border-l">
					{/* Header Section */}
					<div className="relative">
						<LogsHeader />
						{/* Bottom border extending to both edges */}
						<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
					</div>

					{/* Content */}
					<div className="flex h-[calc(100%-100px)] flex-col">
						{/* Filters */}
						<LogsFilterBar
							search={search}
							onSearchChange={setSearch}
							filters={filters}
							onFiltersChange={handleFiltersChange}
							onReset={handleResetFilters}
						/>

						{/* Table Header */}
						<LogsTableHeader developerMode={true} />

						{/* Logs List */}
						<div className="flex-1 overflow-y-auto">
							<LogsStates
								loading={loading}
								error={error}
								filteredLogsCount={filteredLogs.length}
								search={search}
								onRetry={() => fetchLogs(1)}
							/>
							{!loading && !error && filteredLogs.length > 0 && (
								<LogsList
									logs={filteredLogs}
									developerMode={true}
									expandedLogId={expandedLogId}
									onToggleExpand={handleToggleExpand}
									verificationMap={verificationMap}
									bulkJobMap={bulkJobMap}
									formatDate={formatDate}
									onNavigate={handleLogNavigate}
								/>
							)}
						</div>

						{/* Pagination */}
						{!loading && !error && logs.length > 0 && (
							<LogsPagination
								pagination={pagination}
								onPageChange={fetchLogs}
								onPageSizeChange={handlePageSizeChange}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LogsPage;
