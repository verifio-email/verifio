"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useState } from "react";

type DisposableResult = {
	email: string;
	isDisposable: boolean;
	domain: string;
	category: "tempmail" | "guerrillamail" | "10minutemail" | "custom" | "legitimate";
	riskScore: number;
};

const disposableDomains = [
	"tempmail.com",
	"throwaway.com",
	"mailinator.com",
	"guerrillamail.com",
	"10minutemail.com",
	"fakeinbox.com",
	"temp-mail.org",
	"getnada.com",
];

const getCategory = (
	domain: string,
): DisposableResult["category"] => {
	if (domain.includes("tempmail")) return "tempmail";
	if (domain.includes("guerrilla")) return "guerrillamail";
	if (domain.includes("10minute")) return "10minutemail";
	return "custom";
};

async function mockDisposableCheck(
	email: string,
): Promise<DisposableResult> {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const domain = email.split("@")[1]?.toLowerCase() || "";
	const isDisposable = disposableDomains.some((d) => domain.includes(d));

	return {
		email,
		isDisposable,
		domain,
		category: isDisposable ? getCategory(domain) : "legitimate",
		riskScore: isDisposable ? 90 : 10,
	};
}

export default function DisposableDetectorPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<DisposableResult | null>(null);

	const handleCheck = async () => {
		if (!email.trim()) return;
		setIsLoading(true);
		try {
			const checkResult = await mockDisposableCheck(email);
			setResult(checkResult);
		} finally {
			setIsLoading(false);
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
							/ DISPOSABLE EMAIL DETECTOR
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Disposable Email Detector
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Identify temporary and throwaway email addresses. Protect your forms
							from fake signups and spam.
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

							{/* Results Section */}
							{result && (
								<div className="mt-8 space-y-6">
									{/* Status Card */}
									<div
										className={`rounded-xl border p-6 ${
											result.isDisposable
												? "bg-red-500/10 border-red-500/20"
												: "bg-green-500/10 border-green-500/20"
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
											<div className="text-right">
												<p className="text-sm text-text-sub-600">
													Risk Score
												</p>
												<p
													className={`mt-1 font-bold text-3xl ${
														result.isDisposable
															? "text-red-600"
															: "text-green-600"
													}`}
												>
													{result.riskScore}/100
												</p>
											</div>
										</div>
									</div>

									{/* Details */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Analysis Details
										</h3>
										<div className="space-y-3">
											<div className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-4 py-3">
												<span className="text-sm text-text-sub-600">
													Domain
												</span>
												<span className="font-medium text-text-strong-950">
													{result.domain}
												</span>
											</div>
											<div className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-4 py-3">
												<span className="text-sm text-text-sub-600">
													Category
												</span>
												<span
													className={`rounded-full px-3 py-1 text-xs font-medium ${
														result.isDisposable
															? "bg-red-500/10 text-red-600"
															: "bg-green-500/10 text-green-600"
													}`}
												>
													{result.category}
												</span>
											</div>
											<div className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-4 py-3">
												<span className="text-sm text-text-sub-600">
													Recommendation
												</span>
												<span
													className={`font-medium ${
														result.isDisposable
															? "text-red-600"
															: "text-green-600"
													}`}
												>
													{result.isDisposable
														? "Block this email"
														: "Safe to accept"}
												</span>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Info Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[02] DATABASE</span>
						<span className="text-sm text-text-sub-600">
							/ 5000+ DISPOSABLE DOMAINS
						</span>
					</div>
					<div className="p-10 md:p-16">
						<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Comprehensive disposable email database
						</h2>
						<p className="mt-4 text-text-sub-600">
							Our database includes over 5,000 known disposable email domains,
							updated daily. We detect:
						</p>
						<div className="mt-8 grid gap-4 md:grid-cols-3">
							{[
								"Temporary email services",
								"10-minute email providers",
								"Guerrilla mail networks",
								"Fake inbox generators",
								"Throwaway email services",
								"Custom disposable domains",
							].map((item) => (
								<div
									key={item}
									className="flex items-center gap-3 rounded-lg border border-stroke-soft-100 bg-white p-4"
								>
									<Icon
										name="check-circle"
										className="h-5 w-5 text-green-600"
									/>
									<span className="text-sm font-medium text-text-strong-950">
										{item}
									</span>
								</div>
							))}
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
								Protect your forms from fake signups
							</h2>
							<p className="mt-4 text-text-sub-600">
								Integrate disposable email detection into your signup forms.
								Block fake accounts and improve your user data quality.
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
						<div className="flex items-center justify-center">
							<div className="grid grid-cols-2 gap-4 text-center">
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">
										5,000+
									</p>
									<p className="mt-1 text-sm text-text-sub-600">
										Domains tracked
									</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">
										99.9%
									</p>
									<p className="mt-1 text-sm text-text-sub-600">
										Detection rate
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
