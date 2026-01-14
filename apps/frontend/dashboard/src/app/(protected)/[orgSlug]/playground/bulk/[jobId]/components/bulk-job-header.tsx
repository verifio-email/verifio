"use client";
import { AnimatedBackButton } from "@fe/dashboard/components/animated-back-button";
import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import {
	getStateColor,
	getStateIcon,
} from "@fe/dashboard/utils/verification-state";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { Skeleton } from "@verifio/ui/skeleton";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
	type BulkResultStateFilter,
	BulkResultsFilterDropdown,
} from "../../../../bulk/components/bulk-results-filter-dropdown";
import { EmailAvatar } from "../../../components/email-avatar";

interface BulkJobData {
	id: string;
	name: string | null;
	status: string;
	totalEmails: number;
	processedEmails: number;
	stats: {
		deliverable: number;
		undeliverable: number;
		risky: number;
		unknown: number;
		averageScore: number;
	} | null;
	createdAt: string;
	completedAt: string | null;
}
interface BulkJobResultsData {
	results: Array<{
		id?: string;
		email: string;
		state: string;
		score: number;
		reason: string;
		result?: {
			email: string;
			user: string;
			domain: string;
			tag: string | null;
			state: "deliverable" | "undeliverable" | "risky" | "unknown";
			reason: string;
			score: number;
		};
	}>;
	stats: {
		deliverable: number;
		undeliverable: number;
		risky: number;
		unknown: number;
		averageScore: number;
	};
}
interface BulkJobHeaderProps {
	job: BulkJobData | undefined;
	results: BulkJobResultsData | undefined;
	isLoading: boolean;
	isFailed?: boolean;
}
export const BulkJobHeader = ({
	job,
	results,
	isLoading,
}: BulkJobHeaderProps) => {
	const { push } = useUserOrganization();
	const [searchQuery, setSearchQuery] = useState("");
	const [stateFilter, setStateFilter] = useState<
		"all" | "deliverable" | "risky" | "undeliverable" | "unknown"
	>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	// Filter results based on search and state
	const filteredResults =
		results?.results.filter((r) => {
			const matchesSearch = r.email
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const matchesState = stateFilter === "all" || r.state === stateFilter;
			return matchesSearch && matchesState;
		}) || [];
	// Pagination
	const totalPages = Math.ceil(filteredResults.length / pageSize);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, filteredResults.length);
	const paginatedResults = filteredResults.slice(startIndex, endIndex);
	return (
		<div className="h-full overflow-y-auto overflow-x-hidden">
			{/* Back Button Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="mx-auto max-w-4xl">
					<div className="border-stroke-soft-200/50 border-r border-l px-5 py-4">
						<AnimatedBackButton onClick={() => push("/playground")} />
					</div>
				</div>
			</div>
			{/* Header Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="mx-auto max-w-4xl">
					<div className="flex items-center justify-between border-stroke-soft-200/50 border-r border-l px-5 py-6">
						<div>
							{isLoading ? (
								<>
									<Skeleton className="mb-2 h-4 w-32 rounded-full" />
									<Skeleton className="h-7 w-64 rounded-lg" />
								</>
							) : (
								<>
									<h1 className="font-medium text-2xl text-text-strong-950">
										{job?.name || "Bulk Verification"}
									</h1>
									<div className="mt-1 flex items-center gap-1.5 text-sm text-text-sub-600">
										<span>
											{job?.totalEmails ?? results?.results.length ?? 0} emails
										</span>
										<span>•</span>
										<Icon
											name={
												job?.status === "completed"
													? "check-circle"
													: job?.status === "processing"
														? "loader"
														: "x-circle"
											}
											className={cn(
												"h-3.5 w-3.5",
												job?.status === "completed"
													? "text-success-base"
													: job?.status === "processing"
														? "animate-spin text-warning-base"
														: "text-error-base",
											)}
										/>
										<span
											className={cn(
												"font-medium capitalize",
												job?.status === "completed" && "text-success-base",
											)}
										>
											{job?.status || "Unknown"}
										</span>
										<span>•</span>
										<span>
											{job?.createdAt
												? new Date(job.createdAt).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})
												: "—"}
										</span>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Stats Section - Box UI */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="mx-auto max-w-4xl">
					{/* Summary Title */}
					<div className="relative border-stroke-soft-200/50 border-r border-l px-5 py-4">
						<h3 className="font-semibold text-lg text-text-strong-950">
							Summary
						</h3>
						{/* Bottom border extending full width */}
						<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
					</div>
					{/* Box Content */}
					{isLoading ? (
						<div className="flex gap-6 border-stroke-soft-200/50 border-r border-l p-5">
							{[1, 2, 3, 4].map((i) => (
								<Skeleton key={i} className="h-12 w-24" />
							))}
						</div>
					) : (
						(() => {
							const PIE_COLORS = {
								deliverable: "#1fc16b", // success-base
								risky: "#fa7319", // warning-base
								undeliverable: "#fb3748", // error-base
								unknown: "#d1d1d1", // gray-300
							};
							const pieData = job?.stats
								? [
										{
											name: "Valid",
											value: job.stats.deliverable,
											color: PIE_COLORS.deliverable,
										},
										{
											name: "Risky",
											value: job.stats.risky,
											color: PIE_COLORS.risky,
										},
										{
											name: "Invalid",
											value: job.stats.undeliverable,
											color: PIE_COLORS.undeliverable,
										},
										{
											name: "Unknown",
											value: job.stats.unknown,
											color: PIE_COLORS.unknown,
										},
									].filter((d) => d.value > 0)
								: [];
							const totalEmails =
								job?.totalEmails ?? results?.results.length ?? 0;
							const deliverablePercent =
								job?.stats && totalEmails > 0
									? Math.round((job.stats.deliverable / totalEmails) * 100)
									: 0;

							return (
								<div className="flex border-stroke-soft-200/50 border-r border-l">
									{/* Pie Chart Column */}
									<div className="flex flex-1 items-center justify-center border-stroke-soft-200/50 border-r p-6">
										{pieData.length > 0 && (
											<div className="relative h-40 w-40 shrink-0">
												<ResponsiveContainer width="100%" height="100%">
													<PieChart>
														<Pie
															data={pieData}
															cx="50%"
															cy="50%"
															innerRadius={50}
															outerRadius={70}
															paddingAngle={2}
															dataKey="value"
															stroke="none"
														>
															{pieData.map((entry, index) => (
																<Cell
																	key={`cell-${index}`}
																	fill={entry.color}
																/>
															))}
														</Pie>
														<Tooltip
															offset={10}
															wrapperStyle={{
																zIndex: 100,
															}}
															content={({ active, payload }) => {
																if (active && payload && payload.length) {
																	const data = payload[0]?.payload;
																	const total = pieData.reduce(
																		(sum, d) => sum + d.value,
																		0,
																	);
																	const percent = Math.round(
																		(data.value / total) * 100,
																	);
																	return (
																		<div className="overflow-hidden rounded-lg bg-white shadow-lg">
																			<div
																				className="px-3 py-1.5 font-semibold text-white text-xs"
																				style={{
																					backgroundColor: data.color,
																				}}
																			>
																				{data.name.toUpperCase()}
																			</div>
																			<div className="px-3 py-2 text-center text-gray-900 text-sm">
																				{data.value} ({percent}%)
																			</div>
																		</div>
																	);
																}
																return null;
															}}
														/>
													</PieChart>
												</ResponsiveContainer>
												{/* Center Label */}
												<div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
													<span className="font-bold text-lg text-text-strong-950">
														{deliverablePercent}%
													</span>
													<span className="text-[11px] text-text-sub-600">
														Deliverable
													</span>
												</div>
											</div>
										)}
									</div>

									{/* Stats Table Column */}
									<div className="flex flex-1">
										{/* Labels Column */}
										<div className="flex flex-1 flex-col divide-y divide-stroke-soft-200/50">
											<div className="flex items-center px-6 py-4">
												<span className="text-sm text-text-sub-600">Valid</span>
											</div>
											<div className="flex items-center px-6 py-4">
												<span className="text-sm text-text-sub-600">Risky</span>
											</div>
											<div className="flex items-center px-6 py-4">
												<span className="text-sm text-text-sub-600">
													Invalid
												</span>
											</div>
											<div className="flex items-center px-6 py-4">
												<span className="text-sm text-text-sub-600">
													Unknown
												</span>
											</div>
										</div>
										{/* Values Column with left border */}
										<div className="flex flex-1 flex-col divide-y divide-stroke-soft-200/50 border-stroke-soft-200/50 border-l">
											<div className="flex items-center gap-2 px-6 py-4">
												<Icon
													name="check-circle"
													className="h-4 w-4"
													style={{ color: PIE_COLORS.deliverable }}
												/>
												<span
													className="font-semibold text-sm"
													style={{ color: PIE_COLORS.deliverable }}
												>
													{job?.stats?.deliverable || 0}
												</span>
											</div>
											<div className="flex items-center gap-2 px-6 py-4">
												<Icon
													name="alert-triangle"
													className="h-4 w-4"
													style={{ color: PIE_COLORS.risky }}
												/>
												<span
													className="font-semibold text-sm"
													style={{ color: PIE_COLORS.risky }}
												>
													{job?.stats?.risky || 0}
												</span>
											</div>
											<div className="flex items-center gap-2 px-6 py-4">
												<Icon
													name="cross-circle"
													className="h-4 w-4"
													style={{ color: PIE_COLORS.undeliverable }}
												/>
												<span
													className="font-semibold text-sm"
													style={{ color: PIE_COLORS.undeliverable }}
												>
													{job?.stats?.undeliverable || 0}
												</span>
											</div>
											<div className="flex items-center gap-2 px-6 py-4">
												<Icon
													name="help-circle"
													className="h-4 w-4"
													style={{ color: PIE_COLORS.unknown }}
												/>
												<span
													className="font-semibold text-sm"
													style={{ color: PIE_COLORS.unknown }}
												>
													{job?.stats?.unknown || 0}
												</span>
											</div>
										</div>
									</div>
								</div>
							);
						})()
					)}
				</div>
			</div>
			{/* Results Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="mx-auto max-w-4xl">
					<div className="border-stroke-soft-200/50 border-r border-l pt-5">
						<div className="relative flex items-center justify-between px-5 pb-4">
							{/* Bottom border extending full width */}
							<div className="absolute right-[-100vw] bottom-0 left-[-100vw] h-px bg-stroke-soft-200/50" />
							<h3 className="font-semibold text-lg text-text-strong-950">
								Results
							</h3>
							{/* Search and Filter */}
							<div className="flex items-center gap-3">
								{/* Search - comes first like logs page */}
								<div className="w-56">
									<Input.Root size="xsmall">
										<Input.Wrapper>
											<Input.Icon as={Icon} name="search" size="xsmall" />
											<Input.Input
												placeholder="Search emails..."
												value={searchQuery}
												onChange={(e) => {
													setSearchQuery(e.target.value);
													setCurrentPage(1);
												}}
											/>
										</Input.Wrapper>
									</Input.Root>
								</div>
								{/* Filter Dropdown - matching logs page style */}
								<BulkResultsFilterDropdown
									value={{
										states:
											stateFilter === "all"
												? []
												: [stateFilter as BulkResultStateFilter],
									}}
									onChange={(value) => {
										if (value.states.length === 0) {
											setStateFilter("all");
										} else {
											setStateFilter(value.states[0] ?? "all");
										}
										setCurrentPage(1);
									}}
								/>
							</div>
						</div>

						{isLoading ? (
							<div className="space-y-2">
								{[1, 2, 3, 4, 5].map((i) => (
									<Skeleton key={i} className="h-12 w-full" />
								))}
							</div>
						) : (
							<>
								{/* Table Header */}
								<div className="border-stroke-soft-200/50 border-b bg-bg-weak-50/50 px-5">
									<div className="grid grid-cols-[1fr_195px_150px_60px] items-stretch text-[11px] text-text-sub-600 uppercase tracking-wide">
										<div className="flex items-center py-3 font-semibold">
											Email
										</div>
										<div className="flex items-center border-stroke-soft-200/50 border-l py-3 pl-4 font-semibold">
											Reason
										</div>
										<div className="flex items-center border-stroke-soft-200/50 border-l py-3 pl-4 font-semibold">
											Status
										</div>
										<div className="flex items-center justify-end border-stroke-soft-200/50 border-l py-3 pl-4 font-semibold">
											Score
										</div>
									</div>
								</div>

								{/* Results List */}
								<div className="divide-y divide-stroke-soft-200/50">
									{paginatedResults.length > 0 ? (
										paginatedResults.map((result, idx) => (
											<div
												key={result.id || result.email + idx}
												className={cn(
													"grid grid-cols-[1fr_195px_150px_60px] items-stretch px-5 transition-colors hover:bg-bg-weak-50/50",
													result.id && "cursor-pointer",
												)}
												onClick={() =>
													result.id &&
													job?.id &&
													push(`/playground/bulk/${job.id}/result/${result.id}`)
												}
											>
												{/* Email with Avatar */}
												<div className="flex items-center gap-2 overflow-hidden py-3">
													<div
														className={cn(
															"flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
															result.state === "deliverable"
																? "bg-success-alpha-10"
																: result.state === "risky"
																	? "bg-warning-alpha-10"
																	: "bg-error-alpha-10",
														)}
													>
														<EmailAvatar
															email={result.email}
															className="h-5 w-5"
														/>
													</div>
													<span className="truncate text-sm text-text-sub-600">
														{result.email}
													</span>
												</div>

												{/* Reason */}
												<span className="flex items-center truncate border-stroke-soft-200/50 border-l py-3 pl-4 text-sm text-text-sub-600">
													{result.reason.replace(/_/g, " ")}
												</span>

												{/* Status with icon */}
												<span
													className={cn(
														"flex items-center gap-1.5 border-stroke-soft-200/50 border-l py-3 pl-4 text-sm",
														getStateColor(result.state),
													)}
												>
													<Icon
														name={getStateIcon(result.state)}
														className="h-3.5 w-3.5 shrink-0"
													/>
													{result.state}
												</span>

												{/* Score */}
												<span
													className={cn(
														"flex items-center justify-end border-stroke-soft-200/50 border-l py-3 pl-4 font-semibold text-sm tabular-nums",
														getStateColor(result.state),
													)}
												>
													{result.score}
												</span>
											</div>
										))
									) : (
										<div className="flex flex-col items-center justify-center py-16">
											<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-weak-50">
												<Icon
													name="mail"
													className="h-8 w-8 text-text-sub-600"
												/>
											</div>
											<h2 className="mb-2 font-medium text-text-strong-950">
												{searchQuery
													? "No matching results"
													: "No results found"}
											</h2>
											<p className="text-text-sub-600">
												{searchQuery
													? "Try a different search term."
													: "No results available for this job."}
											</p>
										</div>
									)}
								</div>
								{/* Pagination */}
								{filteredResults.length > 0 && (
									<div className="relative flex items-center justify-between px-5 py-4 text-sm">
										{/* Top border extending full width */}
										<div className="absolute top-0 right-[-100vw] left-[-100vw] h-px bg-stroke-soft-200/50" />
										<div className="flex items-center gap-2 text-text-sub-600">
											<span>
												{startIndex + 1}–{endIndex} of {filteredResults.length}
											</span>
											<PageSizeDropdown
												value={pageSize}
												onValueChange={(value) => {
													setPageSize(value);
													setCurrentPage(1);
												}}
											/>
										</div>
										<PaginationControls
											currentPage={currentPage}
											totalPages={totalPages}
											onPageChange={setCurrentPage}
										/>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
