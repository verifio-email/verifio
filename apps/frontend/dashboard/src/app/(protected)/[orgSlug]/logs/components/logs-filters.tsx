import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import type { LogsFilters } from "../logs-filter-dropdown";
import { DateRangeFilter } from "./date-range-filter";
import { ServiceFilter } from "./service-filter";
import { StatusFilter } from "./status-filter";

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
	onReset,
}: LogsFiltersProps) {
	const handleStatusChange = (status: LogsFilters["status"]) => {
		onFiltersChange({ ...filters, status });
	};

	const handleServiceChange = (services: LogsFilters["services"]) => {
		onFiltersChange({ ...filters, services });
	};

	const handleDateRangeChange = (dateRange: LogsFilters["dateRange"]) => {
		onFiltersChange({ ...filters, dateRange });
	};

	// Count active filters (excluding default date range)
	const activeFilterCount =
		filters.status.length +
		filters.services.length +
		(filters.dateRange !== "7d" ? 1 : 0);

	const hasActiveFilters = activeFilterCount > 0;

	return (
		<div className="relative border-stroke-soft-200/50 border-b">
			<div className="flex flex-col gap-4 px-5 py-4 lg:px-6">
				{/* Search and Filters Row */}
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<Input.Root size="xsmall" className="w-56">
							<Input.Wrapper>
								<Input.Icon as={Icon} name="search" size="xsmall" />
								<Input.Input
									placeholder="Search by email, path or endpoint"
									value={search}
									onChange={(e) => onSearchChange(e.target.value)}
								/>
							</Input.Wrapper>
						</Input.Root>
						<div className="flex items-center gap-2">
							<StatusFilter
								value={filters.status}
								onChange={handleStatusChange}
							/>
							<ServiceFilter
								value={filters.services}
								onChange={handleServiceChange}
							/>
							<DateRangeFilter
								value={filters.dateRange}
								onChange={handleDateRangeChange}
							/>
						</div>
					</div>
					{hasActiveFilters && (
						<button
							type="button"
							onClick={onReset}
							className="flex items-center gap-1.5 rounded-lg border border-stroke-soft-200 px-3 py-1.5 text-text-sub-600 text-xs transition-colors hover:bg-bg-weak-50 hover:text-text-strong-950"
						>
							<span>Reset all filters</span>
						</button>
					)}
				</div>{" "}
			</div>
		</div>
	);
}
