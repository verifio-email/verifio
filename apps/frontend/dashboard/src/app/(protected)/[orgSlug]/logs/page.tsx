"use client";

import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DeveloperLogRow } from "./developer-log-row";
import { LogsFilterDropdown, type LogsFilters } from "./logs-filter-dropdown";
import type {
	ActivityLog,
	VerificationEnrichment,
	VerificationHistoryItem,
} from "./types";
import { UserLogRow } from "./user-log-row";

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
	const { activeOrganization, push } = useUserOrganization();
	const { isCollapsed } = useSidebar();
	const [logs, setLogs] = useState<ActivityLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
	const [developerMode, setDeveloperMode] = useState(false);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 20,
		total: 0,
		total_pages: 0,
	});

	// Verification history for enriching user mode display
	const [verificationMap, setVerificationMap] = useState<
		Map<string, VerificationEnrichment>
	>(new Map());

	// Filters
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<LogsFilters>({
		status: [],
		verificationState: [],
		services: [],
		dateRange: "7d",
	});

	const fetchLogs = useCallback(
		async (page = 1) => {
			setLoading(true);
			try {
				const params = new URLSearchParams();
				params.set("organization_id", activeOrganization.id);
				params.set("page", String(page));
				params.set("limit", String(pagination.limit));

				// Note: Search is done client-side for endpoint/path filtering
				// Apply service filters
				if (filters.services.length > 0) {
					params.set("service", filters.services.join(","));
				}
				// Apply status filters
				if (filters.status.length > 0) {
					params.set("status", filters.status.join(","));
				}

				// Date range filter
				if (filters.dateRange !== "all") {
					const now = new Date();
					let from: Date;
					switch (filters.dateRange) {
						case "24h":
							from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
							break;
						case "7d":
							from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
							break;
						case "30d":
							from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
							break;
						default:
							from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
					}
					params.set("from", from.toISOString());
					params.set("to", now.toISOString());
				}

				const response = await fetch(
					`/dashboard/api/logs?${params.toString()}`,
					{ credentials: "include" },
				);
				const data: LogsResponse = await response.json();

				if (data.success) {
					setLogs(data.data);
					setPagination(data.pagination);
				}
			} catch (error) {
				console.error("Failed to fetch logs:", error);
			} finally {
				setLoading(false);
			}
		},
		[activeOrganization.id, filters, pagination.limit],
	);

	useEffect(() => {
		fetchLogs(1);
	}, [fetchLogs]);

	// Fetch verification history when switching to user mode
	useEffect(() => {
		const fetchVerificationHistory = async () => {
			try {
				const response = await fetch("/api/verify/v1/history?limit=100", {
					credentials: "include",
				});
				const data = await response.json();

				if (data.success && data.data?.results) {
					const map = new Map<string, VerificationEnrichment>();
					for (const item of data.data.results as VerificationHistoryItem[]) {
						// Store by email for lookup
						map.set(item.email, {
							resultId: item.id,
							score: item.score,
							state: item.state,
							riskLevel: item.result?.analytics?.riskLevel ?? null,
						});
					}
					setVerificationMap(map);
				}
			} catch (error) {
				console.error("Failed to fetch verification history:", error);
			}
		};

		fetchVerificationHistory();
	}, []);

	const handleSearch = () => {
		fetchLogs(1);
	};

	// Client-side filtering for endpoint/path and verificationState
	const filteredLogs = useMemo(() => {
		let result = logs;

		// Filter by search text
		if (search.trim()) {
			const searchLower = search.toLowerCase();
			result = result.filter(
				(log) =>
					log.endpoint.toLowerCase().includes(searchLower) ||
					(log.resource_id?.toLowerCase().includes(searchLower) ?? false),
			);
		}

		// Filter by verificationState (user mode only)
		if (!developerMode && filters.verificationState.length > 0) {
			result = result.filter((log) => {
				if (!log.resource_id) return false;
				const enrichment = verificationMap.get(log.resource_id);
				if (!enrichment) return false;
				return filters.verificationState.includes(
					enrichment.state as "deliverable" | "risky" | "undeliverable",
				);
			});
		}

		return result;
	}, [logs, search, developerMode, filters.verificationState, verificationMap]);

	const handlePageChange = (page: number) => {
		fetchLogs(page);
	};

	const handlePageSizeChange = (size: number) => {
		setPagination((prev) => ({ ...prev, limit: size }));
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
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
								Activity Logs
							</h1>
							<p className="text-paragraph-md text-text-sub-600">
								Track all your API requests and view detailed activity logs
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Content Area with vertical borders extending to bottom */}
			<div className="flex-1 overflow-hidden">
				<div
					className={cn(
						"h-full",
						isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32",
					)}
				>
					<div className="flex h-full flex-col border-stroke-soft-200/50 border-r border-l">
						{/* Filters Section */}
						<div className="relative border-stroke-soft-200/50 border-b">
							<div className="flex items-center justify-between gap-3 px-5 py-4 lg:px-6">
								<div className="flex items-center gap-3">
									{/* Search - Full width matching Team page */}
									<div className="flex-1">
										<Input.Root size="xsmall" className="w-56">
											<Input.Wrapper>
												<Input.Icon as={Icon} name="search" size="xsmall" />
												<Input.Input
													placeholder="Search by email, path or endpoint"
													value={search}
													onChange={(e) => setSearch(e.target.value)}
													onKeyDown={(e) => e.key === "Enter" && handleSearch()}
												/>
											</Input.Wrapper>
										</Input.Root>
									</div>
									{/* Filter Dropdown - Matching Team page style */}
									<LogsFilterDropdown
										value={filters}
										onChange={setFilters}
										isDeveloperMode={developerMode}
									/>
								</div>
								{/* Developer Mode Toggle */}
								<Button.Root
									type="button"
									size="xsmall"
									variant={developerMode ? "primary" : "neutral"}
									mode={developerMode ? "filled" : "stroke"}
									onClick={() => setDeveloperMode(!developerMode)}
									title={
										developerMode
											? "Switch to User View"
											: "Switch to Developer View"
									}
								>
									<Button.Icon as={Icon} name="code" />
								</Button.Root>
							</div>
						</div>

						{/* Table Header */}
						<div className="border-stroke-soft-200/50 border-b bg-bg-weak-50/50">
							{developerMode ? (
								<div className="grid grid-cols-[70px_140px_1fr_120px_80px_80px_80px_60px] items-center gap-3 px-6 py-3 text-[11px] text-text-sub-600 uppercase tracking-wide">
									<div className="font-semibold">Method</div>
									<div className="font-semibold">Endpoint</div>
									<div className="font-semibold">Email ID</div>
									<div className="font-semibold">Verified At</div>
									<div className="font-semibold">Credit</div>
									<div className="text-right font-semibold">Duration</div>
									<div />
								</div>
							) : (
								<div className="flex items-center justify-between px-6 py-3 text-[11px] text-text-sub-600 uppercase tracking-wide">
									<div className="font-semibold">Email</div>
									<div className="flex items-center gap-12">
										<span className="w-[220px] font-semibold">Verified At</span>
										<span className="w-[80px] font-semibold">Credit</span>
										<span className="w-[100px] font-semibold">Status</span>
										<span className="font-semibold">Score</span>
									</div>
								</div>
							)}
						</div>

						{/* Logs List - Scrollable */}
						<div className="flex-1 overflow-y-auto">
							{loading ? (
								<div className="w-full">
									{Array.from({ length: 5 }).map((_, i) => (
										<div key={i} className="border-stroke-soft-200/50 border-b">
											<div className="grid grid-cols-[70px_180px_1fr_80px_80px_40px] items-center gap-4 px-6 py-4">
												<div className="h-6 w-14 animate-pulse rounded-full bg-bg-weak-100" />
												<div className="h-4 w-24 animate-pulse rounded bg-bg-weak-100" />
												<div className="flex items-center gap-3">
													<div className="h-4 w-32 animate-pulse rounded bg-bg-weak-100" />
													<div className="h-3 w-24 animate-pulse rounded bg-bg-weak-100" />
												</div>
												<div className="ml-auto h-4 w-12 animate-pulse rounded bg-bg-weak-100" />
												<div className="mx-auto h-5 w-16 animate-pulse rounded-full bg-bg-weak-100" />
												<div />
											</div>
										</div>
									))}
								</div>
							) : filteredLogs.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-16">
									<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-weak-50">
										<Icon
											name="file-text"
											className="h-8 w-8 text-text-sub-600"
										/>
									</div>
									<h2 className="mb-2 font-medium text-text-strong-950">
										{search ? "No matching logs found" : "No logs found"}
									</h2>
									<p className="text-text-sub-600">
										{search
											? "Try a different search term."
											: "Make some API requests to see them here."}
									</p>
								</div>
							) : developerMode ? (
								<div>
									{filteredLogs.map((log) => (
										<DeveloperLogRow
											key={log.id}
											log={log}
											formatDate={formatDate}
											isExpanded={expandedLogId === log.id}
											onToggle={() =>
												setExpandedLogId(
													expandedLogId === log.id ? null : log.id,
												)
											}
											enrichment={
												log.resource_id
													? verificationMap.get(log.resource_id)
													: undefined
											}
											onNavigate={() => {
												const en = log.resource_id
													? verificationMap.get(log.resource_id)
													: undefined;
												if (en?.resultId)
													push(`/playground/verify/${en.resultId}`);
											}}
										/>
									))}
								</div>
							) : (
								<div>
									{filteredLogs.map((log) => (
										<UserLogRow
											key={log.id}
											log={log}
											formatDate={formatDate}
											enrichment={
												log.resource_id
													? verificationMap.get(log.resource_id)
													: undefined
											}
											onNavigate={() => {
												const en = log.resource_id
													? verificationMap.get(log.resource_id)
													: undefined;
												if (en?.resultId)
													push(`/playground/verify/${en.resultId}`);
											}}
										/>
									))}
								</div>
							)}
						</div>

						{/* Pagination */}
						{!loading && logs.length > 0 && (
							<div className="border-stroke-soft-200/50 border-t">
								<div className="flex items-center justify-between px-6 py-4">
									<div className="flex items-center gap-2 text-sm text-text-sub-600">
										<span>
											Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
											{Math.min(
												pagination.page * pagination.limit,
												pagination.total,
											)}{" "}
											of {pagination.total}
										</span>
										<PageSizeDropdown
											value={pagination.limit}
											onValueChange={handlePageSizeChange}
										/>
									</div>
									<PaginationControls
										currentPage={pagination.page}
										totalPages={pagination.total_pages}
										onPageChange={handlePageChange}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LogsPage;
