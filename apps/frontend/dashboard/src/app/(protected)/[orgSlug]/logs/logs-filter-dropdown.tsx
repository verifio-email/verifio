"use client";

import { AnimatedHoverBackground } from "@fe/dashboard/components/layout/sidebar/animated-hover-background";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import * as Dropdown from "@verifio/ui/dropdown";
import { Icon } from "@verifio/ui/icon";
import { useRef, useState } from "react";

// Developer mode status options (API status)
export type StatusFilterOption = "success" | "failed" | "error";
// User mode status options (verification state)
export type VerificationStateOption = "deliverable" | "risky" | "undeliverable";
export type ServiceFilterOption = "verify" | "api-key" | "auth" | "upload";
export type DateRangeOption = "24h" | "7d" | "30d" | "all";

export interface LogsFilters {
	status: StatusFilterOption[];
	verificationState: VerificationStateOption[];
	services: ServiceFilterOption[];
	dateRange: DateRangeOption;
}

interface LogsFilterDropdownProps {
	value: LogsFilters;
	onChange: (value: LogsFilters) => void;
	isDeveloperMode: boolean;
}

// Developer mode: API status options
const statusOptions: { id: StatusFilterOption; label: string }[] = [
	{ id: "success", label: "Success" },
	{ id: "failed", label: "Failed" },
	{ id: "error", label: "Error" },
];

// User mode: Verification state options
const verificationStateOptions: {
	id: VerificationStateOption;
	label: string;
}[] = [
	{ id: "deliverable", label: "Deliverable" },
	{ id: "risky", label: "Risky" },
	{ id: "undeliverable", label: "Undeliverable" },
];

const serviceOptions: { id: ServiceFilterOption; label: string }[] = [
	{ id: "verify", label: "Verify" },
	{ id: "api-key", label: "API Key" },
	{ id: "auth", label: "Auth" },
	{ id: "upload", label: "Upload" },
];

const dateRangeOptions: { id: DateRangeOption; label: string }[] = [
	{ id: "24h", label: "Last 24 hours" },
	{ id: "7d", label: "Last 7 days" },
	{ id: "30d", label: "Last 30 days" },
	{ id: "all", label: "All time" },
];

