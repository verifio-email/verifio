import * as File from "fumadocs-ui/components/files";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

function CTA({
	title,
	description,
	href,
	buttonText,
}: {
	title: string;
	description?: string;
	href: string;
	buttonText: string;
}) {
	return (
		<div className="my-8 rounded-xl border bg-bg-weak-50 p-6 shadow-sm">
			<h3 className="mb-2 font-semibold text-text-strong-950 text-xl">
				{title}
			</h3>
			{description && <p className="mb-4 text-text-sub-600">{description}</p>}
			<Link
				href={href ?? "/"}
				className="inline-flex h-10 items-center justify-center rounded-lg bg-text-strong-950 px-4 font-medium text-white transition-colors hover:bg-text-strong-950/90"
			>
				{buttonText ?? "Get Started"}
			</Link>
		</div>
	);
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		...TabsComponents,
		...File,
		CTA,
		...components,
	};
}
