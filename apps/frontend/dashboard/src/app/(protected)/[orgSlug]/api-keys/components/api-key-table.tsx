"use client";
import { AnimatedHoverBackground } from "@fe/dashboard/components/layout/sidebar/animated-hover-background";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { getAnimationProps } from "@fe/dashboard/utils/audience";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import {
	Content as PopoverContent,
	Root as PopoverRoot,
	Trigger as PopoverTrigger,
} from "@verifio/ui/popover";
import { Skeleton } from "@verifio/ui/skeleton";
import * as Tooltip from "@verifio/ui/tooltip";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { DeleteApiKeyModal } from "./delete-api-key-modal";
import { RotateApiKeyModal } from "./rotate-api-key-modal";

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

interface ApiKeyTableProps {
	apiKeys: ApiKeyData[];
	activeOrganizationSlug: string;
	isLoading?: boolean;
	loadingRows?: number;
}

interface ApiKeyActionsDropdownProps {
	apiKey: ApiKeyData;
	onViewDetails: (id: string) => void;
	onToggleEnabled: (apiKey: ApiKeyData) => void;
	onRotateKey: (apiKey: ApiKeyData) => void;
	onDeleteKey: (id: string) => void;
	isToggling: boolean;
	animationProps: ReturnType<typeof getAnimationProps>;
	onOpenChange?: (open: boolean) => void;
}

const ApiKeyActionsDropdown = ({
	apiKey,
	onViewDetails,
	onToggleEnabled,
	onRotateKey,
	onDeleteKey,
	isToggling,
	animationProps,
	onOpenChange,
}: ApiKeyActionsDropdownProps) => {
	const [hoverIdx, setHoverIdx] = useState<number | undefined>(undefined);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const buttonRefs = useRef<HTMLButtonElement[]>([]);

	const handlePopoverOpenChange = (open: boolean) => {
		setPopoverOpen(open);
		onOpenChange?.(open);
	};

	const toggleIcon = apiKey.enabled ? "pause" : "play";
	const menuItems = [
		{
			id: "view",
			label: "View Details",
			icon: "eye-outline" as const,
			isDanger: false,
		},
		{
			id: "toggle",
			label: apiKey.enabled ? "Disable" : "Enable",
			icon: toggleIcon as "pause" | "play",
			isDanger: false,
		},
		{
			id: "rotate",
			label: "Rotate Key",
			icon: "rotate-cw" as const,
			isDanger: false,
		},
		{
			id: "delete",
			label: "Delete API Key",
			icon: "trash" as const,
			isDanger: true,
		},
	];

	const currentTab = buttonRefs.current[hoverIdx ?? -1];
	const hoveredItem = menuItems[hoverIdx ?? -1];
	const isDanger = hoveredItem?.isDanger ?? false;

	const handleItemClick = (itemId: string) => {
		if (itemId === "view") {
			onViewDetails(apiKey.id);
			setPopoverOpen(false);
		} else if (itemId === "toggle") {
			onToggleEnabled(apiKey);
			setPopoverOpen(false);
		} else if (itemId === "rotate") {
			onRotateKey(apiKey);
			setPopoverOpen(false);
		} else if (itemId === "delete") {
			onDeleteKey(apiKey.id);
			setPopoverOpen(false);
		}
	};

	return (
		<motion.div {...animationProps} className="flex items-center justify-end">
			<PopoverRoot open={popoverOpen} onOpenChange={handlePopoverOpenChange}>
				<PopoverTrigger asChild>
					<Button.Root variant="neutral" mode="ghost" size="xxsmall">
						<Icon name="more-vertical" className="h-3 w-3" />
					</Button.Root>
				</PopoverTrigger>
				<PopoverContent
					align="end"
					sideOffset={-4}
					className="w-40 rounded-xl p-1.5"
				>
					<div className="relative">
						{menuItems.map((item, idx) => (
							<button
								key={item.id}
								ref={(el) => {
									if (el) buttonRefs.current[idx] = el;
								}}
								type="button"
								onPointerEnter={() => setHoverIdx(idx)}
								onPointerLeave={() => setHoverIdx(undefined)}
								onClick={() => handleItemClick(item.id)}
								disabled={item.id === "toggle" && isToggling}
								className={cn(
									"flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 font-normal text-xs transition-colors",
									item.isDanger ? "text-error-base" : "text-text-strong-950",
									isToggling &&
										item.id === "toggle" &&
										"cursor-not-allowed opacity-50",
								)}
							>
								{item.id === "toggle" && isToggling ? (
									<Icon
										name="loader-2"
										className="h-3.5 w-3.5 animate-spin text-text-sub-600"
									/>
								) : (
									<Icon
										name={item.icon}
										className={cn(
											"h-3.5 w-3.5",
											item.isDanger ? "" : "text-text-sub-600",
										)}
									/>
								)}
								<span>{item.label}</span>
							</button>
						))}
						<AnimatedHoverBackground
							top={currentTab?.offsetTop ?? 0}
							height={currentTab?.offsetHeight ?? 28}
							isVisible={hoverIdx !== undefined}
							isDanger={isDanger}
						/>
					</div>
				</PopoverContent>
			</PopoverRoot>
		</motion.div>
	);
};

