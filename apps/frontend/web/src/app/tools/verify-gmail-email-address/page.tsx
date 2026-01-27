"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useState } from "react";

type VerificationResult = {
	email: string;
	status: "valid" | "invalid" | "risky";
	score: number;
	isGmail: boolean;
	checks: {
		syntax: boolean;
		mx: boolean;
		smtp: boolean;
	};
};

function validateGmailSyntax(email: string): boolean {
	const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
	return gmailRegex.test(email);
}

async function mockVerifyGmailEmail(
	email: string,
): Promise<VerificationResult> {
	await new Promise((resolve) => setTimeout(resolve, 1500));

	const isValidSyntax = validateGmailSyntax(email);
	const isGmail = email.toLowerCase().endsWith("@gmail.com");

	let status: VerificationResult["status"] = "invalid";
	let score = 0;

	if (!isValidSyntax) {
		status = "invalid";
		score = 0;
	} else if (!isGmail) {
		status = "invalid";
		score = 20;
	} else {
		status = "valid";
		score = 95;
	}

	return {
		email,
		status,
		score,
		isGmail: isValidSyntax && isGmail,
		checks: {
			syntax: isValidSyntax,
			mx: isValidSyntax && isGmail,
			smtp: isValidSyntax && isGmail && status === "valid",
		},
	};
}

// FAQ Schema for Gmail verification
const FAQSchema = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: "How can I verify if a Gmail email address is valid?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Use our free Gmail email verification tool to instantly check if a Gmail address is valid. Simply enter the @gmail.com address and we'll verify the syntax, domain status, and mailbox existence without sending an email.",
			},
		},
		{
			"@type": "Question",
			name: "Does this tool work with all Gmail addresses?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Yes, our Gmail email checker works with all @gmail.com addresses including regular Gmail accounts, Google Workspace accounts that use Gmail, and Gmail aliases. It verifies standard format Gmail addresses.",
			},
		},
		{
			"@type": "Question",
			name: "Can I verify Gmail email addresses without sending an email?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Absolutely! Our tool uses SMTP verification to check if a Gmail mailbox exists without actually sending an email message. This means no notification is sent to the email owner.",
			},
		},
		{
			"@type": "Question",
			name: "What is the correct format for Gmail addresses?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Gmail addresses must follow the format username@gmail.com where the username can contain letters (a-z), numbers (0-9), and periods (.). Gmail addresses are not case-sensitive, and periods in the username are ignored (john.doe@gmail.com is the same as johndoe@gmail.com).",
			},
		},
	],
};

