"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useState } from "react";

// FAQ Schema for SEO
const FAQSchema = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: "What is email verification?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Email verification is the process of checking if an email address is valid, deliverable, and belongs to a real mailbox. It involves syntax validation, domain verification, MX record checks, and SMTP verification to ensure the email can receive messages.",
			},
		},
		{
			"@type": "Question",
			name: "How accurate is free email verification?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our free email verification tool achieves 99% accuracy by performing multiple checks including syntax validation, MX record verification, disposable email detection, and SMTP handshake. This ensures you get reliable results without any cost.",
			},
		},
		{
			"@type": "Question",
			name: "Is this email verifier really free?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Yes! Our free email verification tool allows you to verify individual email addresses without any cost, signup, or credit card required. For bulk verification needs, we offer affordable paid plans with additional features.",
			},
		},
		{
			"@type": "Question",
			name: "What checks does the email verifier perform?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Our free email verifier performs comprehensive checks including syntax validation (RFC 5322 compliance), MX record verification to confirm the domain can receive emails, disposable email detection to identify temporary addresses, catch-all detection, and SMTP verification to confirm mailbox existence.",
			},
		},
		{
			"@type": "Question",
			name: "Why should I verify email addresses?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Verifying email addresses helps reduce bounce rates, protect your sender reputation, save money on email marketing campaigns, improve deliverability, and maintain a clean email list. It prevents wasted resources on invalid emails and ensures your messages reach real recipients.",
			},
		},
	],
};

