import { AnimatedHoverBackground } from "@fe/dashboard/components/layout/sidebar/animated-hover-background";
import { cn } from "@verifio/ui/cn";
import * as Dropdown from "@verifio/ui/dropdown";
import { Icon } from "@verifio/ui/icon";
import { useRef, useState } from "react";
import { DATE_RANGE_OPTIONS } from "./filter-options";

type DateRangeOption = "24h" | "7d" | "30d" | "all";

type DateRangeFilterProps = {
	value: DateRangeOption;
	onChange: (value: DateRangeOption) => void;
};

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [hoverIdx, setHoverIdx] = useState<number | undefined>(undefined);
	const buttonRefs = useRef<HTMLButtonElement[]>([]);

	const currentTab = buttonRefs.current[hoverIdx ?? -1];
	const hasActiveFilter = value !== "7d";

	let refIdx = 0;

	return (
		<Dropdown.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dropdown.Trigger asChild>
				<button
					type="button"
					className={cn(
						"flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors",
						hasActiveFilter
							? "border-primary-alpha-30 bg-primary-alpha-10 text-primary-base"
							: "border-stroke-soft-200 bg-bg-weak-50 text-text-sub-600 hover:bg-bg-weak-100",
					)}
				>
					<Icon name="calendar" className="h-3.5 w-3.5" />
					<span>
						{DATE_RANGE_OPTIONS.find((opt) => opt.id === value)?.label ??
							"Date range"}
					</span>
					<Icon name="chevron-down" className="h-3.5 w-3.5" />
				</button>
			</Dropdown.Trigger>
			<Dropdown.Content align="start" className="w-44 p-2">
				{/* Filter options */}
				<div className="relative">
					{DATE_RANGE_OPTIONS.map((option) => {
						const currentRefIdx = refIdx++;
						const isChecked = value === option.id;
						return (
							<button
								key={option.id}
								ref={(el) => {
									if (el) buttonRefs.current[currentRefIdx] = el;
								}}
								type="button"
								onPointerEnter={() => setHoverIdx(currentRefIdx)}
								onPointerLeave={() => setHoverIdx(undefined)}
								onClick={() => onChange(option.id)}
								aria-pressed={isChecked}
								className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 font-normal text-text-strong-950 text-xs transition-colors"
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

					{/* Animated hover background */}
					<AnimatedHoverBackground
						top={currentTab?.offsetTop ?? 0}
						height={currentTab?.offsetHeight ?? 28}
						isVisible={hoverIdx !== undefined}
					/>
				</div>
			</Dropdown.Content>
		</Dropdown.Root>
	);
}
