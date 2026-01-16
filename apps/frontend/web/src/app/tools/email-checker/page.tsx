"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useState } from "react";

type VerificationResult = {
	email: string;
	status: "valid" | "invalid" | "risky" | "unknown";
	score: number;
	checks: {
		syntax: boolean;
		mx: boolean;
		disposable: boolean;
		catchAll: boolean;
		smtp: boolean;
	};
};

function validateEmailSyntax(email: string): boolean {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
}

// Mock verification for demo - in production this would call your API
async function mockVerifyEmail(email: string): Promise<VerificationResult> {
	await new Promise((resolve) => setTimeout(resolve, 1500));

	const isValidSyntax = validateEmailSyntax(email);
	const domain = email.split("@")[1]?.toLowerCase() || "";

	const disposableDomains = [
		"tempmail.com",
		"throwaway.com",
		"mailinator.com",
		"guerrillamail.com",
	];
	const isDisposable = disposableDomains.some((d) => domain.includes(d));

	const freeProviders = [
		"gmail.com",
		"yahoo.com",
		"outlook.com",
		"hotmail.com",
	];
	const isFreeProvider = freeProviders.includes(domain);

	let status: VerificationResult["status"] = "unknown";
	let score = 0;

	if (!isValidSyntax) {
		status = "invalid";
		score = 0;
	} else if (isDisposable) {
		status = "risky";
		score = 30;
	} else if (isFreeProvider) {
		status = "valid";
		score = 95;
	} else {
		status = "valid";
		score = 85;
	}

	return {
		email,
		status,
		score,
		checks: {
			syntax: isValidSyntax,
			mx: isValidSyntax && !isDisposable,
			disposable: !isDisposable,
			catchAll: !isDisposable,
			smtp: isValidSyntax && status === "valid",
		},
	};
}

