"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useState } from "react";

export const ApiReferenceContent = () => {
	const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

	const copyToClipboard = async (text: string, id: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedEndpoint(id);
			setTimeout(() => setCopiedEndpoint(null), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<div className="border-stroke-soft-100">
			{/* Hero Section with Gradient Background */}
			<div className="relative mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
				<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
					<span className="text-sm text-text-sub-600">[01] API REFERENCE</span>
					<span className="text-sm text-text-sub-600">
						/ EMAIL VERIFICATION
					</span>
				</div>

				<div className="relative overflow-hidden border-stroke-soft-100 border-b px-6 py-24 text-center md:px-12 md:py-32">
					{/* Gradient Background */}
					<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />

					{/* Content */}
					<div className="relative z-10">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-white-0 px-4 py-2 dark:bg-bg-weak-50">
							<Icon name="sparkles" className="h-4 w-4 text-purple-600" />
							<span className="text-sm font-medium text-text-sub-600">
								Real-Time Email Verification
							</span>
						</div>

						<h1 className="title-h1 mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text font-bold text-transparent dark:from-white dark:via-purple-200 dark:to-blue-200">
							Email Verification API
						</h1>

						<p className="mx-auto max-w-3xl text-text-sub-600 text-xl leading-8 md:text-2xl md:leading-9">
							Verify email addresses in real-time with our powerful email
							verification API. Reduce bounce rates by{" "}
							<span className="font-semibold text-purple-600">98%</span>,
							protect your sender reputation, and ensure every verification
							email reaches valid recipients.
						</p>

						<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link
								href="/contact"
								className={Button.buttonVariants({
									variant: "neutral",
									size: "medium",
								}).root({})}
							>
								Start Free Email Verification
							</Link>
							<Link
								href="#quick-start"
								className={Button.buttonVariants({
									mode: "stroke",
									variant: "neutral",
									size: "medium",
								}).root({})}
							>
								View API Documentation
								<Icon name="arrow-down" className="ml-2 h-4 w-4" />
							</Link>
						</div>

						{/* Stats */}
						<div className="mx-auto mt-16 grid max-w-4xl grid-cols-3 gap-8">
							<div className="rounded-xl border border-stroke-soft-100 bg-bg-white-0/80 p-6 backdrop-blur-sm dark:bg-bg-weak-50/80">
								<div className="mb-2 font-bold text-3xl text-purple-600">
									98%
								</div>
								<div className="text-sm text-text-sub-600">
									Bounce Rate Reduction
								</div>
							</div>
							<div className="rounded-xl border border-stroke-soft-100 bg-bg-white-0/80 p-6 backdrop-blur-sm dark:bg-bg-weak-50/80">
								<div className="mb-2 font-bold text-3xl text-blue-600">
									&lt;100ms
								</div>
								<div className="text-sm text-text-sub-600">
									Average Response Time
								</div>
							</div>
							<div className="rounded-xl border border-stroke-soft-100 bg-bg-white-0/80 p-6 backdrop-blur-sm dark:bg-bg-weak-50/80">
								<div className="mb-2 font-bold text-3xl text-green-600">
									99.9%
								</div>
								<div className="text-sm text-text-sub-600">API Uptime</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Start Section */}
			<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
				<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
					<span className="text-sm text-text-sub-600">[02] QUICK START</span>
					<span className="text-sm text-text-sub-600">
						/ GET STARTED IN 60 SECONDS
					</span>
				</div>

				<div id="quick-start" className="border-stroke-soft-100 border-b p-10">
					<h2 className="mb-3 font-semibold text-3xl text-text-strong-950">
						Start Verifying Emails in 60 Seconds
					</h2>
					<p className="max-w-2xl text-text-sub-600 leading-7">
						Integrate our email verification API with just a few lines of code.
						Verify email addresses instantly and protect your email campaigns
						from bounces.
					</p>
				</div>

				<div className="overflow-hidden bg-[#1e1e1e]">
					<div className="flex items-center justify-between border-stroke-soft-200 border-b bg-[#252526] px-6 py-3">
						<div className="flex items-center gap-2">
							<div className="h-3 w-3 rounded-full bg-red-500" />
							<div className="h-3 w-3 rounded-full bg-yellow-500" />
							<div className="h-3 w-3 rounded-full bg-green-500" />
						</div>
						<span className="font-mono text-[#858585] text-xs">
							verify-email.sh
						</span>
						<button
							type="button"
							onClick={() =>
								copyToClipboard(
									`curl -X POST https://api.verifio.email/v1/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com"}'`,
									"quickstart",
								)
							}
							className="rounded px-3 py-1.5 text-[#858585] text-xs hover:bg-[#2d2d30]"
						>
							{copiedEndpoint === "quickstart" ? "Copied!" : "Copy"}
						</button>
					</div>

					<div className="p-6">
						<pre className="font-mono text-sm leading-6">
							<code className="text-[#d4d4d4]">
								<span className="text-[#6a9955]">
									# Add your API key to start email verification
								</span>
								{"\n"}
								<span className="text-[#569cd6]">curl</span> -H{" "}
								<span className="text-[#ce9178]">
									"Authorization: Bearer YOUR_API_KEY"
								</span>{" "}
								\{"\n"}
								{"\n"}
								<span className="text-[#6a9955]">
									# Verify any email address in real-time
								</span>
								{"\n"}
								<span className="text-[#569cd6]">curl</span> -X POST
								https://api.verifio.email/v1/verify \{"\n"}
								{"  "}-H{" "}
								<span className="text-[#ce9178]">
									"Content-Type: application/json"
								</span>{" "}
								\{"\n"}
								{"  "}-d{" "}
								<span className="text-[#ce9178]">
									'{"{"}"email": "user@example.com"{"}"}'
								</span>
								{"\n"}
								{"\n"}
								<span className="text-[#6a9955]">
									# Response: Instant email verification results
								</span>
								{"\n"}
								<span className="text-[#d4d4d4]">{"{"}</span>
								{"\n"}
								{"  "}
								<span className="text-[#9cdcfe]">"valid"</span>:{" "}
								<span className="text-[#569cd6]">true</span>,{"\n"}
								{"  "}
								<span className="text-[#9cdcfe]">"email"</span>:{" "}
								<span className="text-[#ce9178]">"user@example.com"</span>,
								{"\n"}
								{"  "}
								<span className="text-[#9cdcfe]">"disposable"</span>:{" "}
								<span className="text-[#569cd6]">false</span>,{"\n"}
								{"  "}
								<span className="text-[#9cdcfe]">"score"</span>:{" "}
								<span className="text-[#b5cea8]">95</span>
								{"\n"}
								<span className="text-[#d4d4d4]">{"}"}</span>
							</code>
						</pre>
					</div>
				</div>
			</div>

			{/* API Endpoints Section */}
			<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
				<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
					<span className="text-sm text-text-sub-600">[03] ENDPOINTS</span>
					<span className="text-sm text-text-sub-600">/ VERIFICATION API</span>
				</div>

				<div className="border-stroke-soft-100 border-b p-10">
					<h2 className="mb-3 font-semibold text-3xl text-text-strong-950">
						Email Verification API Endpoints
					</h2>
					<p className="max-w-2xl text-text-sub-600 leading-7">
						Comprehensive email verification endpoints to validate emails,
						detect disposable addresses, and ensure deliverability. Built for
						developers who need reliable email verification.
					</p>
				</div>

				<div className="grid border-stroke-soft-100 md:grid-cols-2">
					{/* Endpoint 1 */}
					<div className="group relative border-b border-stroke-soft-100 p-10 transition-colors hover:bg-bg-weak-50 md:border-r">
						<div className="mb-4 flex items-center gap-3">
							<div className="rounded-lg bg-green-100 px-3 py-1.5 font-mono font-semibold text-green-800 text-xs dark:bg-green-900/30 dark:text-green-400">
								POST
							</div>
							<code className="font-mono text-sm text-text-sub-600">
								/v1/verify
							</code>
						</div>
						<h3 className="mb-3 font-semibold text-xl text-text-strong-950">
							Verify Single Email
						</h3>
						<p className="mb-6 text-text-sub-600 leading-6">
							Verify any email address in real-time. Get instant validation
							results including disposable detection, syntax check, and
							deliverability score.
						</p>
						<div className="flex items-center gap-2">
							<Icon name="check-circle" className="h-4 w-4 text-green-600" />
							<span className="text-sm text-text-sub-600">
								Real-time validation
							</span>
						</div>
					</div>

					{/* Endpoint 2 */}
					<div className="group relative border-b border-stroke-soft-100 p-10 transition-colors hover:bg-bg-weak-50">
						<div className="mb-4 flex items-center gap-3">
							<div className="rounded-lg bg-blue-100 px-3 py-1.5 font-mono font-semibold text-blue-800 text-xs dark:bg-blue-900/30 dark:text-blue-400">
								POST
							</div>
							<code className="font-mono text-sm text-text-sub-600">
								/v1/verify/bulk
							</code>
						</div>
						<h3 className="mb-3 font-semibold text-xl text-text-strong-950">
							Bulk Email Verification
						</h3>
						<p className="mb-6 text-text-sub-600 leading-6">
							Verify thousands of email addresses at once. Perfect for cleaning
							email lists and ensuring high deliverability for your campaigns.
						</p>
						<div className="flex items-center gap-2">
							<Icon name="layers" className="h-4 w-4 text-blue-600" />
							<span className="text-sm text-text-sub-600">
								Process thousands at once
							</span>
						</div>
					</div>

					{/* Endpoint 3 */}
					<div className="group relative border-b border-stroke-soft-100 p-10 transition-colors hover:bg-bg-weak-50 md:border-r">
						<div className="mb-4 flex items-center gap-3">
							<div className="rounded-lg bg-purple-100 px-3 py-1.5 font-mono font-semibold text-purple-800 text-xs dark:bg-purple-900/30 dark:text-purple-400">
								GET
							</div>
							<code className="font-mono text-sm text-text-sub-600">
								/v1/verify/status
							</code>
						</div>
						<h3 className="mb-3 font-semibold text-xl text-text-strong-950">
							Verification Status
						</h3>
						<p className="mb-6 text-text-sub-600 leading-6">
							Check the status of bulk email verification jobs. Track progress
							and retrieve results when verification is complete.
						</p>
						<div className="flex items-center gap-2">
							<Icon name="activity" className="h-4 w-4 text-purple-600" />
							<span className="text-sm text-text-sub-600">
								Track job progress
							</span>
						</div>
					</div>

					{/* Endpoint 4 */}
					<div className="group relative border-b border-stroke-soft-100 p-10 transition-colors hover:bg-bg-weak-50">
						<div className="mb-4 flex items-center gap-3">
							<div className="rounded-lg bg-orange-100 px-3 py-1.5 font-mono font-semibold text-orange-800 text-xs dark:bg-orange-900/30 dark:text-orange-400">
								GET
							</div>
							<code className="font-mono text-sm text-text-sub-600">
								/v1/verify/history
							</code>
						</div>
						<h3 className="mb-3 font-semibold text-xl text-text-strong-950">
							Verification History
						</h3>
						<p className="mb-6 text-text-sub-600 leading-6">
							Access your complete email verification history with detailed
							analytics. Track verification patterns and improve email quality
							over time.
						</p>
						<div className="flex items-center gap-2">
							<Icon name="chart-bar" className="h-4 w-4 text-orange-600" />
							<span className="text-sm text-text-sub-600">
								Detailed analytics
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* SDKs Section */}
			<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
				<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
					<span className="text-sm text-text-sub-600">[04] SDKs</span>
					<span className="text-sm text-text-sub-600">/ DEVELOPER TOOLS</span>
				</div>

				<div className="border-stroke-soft-100 border-b p-10">
					<h2 className="mb-3 font-semibold text-3xl text-text-strong-950">
						Official SDKs for Every Language
					</h2>
					<p className="max-w-2xl text-text-sub-600 leading-7">
						Use our official SDKs to integrate Verifio into your applications
						quickly and easily. Available for all major programming languages.
					</p>
				</div>

				<div className="grid border-stroke-soft-100 md:grid-cols-3">
					{[
						{
							icon: "⚡",
							name: "Node.js",
							desc: "TypeScript support",
							install: "npm install @verifio/sdk",
						},
						{
							icon: "🐍",
							name: "Python",
							desc: "Async support",
							install: "pip install verifio",
						},
						{
							icon: "☕",
							name: "Java",
							desc: "Spring Boot integration",
							install: "implementation 'com.verifio:sdk'",
						},
						{
							icon: "🦀",
							name: "Rust",
							desc: "High-performance",
							install: 'verifio = "1.0"',
						},
						{
							icon: "🐹",
							name: "Go",
							desc: "Goroutine support",
							install: "go get github.com/verifio/sdk-go",
						},
						{
							icon: "🐘",
							name: "PHP",
							desc: "Composer support",
							install: "composer require verifio/sdk",
						},
					].map((sdk, index) => (
						<div
							key={sdk.name}
							className={`group border-b border-stroke-soft-100 p-10 transition-all hover:bg-bg-weak-50 ${
								index % 3 !== 2 ? "md:border-r" : ""
							}`}
						>
							<div className="mb-4 text-4xl">{sdk.icon}</div>
							<h3 className="mb-2 font-semibold text-lg text-text-strong-950">
								{sdk.name}
							</h3>
							<p className="mb-4 text-sm text-text-sub-600">{sdk.desc}</p>
							<code className="block rounded-lg bg-bg-weak-50 px-3 py-2 font-mono text-xs text-text-sub-600 dark:bg-bg-weak-100">
								{sdk.install}
							</code>
						</div>
					))}
				</div>
			</div>

			{/* CTA Section */}
			<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
				<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
					<span className="text-sm text-text-sub-600">[05] GET STARTED</span>
					<span className="text-sm text-text-sub-600">
						/ START VERIFYING TODAY
					</span>
				</div>

				<div className="grid grid-cols-2 p-20">
					<div className="flex-1 text-left">
						<h2 className="max-w-2xl font-semibold text-3xl text-text-strong-950">
							Start Verifying Emails for Free Today
							<br />
							<span className="text-text-sub-600 leading-8">
								Join thousands of developers using our email verification API to
								protect their sender reputation and improve deliverability.
							</span>
						</h2>
						<div className="flex flex-col gap-4 pt-6 sm:flex-row">
							<Link
								href="/contact"
								className={Button.buttonVariants({
									variant: "neutral",
									size: "small",
								}).root({})}
							>
								Start Free Email Verification
							</Link>
							<Link
								href="/features/getting-started"
								className={Button.buttonVariants({
									mode: "stroke",
									variant: "neutral",
									size: "small",
								}).root({})}
							>
								View Documentation
							</Link>
						</div>
					</div>
					<div className="flex items-center justify-center">
						<Icon name="mail-single" className="h-40 w-40 text-purple-600" />
					</div>
				</div>
			</div>
		</div>
	);
};
