"use client";

import { userNavigation } from "@fe/dashboard/constants";
import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import * as Dropdown from "@verifio/ui/dropdown";
import { Icon } from "@verifio/ui/icon";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
	const [hoverIdx, setHoverIdx] = useState<number | null>(null);
	const [isHovering, setIsHovering] = useState(false);
	const [hoverPos, setHoverPos] = useState({ top: 0, height: 36 });
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const router = useRouter();

	const hoveredItem = hoverIdx !== null ? userNavigation[hoverIdx] : null;
	const isDanger = hoveredItem?.variant === "danger";

	// Update hover position when hoverIdx changes
	useEffect(() => {
		if (hoverIdx !== null) {
			const hoverItem = buttonRefs.current[hoverIdx];
			if (hoverItem) {
				setHoverPos({
					top: hoverItem.offsetTop,
					height: hoverItem.offsetHeight,
				});
			}
		}
	}, [hoverIdx]);

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
						"flex h-12 w-full cursor-pointer items-center gap-2 px-2 py-2",
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
				sideOffset={0}
				className="w-[232px] overflow-hidden rounded-2xl border border-stroke-soft-200 bg-white p-0"
				style={{
					boxShadow:
						"rgba(0, 0, 0, 0.08) 0px 12px 24px, rgba(0, 0, 0, 0.04) 0px 4px 8px",
				}}
				side="top"
				align="start"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-stroke-soft-200 border-b px-3 py-3">
					<p className="text-sm text-text-soft-400">Account</p>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="flex h-6 w-6 items-center justify-center rounded-md text-text-soft-400 transition-all hover:bg-neutral-alpha-10 hover:text-text-sub-600 active:scale-[0.98]"
					>
						<Icon name="cross" className="h-3 w-3" />
					</button>
				</div>

				{/* Menu items */}
				<div className="relative space-y-0.5 p-2 px-1">
					{/* Hover background */}
					<AnimatedHoverBackground
						top={hoverPos.top}
						height={hoverPos.height}
						isVisible={isHovering}
						isDanger={isDanger}
						zIndex={0}
						className="right-2 left-2"
					/>

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
										<div className="mx-0 my-1.5 h-px bg-stroke-soft-200" />
									)}
									<button
										ref={(el) => {
											buttonRefs.current[navIdx] = el;
										}}
										type="button"
										onMouseEnter={() => {
											setHoverIdx(navIdx);
											setIsHovering(true);
										}}
										onMouseLeave={() => {
											setIsHovering(false);
										}}
										className={cn(
											"relative z-10 flex min-h-[36px] w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none transition-all active:scale-[0.98]",
											isItemDanger
												? "text-red-600/70 hover:text-red-600"
												: "text-text-sub-600 hover:text-text-strong-950",
										)}
										onClick={() => handleAction(path, action, isExternal)}
									>
										<Icon name={iconName} className="h-4 w-4" />
										<span>{label}</span>
									</button>
								</div>
							);
						},
					)}
				</div>
			</Dropdown.Content>
		</Dropdown.Root>
	);
};
