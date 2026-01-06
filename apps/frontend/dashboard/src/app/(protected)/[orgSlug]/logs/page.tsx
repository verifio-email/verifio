"use client";

import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { useCallback, useEffect, useState } from "react";
import { LogsFilterDropdown, type LogsFilters } from "./logs-filter-dropdown";

type ActivityLog = {
	id: string;
	user_id: string | null;
	organization_id: string;
	api_key_id: string | null;
	service: string;
	endpoint: string;
	method: string;
	resource_type: string | null;
	resource_id: string | null;
	status: string;
	result: string | null;
	error_message: string | null;
	credits_used: number | null;
	duration_ms: number | null;
	ip_address: string | null;
	user_agent: string | null;
	metadata: Record<string, unknown>;
	created_at: string;
};

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
	const { activeOrganization } = useUserOrganization();
	const { isCollapsed } = useSidebar();
	const [logs, setLogs] = useState<ActivityLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 20,
		total: 0,
		total_pages: 0,
	});

	// Filters
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<LogsFilters>({
		status: [],
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

				if (search) params.set("search", search);
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
		[activeOrganization.id, search, filters, pagination.limit],
	);

	useEffect(() => {
		fetchLogs(1);
	}, [activeOrganization.id, filters]);

	const handleSearch = () => {
		fetchLogs(1);
	};

	const handlePageChange = (page: number) => {
		fetchLogs(page);
	};

	const handlePageSizeChange = (size: number) => {
		setPagination((prev) => ({ ...prev, limit: size }));
	};

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
								<h3 className="font-medium text-label-md text-text-strong-950">
									Request Logs
								</h3>
								<div className="flex items-center gap-3">
									{/* Search - Full width matching Team page */}
									<div className="flex-1">
										<Input.Root size="xsmall" className="w-56">
											<Input.Wrapper>
												<Input.Icon as={Icon} name="search" size="xsmall" />
												<Input.Input
													placeholder="Search by email or endpoint"
													value={search}
													onChange={(e) => setSearch(e.target.value)}
													onKeyDown={(e) => e.key === "Enter" && handleSearch()}
												/>
											</Input.Wrapper>
										</Input.Root>
									</div>
									{/* Filter Dropdown - Matching Team page style */}
									<LogsFilterDropdown value={filters} onChange={setFilters} />
								</div>
							</div>
						</div>

						{/* Logs List - Scrollable */}
						<div className="flex-1 overflow-y-auto">
							{loading ? (
								<div className="w-full">
									{Array.from({ length: 5 }).map((_, i) => (
										<div key={i} className="border-stroke-soft-200/50 border-b">
											<div className="flex items-center justify-between px-6 py-4">
												<div className="space-y-2">
													<div className="h-4 w-32 animate-pulse rounded bg-bg-weak-100" />
													<div className="h-3 w-48 animate-pulse rounded bg-bg-weak-100" />
												</div>
												<div className="h-6 w-20 animate-pulse rounded bg-bg-weak-100" />
											</div>
										</div>
									))}
								</div>
							) : logs.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-16">
									<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-weak-50">
										<Icon
											name="file-text"
											className="h-8 w-8 text-text-sub-600"
										/>
									</div>
									<h2 className="mb-2 font-medium text-text-strong-950">
										No logs found
									</h2>
									<p className="text-text-sub-600">
										Make some API requests to see them here.
									</p>
								</div>
							) : (
								<div>
									{logs.map((log) => (
										<div
											key={log.id}
											className="border-stroke-soft-200/50 border-b"
										>
											<div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-bg-weak-50/50">
												{/* Left Section: Context */}
												<div className="flex items-center gap-4">
													{/* Method Badge */}
													<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stroke-soft-200/40 bg-bg-weak-50">
														<span className="font-mono font-semibold text-text-sub-600 text-xs">
															{log.method}
														</span>
													</div>

													<div>
														<div className="flex items-center gap-2">
															<p className="font-medium font-mono text-sm text-text-strong-950">
																{log.endpoint}
															</p>
															{log.resource_id && (
																<span className="rounded-full border border-stroke-soft-200/50 bg-bg-weak-50 px-2 py-0.5 text-[10px] text-text-sub-600">
																	{log.resource_id}
																</span>
															)}
														</div>
														<div className="mt-0.5 flex items-center gap-2">
															<span className="text-text-sub-600 text-xs">
																{formatDate(log.created_at)}
															</span>
															<span className="text-text-disabled-300 text-xs">
																•
															</span>
															<span className="text-text-sub-600 text-xs">
																{log.duration_ms ? `${log.duration_ms}ms` : "-"}
															</span>
															{log.credits_used !== null && (
																<>
																	<span className="text-text-disabled-300 text-xs">
																		•
																	</span>
																	<span className="text-text-sub-600 text-xs">
																		{log.credits_used} credits
																	</span>
																</>
															)}
														</div>
													</div>
												</div>

												{/* Right Section: Status */}
												<div className="flex items-center gap-4">
													{getStatusBadge(log.status)}
												</div>
											</div>
										</div>
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
