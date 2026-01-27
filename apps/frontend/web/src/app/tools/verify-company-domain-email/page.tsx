"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useState } from "react";

type VerificationResult = {
	email: string;
	status: "valid" | "invalid" | "risky";
	score: number;
	isCorporate: boolean;
	domainType: string;
	checks: {
		syntax: boolean;
		mx: boolean;
		smtp: boolean;
	};
};

function validateCorporateEmail(email: string): boolean {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regex.test(email)) return false;

	const freeProviders = [
		"gmail.com",
		"yahoo.com",
		"outlook.com",
		"hotmail.com",
		"aol.com",
		"icloud.com",
		"protonmail.com",
	];
	const domain = email.split("@")[1]?.toLowerCase() || "";
	return !freeProviders.includes(domain);
}

async function mockVerifyCorporateEmail(
	email: string,
): Promise<VerificationResult> {
	await new Promise((resolve) => setTimeout(resolve, 1500));

	const isValidSyntax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	const isCorporate = validateCorporateEmail(email);
	const domain = email.split("@")[1]?.toLowerCase() || "";

	let status: VerificationResult["status"] = "invalid";
	let score = 0;

	if (!isValidSyntax) {
		status = "invalid";
		score = 0;
	} else if (!isCorporate) {
		status = "risky";
		score = 50;
	} else {
		status = "valid";
		score = 92;
	}

	return {
		email,
		status,
		score,
		isCorporate,
		domainType: isCorporate ? "Corporate/Business" : "Free Email Provider",
		checks: {
			syntax: isValidSyntax,
			mx: isValidSyntax,
			smtp: isValidSyntax && status === "valid",
		},
	};
}

export default function VerifyCompanyDomainEmailPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<VerificationResult | null>(null);

	const handleVerify = async () => {
		if (!email.trim()) return;
		setIsLoading(true);
		try {
			const verificationResult = await mockVerifyCorporateEmail(email);
			setResult(verificationResult);
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
						<span className="text-sm text-text-sub-600">
							[01] COMPANY EMAIL VERIFICATION
						</span>
						<span className="text-sm text-text-sub-600">
							/ B2B EMAIL CHECKER
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-white-0 px-4 py-2">
							<Icon name="building" className="h-4 w-4 text-blue-600" />
							<span className="font-medium text-sm text-text-sub-600">
								B2B Email Verification
							</span>
						</div>
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Company Email Verification
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Verify business and corporate email addresses instantly. Filter
							out free email providers and focus on B2B leads.
						</p>
					</div>
				</div>
			</section>

			{/* Verification Tool */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="p-10">
						<div className="mx-auto max-w-2xl">
							<div className="flex gap-3">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleVerify()}
									placeholder="Enter business email (e.g., john@company.com)"
									className="flex-1 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-text-strong-950 outline-none transition-all focus:border-stroke-strong-950 focus:ring-2 focus:ring-stroke-strong-950/20"
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
									{isLoading ? "Verifying..." : "Verify Email"}
								</button>
							</div>

							{result && (
								<div className="mt-8 space-y-6">
									{/* Status Card */}
									<div
										className={`rounded-xl border p-6 ${
											result.isCorporate
												? "border-blue-500/20 bg-blue-500/10"
												: "border-yellow-500/20 bg-yellow-500/10"
										}`}
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-text-sub-600">Domain Type</p>
												<p
													className={`mt-1 font-semibold text-2xl ${
														result.isCorporate
															? "text-blue-600"
															: "text-yellow-600"
													}`}
												>
													{result.domainType}
												</p>
											</div>
											<div className="text-right">
												<p className="text-sm text-text-sub-600">
													Quality Score
												</p>
												<p
													className={`mt-1 font-bold text-3xl ${
														result.isCorporate
															? "text-blue-600"
															: "text-yellow-600"
													}`}
												>
													{result.score}%
												</p>
											</div>
										</div>
									</div>

									{/* Checks */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Verification Checks
										</h3>
										<div className="space-y-3">
											{[
												{
													label: "Corporate Domain",
													passed: result.isCorporate,
													desc: "Not a free email provider",
												},
												{
													label: "MX Records",
													passed: result.checks.mx,
													desc: "Domain can receive emails",
												},
												{
													label: "Mailbox Active",
													passed: result.checks.smtp,
													desc: "Email address is valid",
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

									{!result.isCorporate && (
										<div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900/30 dark:bg-yellow-950/10">
											<div className="flex items-start gap-3">
												<Icon
													name="alert-triangle"
													className="mt-0.5 h-5 w-5 text-yellow-600"
												/>
												<div>
													<h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
														Free Email Provider Detected
													</h4>
													<p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
														This email address uses a free email provider rather
														than a corporate domain. For B2B outreach, consider
														focusing on company email addresses.
													</p>
												</div>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Educational Content */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="space-y-12 p-10 md:p-16">
						<article>
							<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
								What is Company Email Verification?
							</h2>
							<p className="text-text-sub-600 leading-relaxed">
								Company email verification is the process of validating business
								and corporate email addresses to ensure they are legitimate and
								associated with a company domain. Unlike free email providers
								like Gmail or Yahoo, company emails use custom domains (e.g.,
								john@acmecorp.com) and indicate a professional business
								relationship.
							</p>
							<p className="mt-4 text-text-sub-600 leading-relaxed">
								Our free company email verification tool helps B2B businesses
								identify and verify corporate email addresses. This is essential
								for lead generation, account-based marketing, and sales outreach
								where you want to target decision-makers at specific companies
								rather than consumers using free email services.
							</p>
						</article>

						<article>
							<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
								Why Verify Company Email Addresses?
							</h2>
							<p className="text-text-sub-600 leading-relaxed">
								Company email addresses typically have higher engagement rates
								for B2B outreach compared to free email addresses.
								Decision-makers and business professionals usually use their
								corporate email for work communications, making these addresses
								more valuable for sales and marketing campaigns.
							</p>
							<p className="mt-4 text-text-sub-600 leading-relaxed">
								Verifying company emails helps you maintain a clean B2B email
								list, improves deliverability to business domains, and ensures
								your messages reach the right people at your target companies.
								It also helps prevent fraud by identifying fake corporate emails
								and protecting your brand reputation.
							</p>
						</article>

						<article>
							<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
								Corporate vs Free Email Domains
							</h2>
							<p className="text-text-sub-600 leading-relaxed">
								Our tool distinguishes between corporate domains and free email
								providers:
							</p>
							<div className="mt-6 grid gap-4 md:grid-cols-2">
								<div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/30 dark:bg-blue-950/10">
									<h3 className="font-semibold text-blue-900 dark:text-blue-100">
										Corporate Domains
									</h3>
									<p className="mt-2 text-blue-800 text-sm dark:text-blue-200">
										Custom domains owned by businesses (e.g., @acmecorp.com,
										@startup.io). These indicate professional email addresses
										used for business communications.
									</p>
								</div>
								<div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-900/30 dark:bg-gray-950/10">
									<h3 className="font-semibold text-gray-900 dark:text-gray-100">
										Free Email Providers
									</h3>
									<p className="mt-2 text-gray-800 text-sm dark:text-gray-200">
										Gmail, Yahoo, Outlook, Hotmail, iCloud, and similar
										services. While valid, these are personal emails rather than
										business addresses.
									</p>
								</div>
							</div>
						</article>

						<article>
							<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
								B2B Email Best Practices
							</h2>
							<ul className="space-y-3 text-text-sub-600">
								<li className="flex items-start gap-2">
									<Icon name="check" className="mt-1 h-4 w-4 text-green-600" />
									<span>
										<strong>Focus on quality over quantity:</strong> A smaller
										list of verified company emails outperforms a large list of
										unverified addresses
									</span>
								</li>
								<li className="flex items-start gap-2">
									<Icon name="check" className="mt-1 h-4 w-4 text-green-600" />
									<span>
										<strong>Verify before adding to CRM:</strong> Check company
										emails during lead capture to maintain data quality
									</span>
								</li>
								<li className="flex items-start gap-2">
									<Icon name="check" className="mt-1 h-4 w-4 text-green-600" />
									<span>
										<strong>Respect unsubscribe requests:</strong> Corporate
										emails are subject to GDPR and other privacy regulations
									</span>
								</li>
								<li className="flex items-start gap-2">
									<Icon name="check" className="mt-1 h-4 w-4 text-green-600" />
									<span>
										<strong>Personalize outreach:</strong> Use company names and
										domains to customize your B2B emails
									</span>
								</li>
							</ul>
						</article>

						<article>
							<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
								More Verification Tools
							</h2>
							<div className="grid gap-4 md:grid-cols-3">
								<Link
									href="/tools/email-checker"
									className="group rounded-xl border border-stroke-soft-100 bg-white p-6 transition-all hover:border-stroke-soft-200"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
											<Icon name="mail-single" className="h-5 w-5" />
										</div>
										<div>
											<h3 className="font-semibold text-text-strong-950 group-hover:text-purple-600">
												Free Email Verifier
											</h3>
											<p className="mt-1 text-sm text-text-sub-600">
												Verify any email address
											</p>
										</div>
									</div>
								</Link>
								<Link
									href="/tools/role-checker"
									className="group rounded-xl border border-stroke-soft-100 bg-white p-6 transition-all hover:border-stroke-soft-200"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
											<Icon name="users" className="h-5 w-5" />
										</div>
										<div>
											<h3 className="font-semibold text-text-strong-950 group-hover:text-orange-600">
												Role Email Checker
											</h3>
											<p className="mt-1 text-sm text-text-sub-600">
												Identify info@, sales@ emails
											</p>
										</div>
									</div>
								</Link>
								<Link
									href="/tools/bulk-tester"
									className="group rounded-xl border border-stroke-soft-100 bg-white p-6 transition-all hover:border-stroke-soft-200"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
											<Icon name="layers" className="h-5 w-5" />
										</div>
										<div>
											<h3 className="font-semibold text-text-strong-950 group-hover:text-green-600">
												Bulk Email Tester
											</h3>
											<p className="mt-1 text-sm text-text-sub-600">
												Test multiple emails at once
											</p>
										</div>
									</div>
								</Link>
							</div>
						</article>
					</div>
				</div>
			</section>
		</div>
	);
}
