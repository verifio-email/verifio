"use client";

import { AnimatedHoverBackground } from "@fe/dashboard/components/layout/sidebar/animated-hover-background";

import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import * as Dropdown from "@verifio/ui/dropdown";
import { Icon } from "@verifio/ui/icon";
import { useRef, useState } from "react";

export type ApiKeyStatusFilterOption = "enabled" | "disabled";
export type ApiKeyStatusFilters = ApiKeyStatusFilterOption[];

export interface OrganizationItem {
	id: string;
	name: string;
	slug: string;
}

export interface ApiKeyFilters {
	status: ApiKeyStatusFilters;
	organizations: string[]; // Organization IDs
}

interface ApiKeyFilterDropdownProps {
	value: ApiKeyFilters;
	onChange: (value: ApiKeyFilters) => void;
	availableOrganizations: OrganizationItem[];
}

const statusFilterOptions: {
	id: ApiKeyStatusFilterOption;
	label: string;
	icon: React.ComponentProps<typeof Icon>["name"];
	colorClass: string;
}[] = [
	{
		id: "enabled",
		label: "Enabled",
		icon: "check-circle",
		colorClass: "text-green-500",
	},
	{
		id: "disabled",
		label: "Disabled",
		icon: "cross-circle",
		colorClass: "text-red-500",
	},
];

export const ApiKeyFilterDropdown = ({
	value,
	onChange,
	availableOrganizations,
}: ApiKeyFilterDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [hoverIdx, setHoverIdx] = useState<number | undefined>(undefined);
	const buttonRefs = useRef<HTMLButtonElement[]>([]);

	const currentTab = buttonRefs.current[hoverIdx ?? -1];

	const activeFilterCount = value.status.length + value.organizations.length;
	const hasActiveFilter = activeFilterCount > 0;

	const handleReset = () => {
		onChange({ status: [], organizations: [] });
	};

	const handleStatusToggle = (optionId: ApiKeyStatusFilterOption) => {
		if (value.status.includes(optionId)) {
			onChange({
				...value,
				status: value.status.filter((v) => v !== optionId),
			});
		} else {
			onChange({ ...value, status: [...value.status, optionId] });
		}
	};

	const handleOrgToggle = (orgId: string) => {
		if (value.organizations.includes(orgId)) {
			onChange({
				...value,
				organizations: value.organizations.filter((v) => v !== orgId),
			});
		} else {
			onChange({ ...value, organizations: [...value.organizations, orgId] });
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
				className="max-h-96 w-52 overflow-y-auto p-2"
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

				{/* All Filter Options in a single relative container */}
				<div className="relative">
					{/* Status Section */}
					<div className="pt-2">
						<span className="px-1 font-medium text-[10px] text-text-soft-400 uppercase tracking-wide">
							Status
						</span>
						<div className="mt-1">
							{statusFilterOptions.map((option, idx) => {
								const isChecked = value.status.includes(option.id);
								return (
									<button
										key={option.id}
										ref={(el) => {
											if (el) buttonRefs.current[idx] = el;
										}}
										type="button"
										onPointerEnter={() => setHoverIdx(idx)}
										onPointerLeave={() => setHoverIdx(undefined)}
										onClick={() => handleStatusToggle(option.id)}
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
											name={option.icon}
											className={cn("h-3.5 w-3.5", option.colorClass)}
										/>
										<span>{option.label}</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* Organizations Section */}
					{availableOrganizations.length > 1 && (
						<div className="mt-2 border-stroke-soft-200 border-t pt-3">
							<span className="px-1 font-medium text-[10px] text-text-soft-400 uppercase tracking-wide">
								Organization
							</span>
							<div className="mt-1">
								{availableOrganizations.map((org, idx) => {
									const globalIdx = statusFilterOptions.length + idx;
									const isChecked = value.organizations.includes(org.id);
									return (
										<button
											key={org.id}
											ref={(el) => {
												if (el) buttonRefs.current[globalIdx] = el;
											}}
											type="button"
											onPointerEnter={() => setHoverIdx(globalIdx)}
											onPointerLeave={() => setHoverIdx(undefined)}
											onClick={() => handleOrgToggle(org.id)}
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
											{/* Org Icon */}
											<div className="flex h-4 w-4 items-center justify-center rounded bg-neutral-200 font-medium text-[10px] text-neutral-700">
												{org.name.charAt(0).toUpperCase()}
											</div>
											<span className="truncate">{org.name}</span>
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* Single AnimatedHoverBackground for all options */}
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
