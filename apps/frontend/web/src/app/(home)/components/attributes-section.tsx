"use client";

import { Icon } from "@verifio/ui/icon";
import { useEffect, useRef, useState } from "react";

interface AttributesSectionProps {
	isFree: boolean;
	isRole: boolean;
	isDisposable: boolean;
	isCatchAll: boolean | null;
	tag: string | null;
}

export function AttributesSection({
	isFree,
	isRole,
	isDisposable,
	isCatchAll,
	tag,
}: AttributesSectionProps) {
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
			<h4 className="flex items-center gap-2 border-stroke-soft-100 border-b px-6 py-4 font-semibold text-sm text-text-strong-950">
				<Icon name="list" className="h-4 w-4 text-text-strong-950" />
				Attributes
			</h4>
			<div
				className="relative divide-y divide-stroke-soft-100"
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
					<div className="flex items-center gap-2">
						<Icon name="dollar" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Free</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isFree ? "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[1] = el;
					}}
					onMouseEnter={() => setHoveredIndex(1)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="users" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Role</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isRole ? "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[2] = el;
					}}
					onMouseEnter={() => setHoveredIndex(2)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="trash" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Disposable</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isDisposable ? "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[3] = el;
					}}
					onMouseEnter={() => setHoveredIndex(3)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="check-circle" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Accept-All</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isCatchAll === null ? "No" : isCatchAll ? "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[4] = el;
					}}
					onMouseEnter={() => setHoveredIndex(4)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="hash" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Tag</span>
					</div>
					<span className="text-sm text-text-strong-950">{tag || "No"}</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[5] = el;
					}}
					onMouseEnter={() => setHoveredIndex(5)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="hash" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">
							Numerical Characters
						</span>
					</div>
					<span className="text-sm text-text-strong-950">0</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[6] = el;
					}}
					onMouseEnter={() => setHoveredIndex(6)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="file-text" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">
							Alphabetical Characters
						</span>
					</div>
					<span className="text-sm text-text-strong-950">6</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[7] = el;
					}}
					onMouseEnter={() => setHoveredIndex(7)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="emoji-wow" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Unicode Symbols</span>
					</div>
					<span className="text-sm text-text-strong-950">0</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[8] = el;
					}}
					onMouseEnter={() => setHoveredIndex(8)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="server-2" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Mailbox Full</span>
					</div>
					<span className="text-sm text-text-strong-950">No</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[9] = el;
					}}
					onMouseEnter={() => setHoveredIndex(9)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="cross-circle" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">No Reply</span>
					</div>
					<span className="text-sm text-text-strong-950">No</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[10] = el;
					}}
					onMouseEnter={() => setHoveredIndex(10)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="lock" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">
							Secure Email Gateway
						</span>
					</div>
					<span className="text-sm text-text-strong-950">No</span>
				</div>
			</div>
		</div>
	);
}
