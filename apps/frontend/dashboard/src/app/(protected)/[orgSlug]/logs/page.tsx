"use client";

import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import * as Select from "@verifio/ui/select";
import { useCallback, useEffect, useState } from "react";

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
	const [serviceFilter, setServiceFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [dateRange, setDateRange] = useState<string>("7d");

	const fetchLogs = useCallback(
		async (page = 1) => {
			setLoading(true);
			try {
				const params = new URLSearchParams();
				params.set("organization_id", activeOrganization.id);
				params.set("page", String(page));
				params.set("limit", String(pagination.limit));

				if (search) params.set("search", search);
				if (serviceFilter && serviceFilter !== "all")
					params.set("service", serviceFilter);
				if (statusFilter && statusFilter !== "all")
					params.set("status", statusFilter);

				// Date range filter
				if (dateRange !== "all") {
					const now = new Date();
					let from: Date;
					switch (dateRange) {
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
		[
			activeOrganization.id,
			search,
			serviceFilter,
			statusFilter,
			dateRange,
			pagination.limit,
		],
	);

	useEffect(() => {
		fetchLogs(1);
	}, [activeOrganization.id, serviceFilter, statusFilter, dateRange]);

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
		<div className="flex-1 overflow-y-auto p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-semibold text-2xl text-text-strong-950">
					Activity Logs
				</h1>
				<p className="mt-1 text-text-sub-600">
					Track all your API requests and view detailed activity logs
				</p>
			</div>

			{/* Filters */}
			<div className="mb-6 flex flex-wrap items-center gap-4">
				{/* Search */}
				<div className="min-w-[240px] max-w-xs flex-1">
					<Input.Root>
						<Input.Wrapper>
							<Input.Icon>
								<Icon name="search" className="h-4 w-4" />
							</Input.Icon>
							<Input.Input
								placeholder="Search by email..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							/>
						</Input.Wrapper>
					</Input.Root>
				</div>

				{/* Service Filter */}
				<Select.Root value={serviceFilter} onValueChange={setServiceFilter}>
					<Select.Trigger className="w-[140px]">
						<Select.Value placeholder="Service" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="all">All Services</Select.Item>
						<Select.Item value="verify">Verify</Select.Item>
						<Select.Item value="api-key">API Key</Select.Item>
						<Select.Item value="auth">Auth</Select.Item>
						<Select.Item value="workflow">Workflow</Select.Item>
						<Select.Item value="upload">Upload</Select.Item>
					</Select.Content>
				</Select.Root>

				{/* Status Filter */}
				<Select.Root value={statusFilter} onValueChange={setStatusFilter}>
					<Select.Trigger className="w-[140px]">
						<Select.Value placeholder="Status" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="all">All Status</Select.Item>
						<Select.Item value="success">Success</Select.Item>
						<Select.Item value="failed">Failed</Select.Item>
						<Select.Item value="error">Error</Select.Item>
					</Select.Content>
				</Select.Root>

				{/* Date Range */}
				<Select.Root value={dateRange} onValueChange={setDateRange}>
					<Select.Trigger className="w-[140px]">
						<Icon name="calendar" className="mr-2 h-4 w-4" />
						<Select.Value placeholder="Date" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="24h">Last 24 hours</Select.Item>
						<Select.Item value="7d">Last 7 days</Select.Item>
						<Select.Item value="30d">Last 30 days</Select.Item>
						<Select.Item value="all">All time</Select.Item>
					</Select.Content>
				</Select.Root>

				{/* Refresh */}
				<Button.Root
					variant="neutral"
					mode="stroke"
					size="small"
					onClick={() => fetchLogs(pagination.page)}
				>
					<Icon name="refresh-ccw" className="h-4 w-4" />
				</Button.Root>
			</div>

			{/* Table */}
			<div className="rounded-xl border border-stroke-soft-200 bg-white">
				{loading ? (
					<div className="flex items-center justify-center py-16">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-base border-t-transparent" />
					</div>
				) : logs.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16">
						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-weak-50">
							<Icon name="file-text" className="h-8 w-8 text-text-sub-600" />
						</div>
						<h2 className="mb-2 font-medium text-text-strong-950">
							No logs found
						</h2>
						<p className="text-text-sub-600">
							Activity logs will appear here once you make API requests.
						</p>
					</div>
				) : (
					<>
						{/* Table Header */}
						<div className="grid grid-cols-[1fr_1.5fr_100px_80px_120px_60px] gap-4 border-stroke-soft-200 border-b bg-bg-weak-50 px-6 py-3">
							<div className="font-medium text-text-sub-600 text-xs uppercase tracking-wide">
								Endpoint
							</div>
							<div className="font-medium text-text-sub-600 text-xs uppercase tracking-wide">
								Resource
							</div>
							<div className="font-medium text-text-sub-600 text-xs uppercase tracking-wide">
								Status
							</div>
							<div className="font-medium text-text-sub-600 text-xs uppercase tracking-wide">
								Credits
							</div>
							<div className="font-medium text-text-sub-600 text-xs uppercase tracking-wide">
								Time
							</div>
							<div className="font-medium text-text-sub-600 text-xs uppercase tracking-wide">
								Duration
							</div>
						</div>

						{/* Table Rows */}
						{logs.map((log) => (
							<div
								key={log.id}
								className="grid grid-cols-[1fr_1.5fr_100px_80px_120px_60px] items-center gap-4 border-stroke-soft-200 border-b px-6 py-4 last:border-b-0 hover:bg-bg-weak-50"
							>
								{/* Endpoint */}
								<div className="flex items-center gap-2">
									<span className="rounded bg-bg-weak-50 px-1.5 py-0.5 font-mono text-text-sub-600 text-xs">
										{log.method}
									</span>
									<span className="truncate font-medium text-sm text-text-strong-950">
										{log.endpoint}
									</span>
								</div>

								{/* Resource */}
								<div className="truncate text-sm text-text-sub-600">
									{log.resource_id || "-"}
								</div>

								{/* Status */}
								<div>{getStatusBadge(log.status)}</div>

								{/* Credits */}
								<div className="text-sm text-text-strong-950">
									{log.credits_used ?? "-"}
								</div>

								{/* Time */}
								<div className="text-sm text-text-sub-600">
									{formatDate(log.created_at)}
								</div>

								{/* Duration */}
								<div className="text-sm text-text-sub-600">
									{log.duration_ms ? `${log.duration_ms}ms` : "-"}
								</div>
							</div>
						))}
					</>
				)}
			</div>

			{/* Pagination */}
			{!loading && logs.length > 0 && (
				<div className="mt-4 flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm text-text-sub-600">
						<span>
							Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
							{Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
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
			)}
		</div>
	);
};

export default LogsPage;
