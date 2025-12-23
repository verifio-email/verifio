"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { useOrgStore } from "@fe/dashboard/store/use-org-store";
import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import * as Popover from "@verifio/ui/popover";
import Link from "next/link";
import { useRef, useState } from "react";
import useSWR from "swr";
import { FeedbackPopover } from "../feedback-popover";
import { AnimatedHoverBackground } from "./sidebar/animated-hover-background";

interface Organization {
	id: string;
	name: string;
	slug: string;
	logo?: string | null;
}

// Avatar with first letter and primary color background (matches Firecrawl)
const OrgAvatar = ({ name, size = 16 }: { name: string; size?: number }) => {
	const firstLetter = name?.charAt(0)?.toUpperCase() || "O";

	return (
		<div
			className="flex shrink-0 items-center justify-center rounded-md bg-primary-base font-medium text-white"
			style={{
				width: size,
				height: size,
				fontSize: size * 0.5,
			}}
		>
			{firstLetter}
		</div>
	);
};

export const GlobalNavbar = () => {
	const { activeOrganization, push } = useUserOrganization();
	const { refetch } = authClient.useSession();
	const { setState } = useOrgStore();

	const { data: organizations } = useSWR(
		"organizations",
		async () => (await authClient.organization.list()).data ?? undefined,
	);

	const [isOpen, setIsOpen] = useState(false);
	const [hoverIdx, setHoverIdx] = useState<number | undefined>(undefined);
	const buttonRefs = useRef<HTMLButtonElement[]>([]);

	const activeIndex = organizations?.findIndex(
		(org) => org.id === activeOrganization?.id,
	);
	const currentIdx = hoverIdx !== undefined ? hoverIdx : activeIndex;
	const currentTab = buttonRefs.current[currentIdx ?? -1];
	const currentRect = currentTab?.getBoundingClientRect();

	const handleOrganizationChange = async (organization: Organization) => {
		await authClient.updateUser({
			activeOrganizationId: organization.id,
		});
		refetch();
		setIsOpen(false);
		push(organization.slug, true);
	};

	const handleCreateOrganization = () => {
		setState(true);
		setIsOpen(false);
	};

	return (
		<nav className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-stroke-soft-200 border-b px-4">
			{/* Left: Organization Switcher */}
			<div className="flex items-center gap-4">
				<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
					<Popover.Trigger asChild>
						<button
							type="button"
							className={cn(
								"flex items-center gap-2.5 rounded-lg bg-stroke-soft-200 px-3 py-2 transition-colors hover:bg-stroke-soft-200",
								isOpen && "bg-stroke-soft-200",
							)}
						>
							<OrgAvatar
								name={activeOrganization?.name ?? "Organization"}
								size={18}
							/>
							<span className="font-medium text-sm text-text-strong-950">
								{activeOrganization?.name ?? "Select Organization"}
							</span>
							<Icon
								name="chevron-down"
								className={cn(
									"h-3.5 w-3.5 text-text-sub-600 transition-transform duration-200",
									isOpen && "rotate-180",
								)}
							/>
						</button>
					</Popover.Trigger>
					<Popover.Content
						sideOffset={-2}
						className="w-64 p-0"
						side="bottom"
						align="start"
					>
						<div className="border-stroke-soft-100 border-b p-2">
							<p className="px-2 py-1 font-medium text-sm text-text-sub-600">
								Teams
							</p>
						</div>
						{organizations && (
							<div className="relative p-2">
								{organizations.map((organization, idx) => {
									const isActiveOrg =
										organization.id === activeOrganization?.id;
									return (
										<button
											type="button"
											ref={(el) => {
												if (el) {
													buttonRefs.current[idx] = el;
												}
											}}
											key={organization.id}
											onPointerEnter={() => setHoverIdx(idx)}
											onPointerLeave={() => setHoverIdx(undefined)}
											className={cn(
												"flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-3 py-2 font-normal transition-colors focus:outline-none",
												isActiveOrg && "bg-bg-weak-50",
												!currentRect &&
													currentIdx === idx &&
													!isActiveOrg &&
													"bg-bg-weak-50",
											)}
											onClick={() => handleOrganizationChange(organization)}
										>
											<OrgAvatar name={organization.name} size={20} />
											<span className="flex-1 text-left text-sm text-text-strong-950">
												{organization.name}
											</span>
											{isActiveOrg && (
												<Icon
													name="check"
													className="h-4 w-4 text-text-sub-600"
												/>
											)}
										</button>
									);
								})}
								<button
									onPointerEnter={() => setHoverIdx(organizations.length)}
									onPointerLeave={() => setHoverIdx(undefined)}
									ref={(el) => {
										if (el) {
											buttonRefs.current[organizations.length] = el;
										}
									}}
									key="create-organization"
									type="button"
									className={cn(
										"flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-3 py-2 font-normal transition-colors focus:outline-none",
										!currentRect &&
											currentIdx === organizations.length &&
											"bg-bg-weak-50",
									)}
									onClick={handleCreateOrganization}
								>
									<Icon
										name="plus-outline"
										className="h-5 w-5 text-text-sub-600"
									/>
									<span className="text-sm text-text-strong-950">New Team</span>
								</button>
								<AnimatedHoverBackground
									rect={currentRect}
									tabElement={currentTab}
								/>
							</div>
						)}
					</Popover.Content>
				</Popover.Root>
			</div>

			{/* Right: Help, Docs, Feedback */}
			<div className="flex items-center gap-1">
				<Button.Root
					mode="ghost"
					variant="neutral"
					size="xxsmall"
					className="gap-1.5 text-text-sub-600"
				>
					<Icon name="help-circle" className="h-4 w-4" />
					Help
				</Button.Root>

				<Link
					href="https://docs.verifio.dev"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button.Root
						mode="ghost"
						variant="neutral"
						size="xxsmall"
						className="gap-1.5 text-text-sub-600"
					>
						<Icon name="book-closed" className="h-4 w-4" />
						Docs
					</Button.Root>
				</Link>

				<FeedbackPopover />
			</div>
		</nav>
	);
};
