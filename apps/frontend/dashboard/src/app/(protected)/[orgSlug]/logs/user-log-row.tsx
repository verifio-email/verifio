"use client";

import {
	getStateColor,
	getStateIcon,
} from "@fe/dashboard/utils/verification-state";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { useCallback } from "react";
import { EmailAvatar } from "../playground/components/email-avatar";
import type { ActivityLog, BulkJobInfo, VerificationEnrichment } from "./types";

type UserLogRowProps = {
	log: ActivityLog;
	onNavigate?: (log: ActivityLog) => void;
	formatDate: (date: string) => string;
	enrichment?: VerificationEnrichment;
	bulkJobInfo?: BulkJobInfo;
};

// Helper to extract state from log result (fallback when no enrichment)
// log.result is a simple string like "deliverable", "undeliverable", "risky"
const getStateFromLog = (log: ActivityLog): string | null => {
	if (!log.result) return null;
	// log.result is already the state string (e.g., "deliverable")
	const validStates = ["deliverable", "undeliverable", "risky", "unknown"];
	const result = log.result.toLowerCase();
	return validStates.includes(result) ? result : null;
};

export function UserLogRow({
	log,
	onNavigate,
	formatDate,
	enrichment,
	bulkJobInfo,
}: UserLogRowProps) {
	// Check if this is a bulk verification log
	const isBulkJob = log.resource_id?.startsWith("vj_");
	const isClickable =
		(log.service === "verify" && log.resource_id) || (isBulkJob && bulkJobInfo);

	// Use enrichment data when available, fallback to log.result for state
	const score = enrichment?.score ?? null;
	const state = enrichment?.state ?? getStateFromLog(log);

	const handleNavigate = useCallback(() => {
		if (isClickable && onNavigate) {
			onNavigate(log);
		}
	}, [isClickable, onNavigate, log]);

	// Get display name for the log entry
	const displayName = isBulkJob
		? bulkJobInfo?.name || `Bulk Job ${log.resource_id?.slice(0, 8)}…`
		: log.resource_id;

	return (
		<div
			className={cn(
				"flex w-full items-center justify-between border-stroke-soft-200/50 border-b px-6 py-3 transition-colors hover:bg-bg-weak-50/50",
				isClickable && "cursor-pointer",
			)}
			onClick={handleNavigate}
			role={isClickable ? "button" : undefined}
			tabIndex={isClickable ? 0 : undefined}
			onKeyDown={(e) => {
				if (isClickable && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault();
					handleNavigate();
				}
			}}
		>
			{/* Left side: Avatar/Icon + Name */}
			<div className="flex flex-1 items-center gap-2">
				{isBulkJob ? (
					// Bulk job icon and styling
					<>
						<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-alpha-10">
							<Icon name="file-upload" className="h-4 w-4 text-primary-base" />
						</div>
						<div className="flex flex-col">
							<span className="text-sm text-text-sub-600">{displayName}</span>
							{bulkJobInfo && (
								<span className="text-text-soft-400 text-xs">
									{bulkJobInfo?.totalEmails} emails • Bulk Verification
								</span>
							)}
						</div>
					</>
				) : log.resource_id ? (
					// Regular email verification
					<>
						<div
							className={cn(
								"flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
								state === "deliverable"
									? "bg-success-alpha-10"
									: state === "risky"
										? "bg-warning-alpha-10"
										: "bg-error-alpha-10",
							)}
						>
							<EmailAvatar email={log.resource_id} className="h-5 w-5" />
						</div>
						<span className="text-sm text-text-sub-600">{log.resource_id}</span>
					</>
				) : (
					// Fallback for entries without resource_id
					<span className="text-sm text-text-soft-400">-</span>
				)}
			</div>

			{/* Right side: Verified At, Credit, Status, Score */}
			<div className="flex items-center gap-12">
				{/* Verified At */}
				<span className="w-[220px] text-sm text-text-sub-600">
					{formatDate(log.created_at)}
				</span>

				{/* Credit Used */}
				<span className="w-[80px] text-sm text-text-sub-600">
					{log.credits_used !== null
						? `${log.credits_used} credit${log.credits_used !== 1 ? "s" : ""}`
						: "-"}
				</span>

				{/* Status with icon */}
				{isBulkJob ? (
					// Bulk job status
					<span className="flex w-[132px] items-center gap-1.5 text-primary-base text-sm">
						<Icon name="check-circle" className="h-3.5 w-3.5 shrink-0" />
						{bulkJobInfo?.status || "completed"}
					</span>
				) : state ? (
					<span
						className={cn(
							"flex w-[120px] items-center gap-1.5 text-sm",
							getStateColor(state),
						)}
					>
						<Icon name={getStateIcon(state)} className="h-3.5 w-3.5 shrink-0" />
						{state}
					</span>
				) : (
					<span className="w-[100px] text-sm text-text-soft-400">-</span>
				)}

				{/* Score */}
				{isBulkJob ? (
					// Bulk jobs don't have a single score
					<span className="text-sm text-text-soft-400">-</span>
				) : score !== null ? (
					<span
						className={cn(
							"font-semibold text-sm tabular-nums",
							state ? getStateColor(state) : "text-text-strong-950",
						)}
					>
						{score}
					</span>
				) : (
					<span className="text-sm text-text-soft-400">-</span>
				)}
			</div>
		</div>
	);
}