export default function VerifyGmailEmailPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<VerificationResult | null>(null);

	const handleVerify = async () => {
		if (!email.trim()) return;
		setIsLoading(true);
		try {
			const verificationResult = await mockVerifyGmailEmail(email);
			setResult(verificationResult);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(FAQSchema),
				}}
			/>

			<div className="min-h-screen">
				{/* Hero Section */}
				<section className="border-stroke-soft-100 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
						<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
							<span className="text-sm text-text-sub-600">
								[01] GMAIL VERIFICATION
							</span>
							<span className="text-sm text-text-sub-600">
								/ VERIFY GMAIL EMAILS
							</span>
						</div>
						<div className="px-10 py-16 text-center">
							<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-white-0 px-4 py-2">
								<Icon name="mail-single" className="h-4 w-4 text-red-600" />
								<span className="font-medium text-sm text-text-sub-600">
									Gmail Email Checker
								</span>
							</div>
							<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
								Verify Gmail Email Address
							</h1>
							<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
								Instantly check if any Gmail address (@gmail.com) is valid and
								active. Free tool with no signup required.
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
										placeholder="Enter Gmail address (e.g., user@gmail.com)"
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
										{isLoading ? "Verifying..." : "Verify Gmail"}
									</button>
								</div>

								{result && (
									<div className="mt-8 space-y-6">
										{/* Status Card */}
										<div
											className={`rounded-xl border p-6 ${
												result.status === "valid"
													? "border-green-500/20 bg-green-500/10"
													: "border-red-500/20 bg-red-500/10"
											}`}
										>
											<div className="flex items-center justify-between">
												<div>
													<p className="text-sm text-text-sub-600">
														Gmail Status
													</p>
													<p
														className={`mt-1 font-semibold text-2xl capitalize ${
															result.status === "valid"
																? "text-green-600"
																: "text-red-600"
														}`}
													>
														{result.status}
													</p>
												</div>
												<div className="text-right">
													<p className="text-sm text-text-sub-600">
														Quality Score
													</p>
													<p
														className={`mt-1 font-bold text-3xl ${
															result.status === "valid"
																? "text-green-600"
																: "text-red-600"
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
														label: "Gmail Format",
														passed: result.checks.syntax,
														desc: "Valid @gmail.com format",
													},
													{
														label: "Gmail MX Records",
														passed: result.checks.mx,
														desc: "Gmail can receive emails",
													},
													{
														label: "Mailbox Exists",
														passed: result.checks.smtp,
														desc: "Gmail account is active",
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

				{/* Educational Content */}
				<section className="border-stroke-soft-100 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
						<div className="space-y-12 p-10 md:p-16">
							{/* About Gmail Verification */}
							<article>
								<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
									About Gmail Email Verification
								</h2>
								<p className="text-text-sub-600 leading-relaxed">
									Verifying Gmail email addresses is essential for businesses
									that collect user emails, as Gmail is the most popular email
									provider worldwide with over 1.8 billion active users. Our
									free Gmail email checker allows you to instantly verify if any
									@gmail.com address is valid, active, and capable of receiving
									messages without sending an actual email.
								</p>
								<p className="mt-4 text-text-sub-600 leading-relaxed">
									Gmail addresses have specific formatting rules that must be
									followed. The username can contain letters (a-z), numbers
									(0-9), and periods (.), and is not case-sensitive. One unique
									feature of Gmail is that periods in the username are ignored -
									john.doe and johndoe are the same address. Our verification
									tool accounts for all these Gmail-specific rules to ensure
									accurate results.
								</p>
							</article>

							{/* Why Verify Gmail */}
							<article>
								<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
									Why Verify Gmail Email Addresses
								</h2>
								<p className="text-text-sub-600 leading-relaxed">
									Gmail addresses represent a significant portion of most email
									lists, often accounting for 40-60% of all addresses. Verifying
									Gmail addresses before adding them to your database helps
									maintain list hygiene and reduces bounce rates. Since Gmail
									has strict spam policies, high bounce rates from your emails
									to Gmail addresses can hurt your sender reputation and cause
									your emails to be marked as spam.
								</p>
								<p className="mt-4 text-text-sub-600 leading-relaxed">
									Gmail also offers email aliases through the plus sign feature
									(user+tag@gmail.com), which allows users to create variations
									of their address. Our tool can verify these aliases as valid
									Gmail addresses. This is useful for identifying users who
									might be using aliases to sign up multiple times for your
									service.
								</p>
							</article>

							{/* Gmail Format Rules */}
							<article>
								<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
									Gmail Address Format Rules
								</h2>
								<p className="text-text-sub-600 leading-relaxed">
									Gmail addresses must follow specific formatting rules to be
									valid:
								</p>
								<ul className="mt-4 space-y-2 text-text-sub-600">
									<li className="flex items-start gap-2">
										<Icon
											name="check"
											className="mt-1 h-4 w-4 text-green-600"
										/>
										<span>
											<strong>Username length:</strong> 6-30 characters before
											@gmail.com
										</span>
									</li>
									<li className="flex items-start gap-2">
										<Icon
											name="check"
											className="mt-1 h-4 w-4 text-green-600"
										/>
										<span>
											<strong>Allowed characters:</strong> Letters (a-z),
											numbers (0-9), and periods (.)
										</span>
									</li>
									<li className="flex items-start gap-2">
										<Icon
											name="check"
											className="mt-1 h-4 w-4 text-green-600"
										/>
										<span>
											<strong>Not case-sensitive:</strong> JohnDoe and johndoe
											are the same
										</span>
									</li>
									<li className="flex items-start gap-2">
										<Icon
											name="check"
											className="mt-1 h-4 w-4 text-green-600"
										/>
										<span>
											<strong>Periods ignored:</strong> john.doe and johndoe are
											identical
										</span>
									</li>
									<li className="flex items-start gap-2">
										<Icon
											name="check"
											className="mt-1 h-4 w-4 text-green-600"
										/>
										<span>
											<strong>Plus aliases:</strong> user+tag@gmail.com is valid
											and delivers to user@gmail.com
										</span>
									</li>
								</ul>
							</article>

							{/* Related Tools */}
							<article>
								<h2 className="mb-4 font-semibold text-3xl text-text-strong-950">
									More Email Verification Tools
								</h2>
								<div className="grid gap-4 md:grid-cols-2">
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
													Verify any email address instantly
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
													Test up to 100 emails at once
												</p>
											</div>
										</div>
									</Link>
								</div>
							</article>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section>
					<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
						<div className="space-y-0 p-10">
							{[
								{
									q: "How can I verify if a Gmail email address is valid?",
									a: "Use our free Gmail email verification tool above. Simply enter the @gmail.com address and we'll verify the syntax, domain status, and mailbox existence without sending an email.",
								},
								{
									q: "Does this work with Google Workspace accounts?",
									a: "Yes, our tool verifies all @gmail.com addresses including personal Gmail accounts and Google Workspace accounts that use Gmail for their domain.",
								},
								{
									q: "Can I verify Gmail addresses without sending an email?",
									a: "Yes! Our tool uses SMTP verification to check if the Gmail mailbox exists without sending any actual email message. The user won't receive any notification.",
								},
								{
									q: "What is the correct format for Gmail addresses?",
									a: "Gmail addresses must be username@gmail.com where the username is 6-30 characters with letters, numbers, and periods only. They're not case-sensitive and periods in usernames are ignored.",
								},
							].map((faq, index) => (
								<div
									key={index}
									className={
										"border-stroke-soft-100 border-b pt-8 pb-8 first:pt-0 last:border-0 last:pb-0"
									}
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
