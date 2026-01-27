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

export default function DisposableDetectorPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<DisposableResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleCheck = async () => {
		if (!email.trim()) return;

		setIsLoading(true);
		setError(null);
		setResult(null);

		const result = await toolsApi.checkDisposable(email.trim());

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
							/ DISPOSABLE EMAIL DETECTOR
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Disposable Email Detector
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Identify temporary and throwaway email addresses. Protect your
							forms from fake signups and spam.
						</p>
					</div>
				</div>
			</section>

			{/* Detector Tool */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="p-10">
						<div className="mx-auto max-w-2xl">
							{/* Input Section */}
							<div className="flex gap-3">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleCheck()}
									placeholder="Enter an email to check..."
									className="flex-1 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-text-strong-950 outline-none transition-all focus:border-stroke-strong-950 focus:ring-2 focus:ring-stroke-strong-950/20"
									disabled={isLoading}
								/>
								<button
									type="button"
									onClick={handleCheck}
									disabled={isLoading || !email.trim()}
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									{isLoading ? "Checking..." : "Check Email"}
								</button>
							</div>

							{error && (
								<div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">
									{error}
								</div>
							)}

							{/* Results Section */}
							{result && (
								<div className="mt-8 space-y-6">
									{/* Status Card */}
									<div
										className={`rounded-xl border p-6 ${
											result.isDisposable
												? "border-red-500/20 bg-red-500/10"
												: "border-green-500/20 bg-green-500/10"
										}`}
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-text-sub-600">Type</p>
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
									</div>

									{/* Provider Info */}
									{result.provider && (
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<h3 className="mb-4 font-medium text-text-strong-950">
												Provider Detected
											</h3>
											<div className="flex items-center gap-3 rounded-lg bg-bg-weak-50 px-4 py-3">
												<Icon
													name="alert-triangle"
													className="h-5 w-5 text-yellow-600"
												/>
												<div>
													<p className="font-medium text-text-strong-950">
														{result.provider}
													</p>
													<p className="text-text-sub-600 text-xs">
														Disposable email provider
													</p>
												</div>
											</div>
										</div>
									)}

									{/* Domain Info */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Domain
										</h3>
										<div className="rounded-lg bg-bg-weak-50 px-4 py-3">
											<p className="font-mono text-sm text-text-strong-950">
												{result.domain}
											</p>
										</div>
									</div>

									{/* Database Stats */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Database Coverage
										</h3>
										<div className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-4 py-3">
											<span className="text-sm text-text-sub-600">
												Known disposable domains
											</span>
											<span className="font-bold text-text-strong-950">
												{result.databaseSize.toLocaleString()}
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section>
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="grid gap-8 p-10 md:grid-cols-2 md:p-16">
						<div>
							<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
								Protect your forms from fake signups
							</h2>
							<p className="mt-4 text-text-sub-600">
								Disposable emails are temporary addresses used to bypass signup
								requirements. Our detector checks against a database of 72,000+
								known disposable email providers.
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
									href="/tools/disposable-detector"
									className={Button.buttonVariants({
										variant: "neutral",
										mode: "stroke",
										size: "medium",
									}).root({})}
								>
									Try Another
								</Link>
							</div>
						</div>
						<div className="flex items-center justify-center">
							<div className="grid grid-cols-2 gap-4 text-center">
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">
										72K+
									</p>
									<p className="mt-1 text-sm text-text-sub-600">
										Domains tracked
									</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">
										100%
									</p>
									<p className="mt-1 text-sm text-text-sub-600">
										Detection accuracy
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
