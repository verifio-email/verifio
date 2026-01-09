"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { codeToHtml, type ThemeRegistration } from "shiki";

interface LogJsonViewerProps {
	data: any;
	filename?: string;
}

const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error("Failed to copy:", err);
	}
};

// Dark theme with one accent color and light gray tones
const darkTheme: ThemeRegistration = {
	name: "minimal-dark",
	type: "dark",
	colors: {
		"editor.background": "transparent",
		"editor.foreground": "#9ca3af",
	},
	tokenColors: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: { foreground: "#6b7280" },
		},
		{
			scope: ["string", "string.quoted"],
			settings: { foreground: "#d1d5db" },
		},
		{
			scope: ["constant.numeric", "constant.language"],
			settings: { foreground: "#0ea5e9" },
		},
		{
			scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
			settings: { foreground: "#0ea5e9" },
		},
		{
			scope: ["entity.name.function", "support.function"],
			settings: { foreground: "#f3f4f6" },
		},
		{
			scope: ["variable", "variable.parameter"],
			settings: { foreground: "#9ca3af" },
		},
		{
			scope: ["entity.name.type", "support.type", "support.class"],
			settings: { foreground: "#d1d5db" },
		},
		{
			scope: ["punctuation", "meta.brace"],
			settings: { foreground: "#6b7280" },
		},
		{
			scope: ["entity.name.tag"],
			settings: { foreground: "#0ea5e9" },
		},
		{
			scope: ["entity.other.attribute-name"],
			settings: { foreground: "#9ca3af" },
		},
		{
			scope: ["constant.other", "variable.other.constant"],
			settings: { foreground: "#f3f4f6" },
		},
	],
};

// Light theme with one accent color and dark gray tones
const lightTheme: ThemeRegistration = {
	name: "minimal-light",
	type: "light",
	colors: {
		"editor.background": "transparent",
		"editor.foreground": "#4b5563",
	},
	tokenColors: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: { foreground: "#9ca3af" },
		},
		{
			scope: ["string", "string.quoted"],
			settings: { foreground: "#374151" },
		},
		{
			scope: ["constant.numeric", "constant.language"],
			settings: { foreground: "#0284c7" },
		},
		{
			scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
			settings: { foreground: "#0284c7" },
		},
		{
			scope: ["entity.name.function", "support.function"],
			settings: { foreground: "#111827" },
		},
		{
			scope: ["variable", "variable.parameter"],
			settings: { foreground: "#4b5563" },
		},
		{
			scope: ["entity.name.type", "support.type", "support.class"],
			settings: { foreground: "#374151" },
		},
		{
			scope: ["punctuation", "meta.brace"],
			settings: { foreground: "#9ca3af" },
		},
		{
			scope: ["entity.name.tag"],
			settings: { foreground: "#0284c7" },
		},
		{
			scope: ["entity.other.attribute-name"],
			settings: { foreground: "#4b5563" },
		},
		{
			scope: ["constant.other", "variable.other.constant"],
			settings: { foreground: "#111827" },
		},
	],
};

export function LogJsonViewer({
	data,
	filename = "data.json",
}: LogJsonViewerProps) {
	const { resolvedTheme } = useTheme();
	const [html, setHtml] = useState<string>("");
	const [mounted, setMounted] = useState(false);
	const [copied, setCopied] = useState(false);

	const jsonString = JSON.stringify(data, null, 2);

	const handleCopy = async () => {
		await copyToClipboard(jsonString);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

		codeToHtml(jsonString, {
			lang: "json",
			theme,
			transformers: [
				{
					pre(node) {
						this.addClassToHast(node, "overflow-x-auto py-3 line-numbers");
					},
					line(node) {
						this.addClassToHast(node, "line");
					},
				},
			],
		}).then(setHtml);
	}, [jsonString, mounted, resolvedTheme]);

	if (!html || !mounted) {
		return null;
	}

	return (
		<div>
			{/* Header */}
			<div className="flex items-center justify-between border-stroke-soft-200/50 border-b px-3 py-2">
				<span className="text-[10px] text-text-sub-600">[ {filename} ]</span>
				<Button.Root
					mode="stroke"
					size="xxsmall"
					variant="neutral"
					onClick={handleCopy}
					className="rounded-full"
					title="Copy to clipboard"
				>
					{copied ? (
						<>
							<Icon name="check" className="h-2.5 w-2.5 text-success-base" />
							<span className="text-[11px] text-success-base transition-colors duration-200">
								Copied
							</span>
						</>
					) : (
						<>
							<Icon name="copy" className="h-2.5 w-2.5" />
							<span className="text-[11px] text-text-sub-600 transition-colors duration-200">
								Copy
							</span>
						</>
					)}
				</Button.Root>
			</div>
			{/* Code */}
			<div className="max-h-72 overflow-auto">
				<style>{`
					.line-numbers {
						counter-reset: line;
					}
					.line-numbers .line {
						position: relative;
						padding-left: 2rem;
					}
					.line-numbers .line::before {
						content: counter(line);
						counter-increment: line;
						position: absolute;
						left: 0;
						width: 2rem;
						text-align: right;
						padding-right: 0.75rem;
						font-size: 0.625rem;
						color: var(--color-text-soft-400);
						user-select: none;
						border-right: 1px solid var(--color-border-soft-200);
					}
				`}</style>
				<div
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{ __html: html }}
					className="[&>pre]:!bg-transparent text-[12px] leading-5 [&>pre]:p-3"
				/>
			</div>
		</div>
	);
}
