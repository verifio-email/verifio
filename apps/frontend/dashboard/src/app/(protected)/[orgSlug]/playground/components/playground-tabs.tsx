"use client";

import { cn } from "@verifio/ui/cn";
import * as FileFormatIcon from "@verifio/ui/file-format-icon";
import { Icon } from "@verifio/ui/icon";
import { motion } from "framer-motion";
import { useQueryState } from "nuqs";
import type { TabType } from "../types";

const tabs = [
	{
		id: "single" as TabType,
		label: "Verify",
		icon: "mail-single",
		useCsvIcon: false,
	},
	{ id: "bulk" as TabType, label: "Bulk", icon: null, useCsvIcon: true },
];

export const PlaygroundTabs = () => {
	const [activeTab, setActiveTab] = useQueryState("tab", {
		defaultValue: "single" as TabType,
	});

	const currentTab = (activeTab || "single") as TabType;

	return (
		<div className="border-stroke-soft-100 border-b">
			<div className="mx-auto max-w-2xl">
				<div className="flex items-center justify-center border-stroke-soft-100 border-r border-l py-6">
					{/* Tab container with gray background */}
					<div className="relative flex items-center gap-1 rounded-xl bg-bg-weak-50 p-0.5">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									"group relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-8 py-2",
									"transition-colors duration-200 ease-out",
									currentTab === tab.id
										? "text-text-strong-950"
										: "text-text-sub-600 hover:text-text-strong-950",
								)}
							>
								{/* Animated background for active tab */}
								{currentTab === tab.id && (
									<motion.div
										layoutId="activeTabBackground"
										className="absolute inset-0 rounded-lg bg-bg-white-0"
										style={{
											boxShadow:
												"rgba(0, 0, 0, 0.04) 0px 6px 12px -3px, rgba(0, 0, 0, 0.04) 0px 3px 6px -1px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.06) 0px 0.5px 0.5px 0px",
										}}
										transition={{
											type: "spring",
											stiffness: 500,
											damping: 35,
										}}
									/>
								)}
								{/* Tab icon */}
								{tab.useCsvIcon ? (
									<FileFormatIcon.Root
										format="CSV"
										color="green"
										className="relative z-10 h-5 w-5"
									/>
								) : (
									<Icon
										name={tab.icon as "mail-single"}
										className={cn(
											"relative z-10 h-4 w-4 transition-colors duration-200",
											currentTab === tab.id
												? "text-primary-base"
												: "text-text-soft-400 group-hover:text-text-sub-600",
										)}
									/>
								)}
								<span className="label-sm relative z-10">{tab.label}</span>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
