"use client";

import * as Button from "@verifio/ui/button";
import { CodeBlock } from "@verifio/ui/code-block";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { Go, Nodejs, Php, Python } from "./language-svg";

const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error("Failed to copy:", err);
	}
};

type SdkType = {
	id: string;
	name: string;
	icon: ReactNode;
	install: string;
	code: string;
};

const sdks: SdkType[] = [
	{
		id: "node",
		name: "Node.js",
		icon: <Nodejs className="h-5 w-5" />,
		install: "npm install @verifio/sdk",
		code: `import Verifio from '@verifio/sdk';

const verifio = new Verifio({
  url: 'https://api.verifio.email',
  key: 'your-api-key'
});

// Verify a single email
const result = await verifio.verify.email({
  email: 'user@example.com'
});

console.log(result);
// {
//   valid: true,
//   email: 'user@example.com',
//   disposable: false,
//   role: false,
//   score: 95
// }`,
	},
	{
		id: "go",
		name: "Go",
		icon: <Go className="h-4 w-11" />,
		install: "go get github.com/verifio/sdk-go",
		code: `package main

import (
  "fmt"
  "github.com/verifio/sdk-go"
)

func main() {
  client := verifio.NewClient("your-api-key")

  result, err := client.Verify.Email(&verifio.VerifyRequest{
    Email: "user@example.com",
  })

  if err != nil {
    fmt.Println("Error:", err)
    return
  }

  fmt.Printf("Valid: %v\\n", result.Valid)
  fmt.Printf("Score: %d\\n", result.Score)
}`,
	},
	{
		id: "php",
		name: "PHP",
		icon: <Php className="h-5 w-8" />,
		install: "composer require verifio/sdk",
		code: `<?php

require 'vendor/autoload.php';

use Verifio\\Verifio;

$verifio = new Verifio([
  'url' => 'https://api.verifio.email',
  'key' => 'your-api-key'
]);

// Verify an email address
$result = $verifio->verify->email([
  'email' => 'user@example.com'
]);

echo "Valid: " . ($result['valid'] ? 'Yes' : 'No');
echo "Score: " . $result['score'];`,
	},
	{
		id: "python",
		name: "Python",
		icon: <Python className="h-5 w-5" />,
		install: "pip install verifio-sdk",
		code: `from verifio import Verifio

# Initialize the client
verifio = Verifio(
    url='https://api.verifio.email',
    key='your-api-key'
)

# Verify an email address
result = verifio.verify.email(
    email='user@example.com'
)

print(f"Valid: {result['valid']}")
print(f"Disposable: {result['disposable']}")
print(f"Score: {result['score']}")`,
	},
];

// Developer feature data
const developerFeatures = [
	{
		id: "realtime",
		icon: "flash" as const,
		title: "Real-Time & Batch Verification",
		features: [
			"Verify during signup, form submission, or API calls",
			"Async batch verification for CSVs",
			"<200ms average response time",
		],
	},
	{
		id: "transparent",
		icon: "search" as const,
		title: "Transparent, Explainable Results",
		features: [
			"Syntax & domain validation",
			"MX & DNS checks",
			"SMTP handshake (no email sent)",
			"Catch-all & disposable detection",
			"Risk & confidence scoring",
		],
	},
	{
		id: "api-first",
		icon: "puzzle" as const,
		title: "API-First & SDK-Friendly",
		features: [
			"REST API with full documentation",
			"Official SDKs (Node.js, Python)",
			"Typed responses",
			"Webhook support",
		],
	},
	{
		id: "open-source",
		icon: "open-source" as const,
		title: "Open-Source Core",
		features: [
			"MIT licensed verification engine",
			"Public roadmap",
			"Community contributions welcome",
			"Optional self-hosting",
		],
	},
];

