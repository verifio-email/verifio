"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { useSidebar } from "@fe/dashboard/providers/sidebar-provider";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

interface ApiKeyData {
	id: string;
	name: string | null;
	key: string;
	start: string | null;
	prefix: string | null;
	enabled: boolean;
}

interface ApiKeyListResponse {
	apiKeys: ApiKeyData[];
}

// Left Column: Email Stats Section
const EmailStatsSection = () => {
	return (
		<div className="flex-1 p-6">
			<div className="mb-2 flex items-center justify-between">
				<div>
					<h3 className="font-semibold text-lg text-text-strong-950">
						Emails Verified - Last 7 days
					</h3>
					<p className="text-[13px] text-text-sub-600">Credit usage differs</p>
				</div>
				<span className="font-semibold text-3xl text-text-strong-950">0</span>
			</div>

			{/* Placeholder for chart - shows empty state */}
			<div className="h-40 w-full" />

			{/* Timeline markers */}
			<div className="mt-2 flex justify-between border-stroke-soft-200/50 border-t pt-2">
				<span className="text-text-sub-600 text-xs">12/18</span>
				<span className="text-text-sub-600 text-xs">12/21</span>
				<span className="text-text-sub-600 text-xs">12/25</span>
			</div>
		</div>
	);
};

// Left Column: Concurrent Requests Section
const ConcurrentRequestsSection = () => {
	return (
		<div className="border-stroke-soft-200/50 border-t p-6">
			<div className="mb-4 flex items-center gap-2">
				<h3 className="font-semibold text-lg text-text-strong-950">
					Concurrent Requests
				</h3>
				<span className="rounded bg-success-base px-2 py-0.5 font-medium text-[10px] text-static-white uppercase">
					LIVE
				</span>
			</div>
			<p className="mb-4 text-[13px] text-text-sub-600">
				# of active requests —{" "}
				<span className="cursor-pointer text-primary-base hover:underline">
					upgrade plan
				</span>{" "}
				for higher limits
			</p>

			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke-soft-200/50 bg-bg-weak-50">
					<span className="font-semibold text-lg text-text-strong-950">0</span>
				</div>
				<span className="text-[13px] text-text-sub-600">
					of <span className="text-primary-base">2</span> active requests
				</span>
			</div>
		</div>
	);
};

// Right Column: API Key Section
const ApiKeySection = () => {
	const { activeOrganization } = useUserOrganization();
	const [isVisible, setIsVisible] = useState(false);

	const { data, isLoading } = useSWR<ApiKeyListResponse>(
		activeOrganization?.id ? "/api/api-key/v1" : null,
	);

	const apiKey = data?.apiKeys?.[0];
	const fullKey = apiKey?.key || "";

	// Get display key - both masked and revealed should be same length
	const getDisplayKey = (key: string, isRevealed: boolean) => {
		if (!key || key.length < 10) return key || "---";

		const displayLength = 32; // Fixed display length
		const prefixLen = 2;
		const suffixLen = 2;

		if (!isRevealed) {
			// Masked: prefix + asterisks + suffix
			const prefix = key.slice(0, prefixLen);
			const suffix = key.slice(-suffixLen);
			const asteriskCount = displayLength - prefixLen - suffixLen;
			return `${prefix}${"*".repeat(asteriskCount)}${suffix}`;
		}
		// Revealed: show more real chars but truncate middle with ...
		if (key.length <= displayLength) {
			return key; // Key fits, show all
		}
		// Show first 14 chars + ... + last 14 chars = ~31 chars
		const showStart = key.slice(0, 21);
		const showEnd = key.slice(-21);
		return `${showStart}...${showEnd}`;
	};

	const handleCopy = async () => {
		if (fullKey) {
			try {
				await navigator.clipboard.writeText(fullKey);
				toast.success("API key copied to clipboard");
			} catch {
				toast.error("Failed to copy API key");
			}
		}
	};

	return (
		<div className="w-full p-6">
			<div className="mb-2 flex items-center justify-between">
				<div>
					<h3 className="font-semibold text-lg text-text-strong-950">
						API Key
					</h3>
					<p className="text-[13px] text-text-sub-600">
						Start verifying right away
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="flex h-12 items-center justify-center rounded-lg bg-bg-weak-50">
					<span className="text-sm text-text-sub-600">Loading...</span>
				</div>
			) : (
				<div className="flex w-full items-center gap-2 rounded-lg bg-primary-alpha-10 px-4 py-3">
					<code className="min-w-0 flex-1 truncate font-mono text-sm text-text-sub-600">
						{getDisplayKey(fullKey, isVisible)}
					</code>
					<button
						type="button"
						onClick={() => setIsVisible(!isVisible)}
						className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded transition-colors hover:bg-primary-alpha-20"
						aria-label={isVisible ? "Hide API key" : "Show API key"}
					>
						<Icon
							name={isVisible ? "eye-slash-outline" : "eye-outline"}
							className="h-4 w-4 text-text-sub-600"
						/>
					</button>
					<button
						type="button"
						onClick={handleCopy}
						className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded transition-colors hover:bg-primary-alpha-20"
						aria-label="Copy API key"
					>
						<Icon name="copy" className="h-4 w-4 text-text-sub-600" />
					</button>
				</div>
			)}
		</div>
	);
};

