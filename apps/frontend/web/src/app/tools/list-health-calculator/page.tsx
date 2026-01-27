"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { toolsApi } from "@verifio/web/lib/tools-client";
import { useState } from "react";

type EmailResult = {
	email: string;
	state: "deliverable" | "undeliverable" | "risky";
	score: number;
	reason: string;
	isDisposable: boolean;
	isRole: boolean;
};

type ListHealthResult = {
	stats: {
		total: number;
		deliverable: number;
		undeliverable: number;
		risky: number;
		disposable: number;
		roleBased: number;
		averageScore: number;
		scoreDistribution: {
			excellent: number;
			good: number;
			fair: number;
			poor: number;
		};
	};
	topIssues: Array<{
		issue: string;
		count: number;
		percentage: number;
	}>;
	results: EmailResult[];
};

type ApiResponse = {
	success: boolean;
	data?: ListHealthResult;
	error?: string;
};

export default function ListHealthCalculatorPage() {
	const [emails, setEmails] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<ListHealthResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleCalculate = async () => {
		const emailList = emails
			.split("\n")
			.map((e) => e.trim())
			.filter((e) => e);

		if (emailList.length < 10) {
			setError("Please enter at least 10 email addresses");
			return;
		}

		if (emailList.length > 50) {
			setError("Maximum 50 email addresses allowed");
			return;
		}

		setIsLoading(true);
		setError(null);
		setResult(null);

		const result = await toolsApi.calculateListHealth(emailList);

		if (result.success && result.data) {
			setResult(result.data);
		} else {
			setError(result.error || "Calculation failed");
		}

		setIsLoading(false);
	};

	const getScoreColor = (score: number) => {
		if (score >= 90) return "text-green-600";
		if (score >= 70) return "text-blue-600";
		if (score >= 50) return "text-yellow-600";
		return "text-red-600";
	};

	const getStateColor = (state: string) => {
		if (state === "deliverable") return "text-green-600";
		if (state === "risky") return "text-yellow-600";
		return "text-red-600";
	};

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] FREE TOOL</span>
						<span className="text-sm text-text-sub-600">/ LIST HEALTH CALCULATOR</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Email List Health Calculator
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Analyze your email list health for free. Check up to 50 emails for
							deliverability and quality score.
						</p>
					</div>
				</div>
			</section>

			{/* Tool Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="p-10">
						<div className="mx-auto max-w-3xl">
							<textarea
								value={emails}
								onChange={(e) => setEmails(e.target.value)}
								placeholder="Enter email addresses (one per line)&#10;example1@gmail.com&#10;example2@yahoo.com&#10;...&#10;Minimum 10, maximum 50 emails"
								className="w-full rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-text-strong-950 outline-none transition-all focus:border-stroke-strong-950 focus:ring-2 focus:ring-stroke-strong-950/20 min-h-[200px] font-mono text-sm"
								disabled={isLoading}
							/>

							<div className="mt-4 flex items-center justify-between">
								<p className="text-sm text-text-sub-600">
									{emails.split("\n").filter((e) => e.trim()).length} emails entered
									(10-50 required)
								</p>
								<button
									type="button"
									onClick={handleCalculate}
									disabled={isLoading}
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									{isLoading ? "Analyzing..." : "Calculate Health"}
								</button>
							</div>

							{error && (
								<div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
									{error}
								</div>
							)}

							{result && (
								<div className="mt-8 space-y-6">
									{/* Stats Overview */}
									<div className="grid gap-4 md:grid-cols-4">
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<p className="text-sm text-text-sub-600">Total</p>
											<p className="mt-2 font-bold text-3xl text-text-strong-950">
												{result.stats.total}
											</p>
										</div>
										<div className="rounded-xl border border-green-200 bg-green-50 p-6">
											<p className="text-sm text-green-800">Deliverable</p>
											<p className="mt-2 font-bold text-3xl text-green-600">
												{result.stats.deliverable}
											</p>
											<p className="mt-1 text-xs text-green-700">
												{Math.round((result.stats.deliverable / result.stats.total) * 100)}%
											</p>
										</div>
										<div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
											<p className="text-sm text-yellow-800">Risky</p>
											<p className="mt-2 font-bold text-3xl text-yellow-600">
												{result.stats.risky}
											</p>
											<p className="mt-1 text-xs text-yellow-700">
												{Math.round((result.stats.risky / result.stats.total) * 100)}%
											</p>
										</div>
										<div className="rounded-xl border border-red-200 bg-red-50 p-6">
											<p className="text-sm text-red-800">Undeliverable</p>
											<p className="mt-2 font-bold text-3xl text-red-600">
												{result.stats.undeliverable}
											</p>
											<p className="mt-1 text-xs text-red-700">
												{Math.round((result.stats.undeliverable / result.stats.total) * 100)}%
											</p>
										</div>
									</div>

									{/* Average Score */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Average Quality Score
										</h3>
										<div className="flex items-center gap-4">
											<p
												className={`font-bold text-5xl ${getScoreColor(
													result.stats.averageScore,
												)}`}
											>
												{result.stats.averageScore}/100
											</p>
											<div className="flex-1">
												<div className="h-3 w-full rounded-full bg-stroke-soft-100">
													<div
														className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
														style={{ width: `${result.stats.averageScore}%` }}
													/>
												</div>
											</div>
										</div>
									</div>

									{/* Score Distribution */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Score Distribution
										</h3>
										<div className="grid gap-4 md:grid-cols-4">
											{[
												{ label: "Excellent (90+)", count: result.stats.scoreDistribution.excellent, color: "bg-green-500" },
												{ label: "Good (70-89)", count: result.stats.scoreDistribution.good, color: "bg-blue-500" },
												{ label: "Fair (50-69)", count: result.stats.scoreDistribution.fair, color: "bg-yellow-500" },
												{ label: "Poor (&lt;50)", count: result.stats.scoreDistribution.poor, color: "bg-red-500" },
											].map((item) => (
												<div key={item.label} className="rounded-lg bg-bg-weak-50 p-4">
													<p className="text-xs text-text-sub-600">{item.label}</p>
													<p className="mt-1 font-bold text-2xl text-text-strong-950">{item.count}</p>
												</div>
											))}
										</div>
									</div>

									{/* Top Issues */}
									{result.topIssues.length > 0 && (
										<div className="rounded-xl border border-red-200 bg-red-50 p-6">
											<h3 className="mb-4 flex items-center gap-2 font-medium text-red-900 dark:text-red-100">
												<Icon name="alert-circle" className="h-5 w-5" />
												Top Issues
											</h3>
											<div className="space-y-3">
												{result.topIssues.map((issue, i) => (
													<div key={i} className="flex items-center gap-3">
														<div className="flex-1 rounded-lg bg-white px-4 py-2">
															<p className="text-sm text-text-strong-950">{issue.issue}</p>
														</div>
														<div className="text-right">
															<p className="font-bold text-text-strong-950">{issue.count}</p>
															<p className="text-xs text-text-sub-600">{issue.percentage}%</p>
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Individual Results (First 10) */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Email Results (showing first 10)
										</h3>
										<div className="overflow-x-auto">
											<table className="w-full text-sm">
												<thead>
													<tr className="border-b border-stroke-soft-100">
														<th className="px-4 py-2 text-left font-medium text-text-sub-600">
															Email
														</th>
														<th className="px-4 py-2 text-left font-medium text-text-sub-600">
															State
														</th>
														<th className="px-4 py-2 text-left font-medium text-text-sub-600">
															Score
														</th>
														<th className="px-4 py-2 text-left font-medium text-text-sub-600">
															Reason
														</th>
													</tr>
												</thead>
												<tbody>
													{result.results.slice(0, 10).map((email, i) => (
														<tr key={i} className="border-b border-stroke-soft-100">
															<td className="px-4 py-3 font-mono text-text-strong-950">
																{email.email}
															</td>
															<td className="px-4 py-3">
																<span className={getStateColor(email.state)}>
																	{email.state}
																</span>
															</td>
															<td className={`px-4 py-3 font-medium ${getScoreColor(email.score)}`}>
																{email.score}
															</td>
															<td className="px-4 py-3 text-text-sub-600">{email.reason}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>

									{/* Warnings */}
									{(result.stats.disposable > 0 || result.stats.roleBased > 0) && (
										<div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
											<h3 className="mb-4 flex items-center gap-2 font-medium text-yellow-900 dark:text-yellow-100">
												<Icon name="alert-triangle" className="h-5 w-5" />
												Special Attention Required
											</h3>
											<p className="text-sm text-yellow-800 dark:text-yellow-200">
												{result.stats.disposable > 0 && (
													<span>{result.stats.disposable} disposable email(s) found. </span>
												)}
												{result.stats.roleBased > 0 && (
													<span>{result.stats.roleBased} role-based address(es) found.</span>
												)}
											</p>
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
								Clean your entire email list
							</h2>
							<p className="mt-4 text-text-sub-600">
								Our free calculator shows the health of a sample. Upgrade to
								verify and clean your entire email list with unlimited volume.
							</p>
							<div className="mt-6 flex flex-col gap-3 sm:flex-row">
								<Link
									href="/pricing"
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									Clean Your List
								</Link>
								<Link
									href="/tools/bulk-tester"
									className={Button.buttonVariants({
										variant: "neutral",
										mode: "stroke",
										size: "medium",
									}).root({})}
								>
									Try Bulk Tester
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
