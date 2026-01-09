"use client";

import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";
import { getStateColor } from "@fe/dashboard/utils/verification-state";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { useState } from "react";
import type { BulkStats, VerificationResult } from "../types";

interface BulkResultsTableProps {
	results: VerificationResult[];
	stats: BulkStats | null;
	onClose: () => void;
}

export const BulkResultsTable = ({
	results,
	stats,
	onClose,
}: BulkResultsTableProps) => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [pageSize, setPageSize] = useState(10);

	// Filter results by search
	const filteredResults = results.filter((result) =>
		result.email.toLowerCase().includes(search.toLowerCase()),
	);

	// Paginate filtered results
	const totalPages = Math.ceil(filteredResults.length / pageSize);
	const paginatedResults = filteredResults.slice(
		(page - 1) * pageSize,
		page * pageSize,
	);
	const startIndex = (page - 1) * pageSize + 1;
	const endIndex = Math.min(page * pageSize, filteredResults.length);

	return (
		<div className="border-stroke-soft-200/50 border-b">
			<div className="px-52 2xl:px-[350px]">
				<div className="border-stroke-soft-200/50 border-r border-l">
					<div className="mx-auto max-w-4xl px-6 py-6">
						{/* Header with title, inline stats, search and close */}
						<div className="mb-6 flex items-center justify-between">
							<div className="flex items-center gap-6">
								<h3 className="font-semibold text-lg text-text-strong-950">
									Verification Results
								</h3>
								{/* Inline Stats */}
								{stats && (
									<div className="flex items-center gap-4 text-sm">
										<span className="text-text-sub-600">
											<span className="font-medium text-text-strong-950">
												{stats.total}
											</span>{" "}
											total
										</span>
										<span className="text-text-disabled-300">•</span>
										<span className="text-success-base">
											{stats.deliverable} valid
										</span>
										<span className="text-text-disabled-300">•</span>
										<span className="text-warning-base">
											{stats.risky} risky
										</span>
										<span className="text-text-disabled-300">•</span>
										<span className="text-error-base">
											{stats.undeliverable} invalid
										</span>
									</div>
								)}
							</div>
							<div className="flex items-center gap-3">
								{/* Search */}
								<div className="w-52">
									<Input.Root size="small" className="rounded-lg">
										<Input.Wrapper>
											<Input.Icon
												as={() => <Icon name="search" className="h-4 w-4" />}
											/>
											<Input.Input
												type="text"
												placeholder="Search..."
												value={search}
												onChange={(e) => {
													setSearch(e.target.value);
													setPage(1);
												}}
											/>
										</Input.Wrapper>
									</Input.Root>
								</div>
								{/* Close button */}
								<button
									type="button"
									onClick={onClose}
									className="flex h-8 w-8 items-center justify-center rounded-lg text-text-soft-400 transition-colors hover:bg-bg-weak-50 hover:text-text-sub-600"
								>
									<Icon name="x" className="h-4 w-4" />
								</button>
							</div>
						</div>

						{/* Results Table - Minimal */}
						<div className="overflow-hidden rounded-lg border border-stroke-soft-200/50">
							<table className="w-full">
								<thead>
									<tr className="border-stroke-soft-200/50 border-b bg-bg-weak-50/50">
										<th className="px-4 py-2.5 text-left font-medium text-text-sub-600 text-xs uppercase tracking-wide">
											Email
										</th>
										<th className="px-4 py-2.5 text-center font-medium text-text-sub-600 text-xs uppercase tracking-wide">
											Status
										</th>
										<th className="px-4 py-2.5 text-center font-medium text-text-sub-600 text-xs uppercase tracking-wide">
											Score
										</th>
										<th className="px-4 py-2.5 text-left font-medium text-text-sub-600 text-xs uppercase tracking-wide">
											Reason
										</th>
									</tr>
								</thead>
								<tbody>
									{paginatedResults.length > 0 ? (
										paginatedResults.map((result, index) => (
											<tr
												key={`${result.email}-${index}`}
												className="border-stroke-soft-200/50 border-b transition-colors last:border-b-0 hover:bg-bg-weak-50/30"
											>
												<td className="px-4 py-3">
													<span className="font-mono text-sm text-text-strong-950">
														{result.email}
													</span>
												</td>
												<td className="px-4 py-3 text-center">
													<span
														className={cn(
															"inline-flex items-center gap-1 text-sm",
															result.state === "deliverable"
																? "text-success-base"
																: result.state === "risky"
																	? "text-warning-base"
																	: "text-error-base",
														)}
													>
														<Icon
															name={
																result.state === "deliverable"
																	? "check-circle"
																	: result.state === "risky"
																		? "alert-triangle"
																		: "x-circle"
															}
															className="h-3.5 w-3.5"
														/>
														{result.state}
													</span>
												</td>
												<td className="px-4 py-3 text-center">
													<span
														className={cn(
															"font-medium text-sm",
															getStateColor(result.state),
														)}
													>
														{result.score}
													</span>
												</td>
												<td className="px-4 py-3">
													<span className="text-sm text-text-sub-600">
														{result.reason.replace(/_/g, " ")}
													</span>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td
												colSpan={4}
												className="px-4 py-8 text-center text-sm text-text-soft-400"
											>
												No results found for "{search}"
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						{/* Pagination Footer - Minimal */}
						{filteredResults.length > 0 && (
							<div className="mt-4 flex items-center justify-between text-sm">
								<div className="flex items-center gap-2 text-text-sub-600">
									<span>
										{startIndex}–{endIndex} of {filteredResults.length}
									</span>
									<PageSizeDropdown
										value={pageSize}
										onValueChange={(value) => {
											setPageSize(value);
											setPage(1);
										}}
									/>
								</div>
								<PaginationControls
									currentPage={page}
									totalPages={totalPages}
									onPageChange={setPage}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
