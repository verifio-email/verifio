"use client";

import { InviteModal } from "@fe/dashboard/app/(protected)/[orgSlug]/settings/team/invite-modal";
import { useOrgStore } from "@fe/dashboard/store/use-org-store";
import { cn } from "@verifio/ui/cn";
import * as Dropdown from "@verifio/ui/dropdown";
import { Icon } from "@verifio/ui/icon";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatedHoverBackground } from "./animated-hover-background";

interface Organization {
	id: string;
	name: string;
	slug: string;
	logo?: string | null;
}

interface OrganizationSwitcherProps {
	organizations: Organization[] | undefined;
	activeOrganization: Organization;
	onOrganizationChange: (organization: Organization) => void;
	isCollapsed?: boolean;
	side?: "bottom" | "right";
}

// Organization Avatar - shows logo image if available, otherwise first letter with primary color
const OrgAvatar = ({
	name,
	logo,
	size = 20,
	isActive = false,
}: {
	name: string;
	logo?: string | null;
	size?: number;
	isActive?: boolean;
}) => {
	const displayLetter = name?.charAt(0)?.toUpperCase() || "O";

	// If logo exists, show the image
	if (logo) {
		return (
			<img
				src={logo}
				alt={name}
				className="rounded object-cover"
				style={{
					width: size,
					height: size,
				}}
			/>
		);
	}

	// Otherwise show first letter
	return (
		<span
			className={cn(
				"flex items-center justify-center rounded font-semibold text-white",
				isActive ? "bg-primary-base" : "bg-primary-base",
			)}
			style={{
				width: size,
				height: size,
				fontSize: size * 0.5,
			}}
		>
			{displayLetter}
		</span>
	);
};

