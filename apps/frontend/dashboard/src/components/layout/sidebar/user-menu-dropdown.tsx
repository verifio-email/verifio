"use client";

import { userNavigation } from "@fe/dashboard/constants";
import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import * as Dropdown from "@verifio/ui/dropdown";
import { Icon } from "@verifio/ui/icon";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AnimatedHoverBackground } from "./animated-hover-background";

interface User {
	name: string;
	email: string;
	image?: string | null;
}

interface UserMenuDropdownProps {
	user: User;
	organizationSlug: string;
	isCollapsed?: boolean;
}

// Avatar with first letter and primary color background
const UserAvatar = ({
	name,
	email,
	image,
	size = 20,
}: {
	name: string;
	email: string;
	image?: string | null;
	size?: number;
}) => {
	// Use first letter of name, or first letter of email if no name
	const displayLetter =
		name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || "U";

	if (image) {
		return (
			<img
				src={image}
				alt={name || email}
				className="shrink-0 rounded-full object-cover"
				style={{ width: size, height: size }}
			/>
		);
	}

	return (
		<div
			className="flex shrink-0 items-center justify-center rounded-full bg-primary-base font-medium text-white"
			style={{
				width: size,
				height: size,
				fontSize: size * 0.5,
			}}
		>
			{displayLetter}
		</div>
	);
};

export const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({
	user,
	organizationSlug,
	isCollapsed = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [hoverIdx, setHoverIdx] = useState<number | undefined>(undefined);
	const buttonRefs = useRef<HTMLButtonElement[]>([]);
	const router = useRouter();

	const currentTab = buttonRefs.current[hoverIdx ?? -1];
	const currentRect = currentTab?.getBoundingClientRect();
	const hoveredItem = userNavigation[hoverIdx ?? -1];
	const isDanger = hoveredItem?.variant === "danger";

	const handleAction = async (
		path: string,
		action: string | undefined,
		isExternal?: boolean,
	) => {
		setIsOpen(false);
		if (action === "signout") {
			await authClient.signOut();
			router.push("/login");
		} else if (isExternal) {
			window.open(path, "_blank");
		} else {
			router.push(`/${organizationSlug}${path}`);
		}
	};

	return (
		<Dropdown.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dropdown.Trigger asChild>
				<Button.Root
					mode="ghost"
					className={cn(
						"flex h-auto w-full cursor-pointer items-center gap-2 px-1.5 py-1.5",
						isCollapsed ? "justify-center" : "justify-start",
						isOpen && "bg-bg-weak-50",
					)}
				>
					<UserAvatar
						name={user.name}
						email={user.email}
						image={user.image}
						size={20}
					/>
					{!isCollapsed && (
						<p className="truncate font-medium text-sm text-text-sub-600">
							{user.email}
						</p>
					)}
				</Button.Root>
			</Dropdown.Trigger>
			<Dropdown.Content
				sideOffset={16}
				className="w-64 p-0"
				side="top"
				align="start"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-stroke-soft-200 border-b px-4 py-3">
					<p className="font-medium text-sm text-text-strong-950">Account</p>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="flex h-6 w-6 items-center justify-center rounded text-text-sub-600 transition-colors hover:bg-bg-weak-50"
					>
						<Icon name="close" className="h-4 w-4" />
					</button>
				</div>

				{/* Menu items */}
				<div className="relative p-2">
					{userNavigation.map(
						(
							{
								path,
								label,
								iconName,
								variant,
								action,
								hasSeparatorAbove,
								isExternal,
							},
							navIdx,
						) => {
							const isItemDanger = variant === "danger";
							return (
								<div key={path + label}>
									{hasSeparatorAbove && (
										<div className="my-2 border-stroke-soft-200" />
									)}
									<button
										ref={(el) => {
											if (el) {
												buttonRefs.current[navIdx] = el;
											}
										}}
										type="button"
										onPointerEnter={() => setHoverIdx(navIdx)}
										onPointerLeave={() => setHoverIdx(undefined)}
										className={cn(
											"flex w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg px-3 py-2.5 font-normal transition-colors",
											isItemDanger ? "text-red-500" : "text-text-strong-950",
											!currentRect &&
												hoverIdx === navIdx &&
												(isItemDanger ? "bg-red-50" : "bg-bg-weak-50"),
										)}
										onClick={() => handleAction(path, action, isExternal)}
									>
										<Icon
											name={iconName}
											className={cn(
												"h-4 w-4",
												isItemDanger ? "" : "text-text-sub-600",
											)}
										/>
										<p className="text-sm">{label}</p>
									</button>
								</div>
							);
						},
					)}
					<AnimatedHoverBackground
						rect={currentRect}
						tabElement={currentTab}
						isDanger={isDanger}
					/>
				</div>
			</Dropdown.Content>
		</Dropdown.Root>
	);
};
