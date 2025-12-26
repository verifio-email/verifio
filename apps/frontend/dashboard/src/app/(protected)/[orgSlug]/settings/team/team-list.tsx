"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import * as Dropdown from "@verifio/ui/dropdown";
import { Icon } from "@verifio/ui/icon";
import { Skeleton } from "@verifio/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

interface Member {
	id: string;
	role: string;
	user: {
		id: string;
		name: string | null;
		email: string;
		image?: string | null;
	};
	createdAt: Date;
}

interface Invite {
	id: string;
	email: string;
	role: string;
	status: string;
	expiresAt: Date;
	inviterId: string;
}

interface TeamListProps {
	searchQuery: string;
	filters?: ("invited" | "suspended" | "active")[];
}

const getFirstChar = (name: string | null, email: string) => {
	if (name && name.length > 0) {
		return name.charAt(0).toUpperCase();
	}
	const emailPart = email.split("@")[0];
	if (!emailPart) return "?";
	return emailPart.charAt(0).toUpperCase();
};

const getRoleBadgeStyles = (role: string) => {
	switch (role.toLowerCase()) {
		case "owner":
			return "border border-warning-base text-warning-base bg-warning-light/20";
		case "admin":
			return "border border-feature-base text-feature-base bg-feature-light/20";
		default:
			return "border border-stroke-soft-200 text-text-sub-600 bg-neutral-alpha-10";
	}
};

const formatRoleLabel = (role: string) => {
	switch (role.toLowerCase()) {
		case "owner":
			return "Owner";
		case "admin":
			return "Admin";
		case "member":
			return "Member";
		default:
			return role;
	}
};

const getAnimationProps = (row: number, column: number) => {
	return {
		initial: { opacity: 0, y: "-100%" },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: "100%" },
		transition: {
			duration: 0.5,
			delay: row * 0.07 + column * 0.1,
			ease: [0.65, 0, 0.35, 1] as const,
		},
	};
};

const TeamSkeleton = () => (
	<div className="relative">
		{/* Top border extending to edges */}
		<div className="absolute top-0 right-[-100vw] left-0 h-px bg-stroke-soft-200/50" />
		<div className="flex items-center justify-between px-5 py-4 lg:px-6">
			{/* Left: Avatar + Name */}
			<div className="flex items-center gap-3">
				<Skeleton className="h-8 w-8 rounded-lg" />
				<div className="space-y-1">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-3 w-32" />
				</div>
			</div>
			{/* Right: Role */}
			<div className="flex items-center gap-3">
				<Skeleton className="h-5 w-14 rounded-full" />
				<Skeleton className="h-6 w-6 rounded" />
			</div>
		</div>
	</div>
);

import { InviteDropdown } from "./invite-dropdown";
import { RemoveMemberModal } from "./remove-member-modal";
import { RevokeInviteModal } from "./revoke-invite-modal";

