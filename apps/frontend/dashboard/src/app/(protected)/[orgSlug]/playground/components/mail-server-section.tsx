"use client";

import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { useEffect, useRef, useState } from "react";

interface MailServerSectionProps {
	smtpProvider: string | null;
	mxRecord: string | null;
	riskLevel?: "low" | "medium" | "high" | null;
	verificationTime?: number;
	verifiedAt?: string;
}

export function MailServerSection({
	smtpProvider,
	mxRecord,
	riskLevel,
	verificationTime,
	verifiedAt,
}: MailServerSectionProps) {
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

	// Format date nicely
	const formatDate = (dateStr?: string) => {
		if (!dateStr) return "—";
		try {
			const date = new Date(dateStr);
			const options: Intl.DateTimeFormatOptions = {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			};
			return date.toLocaleDateString("en-US", options);
		} catch {
			return "—";
		}
	};

	let rowIndex = 0;

	return (
		<div className="border-stroke-soft-200/50 border-t">
			<h4 className="flex items-center gap-2 border-stroke-soft-200/50 border-b px-6 py-4 font-semibold text-sm text-text-strong-950">
				<Icon name="server" className="h-4 w-4 text-primary-base" />
				Mail Server
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
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="mail-single" className="h-4 w-4" />
						SMTP Provider
					</span>
					<span className="text-sm text-text-strong-950">
						{smtpProvider || "—"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="database" className="h-4 w-4" />
						MX Record
					</span>
					<span className="font-mono text-sm text-text-strong-950">
						{mxRecord || "—"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
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
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="clock" className="h-4 w-4" />
						Verification Time
					</span>
					<span className="text-sm text-text-strong-950">
						{verificationTime !== undefined ? `${verificationTime}ms` : "—"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="calendar" className="h-4 w-4" />
						Verified At
					</span>
					<span className="text-sm text-text-strong-950">
						{formatDate(verifiedAt)}
					</span>
				</div>
			</div>
		</div>
	);
}
