"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import { toolsApi } from "@verifio/web/lib/tools-client";
import Link from "next/link";
import { useState } from "react";

type DeliverabilityResult = {
	domain: string;
	overallScore: number;
	checks: {
		domainExists: { pass: boolean; value: string[] };
		mxRecords: {
			pass: boolean;
			records: Array<{ priority: number; exchange: string }>;
		};
		spfRecord: { pass: boolean; record: string | null };
		dkimRecord: { pass: boolean; record: string | null; message: string };
		dmarcRecord: {
			pass: boolean;
			record: string | null;
			policy: string | null;
		};
		provider: string | null;
	};
	risks: string[];
	recommendations: string[];
};

type ApiResponse = {
	success: boolean;
	data?: DeliverabilityResult;
	error?: string;
};

export default function DeliverabilityTesterPage() {
	const [domain, setDomain] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<DeliverabilityResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleTest = async () => {
		if (!domain.trim()) return;

		setIsLoading(true);
		setError(null);
		setResult(null);

		const result = await toolsApi.testDeliverability(domain.trim());

		if (result.success && result.data) {
			setResult(result.data);
		} else {
			setError(result.error || "Test failed");
		}

		setIsLoading(false);
	};

	const getScoreColor = (score: number) => {
		if (score >= 80) return "text-green-600";
		if (score >= 60) return "text-yellow-600";
		return "text-red-600";
	};

	const getScoreLabel = (score: number) => {
		if (score >= 80) return "Excellent";
		if (score >= 60) return "Good";
		if (score >= 40) return "Fair";
		return "Poor";
	};

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] FREE TOOL</span>
						<span className="text-sm text-text-sub-600">
							/ DELIVERABILITY TESTER
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Email Deliverability Tester
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Test if your domain is properly configured for email
							deliverability. Check DNS, MX records, SPF, DKIM, and DMARC.
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
									onKeyDown={(e) => e.key === "Enter" && handleTest()}
									placeholder="example.com"
									className="flex-1 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-text-strong-950 outline-none transition-all focus:border-stroke-strong-950 focus:ring-2 focus:ring-stroke-strong-950/20"
									disabled={isLoading}
								/>
								<button
									type="button"
									onClick={handleTest}
									disabled={isLoading || !domain.trim()}
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									{isLoading ? "Testing..." : "Test Domain"}
								</button>
							</div>

							{error && (
								<div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">
									{error}
								</div>
							)}

							{result && (
								<div className="mt-8 space-y-6">
									{/* Overall Score */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-text-sub-600">
													Deliverability Score
												</p>
												<p
													className={`mt-2 font-bold text-5xl ${getScoreColor(
														result.overallScore,
													)}`}
												>
													{result.overallScore}/100
												</p>
												<p className="mt-1 text-sm text-text-sub-600">
													{getScoreLabel(result.overallScore)}
												</p>
											</div>
											<div className="h-24 w-24 rounded-full border-8 border-stroke-soft-100">
												<div
													className="h-full rounded-full border-8 border-transparent"
													style={{
														borderTopColor:
															result.overallScore >= 80
																? "#16a34a"
																: result.overallScore >= 60
																	? "#ca8a04"
																	: "#dc2626",
														transform: `rotate(${(result.overallScore / 100) * 360}deg)`,
													}}
												/>
											</div>
										</div>
									</div>

									{/* Checks Grid */}
									<div className="grid gap-4 md:grid-cols-2">
										{/* DNS Check */}
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<div className="flex items-center justify-between">
												<h3 className="font-medium text-text-strong-950">
													DNS Records
												</h3>
												<Icon
													name={
														result.checks.domainExists.pass
															? "check-circle"
															: "x-circle"
													}
													className={`h-5 w-5 ${result.checks.domainExists.pass ? "text-green-600" : "text-red-600"}`}
												/>
											</div>
											<p className="mt-2 text-sm text-text-sub-600">
												{result.checks.domainExists.pass
													? "Domain exists"
													: "Domain not found"}
											</p>
										</div>

										{/* MX Records */}
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<div className="flex items-center justify-between">
												<h3 className="font-medium text-text-strong-950">
													MX Records
												</h3>
												<Icon
													name={
														result.checks.mxRecords.pass
															? "check-circle"
															: "x-circle"
													}
													className={`h-5 w-5 ${result.checks.mxRecords.pass ? "text-green-600" : "text-red-600"}`}
												/>
											</div>
											<p className="mt-2 text-sm text-text-sub-600">
												{result.checks.mxRecords.pass
													? `${result.checks.mxRecords.records.length} mail server(s)`
													: "No MX records found"}
											</p>
										</div>

										{/* SPF Record */}
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<div className="flex items-center justify-between">
												<h3 className="font-medium text-text-strong-950">
													SPF Record
												</h3>
												<Icon
													name={
														result.checks.spfRecord.pass
															? "check-circle"
															: "x-circle"
													}
													className={`h-5 w-5 ${result.checks.spfRecord.pass ? "text-green-600" : "text-red-600"}`}
												/>
											</div>
											<p className="mt-2 text-sm text-text-sub-600">
												{result.checks.spfRecord.pass
													? "SPF configured"
													: "SPF missing"}
											</p>
										</div>

										{/* DMARC Record */}
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<div className="flex items-center justify-between">
												<h3 className="font-medium text-text-strong-950">
													DMARC Record
												</h3>
												<Icon
													name={
														result.checks.dmarcRecord.pass
															? "check-circle"
															: "x-circle"
													}
													className={`h-5 w-5 ${result.checks.dmarcRecord.pass ? "text-green-600" : "text-red-600"}`}
												/>
											</div>
											<p className="mt-2 text-sm text-text-sub-600">
												{result.checks.dmarcRecord.pass
													? `Policy: ${result.checks.dmarcRecord.policy}`
													: "DMARC missing"}
											</p>
										</div>
									</div>

									{/* DKIM Record */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<div className="flex items-center justify-between">
											<h3 className="font-medium text-text-strong-950">
												DKIM Record
											</h3>
											<Icon
												name={
													result.checks.dkimRecord.pass
														? "check-circle"
														: "alert-circle"
												}
												className={`h-5 w-5 ${result.checks.dkimRecord.pass ? "text-green-600" : "text-yellow-600"}`}
											/>
										</div>
										<p className="mt-2 text-sm text-text-sub-600">
											{result.checks.dkimRecord.message}
										</p>
									</div>

									{/* Provider */}
									{result.checks.provider && (
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<h3 className="mb-2 font-medium text-text-strong-950">
												Email Provider
											</h3>
											<p className="text-sm text-text-sub-600">
												{result.checks.provider}
											</p>
										</div>
									)}

									{/* Risks */}
									{result.risks.length > 0 && (
										<div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-950/10">
											<h3 className="mb-4 flex items-center gap-2 font-medium text-red-900 dark:text-red-100">
												<Icon name="alert-circle" className="h-5 w-5" />
												Risks Detected
											</h3>
											<ul className="space-y-2">
												{result.risks.map((risk, i) => (
													<li
														key={i}
														className="flex items-start gap-2 text-red-800 text-sm dark:text-red-200"
													>
														<span className="mt-0.5">•</span>
														<span>{risk}</span>
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
								Improve your email deliverability
							</h2>
							<p className="mt-4 text-text-sub-600">
								Proper email configuration is essential for reaching the inbox.
								Get comprehensive email verification and deliverability
								monitoring.
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
									href="/features/api-reference"
									className={Button.buttonVariants({
										variant: "neutral",
										mode: "stroke",
										size: "medium",
									}).root({})}
								>
									View API Docs
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