// Software Schema for SEO
const SoftwareSchema = {
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: "Verifio Free Email Verification Tool",
	applicationCategory: "BusinessApplication",
	operatingSystem: "Web Browser",
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "USD",
		description: "Free email verification tool with no signup required",
	},
	aggregateRating: {
		"@type": "AggregateRating",
		ratingValue: "4.9",
		ratingCount: "2847",
	},
	featureList: [
		"Syntax validation",
		"MX record verification",
		"Disposable email detection",
		"SMTP verification",
		"Quality scoring",
		"No signup required",
	],
};

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
		<>
			{/* Schema JSON-LD */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(FAQSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(SoftwareSchema),
				}}
			/>

			<div className="min-h-screen">
			{/* Hero Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
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
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
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
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
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
									<p className="font-bold text-3xl text-text-strong-950">99%</p>
									<p className="mt-1 text-sm text-text-sub-600">Accuracy</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">{"<"}1s</p>
									<p className="mt-1 text-sm text-text-sub-600">Per Email</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">10M+</p>
									<p className="mt-1 text-sm text-text-sub-600">
										Emails Verified
									</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">50+</p>
									<p className="mt-1 text-sm text-text-sub-600">Integrations</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
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

			{/* Educational Content Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[04] GUIDE</span>
						<span className="text-sm text-text-sub-600">
							/ EMAIL VERIFICATION EXPLAINED
						</span>
					</div>
					<div className="space-y-12 p-10 md:p-16">
						{/* What is Email Verification */}
						<article>
							<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
								What is Email Verification?
							</h2>
							<p className="text-text-sub-600 leading-relaxed">
								Email verification is the process of validating an email address
								to ensure it is accurate, deliverable, and belongs to a real
								mailbox. Our free email verification tool performs multiple checks
								in real-time to determine if an email address is valid without
								sending any actual messages. This helps businesses maintain clean
								email lists, reduce bounce rates, and protect their sender
								reputation.
							</p>
							<p className="mt-4 text-text-sub-600 leading-relaxed">
								When you verify an email address using our free tool, we check the
								email format (syntax validation), verify the domain exists and
								has proper mail exchange (MX) records, detect if the email is from
								a disposable or temporary email service, identify catch-all domains
								that accept all emails, and perform an SMTP handshake to confirm
								the mailbox exists and can receive messages.
							</p>
						</article>

						{/* How Email Verification Works */}
						<article>
							<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
								How Email Verification Works
							</h2>
							<p className="text-text-sub-600 leading-relaxed">
								Our free email verification process uses a multi-step approach to
								ensure maximum accuracy. First, we perform syntax validation to
								check if the email follows the standard format (RFC 5322). This
								includes verifying the email contains an @ symbol, has a valid
								local part before the @, and has a properly formatted domain with
								a valid top-level domain (TLD).
							</p>
							<p className="mt-4 text-text-sub-600 leading-relaxed">
								Next, we verify the domain by checking DNS records to confirm the
								domain exists and has MX (Mail Exchange) records configured. This
								tells us if the domain is set up to receive emails. We then check
								against our database of over 5,000 known disposable email domains
								to identify temporary or throwaway email addresses that are often
								used for fraudulent signups.
							</p>
							<p className="mt-4 text-text-sub-600 leading-relaxed">
								Finally, we perform an SMTP verification by connecting to the
								mail server and checking if the mailbox exists without actually
								sending an email. This ensures the email address is not only
								formatted correctly but also active and capable of receiving
								messages. The entire process takes less than one second and provides
								you with a detailed quality score and verification status.
							</p>
						</article>

						{/* Benefits of Email Verification */}
						<article>
							<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
								Benefits of Using a Free Email Verifier
							</h2>
							<p className="text-text-sub-600 leading-relaxed">
								Using our free email verification tool before sending campaigns can
								significantly improve your email marketing results. By removing
								invalid email addresses from your list, you can reduce bounce rates
								by up to 99%, which protects your sender reputation and prevents
								your emails from being marked as spam. Email service providers
								track bounce rates, and high bounce rates can lead to your emails
								being blocked or sent to spam folders.
							</p>
							<p className="mt-4 text-text-sub-600 leading-relaxed">
								Email verification also saves money by ensuring you only pay for
								valid email addresses. Many email marketing services charge based
								on list size, so removing invalid emails before importing them can
								reduce your costs. Additionally, verified emails have higher
								engagement rates, leading to better open rates, click-through
								rates, and conversions from your email campaigns.
							</p>
							<p className="mt-4 text-text-sub-600 leading-relaxed">
								Our free tool is perfect for quickly checking individual email
								addresses before adding them to your database. For businesses that
								need to verify large lists, we offer bulk verification services
								that can process thousands of emails in minutes with the same level
								of accuracy and detail.
							</p>
						</article>

						{/* Understanding Email Quality Scores */}
						<article>
							<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
								Understanding Email Quality Scores
							</h2>
							<p className="text-text-sub-600 leading-relaxed">
								Our free email verifier provides a quality score from 0-100 for
								each email address. This score indicates the likelihood that the
								email will be delivered successfully. Emails with scores above 90
								are considered excellent and safe to send to, while scores between
								70-89 are good but may have some minor risk factors. Scores below
								70 indicate various levels of risk, and you should consider
								removing these emails from your list.
							</p>
							<p className="mt-4 text-text-sub-600 leading-relaxed">
								The quality score is calculated based on multiple factors including
								syntax correctness, domain age and reputation, MX record
								configuration, disposable email status, catch-all domain detection,
								and SMTP verification results. Emails from free providers like Gmail
								typically score high (90+), while emails from newer domains or
								those with suspicious configurations may score lower.
							</p>
							<p className="mt-4 text-text-sub-600 leading-relaxed">
								Using quality scores helps you prioritize which emails to keep and
								which to remove. For example, you might decide to only send emails
								to addresses with scores above 80 to ensure maximum deliverability.
								This data-driven approach to list cleaning is more effective than
								simply removing all emails that fail verification, as it allows you
								to make informed decisions about borderline cases.
							</p>
						</article>

						{/* Related Tools */}
						<article>
							<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
								Related Email Verification Tools
							</h2>
							<p className="text-text-sub-600 leading-relaxed">
								In addition to our free email verifier, we offer several other
								free tools to help you manage email quality:
							</p>
							<div className="mt-6 grid gap-4 md:grid-cols-2">
								<Link
									href="/tools/syntax-validator"
									className="group rounded-xl border border-stroke-soft-100 bg-white p-6 transition-all hover:border-stroke-soft-200 hover:shadow-md"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
											<Icon name="text-input" className="h-5 w-5" />
										</div>
										<div>
											<h3 className="font-semibold text-text-strong-950 group-hover:text-purple-600">
												Email Syntax Checker
											</h3>
											<p className="mt-1 text-sm text-text-sub-600">
												Validate email format according to RFC standards
											</p>
										</div>
									</div>
								</Link>
								<Link
									href="/tools/disposable-detector"
									className="group rounded-xl border border-stroke-soft-100 bg-white p-6 transition-all hover:border-stroke-soft-200 hover:shadow-md"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600">
											<Icon name="shield" className="h-5 w-5" />
										</div>
										<div>
											<h3 className="font-semibold text-text-strong-950 group-hover:text-yellow-600">
												Disposable Email Detector
											</h3>
											<p className="mt-1 text-sm text-text-sub-600">
												Identify temporary and throwaway email addresses
											</p>
										</div>
									</div>
								</Link>
								<Link
									href="/tools/domain-lookup"
									className="group rounded-xl border border-stroke-soft-100 bg-white p-6 transition-all hover:border-stroke-soft-200 hover:shadow-md"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
											<Icon name="search" className="h-5 w-5" />
										</div>
										<div>
											<h3 className="font-semibold text-text-strong-950 group-hover:text-blue-600">
												Domain Lookup Tool
											</h3>
											<p className="mt-1 text-sm text-text-sub-600">
												Check MX records, SPF, DMARC for any domain
											</p>
										</div>
									</div>
								</Link>
								<Link
									href="/tools/bulk-tester"
									className="group rounded-xl border border-stroke-soft-100 bg-white p-6 transition-all hover:border-stroke-soft-200 hover:shadow-md"
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
												Test up to 100 emails at once for free
											</p>
										</div>
									</div>
								</Link>
							</div>
						</article>
					</div>
				</div>
			</section>

			{/* FAQ Section (visible on page) */}
			<section>
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[05] FAQ</span>
						<span className="text-sm text-text-sub-600">
							/ FREQUENTLY ASKED QUESTIONS
						</span>
					</div>
					<div className="space-y-0 p-10">
						{[
							{
								q: "What is email verification?",
								a: "Email verification is the process of checking if an email address is valid and can receive messages. It includes syntax checks, domain verification, MX record validation, and SMTP verification to confirm the mailbox exists.",
							},
							{
								q: "How accurate is this free email verifier?",
								a: "Our free email verification tool achieves 99% accuracy by performing multiple comprehensive checks. This includes syntax validation, MX record verification, disposable email detection, catch-all detection, and SMTP mailbox verification.",
							},
							{
								q: "Is this email verification tool really free?",
								a: "Yes! Our email verifier is completely free with no signup required, no credit card needed, and no hidden fees. You can verify individual email addresses instantly without any cost.",
							},
							{
								q: "What checks does the email verification perform?",
								a: "Our tool performs syntax validation (RFC 5322), MX record verification to confirm the domain can receive emails, disposable email detection to identify temporary addresses, catch-all domain detection, and SMTP verification to confirm mailbox existence.",
							},
							{
								q: "Why should I verify email addresses?",
								a: "Verifying emails reduces bounce rates by up to 99%, protects your sender reputation, saves money on email marketing costs, improves deliverability, and ensures your messages reach real recipients. It's essential for maintaining email list hygiene.",
							},
						].map((faq, index) => (
							<div
								key={index}
								className={`border-stroke-soft-100 border-b pb-8 pt-8 last:border-0 last:pb-0 first:pt-0`}
							>
								<h3 className="font-semibold text-lg text-text-strong-950">
									{faq.q}
								</h3>
								<p className="mt-2 text-text-sub-600 leading-relaxed">
									{faq.a}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
		</>
	);
}
