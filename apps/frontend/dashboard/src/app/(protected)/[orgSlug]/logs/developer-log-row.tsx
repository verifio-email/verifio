"use client";

import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { Skeleton } from "@verifio/ui/skeleton";
import useSWR from "swr";
import { LogJsonViewer } from "./log-json-viewer";
import type { ActivityLog, VerificationEnrichment } from "./types";

type DeveloperLogRowProps = {
	log: ActivityLog;
	onNavigate?: (log: ActivityLog) => void;
	formatDate: (date: string) => string;
	isExpanded: boolean;
	onToggle: () => void;
	enrichment?: VerificationEnrichment;
};

const getMethodColor = (method: string) => {
	switch (method.toUpperCase()) {
		case "GET":
			return "border-green-200 bg-green-50 text-green-600 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400";
		case "POST":
			return "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400";
		case "PUT":
			return "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400";
		case "PATCH":
			return "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-400";
		case "DELETE":
			return "border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400";
		case "HEAD":
			return "border-green-200 bg-green-50 text-green-600 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400";
		case "OPTIONS":
			return "border-pink-200 bg-pink-50 text-pink-600 dark:border-pink-500/30 dark:bg-pink-500/10 dark:text-pink-400";
		default:
			return "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-500/30 dark:bg-gray-500/10 dark:text-gray-400";
	}
};

const getStatusBadge = (status: string) => {
	switch (status) {
		case "success":
			return (
				<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 font-medium text-[11px] text-green-700 dark:bg-green-500/10 dark:text-green-400">
					Success
				</span>
			);
		case "failed":
			return (
				<span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 font-medium text-[11px] text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
					Failed
				</span>
			);
		case "error":
			return (
				<span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 font-medium text-[11px] text-red-700 dark:bg-red-500/10 dark:text-red-400">
					Error
				</span>
			);
		default:
			return (
				<span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-[11px] text-gray-700 dark:bg-gray-500/10 dark:text-gray-400">
					{status}
				</span>
			);
	}
};

export function DeveloperLogRow({
	log,
	onNavigate,
	formatDate,
	isExpanded,
	onToggle,
	enrichment,
}: DeveloperLogRowProps) {
	const isClickable = log.service === "verify" && log.resource_id;

	// Fetch full verification result when expanded and we have a resultId
	const { data: fullResult, isLoading: isLoadingResult } = useSWR<{
		success: boolean;
		data: Record<string, unknown>;
	}>(
		isExpanded && enrichment?.resultId
			? `/api/verify/v1/results/${enrichment.resultId}`
			: null,
		{ revalidateOnFocus: false },
	);

	const handleNavigate = () => {
		if (isClickable && onNavigate) {
			onNavigate(log);
		}
	};

	// Build request object like Postman
	const getRequestObject = () => {
		const request: Record<string, unknown> = {
			method: log.method,
			endpoint: log.endpoint,
		};
		if (log.resource_id) {
			request.email = log.resource_id;
		}
		if (log.ip_address) {
			request.ip_address = log.ip_address;
		}
		if (Object.keys(log.metadata).length > 0) {
			request.metadata = log.metadata;
		}
		return request;
	};

	// Get response object - prefer full result from API, fallback to log.result
	const getResponseObject = () => {
		// If we have the full result from the API, use it
		if (fullResult?.data) {
			return {
				success: true,
				data: fullResult.data,
			};
		}

		// Fallback to original behavior
		if (log.error_message) {
			return { error: log.error_message };
		}
		if (!log.result) return null;
		try {
			return JSON.parse(log.result);
		} catch {
			return { raw: log.result };
		}
	};

	return (
		<div className="border-stroke-soft-200/50 border-b">
			{/* Main Row */}
			<div
				className={cn(
					"grid w-full grid-cols-[70px_140px_1fr_120px_80px_80px_80px_60px] items-center gap-3 px-6 py-3 transition-colors hover:bg-bg-weak-50/50",
					isClickable && "cursor-pointer",
				)}
				onClick={handleNavigate}
			>
				{/* Method Badge */}
				<div>
					<span
						className={cn(
							"inline-flex items-center justify-center rounded-full border px-2 py-0.5 font-medium font-mono text-[10px]",
							getMethodColor(log.method),
						)}
					>
						{log.method}
					</span>
				</div>

				{/* Endpoint */}
				<div>
					{isClickable ? (
						<button
							type="button"
							onClick={handleNavigate}
							className="font-mono text-[14px] text-primary-base"
						>
							{log.endpoint}
						</button>
					) : (
						<span className="font-mono text-[14px] text-text-strong-950">
							{log.endpoint}
						</span>
					)}
				</div>

				{/* Email ID */}
				<div className="min-w-0">
					{log.resource_id && (
						<span className="block truncate text-sm text-text-sub-600">
							{log.resource_id}
						</span>
					)}
				</div>

				{/* Verified At */}
				<div className="text-sm text-text-sub-600">
					{formatDate(log.created_at)}
				</div>

				{/* Credit Used */}
				<div className="text-sm text-text-sub-600">
					{log.credits_used !== null
						? `${log.credits_used} credit${log.credits_used !== 1 ? "s" : ""}`
						: "-"}
				</div>

				{/* Duration */}
				<div className="text-right font-mono text-sm text-text-sub-600">
					{log.duration_ms ? `${log.duration_ms}ms` : "-"}
				</div>

				{/* Status */}
				<div className="flex justify-center">{getStatusBadge(log.status)}</div>

				{/* Action - Navigation & Expand Buttons */}
				<div className="flex items-center justify-end gap-1">
					{isClickable && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleNavigate();
							}}
							className="flex h-6 w-6 items-center justify-center rounded text-text-sub-600 transition-all hover:bg-bg-weak-100 hover:text-text-strong-950"
							title="View email details"
						>
							<Icon name="arrow-right-02" className="h-3.5 w-3.5" />
						</button>
					)}
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onToggle();
						}}
						className={cn(
							"flex h-6 w-6 items-center justify-center rounded text-text-sub-600 transition-all",
							isExpanded
								? "bg-bg-weak-100 text-text-strong-950"
								: "hover:bg-bg-weak-100 hover:text-text-strong-950",
						)}
						title={isExpanded ? "Hide details" : "View API details"}
					>
						<Icon name="code" className="h-3.5 w-3.5 cursor-pointer" />
					</button>
				</div>
			</div>

			{/* Expandable Content */}
			{isExpanded && (
				<div className="border-stroke-soft-200/30 border-t bg-bg-weak-50/30 px-6 py-4">
					<div className="grid grid-cols-2 gap-6">
						{/* Request Section */}
						<div className="overflow-hidden rounded-lg border border-stroke-soft-200/50">
							<LogJsonViewer
								data={getRequestObject()}
								filename="request.json"
							/>
						</div>

						{/* Response Section */}
						{isLoadingResult ? (
							<div className="overflow-hidden rounded-lg border border-stroke-soft-200/50 p-4">
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-4 w-2/3" />
								</div>
							</div>
						) : getResponseObject() ? (
							<div className="overflow-hidden rounded-lg border border-stroke-soft-200/50">
								<LogJsonViewer
									data={getResponseObject()}
									filename="response.json"
								/>
							</div>
						) : (
							<div className="flex items-center justify-center overflow-hidden rounded-lg border border-stroke-soft-200/50 p-4">
								<span className="text-text-soft-400 text-xs">
									No response data
								</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