// Helper function to mask API key
const maskApiKey = (prefix: string | null, start: string | null): string => {
	const keyStart = prefix || start || "key";
	return `${keyStart}${"•".repeat(16)}`;
};

// Format date for display
const formatCreatedDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export const ApiKeyTable = ({
	apiKeys,
	activeOrganizationSlug,
	isLoading,
	loadingRows = 3,
}: ApiKeyTableProps) => {
	const { push } = useUserOrganization();
	const { mutate } = useSWRConfig();
	const [, setDeleteId] = useQueryState("delete");
	const [togglingId, setTogglingId] = useState<string | null>(null);
	const [rotateModalApiKey, setRotateModalApiKey] = useState<ApiKeyData | null>(
		null,
	);
	const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [revealedKeyId, setRevealedKeyId] = useState<string | null>(null);

	const handleDeleteApiKey = (apiKeyId: string) => {
		setDeleteId(apiKeyId);
	};

	const handleViewDetails = (apiKeyId: string) => {
		push(`/api-keys/${apiKeyId}`);
	};

	const handleCopyKey = async (apiKey: ApiKeyData) => {
		const keyToCopy = apiKey.prefix || apiKey.start || "";
		try {
			await navigator.clipboard.writeText(keyToCopy);
			setCopiedId(apiKey.id);
			toast.success("API key copied to clipboard");
			setTimeout(() => setCopiedId(null), 2000);
		} catch {
			toast.error("Failed to copy API key");
		}
	};

	const handleToggleEnabled = async (apiKey: ApiKeyData) => {
		try {
			setTogglingId(apiKey.id);
			const endpoint = apiKey.enabled
				? `/api/api-key/v1/${apiKey.id}/disable`
				: `/api/api-key/v1/${apiKey.id}/enable`;

			await axios.post(endpoint, {}, { headers: { credentials: "include" } });

			// Revalidate all API key caches using a matcher function
			await mutate(
				(key) => typeof key === "string" && key.startsWith("/api/api-key/v1/"),
				undefined,
				{ revalidate: true },
			);

			toast.success(
				apiKey.enabled
					? "API key disabled successfully"
					: "API key enabled successfully",
			);
		} catch (error) {
			const errorMessage = axios.isAxiosError(error)
				? error.response?.data?.message || "Failed to toggle API key"
				: "Failed to toggle API key";
			toast.error(errorMessage);
		} finally {
			setTogglingId(null);
		}
	};

	return (
		<>
			<AnimatePresence mode="wait">
				<div className="w-full">
					{isLoading
						? // Skeleton loading state
							Array.from({ length: loadingRows }).map((_, index) => (
								<div
									key={`skeleton-${index}-${activeOrganizationSlug}`}
									className="relative"
								>
									<div className="flex items-center justify-between px-5 py-4 lg:px-6">
										<div className="flex-1">
											<Skeleton className="mb-2 h-5 w-32" />
											<Skeleton className="mb-1 h-4 w-48" />
											<Skeleton className="h-3 w-40" />
										</div>
										<div className="flex items-center gap-2">
											<Skeleton className="h-8 w-8 rounded" />
											<Skeleton className="h-8 w-8 rounded" />
										</div>
									</div>
									<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
								</div>
							))
						: apiKeys.map((apiKey, index) => {
								const displayName =
									apiKey.name || apiKey.start || apiKey.prefix || "Unnamed";
								const maskedKey = maskApiKey(apiKey.prefix, apiKey.start);
								const fullKey = apiKey.key;
								const isRevealed = revealedKeyId === apiKey.id;
								const isRowActive = activeDropdownId === apiKey.id;

								return (
									<div key={`api-key-${apiKey.id}`} className="relative">
										<Link
											href={`/${activeOrganizationSlug}/api-keys/${apiKey.id}`}
											className={cn(
												"group block transition-colors hover:bg-bg-weak-50/50",
												isRowActive && "bg-bg-weak-50/50",
											)}
										>
											<div className="flex items-center justify-between px-5 py-4 lg:px-6">
												<motion.div
													{...getAnimationProps(index + 1, 0)}
													className="flex-1"
												>
													{/* Name */}
													<p className="font-medium text-label-md text-text-strong-950">
														{displayName}
													</p>
													{/* Key - Masked or Revealed */}
													<div className="mt-1 flex items-center gap-2 font-mono text-paragraph-sm text-text-sub-600">
														<span>{isRevealed ? fullKey : maskedKey}</span>
													</div>
													{/* Created Date */}
													<p className="mt-1 text-paragraph-xs text-text-soft-400">
														Created on {formatCreatedDate(apiKey.createdAt)}
													</p>
												</motion.div>

												{/* Actions */}
												<motion.div
													{...getAnimationProps(index + 1, 1)}
													className="flex items-center gap-1"
													onClick={(e) => e.preventDefault()}
												>
													{/* Copy Button */}
													<Tooltip.Root delayDuration={0}>
														<Tooltip.Trigger asChild>
															<Button.Root
																variant="neutral"
																mode="ghost"
																size="xxsmall"
																onClick={(e) => {
																	e.preventDefault();
																	e.stopPropagation();
																	handleCopyKey(apiKey);
																}}
															>
																<Icon
																	name={
																		copiedId === apiKey.id ? "check" : "copy"
																	}
																	className="h-4 w-4"
																/>
															</Button.Root>
														</Tooltip.Trigger>
														<Tooltip.Content variant="light" sideOffset={4}>
															{copiedId === apiKey.id ? "Copied!" : "Copy key"}
														</Tooltip.Content>
													</Tooltip.Root>

													{/* Reveal/Hide Key Button */}
													<Tooltip.Root delayDuration={0}>
														<Tooltip.Trigger asChild>
															<Button.Root
																variant="neutral"
																mode="ghost"
																size="xxsmall"
																onClick={(e) => {
																	e.preventDefault();
																	e.stopPropagation();
																	setRevealedKeyId(
																		isRevealed ? null : apiKey.id,
																	);
																}}
															>
																<Icon
																	name={
																		isRevealed
																			? "eye-slash-outline"
																			: "eye-outline"
																	}
																	className="h-4 w-4"
																/>
															</Button.Root>
														</Tooltip.Trigger>
														<Tooltip.Content variant="light" sideOffset={4}>
															{isRevealed ? "Hide key" : "Show key"}
														</Tooltip.Content>
													</Tooltip.Root>

													{/* More Actions */}
													<div
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
														}}
													>
														<ApiKeyActionsDropdown
															apiKey={apiKey}
															onViewDetails={handleViewDetails}
															onToggleEnabled={handleToggleEnabled}
															onRotateKey={setRotateModalApiKey}
															onDeleteKey={handleDeleteApiKey}
															isToggling={togglingId === apiKey.id}
															animationProps={getAnimationProps(index + 1, 2)}
															onOpenChange={(open) =>
																setActiveDropdownId(open ? apiKey.id : null)
															}
														/>
													</div>
												</motion.div>
											</div>
										</Link>
										{/* Bottom border extending to right edge */}
										<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
									</div>
								);
							})}
				</div>
			</AnimatePresence>
			<DeleteApiKeyModal apiKeys={apiKeys} />
			{rotateModalApiKey && (
				<RotateApiKeyModal
					isOpen={!!rotateModalApiKey}
					onClose={() => setRotateModalApiKey(null)}
					apiKeyId={rotateModalApiKey.id}
					apiKeyName={
						rotateModalApiKey.name ||
						rotateModalApiKey.start ||
						rotateModalApiKey.prefix ||
						"Unnamed"
					}
				/>
			)}
		</>
	);
};
