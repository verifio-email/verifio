import type { LogsFilters } from "../logs-filter-dropdown";

export const STATUS_OPTIONS: {
	id: LogsFilters["status"][number];
	label: string;
}[] = [
	{ id: "success", label: "Success" },
	{ id: "failed", label: "Failed" },
	{ id: "error", label: "Error" },
];

export const SERVICE_OPTIONS: {
	id: LogsFilters["services"][number];
	label: string;
}[] = [
	{ id: "verify", label: "Verify" },
	{ id: "api-key", label: "API Key" },
	{ id: "auth", label: "Auth" },
	{ id: "upload", label: "Upload" },
];

export const DATE_RANGE_OPTIONS: {
	id: LogsFilters["dateRange"];
	label: string;
}[] = [
	{ id: "24h", label: "Last 24 hours" },
	{ id: "7d", label: "Last 7 days" },
	{ id: "30d", label: "Last 30 days" },
	{ id: "all", label: "All time" },
];
