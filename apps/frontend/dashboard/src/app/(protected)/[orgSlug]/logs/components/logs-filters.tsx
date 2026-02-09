import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import type { LogsFilters } from "../logs-filter-dropdown";
import { LogsFilterDropdown } from "../logs-filter-dropdown";

type LogsFiltersProps = {
	search: string;
	onSearchChange: (value: string) => void;
	filters: LogsFilters;
	onFiltersChange: (filters: LogsFilters) => void;
	onReset: () => void;
};

export function LogsFilterBar({
	search,
	onSearchChange,
	filters,
	onFiltersChange,
}: LogsFiltersProps) {
	return (
		<div className="relative">
			<div className="flex items-center justify-between gap-3 px-5 py-4 lg:px-6">
				<h3 className="font-medium text-label-md text-text-strong-950">
					Activity Logs
				</h3>
				<div className="flex items-center gap-3">
					<div className="w-64">
						<Input.Root size="small" className="rounded-xl">
							<Input.Wrapper>
								<Input.Icon
									as={() => <Icon name="search" className="h-4 w-4" />}
								/>
								<Input.Input
									type="text"
									placeholder="Search by email, path or endpoint"
									value={search}
									onChange={(e) => onSearchChange(e.target.value)}
								/>
							</Input.Wrapper>
						</Input.Root>
					</div>
					<LogsFilterDropdown
						value={filters}
						onChange={onFiltersChange}
						isDeveloperMode={true}
					/>
				</div>
			</div>
			{/* Bottom border extending to both edges */}
			<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
		</div>
	);
}
