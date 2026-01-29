import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";

type LogsPaginationProps = {
	pagination: {
		page: number;
		limit: number;
		total: number;
		total_pages: number;
	};
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
};

export function LogsPagination({
	pagination,
	onPageChange,
	onPageSizeChange,
}: LogsPaginationProps) {
	return (
		<div className="relative">
			<div className="absolute top-0 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-200/50" />
			<div className="flex items-center justify-between px-6 py-3.5">
				<div className="flex items-center gap-2 text-sm text-text-sub-600">
					<span>
						Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
						{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
						{pagination.total}
					</span>
					<PageSizeDropdown
						value={pagination.limit}
						onValueChange={onPageSizeChange}
					/>
				</div>
				<PaginationControls
					currentPage={pagination.page}
					totalPages={pagination.total_pages}
					onPageChange={onPageChange}
				/>
			</div>
		</div>
	);
}
