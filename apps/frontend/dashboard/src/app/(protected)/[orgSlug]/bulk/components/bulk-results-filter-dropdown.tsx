"use client";

import { AnimatedHoverBackground } from "@fe/dashboard/components/layout/sidebar/animated-hover-background";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import * as Dropdown from "@verifio/ui/dropdown";
import { Icon } from "@verifio/ui/icon";
import { useRef, useState } from "react";

export type BulkResultStateFilter =
	| "deliverable"
	| "risky"
	| "undeliverable"
	| "unknown";

export interface BulkResultsFilters {
	states: BulkResultStateFilter[];
}

interface BulkResultsFilterDropdownProps {
	value: BulkResultsFilters;
	onChange: (value: BulkResultsFilters) => void;
}

const stateFilterOptions: {
	id: BulkResultStateFilter;
	label: string;
	icon: string;
	colorClass: string;
}[] = [
	{
		id: "deliverable",
		label: "Deliverable",
		icon: "check-circle",
		colorClass: "text-success-base",
	},
	{
		id: "risky",
		label: "Risky",
		icon: "alert-triangle",
		colorClass: "text-warning-base",
	},
	{
		id: "undeliverable",
		label: "Undeliverable",
		icon: "cross-circle",
		colorClass: "text-error-base",
	},
	{
		id: "unknown",
		label: "Unknown",
		icon: "help-circle",
		colorClass: "text-text-sub-600",
	},
];

export const BulkResultsFilterDropdown = ({
	value,
	onChange,
}: BulkResultsFilterDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [hoverIdx, setHoverIdx] = useState<number | undefined>(undefined);
	const buttonRefs = useRef<HTMLButtonElement[]>([]);

	const currentTab = buttonRefs.current[hoverIdx ?? -1];

	const activeFilterCount = value.states.length;
	const hasActiveFilter = activeFilterCount > 0;

	const handleReset = () => {
		onChange({ states: [] });
	};

	const handleStateToggle = (stateId: BulkResultStateFilter) => {
		if (value.states.includes(stateId)) {
			onChange({ states: value.states.filter((v) => v !== stateId) });
		} else {
			onChange({ states: [...value.states, stateId] });
		}
	};

	return (
		<Dropdown.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dropdown.Trigger asChild>
				<Button.Root variant="neutral" mode="stroke" size="xsmall">
					<Icon name="filter" className="h-4 w-4" />
					<span>Filter</span>
					{hasActiveFilter && (
						<span className="-top-1.5 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white">
							{activeFilterCount}
						</span>
					)}
				</Button.Root>
			</Dropdown.Trigger>
			<Dropdown.Content
				align="end"
				className="max-h-80 w-52 overflow-y-auto p-2"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-stroke-soft-200 border-b px-1 pb-2">
					<span className="font-medium text-text-sub-600 text-xs">
						Filter by
					</span>
					<button
						type="button"
						onClick={handleReset}
						className="rounded-lg border border-stroke-soft-200 px-2 py-1 text-text-sub-600 text-xs transition-colors hover:bg-bg-weak-50"
					>
						Reset filters
					</button>
				</div>

				{/* Filter Options */}
				<div className="relative">
					<div className="pt-2">
						<span className="px-1 font-medium text-[10px] text-text-soft-400 uppercase tracking-wide">
							Status
						</span>
						<div className="mt-1">
							{stateFilterOptions.map((option, idx) => {
								const isChecked = value.states.includes(option.id);
								return (
									<button
										key={option.id}
										ref={(el) => {
											if (el) buttonRefs.current[idx] = el;
										}}
										type="button"
										onPointerEnter={() => setHoverIdx(idx)}
										onPointerLeave={() => setHoverIdx(undefined)}
										onClick={() => handleStateToggle(option.id)}
										className={cn(
											"flex w-full cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 font-normal text-xs transition-colors",
											"text-text-strong-950",
										)}
									>
										{/* Checkbox */}
										<div
											className={cn(
												"flex h-3.5 w-3.5 items-center justify-center rounded border p-[1px] transition-colors",
												isChecked
													? "border-stroke-soft-900 bg-neutral-900"
													: "border-stroke-soft-200",
											)}
										>
											{isChecked && (
												<Icon name="check" className="h-3 w-3 text-white" />
											)}
										</div>
										{/* Status Icon */}
										<Icon
											name={
												option.icon as React.ComponentProps<typeof Icon>["name"]
											}
											className={cn("h-3.5 w-3.5", option.colorClass)}
										/>
										<span>{option.label}</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* Animated Hover Background */}
					<AnimatedHoverBackground
						top={currentTab?.offsetTop ?? 0}
						height={currentTab?.offsetHeight ?? 28}
						isVisible={hoverIdx !== undefined}
					/>
				</div>
			</Dropdown.Content>
		</Dropdown.Root>
	);
};
