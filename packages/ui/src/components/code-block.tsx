/** biome-ignore lint/security/noDangerouslySetInnerHtml: intentional for shiki rendering */
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { codeToHtml, type ThemeRegistration } from "shiki";

// Vibrant dark theme matching Verifio's brand colors
const darkTheme: ThemeRegistration = {
	name: "verifio-dark",
	type: "dark",
	colors: {
		"editor.background": "transparent",
		"editor.foreground": "#d1d5db", // gray-300
	},
	tokenColors: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: { foreground: "#6b7280" }, // gray-500
		},
		{
			scope: ["string", "string.quoted"],
			settings: { foreground: "#22c55e" }, // green-500
		},
		{
			scope: ["constant.numeric", "constant.language"],
			settings: { foreground: "#f97316" }, // orange-500
		},
		{
			scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
			settings: { foreground: "#a855f7" }, // purple-500
		},
		{
			scope: ["entity.name.function", "support.function"],
			settings: { foreground: "#3b82f6" }, // blue-500
		},
		{
			scope: ["variable", "variable.parameter"],
			settings: { foreground: "#9ca3af" }, // gray-400
		},
		{
			scope: ["entity.name.type", "support.type", "support.class"],
			settings: { foreground: "#eab308" }, // yellow-500
		},
		{
			scope: ["punctuation", "meta.brace"],
			settings: { foreground: "#9ca3af" }, // gray-400
		},
		{
			scope: ["entity.name.tag"],
			settings: { foreground: "#3b82f6" }, // blue-500
		},
		{
			scope: ["entity.other.attribute-name"],
			settings: { foreground: "#a855f7" }, // purple-500
		},
		{
			scope: ["constant.other", "variable.other.constant"],
			settings: { foreground: "#f97316" }, // orange-500
		},
	],
};

// Vibrant light theme matching Verifio's brand colors
const lightTheme: ThemeRegistration = {
	name: "verifio-light",
	type: "light",
	colors: {
		"editor.background": "transparent",
		"editor.foreground": "#374151", // gray-700
	},
	tokenColors: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: { foreground: "#9ca3af" }, // gray-400
		},
		{
			scope: ["string", "string.quoted"],
			settings: { foreground: "#16a34a" }, // green-600
		},
		{
			scope: ["constant.numeric", "constant.language"],
			settings: { foreground: "#ea580c" }, // orange-600
		},
		{
			scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
			settings: { foreground: "#9333ea" }, // purple-600
		},
		{
			scope: ["entity.name.function", "support.function"],
			settings: { foreground: "#2563eb" }, // blue-600
		},
		{
			scope: ["variable", "variable.parameter"],
			settings: { foreground: "#6b7280" }, // gray-500
		},
		{
			scope: ["entity.name.type", "support.type", "support.class"],
			settings: { foreground: "#ca8a04" }, // yellow-600
		},
		{
			scope: ["punctuation", "meta.brace"],
			settings: { foreground: "#6b7280" }, // gray-500
		},
		{
			scope: ["entity.name.tag"],
			settings: { foreground: "#2563eb" }, // blue-600
		},
		{
			scope: ["entity.other.attribute-name"],
			settings: { foreground: "#9333ea" }, // purple-600
		},
		{
			scope: ["constant.other", "variable.other.constant"],
			settings: { foreground: "#ea580c" }, // orange-600
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
