"use client";

import { Icon } from "@verifio/ui/icon";
import { useEffect, useRef, useState } from "react";

interface MailServerSectionProps {
	smtpProvider: string | null;
	mxRecord: string | null;
}

export function MailServerSection({
	smtpProvider,
	mxRecord,
}: MailServerSectionProps) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
	const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
	const rafRef = useRef<number>(0);

	useEffect(() => {
		if (hoveredIndex !== null && rowRefs.current[hoveredIndex]) {
			// Cancel any pending animation frame
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}

			// Use requestAnimationFrame for smooth 60fps updates
			rafRef.current = requestAnimationFrame(() => {
				const row = rowRefs.current[hoveredIndex];
				if (row) {
					const { offsetTop, offsetHeight } = row;
					setIndicatorStyle({ top: offsetTop, height: offsetHeight });
				}
			});
		}
	}, [hoveredIndex]);

	// Cleanup animation frame on unmount
	useEffect(() => {
		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

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
						rowRefs.current[0] = el;
					}}
					onMouseEnter={() => setHoveredIndex(0)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="mail-single" className="h-4 w-4" />
						SMTP Provider
					</span>
					<span className="text-sm text-text-sub-600">
						{smtpProvider || "—"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[1] = el;
					}}
					onMouseEnter={() => setHoveredIndex(1)}
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
						rowRefs.current[2] = el;
					}}
					onMouseEnter={() => setHoveredIndex(2)}
					className="relative flex items-center justify-between border-stroke-soft-200/50 border-b px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="link" className="h-4 w-4" />
						Implicit MX Record
					</span>
					<span className="text-sm text-text-sub-600">—</span>
				</div>
			</div>
		</div>
	);
}
