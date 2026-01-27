"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import { toolsApi } from "@verifio/web/lib/tools-client";
import Link from "next/link";
import { useState } from "react";

type CatchallResult = {
	domain: string;
	isCatchAll: boolean;
	confidence: "high" | "medium" | "low";
	testEmail: string;
	smtpResponse: string | null;
	explanation: string;
	implications: string[];
	recommendations: string[];
};

type ApiResponse = {
	success: boolean;
	data?: CatchallResult;
	error?: string;
};

export default function CatchallCheckerPage() {
	const [domain, setDomain] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<CatchallResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleCheck = async () => {
		if (!domain.trim()) return;

		setIsLoading(true);
		setError(null);
		setResult(null);

		const result = await toolsApi.detectCatchall(domain.trim());

		if (result.success && result.data) {
			setResult(result.data);
		} else {
			setError(result.error || "Check failed");
		}

		setIsLoading(false);
	};

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] FREE TOOL</span>
						<span className="text-sm text-text-sub-600">
							/ CATCH-ALL CHECKER
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Catch-All Domain Checker
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Check if a domain is configured as catch-all (accept-all).
							SMTP-based detection with detailed analysis.
						</p>
					</div>
				</div>
			</section>

			{/* Tool Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="p-10">
						<div className="mx-auto max-w-2xl">
							<div className="flex gap-3">
								<input
									type="text"
									value={domain}
									onChange={(e) => setDomain(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleCheck()}
									placeholder="example.com"
									className="flex-1 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-text-strong-950 outline-none transition-all focus:border-stroke-strong-950 focus:ring-2 focus:ring-stroke-strong-950/20"
									disabled={isLoading}
								/>
								<button
									type="button"
									onClick={handleCheck}
									disabled={isLoading || !domain.trim()}
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									{isLoading ? "Checking..." : "Check Domain"}
								</button>
							</div>

							{error && (
								<div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">
									{error}
								</div>
							)}

							{result && (
								<div className="mt-8 space-y-6">
									{/* Status Card */}
									<div
										className={`rounded-xl border p-6 ${
											result.isCatchAll
												? "border-yellow-500/20 bg-yellow-500/10"
												: "border-green-500/20 bg-green-500/10"
										}`}
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-text-sub-600">Result</p>
												<p
													className={`mt-1 font-semibold text-2xl ${
														result.isCatchAll
															? "text-yellow-600"
															: "text-green-600"
													}`}
												>
													{result.isCatchAll
														? "Catch-All Domain"
														: "Not Catch-All"}
												</p>
												<p className="mt-1 text-text-sub-600 text-xs">
													Confidence: {result.confidence}
												</p>
											</div>
											<div className="flex h-16 w-16 items-center justify-center">
												<Icon
													name={
														result.isCatchAll
															? "alert-triangle"
															: "check-circle"
													}
													className={`h-12 w-12 ${
														result.isCatchAll
															? "text-yellow-600"
															: "text-green-600"
													}`}
												/>
											</div>
										</div>
									</div>

									{/* Explanation */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											What This Means
										</h3>
										<p className="text-sm text-text-sub-600">
											{result.explanation}
										</p>
									</div>

									{/* Test Email */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Test Email Used
										</h3>
										<div className="rounded-lg bg-bg-weak-50 px-4 py-3">
											<p className="font-mono text-sm text-text-strong-950">
												{result.testEmail}
											</p>
										</div>
										<p className="mt-2 text-text-sub-600 text-xs">
											Randomly generated email to test catch-all behavior
										</p>
									</div>

									{/* SMTP Response (if available) */}
									{result.smtpResponse && (
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<h3 className="mb-4 font-medium text-text-strong-950">
												SMTP Response
											</h3>
											<div className="max-h-40 overflow-auto rounded-lg bg-bg-weak-50 px-4 py-3">
												<p className="font-mono text-text-strong-950 text-xs">
													{result.smtpResponse}
												</p>
											</div>
										</div>
									)}

									{/* Implications */}
									{result.implications.length > 0 && (
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<h3 className="mb-4 font-medium text-text-strong-950">
												Implications
											</h3>
											<ul className="space-y-2">
												{result.implications.map((imp, i) => (
													<li
														key={i}
														className="flex items-start gap-2 text-sm text-text-sub-600"
													>
														<span className="mt-0.5">•</span>
														<span>{imp}</span>
													</li>
												))}
											</ul>
										</div>
									)}

									{/* Recommendations */}
									{result.recommendations.length > 0 && (
										<div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/30 dark:bg-blue-950/10">
											<h3 className="mb-4 flex items-center gap-2 font-medium text-blue-900 dark:text-blue-100">
												<Icon name="lightbulb" className="h-5 w-5" />
												Recommendations
											</h3>
											<ul className="space-y-2">
												{result.recommendations.map((rec, i) => (
													<li
														key={i}
														className="flex items-start gap-2 text-blue-800 text-sm dark:text-blue-200"
													>
														<span className="mt-0.5">•</span>
														<span>{rec}</span>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section>
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="grid gap-8 p-10 md:grid-cols-2 md:p-16">
						<div>
							<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
								Understand catch-all domains
							</h2>
							<p className="mt-4 text-text-sub-600">
								Catch-all domains accept all emails, making verification
								challenging. Learn how to handle them properly.
							</p>
							<div className="mt-6 flex flex-col gap-3 sm:flex-row">
								<Link
									href="/pricing"
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									Get Started
								</Link>
								<Link
									href="/tools/email-checker"
									className={Button.buttonVariants({
										variant: "neutral",
										mode: "stroke",
										size: "medium",
									}).root({})}
								>
									More Tools
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
