"use client";

import { InviteModal } from "@fe/dashboard/app/(protected)/[orgSlug]/settings/team/invite-modal";
import { useOrgStore } from "@fe/dashboard/store/use-org-store";
import { cn } from "@verifio/ui/cn";
import * as Dropdown from "@verifio/ui/dropdown";
import { Icon } from "@verifio/ui/icon";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

// Organization Avatar - shows first letter with primary color
const OrgAvatar = ({
	name,
	size = 20,
	isActive = false,
}: {
	name: string;
	size?: number;
	isActive?: boolean;
}) => {
	const displayLetter = name?.charAt(0)?.toUpperCase() || "O";

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
							<OrgAvatar name={activeOrganization.name} size={20} isActive />
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
						<OrgAvatar name={activeOrganization.name} size={16} isActive />
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
	if (!organizations) return null;

	return (
		<>
			{/* Header */}
			<div className="flex items-center justify-between border-stroke-soft-200 border-b px-3 py-3">
				<p className="text-sm text-text-soft-400">Organizations</p>
				<button
					type="button"
					onClick={onClose}
					className="flex h-6 w-6 items-center justify-center rounded-md text-text-soft-400 transition-all hover:bg-neutral-alpha-10 hover:text-text-sub-600 active:scale-[0.98]"
				>
					<Icon name="cross" className="h-3 w-3" />
				</button>
			</div>

			{/* Organizations List */}
			<div className="space-y-0.5 p-2 pt-1 pb-2">
				{organizations.map((organization) => {
					const isActive = organization.id === activeOrganization.id;
					return (
						<button
							type="button"
							key={organization.id}
							className={cn(
								"flex min-h-[36px] w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none transition-all active:scale-[0.98]",
								isActive
									? "bg-primary-alpha-10 text-primary-darker"
									: "text-text-sub-600 hover:bg-neutral-alpha-10 hover:text-text-strong-950",
							)}
							onClick={() => onSelect(organization)}
						>
							<OrgAvatar
								name={organization.name}
								size={20}
								isActive={isActive}
							/>
							<span className="flex-1 text-left">{organization.name}</span>
							{isActive && (
								<div className="h-2 w-2 rounded-full bg-primary-base" />
							)}
						</button>
					);
				})}
			</div>

			{/* Divider */}
			<div className="h-px bg-stroke-soft-200" />

			{/* Action Buttons */}
			<div className="space-y-0.5 p-2 pt-1 pb-2">
				<button
					type="button"
					className="flex min-h-[36px] w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-text-sub-600 outline-none transition-all hover:bg-neutral-alpha-10 hover:text-text-strong-950 active:scale-[0.98]"
					onClick={onCreateNew}
				>
					<Icon name="plus-outline" className="h-4 w-4" />
					<span>New Organization</span>
				</button>
				<button
					type="button"
					className="flex min-h-[36px] w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-text-sub-600 outline-none transition-all hover:bg-neutral-alpha-10 hover:text-text-strong-950 active:scale-[0.98]"
					onClick={onOrgSettings}
				>
					<Icon name="gear" className="h-4 w-4" />
					<span>Organization Settings</span>
				</button>
				<button
					type="button"
					className="flex min-h-[36px] w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-text-sub-600 outline-none transition-all hover:bg-neutral-alpha-10 hover:text-text-strong-950 active:scale-[0.98]"
					onClick={onInviteMembers}
				>
					<Icon name="users" className="h-4 w-4" />
					<span>Invite Members</span>
				</button>
			</div>
		</>
	);
};
