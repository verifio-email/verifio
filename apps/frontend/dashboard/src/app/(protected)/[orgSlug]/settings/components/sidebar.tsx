"use client";
import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const list = [
	{
		title: "General",
		path: "/settings",
		iconName: "gear",
	},
	{
		title: "Account",
		path: "/settings/account",
		iconName: "user",
	},
	{
		title: "Team",
		path: "/settings/team",
		iconName: "users",
	},
	{
		title: "Security",
		path: "/settings/security",
		iconName: "shield-check",
	},
	{
		title: "Appearance",
		path: "/settings/appearance",
		iconName: "swatch-book",
	},
];

export const SettingsSidebar = () => {
	const pathname = usePathname();
	const { activeOrganization } = useUserOrganization();

	// Extract path without org slug
	const pathWithoutSlug = pathname.replace(/^\/[^/]+/, "") || "/";

	// Match current path to list items
	const isActive = (itemPath: string) => {
		if (itemPath === "/settings") {
			return pathWithoutSlug === "/settings" || pathWithoutSlug === "/";
		}
		return (
			pathWithoutSlug === itemPath || pathWithoutSlug.startsWith(itemPath + "/")
		);
	};

	return (
		<nav className="relative">
			{/* Background highlight for active tab */}
			<div className="space-y-1.5">
				{list.map(({ path, title, iconName }) => {
					const active = isActive(path);
					return (
						<Link
							key={path}
							href={`/${activeOrganization.slug}${path}`}
							className={cn(
								"group relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left transition-all",
								active ? "bg-primary-alpha-10" : "hover:bg-bg-weak-50",
							)}
						>
							<div className="flex h-10 flex-shrink-0 items-center justify-center">
								<Icon
									name={iconName}
									className={cn(
										"h-4 w-4 transition-all",
										active
											? "text-primary"
											: "text-text-soft-400 group-hover:text-text-sub-600",
									)}
								/>
							</div>
							<span
								className={cn(
									"flex-1 font-medium text-sm transition-all",
									active
										? "text-primary"
										: "text-text-sub-600 group-hover:text-text-strong-950",
								)}
							>
								{title}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};
