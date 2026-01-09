"use client";

import {
	getStateColor,
	getStateIcon,
} from "@fe/dashboard/utils/verification-state";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { EmailAvatar } from "../playground/components/email-avatar";
import type { ActivityLog, VerificationEnrichment } from "./types";

type UserLogRowProps = {
	log: ActivityLog;
	onNavigate?: (log: ActivityLog) => void;
	formatDate: (date: string) => string;
	enrichment?: VerificationEnrichment;
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
}: UserLogRowProps) {
	const isClickable = log.service === "verify" && log.resource_id;

	// Use enrichment data when available, fallback to log.result for state
	const score = enrichment?.score ?? null;
	const state = enrichment?.state ?? getStateFromLog(log);

	const handleNavigate = () => {
		if (isClickable && onNavigate) {
			onNavigate(log);
		}
	};

	return (
		<div
			className={cn(
				"flex w-full items-center justify-between border-stroke-soft-200/50 border-b px-6 py-3 transition-colors hover:bg-bg-weak-50/50",
				isClickable && "cursor-pointer",
			)}
			onClick={handleNavigate}
		>
			{/* Left side: Avatar + Email */}
			<div className="flex items-center gap-2">
				{log.resource_id && (
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
				)}
			</div>

			{/* Right side: Verified At, Status, Score */}
			<div className="flex items-center gap-20">
				{/* Verified At */}
				<span className="text-sm text-text-sub-600">
					{formatDate(log.created_at)}
				</span>

				{/* Status with icon */}
				{state ? (
					<span
						className={cn(
							"flex w-[100px] items-center gap-1.5 text-sm",
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
				{score !== null ? (
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
