/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <explanation> */
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { codeToHtml, type ThemeRegistration } from "shiki";

// Dark theme with neutral gray tones (monochromatic)
const darkTheme: ThemeRegistration = {
	name: "minimal-dark",
	type: "dark",
	colors: {
		"editor.background": "transparent",
		"editor.foreground": "#9ca3af", // gray-400
	},
	tokenColors: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: { foreground: "#6b7280" }, // gray-500
		},
		{
			scope: ["string", "string.quoted"],
			settings: { foreground: "#d1d5db" }, // gray-300
		},
		{
			scope: ["constant.numeric", "constant.language"],
			settings: { foreground: "#f3f4f6" }, // gray-100
		},
		{
			scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
			settings: { foreground: "#f3f4f6" }, // gray-100
		},
		{
			scope: ["entity.name.function", "support.function"],
			settings: { foreground: "#ffffff" }, // white
		},
		{
			scope: ["variable", "variable.parameter"],
			settings: { foreground: "#9ca3af" }, // gray-400
		},
		{
			scope: ["entity.name.type", "support.type", "support.class"],
			settings: { foreground: "#d1d5db" }, // gray-300
		},
		{
			scope: ["punctuation", "meta.brace"],
			settings: { foreground: "#6b7280" }, // gray-500
		},
		{
			scope: ["entity.name.tag"],
			settings: { foreground: "#f3f4f6" }, // gray-100
		},
		{
			scope: ["entity.other.attribute-name"],
			settings: { foreground: "#9ca3af" }, // gray-400
		},
		{
			scope: ["constant.other", "variable.other.constant"],
			settings: { foreground: "#ffffff" }, // white
		},
	],
};

// Light theme with neutral dark gray tones (monochromatic)
const lightTheme: ThemeRegistration = {
	name: "minimal-light",
	type: "light",
	colors: {
		"editor.background": "transparent",
		"editor.foreground": "#4b5563", // gray-600
	},
	tokenColors: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: { foreground: "#9ca3af" }, // gray-400
		},
		{
			scope: ["string", "string.quoted"],
			settings: { foreground: "#374151" }, // gray-700
		},
		{
			scope: ["constant.numeric", "constant.language"],
			settings: { foreground: "#111827" }, // gray-900
		},
		{
			scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
			settings: { foreground: "#111827" }, // gray-900
		},
		{
			scope: ["entity.name.function", "support.function"],
			settings: { foreground: "#030712" }, // gray-950
		},
		{
			scope: ["variable", "variable.parameter"],
			settings: { foreground: "#4b5563" }, // gray-600
		},
		{
			scope: ["entity.name.type", "support.type", "support.class"],
			settings: { foreground: "#374151" }, // gray-700
		},
		{
			scope: ["punctuation", "meta.brace"],
			settings: { foreground: "#9ca3af" }, // gray-400
		},
		{
			scope: ["entity.name.tag"],
			settings: { foreground: "#111827" }, // gray-900
		},
		{
			scope: ["entity.other.attribute-name"],
			settings: { foreground: "#4b5563" }, // gray-600
		},
		{
			scope: ["constant.other", "variable.other.constant"],
			settings: { foreground: "#030712" }, // gray-950
		},
	],
};

interface Props {
	code: string;
	lang?: string;
}

export const CodeBlock = ({ code, lang = "javascript" }: Props) => {
	const { resolvedTheme } = useTheme();
	const [html, setHtml] = useState<string>("");
	const [mounted, setMounted] = useState(false);

	// Handle mounting to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

		codeToHtml(code, {
			lang,
			theme,
			transformers: [
				{
					pre(node) {
						this.addClassToHast(node, "overflow-x-auto py-4 line-numbers");
					},
					line(node) {
						this.addClassToHast(node, "line");
					},
				},
			],
		}).then(setHtml);
	}, [code, lang, mounted, resolvedTheme]);

	if (!html || !mounted) {
		return null;
	}

	return (
		<>
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
					padding-right: 1rem;
					font-size: 0.75rem;
					color: var(--color-text-soft-400);
					user-select: none;
					border-right: 1px solid var(--color-border-soft-200);
				}
			`}</style>
			<div
				dangerouslySetInnerHTML={{ __html: html }}
				className="[&>pre]:!bg-transparent text-sm leading-6 [&>pre]:p-4"
			/>
		</>
	);
};
