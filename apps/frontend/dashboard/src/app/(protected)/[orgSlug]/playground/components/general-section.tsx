"use client";

import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { useEffect, useRef, useState } from "react";

interface GeneralSectionProps {
	state: string;
	reason: string;
	domain: string;
	user?: string;
	tag?: string | null;
	didYouMean?: string;
	riskLevel?: "low" | "medium" | "high" | null;
}

export function GeneralSection({
	state,
	reason,
	domain,
	user,
	tag,
	didYouMean,
	riskLevel,
}: GeneralSectionProps) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
	const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
	const rafRef = useRef<number>(0);

	useEffect(() => {
		if (hoveredIndex !== null && rowRefs.current[hoveredIndex]) {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
			rafRef.current = requestAnimationFrame(() => {
				const row = rowRefs.current[hoveredIndex];
				if (row) {
					const { offsetTop, offsetHeight } = row;
					setIndicatorStyle({ top: offsetTop, height: offsetHeight });
				}
			});
		}
	}, [hoveredIndex]);

	useEffect(() => {
		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	const ROW_STATE = 0;
	const ROW_REASON = 1;
	const ROW_DOMAIN = 2;
	const ROW_USER = 3;
	const ROW_TAG = 4;
	const ROW_RISK = 5;
	const ROW_DID_YOU_MEAN = 6;

	return (
		<div>
			<h4 className="flex items-center gap-2 border-stroke-soft-200/50 border-b px-6 py-4 font-semibold text-sm text-text-strong-950">
				<Icon name="info" className="h-4 w-4 text-primary-base" />
				General
			</h4>
			<div
				className="relative divide-y divide-stroke-soft-100/60"
				onMouseLeave={() => setHoveredIndex(null)}
			>
				{/* Animated hover indicator */}
				<div
					className={`pointer-events-none absolute inset-x-0 bg-bg-soft-200/50 transition-all duration-200 ease-out ${
						hoveredIndex !== null ? "opacity-100" : "opacity-0"
					}`}
					style={{
						top: `${indicatorStyle.top}px`,
						height: `${indicatorStyle.height}px`,
					}}
					aria-hidden="true"
				/>
				<div
					ref={(el) => {
						rowRefs.current[ROW_STATE] = el;
					}}
					onMouseEnter={() => setHoveredIndex(ROW_STATE)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="activity" className="h-4 w-4" />
						State
					</span>
					<span
						className={`flex items-center gap-1.5 font-medium text-sm ${
							state === "deliverable"
								? "text-green-600 dark:text-green-500"
								: state === "risky"
									? "text-warning-base"
									: "text-red-600 dark:text-red-500"
						}`}
					>
						<Icon
							name={
								state === "deliverable"
									? "check-circle"
									: state === "risky"
										? "alert-triangle"
										: "cross-circle"
							}
							className="h-3.5 w-3.5"
						/>
						{state === "deliverable"
							? "Deliverable"
							: state.charAt(0).toUpperCase() + state.slice(1)}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[ROW_REASON] = el;
					}}
					onMouseEnter={() => setHoveredIndex(ROW_REASON)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="alert-circle" className="h-4 w-4" />
						Reason
					</span>
					<span className="rounded-md bg-blue-50 px-2.5 py-1 font-medium text-blue-700 text-xs dark:bg-blue-950/40 dark:text-blue-400">
						{reason ? reason.toUpperCase().replace(/_/g, " ") : "—"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[ROW_DOMAIN] = el;
					}}
					onMouseEnter={() => setHoveredIndex(ROW_DOMAIN)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="globe" className="h-4 w-4" />
						Domain
					</span>
					{domain ? (
						<a
							href={`https://${domain}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm underline transition-colors hover:text-text-strong-950 hover:decoration-primary-base"
						>
							{domain}
						</a>
					) : (
						<span className="text-sm text-text-sub-600">—</span>
					)}
				</div>
				<div
					ref={(el) => {
						rowRefs.current[ROW_USER] = el;
					}}
					onMouseEnter={() => setHoveredIndex(ROW_USER)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="user" className="h-4 w-4" />
						User
					</span>
					<span className="font-medium text-sm text-text-strong-950">
						{user || "—"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[ROW_TAG] = el;
					}}
					onMouseEnter={() => setHoveredIndex(ROW_TAG)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="hash" className="h-4 w-4" />
						Tag
					</span>
					<span className="text-sm text-text-strong-950">{tag || "—"}</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[ROW_RISK] = el;
					}}
					onMouseEnter={() => setHoveredIndex(ROW_RISK)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="alert-triangle" className="h-4 w-4" />
						Risk Level
					</span>
					{riskLevel ? (
						<span
							className={cn(
								"rounded px-2 py-0.5 font-medium text-sm capitalize",
								riskLevel === "low"
									? "bg-success-alpha-10 text-success-base"
									: riskLevel === "medium"
										? "bg-warning-alpha-10 text-warning-base"
										: "bg-error-alpha-10 text-error-base",
							)}
						>
							{riskLevel}
						</span>
					) : (
						<span className="text-sm text-text-sub-600">—</span>
					)}
				</div>
				{didYouMean && (
					<div
						ref={(el) => {
							rowRefs.current[ROW_DID_YOU_MEAN] = el;
						}}
						onMouseEnter={() => setHoveredIndex(ROW_DID_YOU_MEAN)}
						className="relative flex items-center justify-between px-6 py-3"
					>
						<span className="flex items-center gap-2 text-sm text-text-sub-600">
							<Icon name="help-circle" className="h-4 w-4" />
							Did you mean
						</span>
						<span className="font-mono text-sm text-text-strong-950">
							{didYouMean}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
