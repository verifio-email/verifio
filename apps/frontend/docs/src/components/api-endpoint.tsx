"use client";

import { cn } from "@fe/docs/lib/cn";
import { CopyButton } from "./copy-button";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiEndpointProps {
	method: HttpMethod;
	path: string;
	description?: string;
	authenticated?: boolean;
	children?: React.ReactNode;
}

const methodColors: Record<HttpMethod, string> = {
	GET: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
	POST: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
	PUT: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
	PATCH: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
	DELETE: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export function ApiEndpoint({
	method,
	path,
	description,
	authenticated = true,
	children,
}: ApiEndpointProps) {
	const fullUrl = `https://verifio.email${path}`;

	return (
		<div className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card">
			{/* Header */}
			<div className="flex items-center gap-3 border-fd-border border-b bg-fd-muted/50 px-4 py-3">
				<span
					className={cn(
						"inline-flex items-center rounded-md px-2 py-1 font-bold text-xs uppercase tracking-wide",
						methodColors[method],
					)}
				>
					{method}
				</span>
				<code className="flex-1 font-mono text-fd-foreground text-sm">
					{path}
				</code>
				<CopyButton value={fullUrl} />
				{authenticated && (
					<span className="inline-flex items-center gap-1 rounded-full bg-fd-primary/10 px-2 py-0.5 font-medium text-fd-primary text-xs">
						<svg
							className="size-3"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						Auth Required
					</span>
				)}
			</div>

			{/* Description */}
			{description && (
				<div className="border-fd-border border-b px-4 py-3">
					<p className="text-fd-muted-foreground text-sm">{description}</p>
				</div>
			)}

			{/* Content - Request/Response details */}
			{children && <div className="divide-y divide-fd-border">{children}</div>}
		</div>
	);
}

interface ApiSectionProps {
	title: string;
	children: React.ReactNode;
}

export function ApiSection({ title, children }: ApiSectionProps) {
	return (
		<div className="px-4 py-4">
			<h4 className="mb-3 font-semibold text-fd-muted-foreground text-xs uppercase tracking-wide">
				{title}
			</h4>
			<div className="space-y-2">{children}</div>
		</div>
	);
}
