"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useState } from "react";

type BulkEmailResult = {
	email: string;
	status: "valid" | "invalid" | "risky";
	score: number;
};

type BulkTestResult = {
	total: number;
	valid: number;
	invalid: number;
	risky: number;
	results: BulkEmailResult[];
};

async function mockBulkVerify(emails: string[]): Promise<BulkTestResult> {
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const results = emails.map((email) => {
		const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const disposable = ["temp", "fake", "throw"].some((word) =>
			email.toLowerCase().includes(word),
		);

		let status: BulkEmailResult["status"] = "valid";
		let score = 95;

		if (!isValid) {
			status = "invalid";
			score = 0;
		} else if (disposable) {
			status = "risky";
			score = 40;
		}

		return { email, status, score };
	});

	return {
		total: emails.length,
		valid: results.filter((r) => r.status === "valid").length,
		invalid: results.filter((r) => r.status === "invalid").length,
		risky: results.filter((r) => r.status === "risky").length,
		results,
	};
}

export default function BulkTesterPage() {
	const [emailText, setEmailText] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [result, setResult] = useState<BulkTestResult | null>(null);

	const handleVerify = async () => {
		const emails = emailText
			.split("\n")
			.map((e) => e.trim())
			.filter(Boolean)
			.slice(0, 100);

		if (emails.length === 0) return;

		setIsVerifying(true);
		try {
			const testResult = await mockBulkVerify(emails);
			setResult(testResult);
		} finally {
			setIsVerifying(false);
		}
	};

	const getStatusColor = (status: BulkEmailResult["status"]) => {
		switch (status) {
			case "valid":
				return "text-green-600";
			case "invalid":
				return "text-red-600";
			case "risky":
				return "text-yellow-600";
		}
	};

	const getStatusBg = (status: BulkEmailResult["status"]) => {
		switch (status) {
			case "valid":
				return "bg-green-500/10 border-green-500/20";
			case "invalid":
				return "bg-red-500/10 border-red-500/20";
			case "risky":
				return "bg-yellow-500/10 border-yellow-500/20";
		}
	};

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] FREE TOOL</span>
						<span className="text-sm text-text-sub-600">
							/ BULK EMAIL TESTER
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-white-0 px-4 py-2">
							<Icon name="layers" className="h-4 w-4 text-purple-600" />
							<span className="font-medium text-sm text-text-sub-600">
								Up to 100 emails
							</span>
						</div>
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Free Bulk Email Tester
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Test up to 100 emails at once for free. Perfect for small list
							cleaning before committing to a paid plan.
						</p>
					</div>
				</div>
			</section>

			{/* Bulk Tester Tool */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="p-10">
						<div className="mx-auto max-w-3xl">
							{/* Input Section */}
							<div className="space-y-4">
								<div>
									<label className="mb-2 block font-medium text-text-strong-950">
										Enter Emails (one per line)
									</label>
									<textarea
										value={emailText}
										onChange={(e) => setEmailText(e.target.value)}
										placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
										className="h-64 w-full rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 font-mono text-sm text-text-strong-950 outline-none transition-all focus:border-stroke-strong-950 focus:ring-2 focus:ring-stroke-strong-950/20"
									/>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-text-sub-600">
										{emailText.split("\n").filter(Boolean).length}/100 emails
									</span>
									<button
										type="button"
										onClick={handleVerify}
										disabled={
											isVerifying ||
											!emailText.trim() ||
											emailText.split("\n").filter(Boolean).length === 0
										}
										className={Button.buttonVariants({
											variant: "primary",
											size: "medium",
										}).root({})}
									>
										{isVerifying ? (
											<span className="flex items-center gap-2">
												<svg
													className="h-4 w-4 animate-spin"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
														fill="none"
													/>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													/>
												</svg>
												Verifying...
											</span>
										) : (
											"Verify Emails"
										)}
									</button>
								</div>
							</div>

							{/* Results Section */}
							{result && (
								<div className="mt-8 space-y-6">
									{/* Summary Stats */}
									<div className="grid gap-4 md:grid-cols-4">
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6 text-center">
											<p className="text-sm text-text-sub-600">Total</p>
											<p className="mt-2 font-bold text-3xl text-text-strong-950">
												{result.total}
											</p>
										</div>
										<div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-900/30 dark:bg-green-950/10">
											<p className="text-sm text-green-800 dark:text-green-200">
												Valid
											</p>
											<p className="mt-2 font-bold text-3xl text-green-600">
												{result.valid}
											</p>
										</div>
										<div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-950/10">
											<p className="text-sm text-red-800 dark:text-red-200">
												Invalid
											</p>
											<p className="mt-2 font-bold text-3xl text-red-600">
												{result.invalid}
											</p>
										</div>
										<div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center dark:border-yellow-900/30 dark:bg-yellow-950/10">
											<p className="text-sm text-yellow-800 dark:text-yellow-200">
												Risky
											</p>
											<p className="mt-2 font-bold text-3xl text-yellow-600">
												{result.risky}
											</p>
										</div>
									</div>

									{/* Results List */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Verification Results
										</h3>
										<div className="max-h-96 space-y-2 overflow-y-auto">
											{result.results.map((item, index) => (
												<div
													key={index}
													className={`flex items-center justify-between rounded-lg border px-4 py-3 ${getStatusBg(item.status)}`}
												>
													<span className="font-mono text-sm text-text-strong-950">
														{item.email}
													</span>
													<div className="flex items-center gap-3">
														<span
															className={`font-semibold ${getStatusColor(item.status)}`}
														>
															{item.score}%
														</span>
														<span
															className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusBg(item.status)}`}
														>
															{item.status}
														</span>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[02] FEATURES</span>
						<span className="text-sm text-text-sub-600">
							/ WHAT YOU GET FOR FREE
						</span>
					</div>
					<div className="grid gap-0 md:grid-cols-3">
						{[
							{
								icon: "zap",
								title: "100 Emails Per Day",
								desc: "Test up to 100 emails daily without signing up",
							},
							{
								icon: "workflow",
								title: "Real-Time Results",
								desc: "Get instant verification results for all emails",
							},
							{
								icon: "download",
								title: "Export Results",
								desc: "Download verified list in CSV format",
							},
						].map((feature, index) => (
							<div
								key={feature.title}
								className={`border-stroke-soft-100 p-8 ${
									index < 2 ? "md:border-r" : ""
								}`}
							>
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-lg ${
										index === 0
											? "bg-yellow-500/10 text-yellow-600"
											: index === 1
												? "bg-blue-500/10 text-blue-600"
												: "bg-green-500/10 text-green-600"
									}`}
								>
									<Icon name={feature.icon} className="h-6 w-6" />
								</div>
								<h3 className="mt-4 font-semibold text-lg text-text-strong-950">
									{feature.title}
								</h3>
								<p className="mt-2 text-sm text-text-sub-600 leading-relaxed">
									{feature.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section>
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="grid gap-8 p-10 md:grid-cols-2 md:p-16">
						<div>
							<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
								Need to verify more emails?
							</h2>
							<p className="mt-4 text-text-sub-600">
								Upgrade to verify thousands of emails at once. Get API access,
								webhook notifications, and priority processing.
							</p>
							<div className="mt-6 flex flex-col gap-3 sm:flex-row">
								<Link
									href="/pricing"
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									View Pricing
								</Link>
								<Link
									href="/solutions/bulk-email-verification"
									className={Button.buttonVariants({
										variant: "neutral",
										mode: "stroke",
										size: "medium",
									}).root({})}
								>
									Learn More
								</Link>
							</div>
						</div>
						<div className="flex items-center justify-center">
							<div className="grid grid-cols-2 gap-4 text-center">
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">
										10,000+
									</p>
									<p className="mt-1 text-sm text-text-sub-600">
										Free verifications
									</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">Unlimited</p>
									<p className="mt-1 text-sm text-text-sub-600">
										With paid plan
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
