"use client";

import { cn } from "@fe/docs/lib/cn";
import { useState } from "react";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
	showLineNumbers?: boolean;
}

export function CodeBlock({
	code,
	language = "typescript",
	filename,
	showLineNumbers = false,
}: CodeBlockProps) {
	return (
		<div className="group relative overflow-hidden rounded-lg border border-fd-border bg-fd-secondary">
			{filename && (
				<div className="flex items-center gap-2 border-fd-border border-b bg-fd-muted/50 px-4 py-2">
					<span className="font-medium text-fd-muted-foreground text-xs">
						{filename}
					</span>
				</div>
			)}
			<div className="relative">
				<CopyButton
					value={code}
					className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
				/>
				<pre
					className={cn(
						"overflow-x-auto p-4 text-sm",
						showLineNumbers && "pl-12",
					)}
				>
					<code className={`language-${language}`}>{code}</code>
				</pre>
			</div>
		</div>
	);
}

interface CodeGroupTab {
	label: string;
	language?: string;
	code: string;
}

interface CodeGroupProps {
	tabs: CodeGroupTab[];
	className?: string;
}

export function CodeGroup({ tabs, className }: CodeGroupProps) {
	const [activeTab, setActiveTab] = useState(0);

	if (!tabs.length) return null;

	const currentTab = tabs[activeTab] ?? tabs[0];
	if (!currentTab) return null;

	return (
		<div
			className={cn(
				"not-prose my-4 overflow-hidden rounded-xl border border-fd-border bg-fd-secondary",
				className,
			)}
		>
			{/* Tab headers */}
			<div className="flex border-fd-border border-b bg-fd-muted/50">
				{tabs.map((tab, index) => (
					<button
						key={tab.label}
						type="button"
						onClick={() => setActiveTab(index)}
						className={cn(
							"px-4 py-2.5 font-medium text-sm transition-colors",
							activeTab === index
								? "border-fd-primary border-b-2 text-fd-foreground"
								: "text-fd-muted-foreground hover:text-fd-foreground",
						)}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab content */}
			<div className="group relative">
				<CopyButton
					value={currentTab.code}
					className="absolute top-3 right-3 z-10 opacity-0 transition-opacity group-hover:opacity-100"
				/>
				<pre className="overflow-x-auto p-4 text-sm">
					<code className={`language-${currentTab.language || "bash"}`}>
						{currentTab.code}
					</code>
				</pre>
			</div>
		</div>
	);
}
