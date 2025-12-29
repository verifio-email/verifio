"use client";
import { PageSizeDropdown } from "@fe/dashboard/components/page-size-dropdown";
import { PaginationControls } from "@fe/dashboard/components/pagination-controls";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import useSWR from "swr";
import {
	ApiKeyFilterDropdown,
	type ApiKeyFilters,
	type CreatedByUser,
} from "./api-key-filter-dropdown";
import { ApiKeyTable } from "./api-key-table";
import { CreateApiKeyModal } from "./create-api-key-modal";
import { EmptyState } from "./empty-state";

interface ApiKeyData {
	id: string;
	name: string | null;
	key: string;
	start: string | null;
	prefix: string | null;
	enabled: boolean;
	requestCount: number;
	remaining: number | null;
	expiresAt: string | null;
	createdAt: string;
	createdBy?: {
		id: string;
		name: string | null;
		image: string | null;
		email: string | null;
	};
}

interface ApiKeyListResponse {
	apiKeys: ApiKeyData[];
	total: number;
	page: number;
	limit: number;
}

export const ApiKeyListSidebar = () => {
	const { activeOrganization } = useUserOrganization();
	const [filters, setFilters] = useState<ApiKeyFilters>({
		status: [],
		createdBy: [],
	});
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(1),
	);
	const [pageSize, setPageSize] = useQueryState(
		"limit",
		parseAsInteger.withDefault(10),
	);

	const { data, error, isLoading } = useSWR<ApiKeyListResponse>(
		activeOrganization?.id
			? `/api/api-key/v1/?limit=${pageSize}&page=${currentPage}`
			: null,
		{
			revalidateOnFocus: true,
			revalidateOnReconnect: true,
		},
	);

	const totalPages = data ? Math.ceil(data.total / pageSize) : 1;
	const startIndex = (currentPage - 1) * pageSize + 1;
	const endIndex = Math.min(currentPage * pageSize, data?.total || 0);

	// Extract unique creators from API keys
	const availableCreators = useMemo<CreatedByUser[]>(() => {
		if (!data?.apiKeys) return [];
		const creatorsMap = new Map<string, CreatedByUser>();
		for (const apiKey of data.apiKeys) {
			if (apiKey.createdBy?.id && !creatorsMap.has(apiKey.createdBy.id)) {
				creatorsMap.set(apiKey.createdBy.id, {
					id: apiKey.createdBy.id,
					name: apiKey.createdBy.name,
					image: apiKey.createdBy.image,
				});
			}
		}
		return Array.from(creatorsMap.values());
	}, [data?.apiKeys]);

	// Filter API keys based on status, creator, and search query
	const filteredApiKeys =
		data?.apiKeys?.filter((apiKey) => {
			const matchesStatus =
				filters.status.length === 0 ||
				(filters.status.includes("enabled") && apiKey.enabled) ||
				(filters.status.includes("disabled") && !apiKey.enabled);

			const matchesCreator =
				filters.createdBy.length === 0 ||
				(apiKey.createdBy?.id &&
					filters.createdBy.includes(apiKey.createdBy.id));

			const displayName = apiKey.name || apiKey.start || apiKey.prefix || "";
			const matchesSearch =
				searchQuery === "" ||
				displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				apiKey.prefix?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				apiKey.start?.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesStatus && matchesCreator && matchesSearch;
		}) || [];

	return (
		<div className="h-full">
			{/* Header Section */}
			<div className="relative">
				<div className="flex items-center justify-between px-5 py-6 lg:px-6">
					<div>
						<h1 className="font-medium text-2xl text-text-strong-950">
							API Keys
						</h1>
						<p className="text-paragraph-sm text-text-sub-600">
							Create and manage API keys to authenticate with the Verifio API
						</p>
					</div>
					<Button.Root size="xsmall" onClick={() => setIsCreateModalOpen(true)}>
						<Icon name="plus" className="h-4 w-4" />
						Create
					</Button.Root>
				</div>
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Content */}
			<div>
				{error ? (
					<div className="flex flex-col items-center justify-center gap-2 p-8">
						<Icon name="alert-circle" className="h-8 w-8 text-red-500" />
						<p className="text-center text-sm text-text-sub-600">
							Failed to load API keys
						</p>
					</div>
				) : data?.apiKeys && data.apiKeys.length === 0 ? (
					<EmptyState onCreateApiKey={() => setIsCreateModalOpen(true)} />
				) : (
					<>
						{/* Your API Keys Section Header */}
						<div className="relative">
							<div className="flex items-center justify-between gap-3 px-5 py-4 lg:px-6">
								<h3 className="font-medium text-label-md text-text-strong-950">
									Your API Keys
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
													placeholder="Search API keys..."
													value={searchQuery}
													onChange={(e) => setSearchQuery(e.target.value)}
												/>
											</Input.Wrapper>
										</Input.Root>
									</div>
									<ApiKeyFilterDropdown
										value={filters}
										onChange={setFilters}
										availableCreators={availableCreators}
									/>
								</div>
							</div>
							{/* Bottom border extending to right edge */}
							<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
						</div>

						{/* API Keys List */}
						<div>
							<ApiKeyTable
								apiKeys={filteredApiKeys}
								activeOrganizationSlug={activeOrganization?.slug || ""}
								isLoading={isLoading}
								loadingRows={4}
								onCreateNewKey={() => setIsCreateModalOpen(true)}
							/>
						</div>

						{/* Pagination */}
						{data && data.total > 0 && (
							<div className="relative">
								<div className="flex items-center justify-between px-5 py-4 text-paragraph-sm text-text-sub-600 lg:px-6">
									<div className="flex items-center gap-3">
										<span>
											Showing {startIndex}–{endIndex} of {data.total} API key
											{data.total !== 1 ? "s" : ""}
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
										isLoading={isLoading}
									/>
								</div>
								{/* Bottom border extending to right edge */}
								<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
							</div>
						)}
					</>
				)}
			</div>
			<CreateApiKeyModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
			/>
		</div>
	);
};