// Static visual components for each feature
function RealtimeVisual() {
	return (
		<div className="relative flex h-32 w-full items-center justify-center">
			<div className="relative">
				{/* Outer rings */}
				<div className="absolute -inset-6 rounded-full border border-primary-base/20" />
				<div className="absolute -inset-3 rounded-full border border-primary-base/40" />

				{/* Center flash icon */}
				<div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-primary-base/30 bg-gradient-to-br from-primary-base/20 to-primary-base/5">
					<Icon name="flash" className="h-6 w-6 text-primary-base" />
				</div>

				{/* Speed indicator */}
				<div className="absolute -right-12 top-1/2 -translate-y-1/2 rounded-md border border-green-500/30 bg-green-500/10 px-2 py-1 font-mono text-[9px] text-green-500">
					&lt;200ms
				</div>

				{/* Batch indicator */}
				<div className="absolute -left-8 -bottom-2 flex items-center gap-1 rounded-md border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 font-mono text-[9px] text-text-sub-600 dark:bg-gray-900/50">
					<span className="h-1.5 w-1.5 rounded-full bg-primary-base" />
					batch ready
				</div>
			</div>
		</div>
	);
}

function TransparentVisual() {
	return (
		<div className="relative flex h-32 w-full items-center justify-center">
			<div className="relative">
				{/* Signal list */}
				<div className="rounded-lg border border-stroke-soft-200/30 bg-gradient-to-br from-bg-white-0 to-bg-soft-200/20 p-3 font-mono text-[9px] dark:from-gray-900/50 dark:to-gray-800/30">
					<div className="space-y-1.5">
						{[
							{ label: "syntax", status: "valid", color: "green" },
							{ label: "mx_records", status: "found", color: "green" },
							{ label: "smtp", status: "ok", color: "green" },
							{ label: "disposable", status: "false", color: "blue" },
						].map((item) => (
							<div
								key={item.label}
								className="flex items-center justify-between gap-4"
							>
								<span className="text-text-sub-600">{item.label}:</span>
								<span
									className={
										item.color === "green"
											? "text-green-500"
											: "text-primary-base"
									}
								>
									{item.status}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Score badge */}
				<div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-mono text-[10px] font-bold text-white">
					95
				</div>
			</div>
		</div>
	);
}

function ApiFirstVisual() {
	return (
		<div className="relative flex h-32 w-full items-center justify-center">
			<div className="relative flex items-center gap-3">
				{/* API endpoint visual */}
				<div className="rounded-lg border border-stroke-soft-200/30 bg-gradient-to-br from-bg-white-0 to-bg-soft-200/20 p-2 dark:from-gray-900/50 dark:to-gray-800/30">
					<div className="font-mono text-[10px]">
						<div className="flex items-center gap-2">
							<span className="rounded bg-green-500/20 px-1.5 py-0.5 font-semibold text-green-500">
								POST
							</span>
							<span className="text-text-sub-600">/verify</span>
						</div>
					</div>
				</div>

				{/* Arrow */}
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					className="text-primary-base/60"
				>
					<path
						d="M5 12h14M13 5l7 7-7 7"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>

				{/* SDKs */}
				<div className="flex flex-col gap-1">
					{["Node.js", "Python"].map((sdk) => (
						<div
							key={sdk}
							className="rounded border border-stroke-soft-200/30 bg-bg-white-0 px-2 py-1 font-mono text-[9px] text-text-sub-600 dark:bg-gray-900/50"
						>
							{sdk}
						</div>
					))}
				</div>

				{/* Typed response badge */}
				<div className="absolute -right-2 -bottom-3 rounded bg-primary-base/20 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-primary-base">
					TypeScript
				</div>
			</div>
		</div>
	);
}

function OpenSourceVisual() {
	return (
		<div className="relative flex h-32 w-full items-center justify-center">
			<div className="relative">
				{/* GitHub-style repo card */}
				<div className="rounded-xl border border-stroke-soft-200/30 bg-gradient-to-br from-bg-white-0 to-bg-soft-200/20 p-3 dark:from-gray-900/50 dark:to-gray-800/30">
					<div className="flex items-center gap-2">
						<Icon name="open-source" className="h-4 w-4 text-text-sub-600" />
						<span className="font-mono text-[10px] text-text-sub-600">
							reloop-labs/
							<span className="font-semibold text-primary-base">verifio</span>
						</span>
					</div>

					{/* Stats */}
					<div className="mt-2 flex items-center gap-3 font-mono text-[9px] text-text-sub-600/70">
						<div className="flex items-center gap-1">
							<Icon name="star" className="h-3 w-3 text-amber-400" />
							<span>2.4k</span>
						</div>
						<div className="flex items-center gap-1">
							<svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
								<path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
							</svg>
							<span>156</span>
						</div>
					</div>

					{/* Badges */}
					<div className="mt-2 flex gap-1.5">
						<span className="rounded-full bg-primary-base/20 px-2 py-0.5 font-mono text-[8px] font-semibold text-primary-base">
							MIT
						</span>
						<span className="rounded-full bg-green-500/20 px-2 py-0.5 font-mono text-[8px] text-green-600">
							Self-host
						</span>
					</div>
				</div>

				{/* Contribute indicator */}
				<div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
					<Icon name="plus" className="h-3 w-3" />
				</div>
			</div>
		</div>
	);
}

const visualComponents = {
	realtime: RealtimeVisual,
	transparent: TransparentVisual,
	"api-first": ApiFirstVisual,
	"open-source": OpenSourceVisual,
};

export const Sdk = () => {
	const [selectedSdk, setSelectedSdk] = useState<SdkType>(sdks[0] as SdkType);
	const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
	const [mounted, setMounted] = useState(false);
	const tabsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const activeIndex = sdks.findIndex((sdk) => sdk.id === selectedSdk.id);
		const activeTab = tabsRef.current[activeIndex];

		if (activeTab) {
			const { offsetWidth: width, offsetLeft: left } = activeTab;
			setIndicatorStyle({ width, left });
			setMounted(true);
		}
	}, [selectedSdk]);

	const getLanguage = (id: string) => {
		switch (id) {
			case "node":
				return "javascript";
			case "go":
				return "go";
			case "php":
				return "php";
			case "python":
				return "python";
			default:
				return "javascript";
		}
	};

	return (
		<div className="border-stroke-soft-100 border-t border-b">
			<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100 border-b bg-bg-white-0 px-4 py-4 md:px-10">
					<span className="text-text-sub-600 text-xs">[02] SDK</span>
					<span className="text-text-sub-600 text-xs">/ DEVELOPER TOOLS</span>
				</div>
				<div className="flex flex-col border-stroke-soft-100">
					{/* Header Section */}
					<div className="flex flex-col items-center justify-center border-stroke-soft-100 border-b px-4 py-8 text-center md:p-10">
						{/* Developer First Badge */}
						<div className="mb-4 flex items-center gap-2 rounded-full border border-primary-base/20 bg-primary-base/5 px-4 py-2 md:mb-6">
							<Icon name="code-box" className="h-4 w-4 text-primary-base" />
							<span className="font-medium text-sm text-primary-base">
								Built for Developers
							</span>
						</div>
						<h2 className="max-w-3xl font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Email Verification{" "}
							<span className="text-primary-base">Infrastructure</span>
							<br />
							for Developers
						</h2>
						<p className="mt-2 max-w-lg px-2 text-sm text-text-sub-600 leading-7 md:max-w-xl md:px-0 md:text-base md:leading-8">
							Build verification directly into your product, workflows, and
							pipelines. Verify emails programmatically with a fast, transparent
							API powered by an open-source core.
						</p>
					</div>

					{/* Developer Features Grid - 2x2 */}
					<div className="grid grid-cols-1 md:grid-cols-2">
						{developerFeatures.map((feature, index) => {
							const VisualComponent =
								visualComponents[feature.id as keyof typeof visualComponents];
							const isBottomRow = index >= 2;
							const isRightColumn = index % 2 === 1;

							return (
								<div
									key={feature.id}
									className={`group relative flex flex-col p-6 transition-all duration-300 hover:bg-[rgba(var(--primary-base-rgb),0.02)] ${
										!isRightColumn
											? "md:border-stroke-soft-100 md:border-r"
											: ""
									} ${
										!isBottomRow
											? "border-stroke-soft-100 border-b"
											: "border-stroke-soft-100 border-b md:border-b-0"
									}`}
								>
									{/* Hover glow effect */}
									<div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
										<div className="absolute inset-0 bg-gradient-to-br from-primary-base/5 via-transparent to-transparent" />
									</div>

									{/* Visual */}
									<div className="relative mb-3 overflow-hidden">
										<VisualComponent />
									</div>

									{/* Content */}
									<div className="relative mt-auto space-y-2">
										<div className="flex items-center gap-2">
											<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-base/10">
												<Icon
													name={feature.icon}
													className="h-4 w-4 text-primary-base"
												/>
											</div>
											<h3 className="font-semibold text-sm text-text-strong-950 transition-colors duration-300 group-hover:text-primary-base">
												{feature.title}
											</h3>
										</div>
										<ul className="space-y-1 pl-9">
											{feature.features.map((item, i) => (
												<li
													key={i}
													className="flex items-start gap-2 text-xs text-text-sub-600"
												>
													<span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary-base/60" />
													{item}
												</li>
											))}
										</ul>
									</div>
								</div>
							);
						})}
					</div>

					{/* SDK Selection and Code Display */}
					<div className="flex flex-col border-stroke-soft-100 border-t">
						{/* SDK Section Header */}
						<div className="flex items-center justify-center border-stroke-soft-100 border-b bg-bg-soft-200/30 px-4 py-4">
							<span className="font-medium text-sm text-text-sub-600">
								Official SDKs — integrate in minutes with just a few lines of
								code
							</span>
						</div>

						{/* Tabs */}
						<div className="overflow-x-auto border-stroke-soft-100 border-b">
							<div className="relative flex w-fit min-w-full items-stretch border-stroke-soft-100 bg-bg-white-0 md:border-r">
								{/* Animated floating background */}
								<div
									className={`absolute inset-y-3 rounded-full border border-stroke-soft-100 bg-bg-white-100 transition-all duration-300 ${
										mounted ? "opacity-100" : "opacity-0"
									}`}
									style={{
										left: `${indicatorStyle.left}px`,
										width: `${indicatorStyle.width}px`,
										transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
									}}
									aria-hidden="true"
								/>
								{sdks.map((sdk, index) => (
									<Fragment key={sdk.id}>
										<div
											ref={(el) => {
												tabsRef.current[index] = el;
											}}
											className="relative z-10 mx-3 flex flex-col justify-center py-3"
										>
											<button
												type="button"
												onClick={() => setSelectedSdk(sdk)}
												className="flex cursor-pointer items-center gap-2 rounded-full border border-transparent px-4 py-3 transition-colors"
											>
												<span className="text-lg">{sdk.icon}</span>
												<span
													className={`font-semibold text-sm ${
														selectedSdk.id === sdk.id
															? "text-text-strong-950"
															: "text-text-sub-600"
													}`}
												>
													{sdk.name}
												</span>
											</button>
										</div>
										{index < sdks.length - 1 && (
											<div className="w-px bg-stroke-soft-100" />
										)}
									</Fragment>
								))}
							</div>
						</div>

						{/* Code Display */}
						<div className="max-h-[400px] overflow-auto text-sm md:max-h-[500px] md:text-base">
							<CodeBlock
								code={selectedSdk.code}
								lang={getLanguage(selectedSdk.id)}
							/>
						</div>

						{/* Actions Footer */}
						<div className="flex items-center justify-end border-stroke-soft-100 border-t">
							<div className="flex items-center gap-2 border-stroke-soft-100 px-4 py-3 md:border-l">
								<Button.Root
									mode="stroke"
									size="small"
									variant="neutral"
									onClick={() => copyToClipboard(selectedSdk.code)}
									className="rounded-full"
								>
									<Icon
										name="copy"
										className="h-3.5 w-3.5 stroke-1 text-text-sub-600"
									/>
									Copy
								</Button.Root>
								<Link href="/docs/sdks">
									<Button.Root
										mode="stroke"
										size="small"
										variant="neutral"
										className="rounded-full"
									>
										View Docs
										<Icon
											name="chevron-right"
											className="h-3.5 w-3.5 stroke-1 text-text-sub-600"
										/>
									</Button.Root>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sdk;