export const TeamList = ({ searchQuery, filters = [] }: TeamListProps) => {
	const { activeOrganization } = useUserOrganization();
	const [removingMember, setRemovingMember] = useState<string | null>(null);
	const [cancellingInvite, setCancellingInvite] = useState<string | null>(null);
	const [resendingInvite, setResendingInvite] = useState<string | null>(null);
	const [revokeModalOpen, setRevokeModalOpen] = useState(false);
	const [inviteToRevoke, setInviteToRevoke] = useState<{
		id: string;
		email: string;
	} | null>(null);
	const [removeMemberModalOpen, setRemoveMemberModalOpen] = useState(false);
	const [memberToRemove, setMemberToRemove] = useState<{
		id: string;
		name: string | null;
		email: string;
	} | null>(null);

	// Fetch members
	const {
		data: membersData,
		isLoading: membersLoading,
		mutate: mutateMembers,
	} = useSWR<{ members: Member[] }>(
		`organization-member-${activeOrganization.id}`,
		async () => {
			const result = await authClient.organization.listMembers({
				query: { organizationId: activeOrganization.id },
			});
			return result.data ?? { members: [] };
		},
	);

	// Fetch invites
	const {
		data: invites,
		isLoading: invitesLoading,
		mutate: mutateInvites,
	} = useSWR<Invite[]>(`invitations-${activeOrganization.id}`, async () => {
		const result = await authClient.organization.listInvitations({
			query: { organizationId: activeOrganization.id },
		});
		return result.data ?? [];
	});

	const { data: session } = authClient.useSession();
	const currentUserId = session?.user?.id;

	// Filter based on search query and filter type
	const filteredData = useMemo(() => {
		const members = membersData?.members ?? [];
		const pendingInvites = (invites ?? []).filter(
			(i) => i.status.toLowerCase() === "pending",
		);

		let filteredMembers = members;
		let filteredInvites = pendingInvites;

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filteredMembers = filteredMembers.filter(
				(m) =>
					m.user.email.toLowerCase().includes(query) ||
					(m.user.name && m.user.name.toLowerCase().includes(query)),
			);
			filteredInvites = filteredInvites.filter((i) =>
				i.email.toLowerCase().includes(query),
			);
		}

		// Apply type filter (multi-select)
		if (filters.length > 0) {
			const showInvited = filters.includes("invited");
			const showSuspended = filters.includes("suspended");
			const showActive = filters.includes("active");

			// If only specific filters are selected, filter accordingly
			if (!showInvited) {
				filteredInvites = [];
			}
			if (!showActive && !showSuspended) {
				filteredMembers = [];
			} else if (showSuspended && !showActive) {
				// TODO: Filter by suspended status when available
				filteredMembers = [];
			} else if (showActive && !showSuspended) {
				// Show only active members
				// filteredMembers already contains all members
			}
		}

		return { members: filteredMembers, invites: filteredInvites };
	}, [membersData, invites, searchQuery, filters]);

	const handleRemoveMember = async (memberId: string) => {
		setRemovingMember(memberId);
		try {
			const { error } = await authClient.organization.removeMember({
				memberIdOrEmail: memberId,
			});
			if (error) {
				toast.error(error.message || "Failed to remove member");
				return;
			}
			toast.success("Member removed successfully");
			mutateMembers();
		} catch (err) {
			toast.error("Failed to remove member");
		} finally {
			setRemovingMember(null);
			setRemoveMemberModalOpen(false);
			setMemberToRemove(null);
		}
	};

	const handleRemoveMemberClick = (member: Member) => {
		setMemberToRemove({
			id: member.id,
			name: member.user.name,
			email: member.user.email,
		});
		setRemoveMemberModalOpen(true);
	};

	const handleConfirmRemoveMember = async () => {
		if (!memberToRemove) return;
		await handleRemoveMember(memberToRemove.id);
	};

	const handleCancelInvite = async (invitationId: string) => {
		setCancellingInvite(invitationId);
		try {
			const { error } = await authClient.organization.cancelInvitation({
				invitationId,
			});
			if (error) {
				toast.error(error.message || "Failed to cancel invitation");
				return;
			}
			toast.success("Invitation cancelled");
			mutateInvites();
		} catch (err) {
			toast.error("Failed to cancel invitation");
		} finally {
			setCancellingInvite(null);
		}
	};

	const handleResendInvite = async (inviteId: string) => {
		const invite = invites?.find((i) => i.id === inviteId);
		if (!invite) return;

		setResendingInvite(inviteId);
		try {
			const { error } = await authClient.organization.inviteMember({
				email: invite.email,
				role: invite.role as "admin" | "member",
				organizationId: activeOrganization.id,
				resend: true,
			});
			if (error) {
				toast.error(error.message || "Failed to resend invitation");
				return;
			}
			toast.success("Invitation resent successfully");
			mutateInvites();
		} catch (err) {
			toast.error("Failed to resend invitation");
		} finally {
			setResendingInvite(null);
		}
	};

	const handleCopyInviteLink = (inviteId: string) => {
		const inviteLink = `${window.location.origin}/accept-invitation?id=${inviteId}`;
		navigator.clipboard.writeText(inviteLink);
		toast.success("Invite link copied to clipboard");
	};

	const handleRevokeInviteClick = (inviteId: string) => {
		const invite = invites?.find((i) => i.id === inviteId);
		if (invite) {
			setInviteToRevoke({ id: invite.id, email: invite.email });
			setRevokeModalOpen(true);
		}
	};

	const handleConfirmRevoke = async () => {
		if (!inviteToRevoke) return;
		await handleCancelInvite(inviteToRevoke.id);
		setRevokeModalOpen(false);
		setInviteToRevoke(null);
	};

	const isLoading = membersLoading || invitesLoading;

	if (isLoading) {
		return (
			<div className="w-full text-paragraph-sm">
				{/* Skeleton rows */}
				<div>
					{Array.from({ length: 3 }).map((_, index) => (
						<TeamSkeleton key={`skeleton-${index}`} />
					))}
					{/* Bottom border for last skeleton */}
					<div className="relative">
						<div className="absolute top-0 right-[-100vw] left-0 h-px bg-stroke-soft-200/50" />
					</div>
				</div>
			</div>
		);
	}

	const noResults =
		filteredData.members.length === 0 && filteredData.invites.length === 0;

	if (noResults && searchQuery) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-weak-50">
					<Icon name="search" className="h-6 w-6 text-text-sub-600" />
				</div>
				<p className="mt-4 font-medium text-text-strong-950">
					No results found
				</p>
				<p className="mt-1 text-sm text-text-sub-600">
					Try a different search term
				</p>
			</div>
		);
	}

	if (noResults) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-weak-50">
					<Icon name="users" className="h-6 w-6 text-text-sub-600" />
				</div>
				<p className="mt-4 font-medium text-text-strong-950">
					No team members yet
				</p>
				<p className="mt-1 text-sm text-text-sub-600">
					Invite members to get started
				</p>
			</div>
		);
	}

	return (
		<AnimatePresence mode="wait">
			<div className="w-full text-paragraph-sm">
				{/* Combined List */}
				<div>
					{/* Pending Invites */}
					{filteredData.invites.map((invite, index) => (
						<div
							key={
								invite.id && invite.id.length > 0
									? `invite-${invite.id}`
									: `invite-idx-${index}`
							}
							className="relative"
						>
							{/* Top border extending to edges */}
							<div className="absolute top-0 right-[-100vw] left-0 h-px bg-stroke-soft-200/50" />
							<div className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-bg-weak-50/50 lg:px-6">
								{/* Left: Avatar + Email */}
								<motion.div
									{...getAnimationProps(index + 1, 0)}
									className="flex items-center gap-3"
								>
									<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-stroke-soft-200/40 bg-bg-weak-50">
										<span className="font-semibold text-sm text-text-sub-600">
											{invite.email.charAt(0).toUpperCase()}
										</span>
									</div>
									<div>
										<p className="font-medium text-label-sm text-text-strong-950">
											{invite.email}
										</p>
										<p className="text-paragraph-xs text-text-sub-600">
											Invite pending
										</p>
									</div>
								</motion.div>

								{/* Right: Role + Actions */}
								<motion.div
									{...getAnimationProps(index + 1, 1)}
									className="flex items-center gap-3"
								>
									<span
										className={cn(
											"inline-flex rounded-full px-2 py-0.5 font-medium text-xs",
											getRoleBadgeStyles(invite.role),
										)}
									>
										{formatRoleLabel(invite.role)}
									</span>
									<InviteDropdown
										inviteId={invite.id}
										onResendInvite={handleResendInvite}
										onCopyInviteLink={handleCopyInviteLink}
										onRevokeInvite={handleRevokeInviteClick}
										isResending={resendingInvite === invite.id}
									/>
								</motion.div>
							</div>
							{/* Bottom border for last invite if no members */}
							{index === filteredData.invites.length - 1 &&
								filteredData.members.length === 0 && (
									<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
								)}
						</div>
					))}

					{/* Members */}
					{filteredData.members.map((member, index) => {
						const isOwner = member.role.toLowerCase() === "owner";
						const isCurrentUser = member.user.id === currentUserId;
						const displayIndex = index + filteredData.invites.length;

						return (
							<div
								key={
									member.id && member.id.length > 0
										? `member-${member.id}`
										: `member-idx-${index}`
								}
								className="relative"
							>
								{/* Top border extending to edges */}
								<div className="absolute top-0 right-[-100vw] left-0 h-px bg-stroke-soft-200/50" />
								<div className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-bg-weak-50/50 lg:px-6">
									{/* Left: Avatar + Name + Email */}
									<motion.div
										{...getAnimationProps(displayIndex + 1, 0)}
										className="flex items-center gap-3"
									>
										<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-stroke-soft-200/40 bg-bg-weak-50">
											{member.user.image ? (
												<img
													src={member.user.image}
													alt={member.user.name || member.user.email}
													className="h-full w-full object-cover"
												/>
											) : (
												<span className="font-semibold text-sm text-text-sub-600">
													{getFirstChar(member.user.name, member.user.email)}
												</span>
											)}
										</div>
										<div>
											<div className="flex items-center gap-1.5">
												<p className="font-medium text-label-sm text-text-strong-950">
													{member.user.name || member.user.email.split("@")[0]}
												</p>
												{isCurrentUser && (
													<span className="rounded-md border border-stroke-soft-200 bg-neutral-alpha-10 px-1.5 py-0.5 font-medium text-[10px] text-text-sub-600">
														You
													</span>
												)}
											</div>
											<p className="text-paragraph-xs text-text-sub-600">
												{member.user.email}
											</p>
										</div>
									</motion.div>

									{/* Right: Role + Actions */}
									<motion.div
										{...getAnimationProps(displayIndex + 1, 1)}
										className="flex items-center gap-3"
									>
										<span
											className={cn(
												"inline-flex rounded-full px-2 py-0.5 font-medium text-xs",
												getRoleBadgeStyles(member.role),
											)}
										>
											{formatRoleLabel(member.role)}
										</span>
										{/* Always reserve space for action button for alignment */}
										{!isOwner && !isCurrentUser ? (
											<Dropdown.Root>
												<Dropdown.Trigger asChild>
													<Button.Root
														variant="neutral"
														mode="ghost"
														size="xxsmall"
													>
														<Icon name="more-vertical" className="h-4 w-4" />
													</Button.Root>
												</Dropdown.Trigger>
												<Dropdown.Content align="end" className="w-52 text-xs">
													<Dropdown.Item
														className="text-error-base"
														onClick={() => handleRemoveMemberClick(member)}
													>
														<Icon name="user-minus" className="h-3 w-3" />
														Remove from organization
													</Dropdown.Item>
												</Dropdown.Content>
											</Dropdown.Root>
										) : (
											<div className="w-9" />
										)}
									</motion.div>
								</div>
								{/* Bottom border for last item */}
								{index === filteredData.members.length - 1 && (
									<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
								)}
							</div>
						);
					})}
				</div>
			</div>
			<RevokeInviteModal
				open={revokeModalOpen}
				onOpenChange={setRevokeModalOpen}
				onConfirm={handleConfirmRevoke}
				isRevoking={cancellingInvite === inviteToRevoke?.id}
				inviteEmail={inviteToRevoke?.email ?? ""}
			/>
			<RemoveMemberModal
				open={removeMemberModalOpen}
				onOpenChange={setRemoveMemberModalOpen}
				onConfirm={handleConfirmRemoveMember}
				isRemoving={removingMember === memberToRemove?.id}
				memberName={memberToRemove?.name ?? ""}
				memberEmail={memberToRemove?.email ?? ""}
			/>
		</AnimatePresence>
	);
};