export const OrganizationSwitcher: React.FC<OrganizationSwitcherProps> = ({
	organizations,
	activeOrganization,
	onOrganizationChange,
	isCollapsed = false,
	side = "bottom",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const { setState } = useOrgStore();
	const router = useRouter();

	const handleCreateOrganization = () => {
		setState(true);
		setIsOpen(false);
	};

	const handleSelectOrganization = async (organization: Organization) => {
		onOrganizationChange(organization);
		setIsOpen(false);
	};

	const handleOrgSettings = () => {
		router.push(`/${activeOrganization.slug}/settings/team`);
		setIsOpen(false);
	};

	const handleInviteMembers = () => {
		setIsOpen(false);
		setIsInviteModalOpen(true);
	};

	// Collapsed state - just show icon
	if (isCollapsed) {
		return (
			<>
				<Dropdown.Root open={isOpen} onOpenChange={setIsOpen}>
					<Dropdown.Trigger asChild>
						<button
							type="button"
							className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-alpha-10 transition-all hover:bg-neutral-alpha-16 active:scale-[0.98]"
							title={activeOrganization.name}
						>
							<OrgAvatar
								name={activeOrganization.name}
								logo={activeOrganization.logo}
								size={20}
								isActive
							/>
						</button>
					</Dropdown.Trigger>
					<Dropdown.Content
						sideOffset={8}
						className="w-64 overflow-hidden rounded-2xl border border-stroke-soft-200 p-0"
						style={{
							boxShadow:
								"rgba(0, 0, 0, 0.08) 0px 12px 24px, rgba(0, 0, 0, 0.04) 0px 4px 8px",
						}}
						side="right"
						align="start"
					>
						<OrgDropdownContent
							organizations={organizations}
							activeOrganization={activeOrganization}
							onSelect={handleSelectOrganization}
							onCreateNew={handleCreateOrganization}
							onOrgSettings={handleOrgSettings}
							onInviteMembers={handleInviteMembers}
							onClose={() => setIsOpen(false)}
						/>
					</Dropdown.Content>
				</Dropdown.Root>

				{/* Invite Members Modal */}
				<InviteModal
					open={isInviteModalOpen}
					onOpenChange={setIsInviteModalOpen}
				/>
			</>
		);
	}

	return (
		<>
			<Dropdown.Root open={isOpen} onOpenChange={setIsOpen}>
				<Dropdown.Trigger asChild>
					<button
						type="button"
						className={cn(
							"flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all",
							"bg-neutral-alpha-10 hover:bg-neutral-alpha-16 active:scale-[0.98]",
							"text-text-strong-950",
						)}
					>
						<OrgAvatar
							name={activeOrganization.name}
							logo={activeOrganization.logo}
							size={16}
							isActive
						/>
						<span className="font-medium text-sm">
							{activeOrganization.name}
						</span>
						<Icon name="chevron-down" className="h-3 w-3 text-text-soft-400" />
					</button>
				</Dropdown.Trigger>
				<Dropdown.Content
					sideOffset={8}
					className="w-64 overflow-hidden rounded-2xl border border-stroke-soft-200 p-0"
					style={{
						boxShadow:
							"rgba(0, 0, 0, 0.08) 0px 12px 24px, rgba(0, 0, 0, 0.04) 0px 4px 8px",
					}}
					side={side}
					align="start"
				>
					<OrgDropdownContent
						organizations={organizations}
						activeOrganization={activeOrganization}
						onSelect={handleSelectOrganization}
						onCreateNew={handleCreateOrganization}
						onOrgSettings={handleOrgSettings}
						onInviteMembers={handleInviteMembers}
						onClose={() => setIsOpen(false)}
					/>
				</Dropdown.Content>
			</Dropdown.Root>

			{/* Invite Members Modal */}
			<InviteModal
				open={isInviteModalOpen}
				onOpenChange={setIsInviteModalOpen}
			/>
		</>
	);
};

interface OrgDropdownContentProps {
	organizations: Organization[] | undefined;
	activeOrganization: Organization;
	onSelect: (organization: Organization) => void;
	onCreateNew: () => void;
	onOrgSettings: () => void;
	onInviteMembers: () => void;
	onClose: () => void;
}

const OrgDropdownContent: React.FC<OrgDropdownContentProps> = ({
	organizations,
	activeOrganization,
	onSelect,
	onCreateNew,
	onOrgSettings,
	onInviteMembers,
	onClose,
}) => {
	const [hoverIdx, setHoverIdx] = useState<number | null>(null);
	const [isHovering, setIsHovering] = useState(false);
	const orgItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

	// Track positions for smooth animation
	const [activePos, setActivePos] = useState({ top: 0, height: 36 });
	const [hoverPos, setHoverPos] = useState({ top: 0, height: 36 });

	if (!organizations) return null;

	const activeIndex = organizations.findIndex(
		(org) => org.id === activeOrganization.id,
	);

	// Update active position when activeIndex changes or on mount
	useEffect(() => {
		if (activeIndex >= 0) {
			const activeItem = orgItemRefs.current[activeIndex];
			if (activeItem) {
				setActivePos({
					top: activeItem.offsetTop,
					height: activeItem.offsetHeight,
				});
			}
		}
	}, [activeIndex]);

	// Update hover position when hoverIdx changes
	useEffect(() => {
		if (hoverIdx !== null && hoverIdx !== activeIndex) {
			const hoverItem = orgItemRefs.current[hoverIdx];
			if (hoverItem) {
				setHoverPos({
					top: hoverItem.offsetTop,
					height: hoverItem.offsetHeight,
				});
			}
		}
	}, [hoverIdx, activeIndex]);

	const showHoverIndicator =
		isHovering && hoverIdx !== null && hoverIdx !== activeIndex;

	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0, y: -4 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -4 }}
				transition={{ duration: 0.15, ease: "easeInOut" }}
			>
				{/* Header */}
				<motion.div
					className="flex items-center justify-between border-stroke-soft-200 border-b px-3 py-3"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.15, delay: 0.05 }}
				>
					<p className="text-sm text-text-soft-400">Organizations</p>
					<button
						type="button"
						onClick={onClose}
						className="flex h-6 w-6 items-center justify-center rounded-md text-text-soft-400 transition-all hover:bg-neutral-alpha-10 hover:text-text-sub-600 active:scale-[0.98]"
					>
						<Icon name="cross" className="h-3 w-3" />
					</button>
				</motion.div>

				{/* Organizations List */}
				<motion.div
					className="relative space-y-0.5 p-2 pt-1 pb-2"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.15, delay: 0.1 }}
				>
					{/* Active item sliding background - primary color */}
					{activeIndex >= 0 && (
						<AnimatedHoverBackground
							top={activePos.top}
							height={activePos.height}
							isActive={true}
							isPrimary={true}
							zIndex={1}
							className="mx-2"
						/>
					)}

					{/* Hover preview background - neutral color - slides smoothly */}
					<AnimatedHoverBackground
						top={hoverPos.top}
						height={hoverPos.height}
						isVisible={showHoverIndicator}
						zIndex={0}
						className="mx-2"
					/>

					{/* Organization items */}
					<div className="relative z-10 space-y-0.5">
						{organizations.map((organization, index) => {
							const isActive = organization.id === activeOrganization.id;
							return (
								<motion.button
									type="button"
									key={organization.id}
									ref={(el) => {
										orgItemRefs.current[index] = el;
									}}
									onMouseEnter={() => {
										setHoverIdx(index);
										setIsHovering(true);
									}}
									onMouseLeave={() => {
										setIsHovering(false);
									}}
									className={cn(
										"flex min-h-[36px] w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none transition-colors active:scale-[0.98]",
										isActive
											? "text-primary-base"
											: "text-text-sub-600 hover:text-text-strong-950",
									)}
									onClick={() => onSelect(organization)}
									initial={{ opacity: 0, x: -4 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.15, delay: 0.1 + index * 0.03 }}
								>
									<OrgAvatar
										name={organization.name}
										logo={organization.logo}
										size={20}
										isActive={isActive}
									/>
									<span className="flex-1 text-left">{organization.name}</span>
									{isActive && (
										<motion.div
											className="-translate-y-1/2 absolute top-1/2 left-0 h-4 w-1 rounded-r-md bg-primary-base"
											initial={{ opacity: 0, scaleY: 0 }}
											animate={{ opacity: 1, scaleY: 1 }}
											transition={{ duration: 0.2, ease: "easeOut" }}
										/>
									)}
								</motion.button>
							);
						})}
					</div>
				</motion.div>

				{/* Divider */}
				<motion.div
					className="h-px bg-stroke-soft-200"
					initial={{ opacity: 0, scaleX: 0 }}
					animate={{ opacity: 1, scaleX: 1 }}
					transition={{ duration: 0.15, delay: 0.15 }}
				/>

				{/* Action Buttons */}
				<motion.div
					className="space-y-0.5 p-2 pt-1 pb-2"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.15, delay: 0.2 }}
				>
					<motion.button
						type="button"
						className="flex min-h-[36px] w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-text-sub-600 outline-none transition-all hover:bg-neutral-alpha-10 hover:text-text-strong-950 active:scale-[0.98]"
						onClick={onCreateNew}
						initial={{ opacity: 0, x: -4 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.15, delay: 0.22 }}
					>
						<Icon name="plus-outline" className="h-4 w-4" />
						<span>New Organization</span>
					</motion.button>
					<motion.button
						type="button"
						className="flex min-h-[36px] w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-text-sub-600 outline-none transition-all hover:bg-neutral-alpha-10 hover:text-text-strong-950 active:scale-[0.98]"
						onClick={onOrgSettings}
						initial={{ opacity: 0, x: -4 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.15, delay: 0.25 }}
					>
						<Icon name="gear" className="h-4 w-4" />
						<span>Organization Settings</span>
					</motion.button>
					<motion.button
						type="button"
						className="flex min-h-[36px] w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-text-sub-600 outline-none transition-all hover:bg-neutral-alpha-10 hover:text-text-strong-950 active:scale-[0.98]"
						onClick={onInviteMembers}
						initial={{ opacity: 0, x: -4 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.15, delay: 0.28 }}
					>
						<Icon name="users" className="h-4 w-4" />
						<span>Invite Members</span>
					</motion.button>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
