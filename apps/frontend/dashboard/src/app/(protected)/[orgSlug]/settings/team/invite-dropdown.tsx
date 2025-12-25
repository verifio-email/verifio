"use client";

import { AnimatedHoverBackground } from "@fe/dashboard/components/layout/sidebar/animated-hover-background";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import * as Dropdown from "@verifio/ui/dropdown";
import { Icon } from "@verifio/ui/icon";
import Spinner from "@verifio/ui/spinner";
import { useRef, useState } from "react";
import { toast } from "sonner";

export interface InviteDropdownProps {
	inviteId: string;
	onResendInvite: (id: string) => Promise<void>;
	onCopyInviteLink: (id: string) => void;
	onRevokeInvite: (id: string) => void;
	isResending: boolean;
}

const inviteMenuItems = [
	{
		id: "resend",
		label: "Resend invite",
		icon: "mail" as const,
		isDanger: false,
	},
	{
		id: "copy",
		label: "Copy invite link",
		icon: "link" as const,
		isDanger: false,
	},
	{
		id: "revoke",
		label: "Revoke invite",
		icon: "cross" as const,
		isDanger: true,
	},
];

export const InviteDropdown = ({
	inviteId,
	onResendInvite,
	onCopyInviteLink,
	onRevokeInvite,
	isResending,
}: InviteDropdownProps) => {
	const [hoverIdx, setHoverIdx] = useState<number | undefined>(undefined);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const buttonRefs = useRef<HTMLButtonElement[]>([]);

	const currentTab = buttonRefs.current[hoverIdx ?? -1];

	const hoveredItem = inviteMenuItems[hoverIdx ?? -1];
	const isDanger = hoveredItem?.isDanger ?? false;

	const handleItemClick = async (itemId: string) => {
		if (itemId === "revoke") {
			setDropdownOpen(false);
			onRevokeInvite(inviteId);
		} else if (itemId === "copy") {
			onCopyInviteLink(inviteId);
			setDropdownOpen(false);
		} else if (itemId === "resend") {
			await onResendInvite(inviteId);
			setDropdownOpen(false);
		}
	};

	return (
		<Dropdown.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<Dropdown.Trigger asChild>
				<Button.Root variant="neutral" mode="ghost" size="xxsmall">
					<Icon name="more-vertical" className="h-3 w-3" />
				</Button.Root>
			</Dropdown.Trigger>
			<Dropdown.Content align="end" className="w-40 p-1.5">
				<div className="relative">
					{inviteMenuItems.map((item, idx) => (
						<button
							key={item.id}
							ref={(el) => {
								if (el) buttonRefs.current[idx] = el;
							}}
							type="button"
							onPointerEnter={() => setHoverIdx(idx)}
							onPointerLeave={() => setHoverIdx(undefined)}
							onClick={() => handleItemClick(item.id)}
							disabled={item.id === "resend" && isResending}
							className={cn(
								"flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 font-normal text-xs transition-colors",
								item.isDanger ? "text-error-base" : "text-text-strong-950",
								isResending &&
									item.id === "resend" &&
									"cursor-not-allowed opacity-50",
							)}
						>
							{item.id === "resend" && isResending ? (
								<Spinner size={14} color="var(--text-sub-600)" />
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
			</Dropdown.Content>
		</Dropdown.Root>
	);
};
