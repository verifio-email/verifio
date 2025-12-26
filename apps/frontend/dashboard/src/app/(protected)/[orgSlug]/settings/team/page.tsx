"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { useState } from "react";
import { InviteModal } from "./invite-modal";
import { TeamFilterDropdown, type TeamFilters } from "./team-filter-dropdown";
import { TeamList } from "./team-list";

const Team = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<TeamFilters>([]);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

	return (
		<div className="flex h-full flex-col">
			{/* Header Section */}
			<div className="relative">
				<div className="px-5 pt-5 pb-4 lg:px-6">
					<h3 className="font-medium text-label-md text-text-strong-950">
						Team
					</h3>
					<p className="text-paragraph-sm text-text-sub-600">
						Manage workspace members, set access levels, and invite new users.
					</p>
				</div>
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Invite Members Section */}
			<div className="relative">
				<div className="flex items-center justify-between px-5 py-4 lg:px-6">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke-soft-200/40 bg-bg-weak-50">
							<Icon name="user-plus" className="h-5 w-5 text-text-sub-600" />
						</div>
						<div>
							<p className="font-medium text-label-sm text-text-strong-950">
								Invite team members
							</p>
							<p className="text-paragraph-xs text-text-sub-600">
								Add new members to collaborate with your team
							</p>
						</div>
					</div>
					<Button.Root size="xsmall" onClick={() => setIsInviteModalOpen(true)}>
						<Icon name="user-plus" className="h-4 w-4" />
						<span>Invite</span>
					</Button.Root>
				</div>
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Team Members Header Section */}
			<div className="relative">
				<div className="px-5 pt-5 pb-4 lg:px-6">
					<h3 className="font-medium text-label-md text-text-strong-950">
						Team Members
					</h3>
					<p className="text-paragraph-sm text-text-sub-600">
						View and manage all members in your workspace
					</p>
				</div>
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Search and Filter Section */}
			<div className="relative">
				<div className="flex items-center gap-3 px-5 py-4 lg:px-6">
					<div className="flex-1">
						<Input.Root size="xsmall">
							<Input.Wrapper>
								<Input.Icon as={Icon} name="search" size="xsmall" />
								<Input.Input
									placeholder="Search name or email"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</Input.Wrapper>
						</Input.Root>
					</div>
					<TeamFilterDropdown value={filters} onChange={setFilters} />
				</div>
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Team List Section */}
			<div className="flex-1">
				<TeamList searchQuery={searchQuery} filters={filters} />
			</div>

			{/* Invite Modal */}
			<InviteModal
				open={isInviteModalOpen}
				onOpenChange={setIsInviteModalOpen}
			/>
		</div>
	);
};

export default Team;