export const LogsFilterDropdown = ({
	value,
	onChange,
	isDeveloperMode,
}: LogsFilterDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [hoverIdx, setHoverIdx] = useState<number | undefined>(undefined);
	const buttonRefs = useRef<HTMLButtonElement[]>([]);

	const currentTab = buttonRefs.current[hoverIdx ?? -1];

	const activeFilterCount = isDeveloperMode
		? value.status.length +
			value.services.length +
			(value.dateRange !== "7d" ? 1 : 0)
		: value.verificationState.length + (value.dateRange !== "7d" ? 1 : 0);
	const hasActiveFilter = activeFilterCount > 0;

	const handleReset = () => {
		onChange({
			status: [],
			verificationState: [],
			services: [],
			dateRange: "7d",
		});
	};

	const handleToggleStatus = (optionId: StatusFilterOption) => {
		if (value.status.includes(optionId)) {
			onChange({
				...value,
				status: value.status.filter((v) => v !== optionId),
			});
		} else {
			onChange({ ...value, status: [...value.status, optionId] });
		}
	};

	const handleToggleVerificationState = (optionId: VerificationStateOption) => {
		if (value.verificationState.includes(optionId)) {
			onChange({
				...value,
				verificationState: value.verificationState.filter(
					(v) => v !== optionId,
				),
			});
		} else {
			onChange({
				...value,
				verificationState: [...value.verificationState, optionId],
			});
		}
	};

	const handleToggleService = (optionId: ServiceFilterOption) => {
		if (value.services.includes(optionId)) {
			onChange({
				...value,
				services: value.services.filter((v) => v !== optionId),
			});
		} else {
			onChange({ ...value, services: [...value.services, optionId] });
		}
	};

	const handleDateRangeChange = (optionId: DateRangeOption) => {
		onChange({ ...value, dateRange: optionId });
	};

	// Track button references with a running index
	let refIdx = 0;

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
			<Dropdown.Content align="end" className="w-52 p-3">
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

				{/* All Filter Options in a single relative container for animation */}
				<div className="relative mt-2">
					{isDeveloperMode ? (
						<>
							{/* Developer Mode: Status Section */}
							<span className="mb-1 block px-1 font-medium text-[10px] text-text-soft-400 uppercase tracking-wider">
								Status
							</span>
							{statusOptions.map((option) => {
								const currentRefIdx = refIdx++;
								const isChecked = value.status.includes(option.id);
								return (
									<button
										key={option.id}
										ref={(el) => {
											if (el) buttonRefs.current[currentRefIdx] = el;
										}}
										type="button"
										onPointerEnter={() => setHoverIdx(currentRefIdx)}
										onPointerLeave={() => setHoverIdx(undefined)}
										onClick={() => handleToggleStatus(option.id)}
										className={cn(
											"flex w-full cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 font-normal text-xs transition-colors",
											"text-text-strong-950",
										)}
									>
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
										<span>{option.label}</span>
									</button>
								);
							})}

							{/* Developer Mode: Service Section */}
							<span className="mt-3 mb-1 block px-1 font-medium text-[10px] text-text-soft-400 uppercase tracking-wider">
								Service
							</span>
							{serviceOptions.map((option) => {
								const currentRefIdx = refIdx++;
								const isChecked = value.services.includes(option.id);
								return (
									<button
										key={option.id}
										ref={(el) => {
											if (el) buttonRefs.current[currentRefIdx] = el;
										}}
										type="button"
										onPointerEnter={() => setHoverIdx(currentRefIdx)}
										onPointerLeave={() => setHoverIdx(undefined)}
										onClick={() => handleToggleService(option.id)}
										className={cn(
											"flex w-full cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 font-normal text-xs transition-colors",
											"text-text-strong-950",
										)}
									>
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
										<span>{option.label}</span>
									</button>
								);
							})}
						</>
					) : (
						<>
							{/* User Mode: Verification State Section */}
							<span className="mb-1 block px-1 font-medium text-[10px] text-text-soft-400 uppercase tracking-wider">
								Status
							</span>
							{verificationStateOptions.map((option) => {
								const currentRefIdx = refIdx++;
								const isChecked = value.verificationState.includes(option.id);
								return (
									<button
										key={option.id}
										ref={(el) => {
											if (el) buttonRefs.current[currentRefIdx] = el;
										}}
										type="button"
										onPointerEnter={() => setHoverIdx(currentRefIdx)}
										onPointerLeave={() => setHoverIdx(undefined)}
										onClick={() => handleToggleVerificationState(option.id)}
										className={cn(
											"flex w-full cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 font-normal text-xs transition-colors",
											"text-text-strong-950",
										)}
									>
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
										<span>{option.label}</span>
									</button>
								);
							})}
						</>
					)}

					{/* Date Range Section - Common to both modes */}
					<span className="mt-3 mb-1 block px-1 font-medium text-[10px] text-text-soft-400 uppercase tracking-wider">
						Date Range
					</span>
					{dateRangeOptions.map((option) => {
						const currentRefIdx = refIdx++;
						const isChecked = value.dateRange === option.id;
						return (
							<button
								key={option.id}
								ref={(el) => {
									if (el) buttonRefs.current[currentRefIdx] = el;
								}}
								type="button"
								onPointerEnter={() => setHoverIdx(currentRefIdx)}
								onPointerLeave={() => setHoverIdx(undefined)}
								onClick={() => handleDateRangeChange(option.id)}
								className={cn(
									"flex w-full cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 font-normal text-xs transition-colors",
									"text-text-strong-950",
								)}
							>
								<div
									className={cn(
										"flex h-3.5 w-3.5 items-center justify-center rounded-full border p-[1px] transition-colors",
										isChecked
											? "border-stroke-soft-900 bg-neutral-900"
											: "border-stroke-soft-200",
									)}
								>
									{isChecked && (
										<div className="h-1.5 w-1.5 rounded-full bg-white" />
									)}
								</div>
								<span>{option.label}</span>
							</button>
						);
					})}

					{/* Animated hover background - inside the single relative container */}
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
