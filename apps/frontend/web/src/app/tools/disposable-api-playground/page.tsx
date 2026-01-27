"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import { toolsApi } from "@verifio/web/lib/tools-client";
import Link from "next/link";
import { useState } from "react";

type DisposableResult = {
	email: string;
	isDisposable: boolean;
	domain: string;
	provider: string | null;
	databaseSize: number;
	lastUpdated: string;
};

type ApiResponse = {
	success: boolean;
	data?: DisposableResult;
	error?: string;
};

// Common disposable email examples for the playground
const disposableExamples = [
	{ email: "test@tempmail.com", provider: "TempMail" },
	{ email: "user@guerrillamail.com", provider: "Guerrilla Mail" },
	{ email: "demo@10minutemail.com", provider: "10 Minute Mail" },
	{ email: "sample@mailinator.com", provider: "Mailinator" },
	{ email: "check@throwaway.email", provider: "Throwaway Email" },
];

const legitimateExamples = [
	{ email: "user@gmail.com", provider: "Gmail" },
	{ email: "person@outlook.com", provider: "Outlook" },
	{ email: "admin@yahoo.com", provider: "Yahoo" },
];

export default function DisposableAPIPlaygroundPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<DisposableResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleCheck = async (testEmail?: string) => {
		const emailToCheck = testEmail || email;

		if (!emailToCheck.trim()) return;

		setIsLoading(true);
		setError(null);
		setResult(null);

		const result = await toolsApi.checkDisposable(emailToCheck.trim());

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
							/ DISPOSABLE API PLAYGROUND
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-white-0 px-4 py-2">
							<Icon name="sparkles" className="h-4 w-4 text-purple-600" />
							<span className="font-medium text-sm text-text-sub-600">
								Interactive Demo
							</span>
						</div>
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Disposable Email Detection Playground
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Explore our disposable email detection in real-time. Test emails,
							learn about providers, and see the API in action.
						</p>
					</div>
				</div>
			</section>

			{/* Playground Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="p-10">
						<div className="mx-auto max-w-3xl">
							{/* Input Area */}
							<div className="flex gap-3">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleCheck()}
									placeholder="Enter an email to test..."
									className="flex-1 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-text-strong-950 outline-none transition-all focus:border-stroke-strong-950 focus:ring-2 focus:ring-stroke-strong-950/20"
									disabled={isLoading}
								/>
								<button
									type="button"
									onClick={() => handleCheck()}
									disabled={isLoading || !email.trim()}
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									{isLoading ? "Checking..." : "Test Email"}
								</button>
							</div>

							{error && (
								<div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">
									{error}
								</div>
							)}

							{/* Result Display */}
							{result && (
								<div className="mt-8">
									<div
										className={`rounded-xl border p-6 ${
											result.isDisposable
												? "border-red-500/20 bg-red-500/10"
												: "border-green-500/20 bg-green-500/10"
										}`}
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-text-sub-600">Result</p>
												<p
													className={`mt-1 font-semibold text-2xl ${
														result.isDisposable
															? "text-red-600"
															: "text-green-600"
													}`}
												>
													{result.isDisposable
														? "Disposable Email"
														: "Legitimate Email"}
												</p>
												{result.provider && (
													<p className="mt-1 text-sm text-text-sub-600">
														Provider: {result.provider}
													</p>
												)}
											</div>
											<div className="flex h-16 w-16 items-center justify-center">
												<Icon
													name={result.isDisposable ? "shield" : "check-circle"}
													className={`h-12 w-12 ${
														result.isDisposable
															? "text-red-600"
															: "text-green-600"
													}`}
												/>
											</div>
										</div>
										<div className="mt-4 border-stroke-soft-200 border-t pt-4">
											<p className="text-text-sub-600 text-xs">
												Domain:{" "}
												<span className="font-mono">{result.domain}</span>
											</p>
											<p className="mt-1 text-text-sub-600 text-xs">
												Database: {result.databaseSize.toLocaleString()}{" "}
												disposable domains
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Example Emails */}
							<div className="mt-12">
								<h3 className="mb-6 font-semibold text-text-strong-950 text-xl">
									Try These Examples
								</h3>

								{/* Disposable Examples */}
								<div className="mb-8">
									<h4 className="mb-4 flex items-center gap-2 font-medium text-red-600 text-sm">
										<Icon name="shield" className="h-4 w-4" />
										Disposable Email Providers
									</h4>
									<div className="grid gap-3 md:grid-cols-2">
										{disposableExamples.map((example) => (
											<button
												key={example.email}
												type="button"
												onClick={() => {
													setEmail(example.email);
													handleCheck(example.email);
												}}
												disabled={isLoading}
												className="flex items-center gap-3 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-left transition-all hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
											>
												<Icon
													name="alert-triangle"
													className="h-4 w-4 text-red-500"
												/>
												<div className="flex-1">
													<p className="font-mono text-sm text-text-strong-950">
														{example.email}
													</p>
													<p className="text-text-sub-600 text-xs">
														{example.provider}
													</p>
												</div>
												<Icon
													name="arrow-right"
													className="h-4 w-4 text-text-sub-600"
												/>
											</button>
										))}
									</div>
								</div>

								{/* Legitimate Examples */}
								<div>
									<h4 className="mb-4 flex items-center gap-2 font-medium text-green-600 text-sm">
										<Icon name="check-circle" className="h-4 w-4" />
										Legitimate Email Providers
									</h4>
									<div className="grid gap-3 md:grid-cols-2">
										{legitimateExamples.map((example) => (
											<button
												key={example.email}
												type="button"
												onClick={() => {
													setEmail(example.email);
													handleCheck(example.email);
												}}
												disabled={isLoading}
												className="flex items-center gap-3 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-left transition-all hover:border-green-300 hover:bg-green-50 disabled:opacity-50"
											>
												<Icon
													name="check-circle"
													className="h-4 w-4 text-green-500"
												/>
												<div className="flex-1">
													<p className="font-mono text-sm text-text-strong-950">
														{example.email}
													</p>
													<p className="text-text-sub-600 text-xs">
														{example.provider}
													</p>
												</div>
												<Icon
													name="arrow-right"
													className="h-4 w-4 text-text-sub-600"
												/>
											</button>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* API Integration Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">
							[02] API INTEGRATION
						</span>
						<span className="text-sm text-text-sub-600">/ REAL DETECTION</span>
					</div>
					<div className="p-10 md:p-16">
						<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Powerful disposable email detection
						</h2>
						<p className="mt-4 text-text-sub-600">
							Our API checks against a database of 72,000+ known disposable
							email domains. Get real-time detection with comprehensive
							coverage.
						</p>

						{/* Stats */}
						<div className="mt-8 grid gap-4 md:grid-cols-3">
							<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
									<Icon name="database" className="h-6 w-6" />
								</div>
								<p className="mt-4 font-bold text-3xl text-text-strong-950">
									72K+
								</p>
								<p className="mt-1 text-sm text-text-sub-600">
									Disposable domains
								</p>
							</div>
							<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
									<Icon name="zap" className="h-6 w-6" />
								</div>
								<p className="mt-4 font-bold text-3xl text-text-strong-950">
									&lt;50ms
								</p>
								<p className="mt-1 text-sm text-text-sub-600">Response time</p>
							</div>
							<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
									<Icon name="refresh" className="h-6 w-6" />
								</div>
								<p className="mt-4 font-bold text-3xl text-text-strong-950">
									Daily
								</p>
								<p className="mt-1 text-sm text-text-sub-600">
									Database updates
								</p>
							</div>
						</div>

						{/* CTA */}
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Link
								href="/pricing"
								className={Button.buttonVariants({
									variant: "primary",
									size: "medium",
								}).root({})}
							>
								Get API Access
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
			</section>

			{/* How It Works */}
			<section>
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[03] HOW IT WORKS</span>
						<span className="text-sm text-text-sub-600">/ UNDER THE HOOD</span>
					</div>
					<div className="p-10 md:p-16">
						<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
							How disposable email detection works
						</h2>
						<p className="mt-4 text-text-sub-600">
							We maintain a comprehensive database of disposable email
							providers, updated daily from multiple sources.
						</p>

						<div className="mt-8 space-y-6">
							{[
								{
									step: "01",
									title: "Domain Extraction",
									desc: "When an email is submitted, we extract the domain portion for checking",
								},
								{
									step: "02",
									title: "Database Lookup",
									desc: "We query our database of 72,000+ known disposable email domains",
								},
								{
									step: "03",
									title: "Provider Identification",
									desc: "If matched, we identify the specific disposable email provider",
								},
								{
									step: "04",
									title: "Instant Response",
									desc: "Return results in under 50ms with confidence and provider details",
								},
							].map((item) => (
								<div key={item.step} className="flex gap-4">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10 font-semibold text-purple-600 text-sm">
										{item.step}
									</div>
									<div>
										<h3 className="font-semibold text-lg text-text-strong-950">
											{item.title}
										</h3>
										<p className="mt-1 text-sm text-text-sub-600">
											{item.desc}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
