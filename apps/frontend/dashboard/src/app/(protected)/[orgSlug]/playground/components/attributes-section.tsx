"use client";

import { Icon } from "@verifio/ui/icon";
import { useEffect, useRef, useState } from "react";

interface AttributesSectionProps {
	isFree: boolean;
	freeProvider?: string;
	isRole: boolean;
	roleName?: string;
	isDisposable: boolean;
	disposableProvider?: string;
	isCatchAll: boolean | null;
	syntaxValid?: boolean;
	dnsValid?: boolean;
	hasMx?: boolean;
	numericalChars?: number;
	alphabeticalChars?: number;
	unicodeSymbols?: number;
}

export function AttributesSection({
	isFree,
	freeProvider,
	isRole,
	roleName,
	isDisposable,
	disposableProvider,
	isCatchAll,
	syntaxValid,
	dnsValid,
	hasMx,
	numericalChars,
	alphabeticalChars,
	unicodeSymbols,
}: AttributesSectionProps) {
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

	let rowIndex = 0;

	return (
		<div>
			<h4 className="flex items-center gap-2 border-stroke-soft-200/50 border-b px-6 py-4 font-semibold text-sm text-text-strong-950">
				<Icon name="list" className="h-4 w-4 text-primary-base" />
				Attributes
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
					<div className="flex items-center gap-2">
						<Icon name="dollar" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Free Provider</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isFree ? freeProvider || "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="users" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Role Account</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isRole ? roleName || "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="trash" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Disposable</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isDisposable ? disposableProvider || "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="check-circle" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Accept-All</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isCatchAll === null ? "—" : isCatchAll ? "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="check" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Syntax Valid</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{syntaxValid === undefined ? "—" : syntaxValid ? "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="globe" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">DNS Valid</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{dnsValid === undefined ? "—" : dnsValid ? "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="server" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Has MX</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{hasMx === undefined ? "—" : hasMx ? "Yes" : "No"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="hash" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">
							Numerical Characters
						</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{numericalChars ?? "—"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="file-text" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">
							Alphabetical Characters
						</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{alphabeticalChars ?? "—"}
					</span>
				</div>
				<div
					ref={(el) => {
						rowRefs.current[rowIndex] = el;
					}}
					onMouseEnter={() => setHoveredIndex(rowIndex++)}
					className="relative flex items-center justify-between px-6 py-3"
				>
					<div className="flex items-center gap-2">
						<Icon name="emoji-wow" className="h-3.5 w-3.5" />
						<span className="text-sm text-text-sub-600">Unicode Symbols</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{unicodeSymbols ?? "—"}
					</span>
				</div>
			</div>
		</div>
	);
}
