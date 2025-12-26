"use client";

import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import type React from "react";

// Integration item data
interface Integration {
	name: string;
	icon: string;
	href?: string;
	isExternal?: boolean;
}

// Example project data
interface ExampleProject {
	title: string;
	description: string;
	tags: { label: string; color: "orange" | "yellow" | "blue" }[];
}

const integrations: Integration[] = [
	{ name: "Python", icon: "code", href: "#" },
	{ name: "JS/TS SDK", icon: "code", href: "#" },
	{ name: "Langchain", icon: "link", href: "#" },
	{ name: "Langchain JS", icon: "link", href: "#" },
	{ name: "LlamaIndex", icon: "layers", href: "#" },
	{ name: "Zapier", icon: "zap", href: "#" },
	{ name: "Make", icon: "settings", href: "#" },
	{ name: "Discord", icon: "message-circle", href: "#" },
	{ name: "CrewAI", icon: "users", href: "#" },
	{ name: "Dify", icon: "box", href: "#" },
	{ name: "Flowise", icon: "git-branch", href: "#", isExternal: true },
	{ name: "Pipedream", icon: "activity", href: "#" },
	{ name: "n8n", icon: "repeat", href: "#" },
	{ name: "Composio", icon: "package", href: "#" },
	{ name: "Langflow", icon: "git-merge", href: "#" },
	{ name: "Vectorize", icon: "database", href: "#" },
	{ name: "CAMEL-AI", icon: "cpu", href: "#" },
	{ name: "Praison AI", icon: "brain", href: "#" },
	{ name: "Superinterface", icon: "layout", href: "#" },
	{ name: "SourceSync.ai", icon: "refresh-cw", href: "#" },
	{ name: "Cargo", icon: "truck", href: "#" },
	{ name: "Pabbly Conne...", icon: "plug", href: "#" },
	{ name: "Abstra", icon: "terminal", href: "#" },
	{ name: "ViaSocket", icon: "globe", href: "#" },
];

const exampleProjects: ExampleProject[] = [
	{
		title: "30+ Examples",
		description: "Collection of simple projects built with Verifio",
		tags: [
			{ label: "TypeScript", color: "orange" },
			{ label: "Python", color: "yellow" },
			{ label: "Verifio SDK", color: "orange" },
		],
	},
	{
		title: "LLMs.txt Generator",
		description: "Generate an llms.txt with this web app built on Next.js",
		tags: [
			{ label: "TypeScript", color: "orange" },
			{ label: "Next.js", color: "yellow" },
			{ label: "Verifio SDK", color: "orange" },
		],
	},
	{
		title: "Trend Finder",
		description: "Stay on top of trending topics on the web with AI",
		tags: [
			{ label: "TypeScript", color: "orange" },
			{ label: "Verifio SDK", color: "orange" },
		],
	},
	{
		title: "Open Deep Research",
		description: "Open source version of OpenAI's Deep Research",
		tags: [
			{ label: "Next.js", color: "yellow" },
			{ label: "AI SDK", color: "blue" },
			{ label: "Verifio SDK", color: "orange" },
		],
	},
];

// Tag component
const Tag: React.FC<{ label: string; color: "orange" | "yellow" | "blue" }> = ({
	label,
	color,
}) => {
	const colorClasses = {
		orange: "bg-primary-alpha-16 text-primary-base",
		yellow: "bg-warning-alpha-16 text-warning-base",
		blue: "bg-information-alpha-16 text-information-base",
	};

	return (
		<span
			className={`rounded px-2 py-0.5 font-mono text-xs ${colorClasses[color]}`}
		>
			{label}
		</span>
	);
};

// Integration item component
const IntegrationItem: React.FC<{
	integration: Integration;
	isLastColumn: boolean;
}> = ({ integration, isLastColumn }) => {
	return (
		<Link
			href={integration.href || "#"}
			className={`flex items-center gap-3 border-stroke-soft-200/50 border-b px-4 py-3 transition-colors hover:bg-bg-weak-50 ${!isLastColumn ? "border-r" : ""}`}
		>
			<Icon name={integration.icon} className="h-5 w-5 text-text-sub-600" />
			<span className="text-sm text-text-strong-950">{integration.name}</span>
			{integration.isExternal && (
				<Icon
					name="external-link"
					className="ml-auto h-3.5 w-3.5 text-primary-base"
				/>
			)}
		</Link>
	);
};

// Example project item component
const ExampleProjectItem: React.FC<{ project: ExampleProject }> = ({
	project,
}) => {
	return (
		<div className="border-stroke-soft-200/50 border-b p-4 last:border-b-0">
			<h4 className="font-medium font-mono text-sm text-text-strong-950">
				{project.title}
			</h4>
			<p className="mt-1 text-[13px] text-text-sub-600">
				{project.description}
			</p>
			<div className="mt-2 flex flex-wrap gap-1.5">
				{project.tags.map((tag, index) => (
					<Tag key={index} label={tag.label} color={tag.color} />
				))}
			</div>
		</div>
	);
};

// Integrations grid component
const IntegrationsSection = () => {
	return (
		<div className="flex-1">
			<div className="border-stroke-soft-200/50 border-b p-6 pb-4">
				<h3 className="font-semibold text-lg text-text-strong-950">
					Integrations
				</h3>
			</div>
			<div className="grid grid-cols-3">
				{integrations.map((integration, index) => (
					<IntegrationItem
						key={index}
						integration={integration}
						isLastColumn={(index + 1) % 3 === 0}
					/>
				))}
			</div>
		</div>
	);
};

// Example projects component
const ExampleProjectsSection = () => {
	return (
		<div className="flex-1">
			<div className="border-stroke-soft-200/50 border-b p-6 pb-4">
				<h3 className="font-semibold text-lg text-text-strong-950">
					Example Projects
				</h3>
			</div>
			<div>
				{exampleProjects.map((project, index) => (
					<ExampleProjectItem key={index} project={project} />
				))}
			</div>
		</div>
	);
};

// Main Integrations and Examples Section
export const IntegrationsExamplesSection = () => {
	const { isCollapsed } = useSidebar();

	return (
		<div className="border-stroke-soft-200/50 border-b">
			<div className={cn(isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32")}>
				<div className="flex flex-col border-stroke-soft-200/50 border-r border-l lg:flex-row">
					{/* Left Column - Integrations */}
					<div className="flex-1 border-stroke-soft-200/50 border-r">
						<IntegrationsSection />
					</div>

					{/* Right Column - Example Projects */}
					<div className="flex-1">
						<ExampleProjectsSection />
					</div>
				</div>
			</div>
		</div>
	);
};
