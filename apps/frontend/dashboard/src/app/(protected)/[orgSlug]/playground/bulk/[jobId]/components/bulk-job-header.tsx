"use client";
import { AnimatedBackButton } from "@fe/dashboard/components/animated-back-button";
import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import {
	getStateBadge,
	getStateColor,
} from "@fe/dashboard/utils/verification-state";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { Skeleton } from "@verifio/ui/skeleton";
import { useState } from "react";

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
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	// Filter results based on search
	const filteredResults =
		results?.results.filter((r) =>
			r.email.toLowerCase().includes(searchQuery.toLowerCase()),
		) || [];
	// Pagination
	const totalPages = Math.ceil(filteredResults.length / pageSize);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, filteredResults.length);
	const paginatedResults = filteredResults.slice(startIndex, endIndex);
	return (
		<div className="h-full overflow-y-auto">
			{/* Back Button Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-5 py-4">
						<AnimatedBackButton onClick={() => push("/playground")} />
					</div>
				</div>
			</div>
			{/* Header Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="flex items-center justify-between border-stroke-soft-200/50 border-r border-l px-5 py-6">
						<div>
							{isLoading ? (
								<>
									<Skeleton className="mb-2 h-4 w-32 rounded-full" />
									<Skeleton className="h-7 w-64 rounded-lg" />
								</>
							) : (
								<>
									<div className="mb-1 flex items-center gap-1.5">
										<p className="font-medium text-paragraph-xs text-text-sub-600">
											Bulk Verification
										</p>
										<p className="font-semibold text-paragraph-xs text-text-sub-600">
											•
										</p>
										<div className="flex items-center gap-1 text-text-sub-600">
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
														? "text-text-disabled-300"
														: job?.status === "processing"
															? "animate-spin text-warning-base"
															: "text-error-base",
												)}
											/>
											<p className="font-medium text-paragraph-xs capitalize">
												{job?.status || "Unknown"}
											</p>
										</div>
									</div>
									<h1 className="font-medium text-2xl text-text-strong-950">
										{job?.name || "Bulk Verification"}
									</h1>
									<p className="mt-1 text-sm text-text-sub-600">
										{job?.totalEmails} emails •{" "}
										{job?.createdAt
											? new Date(job.createdAt).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})
											: "—"}
									</p>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Stats Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-5 py-5">
						<h3 className="mb-4 font-semibold text-lg text-text-strong-950">
							Summary
						</h3>
						{isLoading ? (
							<div className="flex gap-6">
								{[1, 2, 3, 4].map((i) => (
									<Skeleton key={i} className="h-12 w-24" />
								))}
							</div>
						) : (
							<div className="flex items-center gap-6">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-success-base" />
									<span className="text-sm text-text-sub-600">
										{job?.stats?.deliverable || 0} valid
									</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-warning-base" />
									<span className="text-sm text-text-sub-600">
										{job?.stats?.risky || 0} risky
									</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-error-base" />
									<span className="text-sm text-text-sub-600">
										{job?.stats?.undeliverable || 0} invalid
									</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-bg-soft-200" />
									<span className="text-sm text-text-sub-600">
										{job?.stats?.unknown || 0} unknown
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			{/* Results Section */}
			<div className="border-stroke-soft-200/50 border-b">
				<div className="px-[340px] 2xl:px-[450px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-5 py-5">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="font-semibold text-lg text-text-strong-950">
								Results
							</h3>
							{/* Search */}
							<div className="w-64">
								<Input.Root size="small">
									<Input.Wrapper>
										<Input.Icon as={Icon} name="search" />
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
						</div>
						{isLoading ? (
							<div className="space-y-2">
								{[1, 2, 3, 4, 5].map((i) => (
									<Skeleton key={i} className="h-12 w-full" />
								))}
							</div>
						) : (
							<>
								{/* Results Table */}
								<div className="overflow-hidden rounded-lg border border-stroke-soft-200/50">
									<table className="w-full">
										<thead>
											<tr className="border-stroke-soft-200/50 border-b bg-bg-weak-50">
												<th className="px-4 py-2.5 text-left font-medium text-sm text-text-sub-600">
													Email
												</th>
												<th className="px-4 py-2.5 text-left font-medium text-sm text-text-sub-600">
													State
												</th>
												<th className="px-4 py-2.5 text-left font-medium text-sm text-text-sub-600">
													Score
												</th>
												<th className="px-4 py-2.5 text-left font-medium text-sm text-text-sub-600">
													Reason
												</th>
											</tr>
										</thead>
										<tbody>
											{paginatedResults.length > 0 ? (
												paginatedResults.map((result, idx) => (
													<tr
														key={result.email + idx}
														className="border-stroke-soft-200/50 border-b last:border-b-0"
													>
														<td className="px-4 py-3">
															<span className="font-mono text-sm text-text-strong-950">
																{result.email}
															</span>
														</td>
														<td className="px-4 py-3">
															<span
																className={cn(
																	"rounded-full px-2 py-0.5 font-medium text-xs capitalize",
																	getStateBadge(result.state),
																)}
															>
																{result.state}
															</span>
														</td>
														<td className="px-4 py-3">
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
														{searchQuery
															? `No results found for "${searchQuery}"`
															: "No results available"}
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
								{/* Pagination */}
								{filteredResults.length > 0 && (
									<div className="mt-4 flex items-center justify-between text-sm">
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
