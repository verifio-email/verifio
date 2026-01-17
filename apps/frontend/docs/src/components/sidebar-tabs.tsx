"use client";

import { cn } from "@fe/docs/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenIcon, Laptop, ServerIcon, TerminalIcon } from "./icons/Tech";

interface TabItem {
	title: string;
	description: string;
	href: string;
	icon: React.ReactNode;
}

const tabs: TabItem[] = [
	{
		title: "Documentation",
		description: "Guides and tutorials",
		href: "/guides",
		icon: <BookOpenIcon className="size-5" />,
	},
	{
		title: "API Reference",
		description: "Endpoint documentation",
		href: "/api-reference",
		icon: <TerminalIcon className="size-5" />,
	},
	{
		title: "Self Hosted",
		description: "Deploy on your own server",
		href: "/self-hosted",
		icon: <ServerIcon className="size-5" />,
	},
	{
		title: "Local Setup",
		description: "Development environment",
		href: "/local-setup",
		icon: <Laptop className="size-5" />,
	},
];

export function SidebarTabs() {
	const pathname = usePathname();

	const isActive = (href: string) => {
		// Remove leading slash for comparison
		const path = href.replace(/^\//, "");
		return pathname.includes(path);
	};

	return (
		<div className="flex flex-col gap-1">
			{tabs.map((tab) => (
				<Link
					key={tab.href}
					href={tab.href}
					className={cn(
						"flex items-center gap-1 rounded-xl px-1.5 py-1.5 transition-colors",
						isActive(tab.href)
							? "font-medium"
							: "text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-foreground",
					)}
				>
					<span
						className={cn(
							"flex size-7 items-center justify-center p-1",
							isActive(tab.href) ? "opacity-100" : "opacity-60",
						)}
					>
						{tab.icon}
					</span>
					<span className="text-base">{tab.title}</span>
				</Link>
			))}
		</div>
	);
}
