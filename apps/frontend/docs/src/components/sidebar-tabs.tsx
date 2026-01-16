"use client";

import { cn } from "@fe/docs/lib/cn";
import { BookOpen, Terminal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
		icon: <BookOpen className="size-4" />,
	},
	{
		title: "API Reference",
		description: "Endpoint documentation",
		href: "/api-reference",
		icon: <Terminal className="size-4" />,
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
		<div className="mb-4 flex flex-col gap-1 border-fd-border border-b pb-4">
			{tabs.map((tab) => (
				<Link
					key={tab.href}
					href={tab.href}
					className={cn(
						"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
						isActive(tab.href)
							? "bg-fd-accent font-medium text-fd-accent-foreground"
							: "text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-foreground",
					)}
				>
					<span
						className={cn(
							"flex size-6 items-center justify-center rounded-md",
							isActive(tab.href)
								? "bg-fd-primary text-fd-primary-foreground"
								: "bg-fd-muted",
						)}
					>
						{tab.icon}
					</span>
					<span>{tab.title}</span>
				</Link>
			))}
		</div>
	);
}