// Right Column: MCP Integration Section
const McpIntegrationSection = () => {
	const [isVisible, setIsVisible] = useState(false);

	const handleCopy = async () => {
		const codeSnippet = `{
  "mcpServers": {
    "verifio-mcp": {
      "command": "npx",
      "args": ["-y", "verifio-mcp"],
      "env": {
        "VERIFIO_API_KEY": "$API_KEY"
      }
    }
  }
}`;
		try {
			await navigator.clipboard.writeText(codeSnippet);
			toast.success("Code copied to clipboard");
		} catch {
			toast.error("Failed to copy code");
		}
	};

	return (
		<div className="border-stroke-soft-200/50 border-t p-6">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h3 className="font-semibold text-lg text-text-strong-950">
						MCP Integration
					</h3>
					<p className="text-[13px] text-text-sub-600">Connect with AI tools</p>
				</div>
				<Icon
					name="chevron-right"
					className="h-5 w-5 cursor-pointer text-text-sub-600"
				/>
			</div>

			<div className="relative rounded-lg bg-bg-weak-50 p-4">
				<div className="absolute top-2 right-2 flex gap-1">
					<button
						type="button"
						onClick={() => setIsVisible(!isVisible)}
						className="flex h-8 w-8 items-center justify-center rounded border border-stroke-soft-200/50 bg-bg-white-0 transition-colors hover:bg-bg-weak-50"
						aria-label={isVisible ? "Hide code" : "Show code"}
					>
						<Icon
							name={isVisible ? "eye-slash-outline" : "eye-outline"}
							className="h-4 w-4 text-text-sub-600"
						/>
					</button>
					<button
						type="button"
						onClick={handleCopy}
						className="flex h-8 w-8 items-center justify-center rounded border border-stroke-soft-200/50 bg-bg-white-0 transition-colors hover:bg-bg-weak-50"
						aria-label="Copy code"
					>
						<Icon name="copy" className="h-4 w-4 text-text-sub-600" />
					</button>
				</div>

				<pre className="overflow-x-auto text-sm leading-relaxed">
					<code>
						<span className="text-text-sub-600">{"{"}</span>
						{"\n"}
						<span className="text-text-sub-600">{"  "}</span>
						<span className="text-primary-base">"mcpServers"</span>
						<span className="text-text-sub-600">{": {"}</span>
						{"\n"}
						<span className="text-text-sub-600">{"    "}</span>
						<span className="text-primary-base">"verifio-mcp"</span>
						<span className="text-text-sub-600">{": {"}</span>
						{"\n"}
						<span className="text-text-sub-600">{"      "}</span>
						<span className="text-primary-base">"command"</span>
						<span className="text-text-sub-600">{": "}</span>
						<span className="text-primary-base">"npx"</span>
						<span className="text-text-sub-600">{","}</span>
						{"\n"}
						<span className="text-text-sub-600">{"      "}</span>
						<span className="text-primary-base">"args"</span>
						<span className="text-text-sub-600">{": ["}</span>
						<span className="text-primary-base">"-y"</span>
						<span className="text-text-sub-600">{", "}</span>
						<span className="text-primary-base">"verifio-mcp"</span>
						<span className="text-text-sub-600">{"],"}</span>
						{"\n"}
						<span className="text-text-sub-600">{"      "}</span>
						<span className="text-primary-base">"env"</span>
						<span className="text-text-sub-600">{": {"}</span>
						{"\n"}
						<span className="text-text-sub-600">{"        "}</span>
						<span className="text-primary-base">"VERIFIO_API_KEY"</span>
						<span className="text-text-sub-600">{": "}</span>
						<span className="text-primary-base">"$API_KEY"</span>
						{"\n"}
						<span className="text-text-sub-600">{"      }"}</span>
						{"\n"}
						<span className="text-text-sub-600">{"    }"}</span>
						{"\n"}
						<span className="text-text-sub-600">{"  }"}</span>
						{"\n"}
						<span className="text-text-sub-600">{"}"}</span>
					</code>
				</pre>
			</div>
		</div>
	);
};

// Main Dashboard Stats Section
export const DashboardStatsSection = () => {
	const { isCollapsed } = useSidebar();

	return (
		<div className="border-stroke-soft-200/50 border-b">
			<div className={cn(isCollapsed ? "px-24 2xl:px-32" : "px-6 2xl:px-32")}>
				<div className="flex flex-col border-stroke-soft-200/50 border-r border-l lg:flex-row">
					{/* Left Column */}
					<div className="flex-1 border-stroke-soft-200/50 border-r">
						<EmailStatsSection />
						<ConcurrentRequestsSection />
					</div>

					{/* Right Column */}
					<div className="flex-1">
						<ApiKeySection />
						<McpIntegrationSection />
					</div>
				</div>
			</div>
		</div>
	);
};
