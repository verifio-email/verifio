"use client";

import { Icon } from "@verifio/ui/icon";
import * as Badge from "@verifio/ui/badge";
import { useState, useRef, useEffect } from "react";

interface GeneralSectionProps {
	state: string;
	reason: string;
	domain: string;
	didYouMean?: string;
}

export function GeneralSection({
	state,
	reason,
	domain,
	didYouMean,
}: GeneralSectionProps) {
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
		<div>
			<h4 className="flex items-center gap-2 border-stroke-soft-100/60 border-b px-6 py-4 font-semibold text-sm text-text-strong-950">
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
						rowRefs.current[0] = el;
					}}
					onMouseEnter={() => setHoveredIndex(0)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="user" className="h-4 w-4" />
						Full Name
					</span>
					<span className="text-sm text-text-sub-600">—</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[1] = el;
					}}
					onMouseEnter={() => setHoveredIndex(1)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="users" className="h-4 w-4" />
						Gender
					</span>
					<span className="text-sm text-text-sub-600">—</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[2] = el;
					}}
					onMouseEnter={() => setHoveredIndex(2)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="activity" className="h-4 w-4" />
						State
					</span>
					<div className="flex items-center gap-2">
						<Badge.Root
							variant="light"
							color={state === "deliverable" ? "green" : "red"}
							size="small"
						>
							<Icon
								name={state === "deliverable" ? "check-circle" : "cross-circle"}
								className="h-3 w-3"
							/>
							{state === "deliverable" ? "Deliverable" : state}
						</Badge.Root>
						{state !== "deliverable" && (
							<Badge.Root variant="lighter" color="red" size="small">
								0x
							</Badge.Root>
						)}
					</div>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[3] = el;
					}}
					onMouseEnter={() => setHoveredIndex(3)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="alert-circle" className="h-4 w-4" />
						Reason
					</span>
					<Badge.Root variant="lighter" color="blue" size="small">
						{reason.toUpperCase().replace(/_/g, " ")}
					</Badge.Root>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[4] = el;
					}}
					onMouseEnter={() => setHoveredIndex(4)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<span className="flex items-center gap-2 text-sm text-text-sub-600">
						<Icon name="globe" className="h-4 w-4" />
						Domain
					</span>
					<span className="font-mono text-primary-base text-sm">{domain}</span>
				</div>
				{didYouMean && (
					<div
						ref={(el) => {
							rowRefs.current[5] = el;
						}}
						onMouseEnter={() => setHoveredIndex(5)}
						className="relative flex items-center justify-between px-6 py-3"
					>
						<div className="flex items-center gap-2 text-sm text-text-sub-600">
							<Icon name="help-circle" className="h-4 w-4" />
							Did you mean
							<Badge.Root variant="lighter" color="blue" size="small">
								0.9x
							</Badge.Root>
						</div>
						<div className="flex items-center gap-2">
							<span className="font-mono text-sm text-text-strong-950">
								{didYouMean}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