export default function EmailCheckerPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<VerificationResult | null>(null);

	const handleVerify = async () => {
		if (!email.trim()) return;
		setIsLoading(true);
		try {
			const verificationResult = await mockVerifyEmail(email);
			setResult(verificationResult);
		} finally {
			setIsLoading(false);
		}
	};

	const getStatusColor = (status: VerificationResult["status"]) => {
		switch (status) {
			case "valid":
				return "text-green-500";
			case "invalid":
				return "text-red-500";
			case "risky":
				return "text-yellow-500";
			default:
				return "text-gray-500";
		}
	};

	const getStatusBg = (status: VerificationResult["status"]) => {
		switch (status) {
			case "valid":
				return "bg-green-500/10 border-green-500/20";
			case "invalid":
				return "bg-red-500/10 border-red-500/20";
			case "risky":
				return "bg-yellow-500/10 border-yellow-500/20";
			default:
				return "bg-gray-500/10 border-gray-500/20";
		}
	};

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] FREE TOOL</span>
						<span className="text-sm text-text-sub-600">
							/ EMAIL VERIFICATION
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Free Email Verification Tool
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Instantly verify any email address. Check syntax, MX records,
							disposable domains, and more — completely free.
						</p>
					</div>
				</div>
			</section>

			{/* Email Checker Tool */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="p-10">
						<div className="mx-auto max-w-2xl">
							{/* Input Section */}
							<div className="flex gap-3">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleVerify()}
									placeholder="Enter an email address to verify..."
									className="flex-1 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-text-strong-950 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
								/>
								<button
									type="button"
									onClick={handleVerify}
									disabled={isLoading || !email.trim()}
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									{isLoading ? (
										<span className="flex items-center gap-2">
											<svg
												className="h-4 w-4 animate-spin"
												viewBox="0 0 24 24"
												aria-label="Loading"
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
										"Verify Email"
									)}
								</button>
							</div>

							{/* Results Section */}
							{result && (
								<div className="mt-8 space-y-6">
									{/* Status Card */}
									<div
										className={`rounded-xl border p-6 ${getStatusBg(result.status)}`}
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-text-sub-600">
													Email Status
												</p>
												<p
													className={`mt-1 font-semibold text-2xl capitalize ${getStatusColor(result.status)}`}
												>
													{result.status}
												</p>
											</div>
											<div className="text-right">
												<p className="text-sm text-text-sub-600">
													Quality Score
												</p>
												<p
													className={`mt-1 font-bold text-3xl ${getStatusColor(result.status)}`}
												>
													{result.score}%
												</p>
											</div>
										</div>
									</div>

									{/* Detailed Checks */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Verification Details
										</h3>
										<div className="grid gap-3">
											{[
												{
													label: "Syntax Check",
													passed: result.checks.syntax,
													desc: "Valid email format",
												},
												{
													label: "MX Records",
													passed: result.checks.mx,
													desc: "Domain can receive emails",
												},
												{
													label: "Disposable Check",
													passed: result.checks.disposable,
													desc: "Not a temporary email",
												},
												{
													label: "Catch-All Detection",
													passed: result.checks.catchAll,
													desc: "Server doesn't accept all emails",
												},
												{
													label: "SMTP Verification",
													passed: result.checks.smtp,
													desc: "Mailbox exists and is active",
												},
											].map((check) => (
												<div
													key={check.label}
													className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-4 py-3"
												>
													<div>
														<p className="font-medium text-sm text-text-strong-950">
															{check.label}
														</p>
														<p className="text-text-sub-600 text-xs">
															{check.desc}
														</p>
													</div>
													<span
														className={
															check.passed ? "text-green-500" : "text-red-500"
														}
													>
														{check.passed ? "✓" : "✗"}
													</span>
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

			{/* CTA Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[02] BULK</span>
						<span className="text-sm text-text-sub-600">
							/ VERIFY THOUSANDS OF EMAILS
						</span>
					</div>
					<div className="grid gap-8 p-10 md:grid-cols-2 md:p-16">
						<div>
							<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
								Need to verify bulk email lists?
							</h2>
							<p className="mt-4 text-text-sub-600">
								Upload CSV files with thousands of emails and get detailed
								verification results in minutes. Clean your lists, reduce
								bounces, and protect your sender reputation.
							</p>
							<div className="mt-6 flex flex-col gap-3 sm:flex-row">
								<Link
									href="/solutions/bulk-email-verification"
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									Learn More
								</Link>
								<Link
									href="/pricing"
									className={Button.buttonVariants({
										variant: "neutral",
										mode: "stroke",
										size: "medium",
									}).root({})}
								>
									View Pricing
								</Link>
							</div>
						</div>
						<div className="flex items-center justify-center">
							<div className="grid grid-cols-2 gap-4 text-center">
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-primary-500">99%</p>
									<p className="mt-1 text-sm text-text-sub-600">Accuracy</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-primary-500">{"<"}1s</p>
									<p className="mt-1 text-sm text-text-sub-600">Per Email</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-primary-500">10M+</p>
									<p className="mt-1 text-sm text-text-sub-600">
										Emails Verified
									</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-primary-500">50+</p>
									<p className="mt-1 text-sm text-text-sub-600">Integrations</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[03] FEATURES</span>
						<span className="text-sm text-text-sub-600">/ WHAT WE CHECK</span>
					</div>
					<div className="grid gap-0 md:grid-cols-3">
						{[
							{
								title: "Syntax Validation",
								desc: "Checks if the email follows proper formatting rules",
							},
							{
								title: "MX Record Check",
								desc: "Verifies the domain has valid mail exchange records",
							},
							{
								title: "Disposable Detection",
								desc: "Identifies temporary and throwaway email addresses",
							},
							{
								title: "SMTP Verification",
								desc: "Confirms the mailbox exists without sending an email",
							},
							{
								title: "Catch-All Detection",
								desc: "Detects servers that accept all emails regardless",
							},
							{
								title: "Role Account Check",
								desc: "Identifies generic emails like info@ or support@",
							},
						].map((feature, index) => (
							<div
								key={feature.title}
								className={`border-stroke-soft-100 p-8 ${index < 3 ? "border-b" : ""} ${index % 3 !== 2 ? "border-r" : ""}`}
							>
								<h3 className="font-medium text-text-strong-950">
									{feature.title}
								</h3>
								<p className="mt-2 text-sm text-text-sub-600">{feature.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
