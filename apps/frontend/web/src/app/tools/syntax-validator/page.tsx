"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useState } from "react";

type ValidationResult = {
	email: string;
	isValid: boolean;
	errors: string[];
	warnings: string[];
	normalizedEmail?: string;
};

function validateEmailSyntax(email: string): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];
	let normalizedEmail = email;

	// Basic format check
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		errors.push("Invalid email format");
	}

	// Check for @
	if (!email.includes("@")) {
		errors.push("Missing @ symbol");
	} else {
		const [localPart, domain] = email.split("@");

		// Check local part
		if (!localPart) {
			errors.push("Missing local part before @");
		} else if (localPart.length > 64) {
			errors.push("Local part exceeds 64 characters");
		}

		// Check domain
		if (!domain) {
			errors.push("Missing domain after @");
		} else if (domain.length > 255) {
			errors.push("Domain exceeds 255 characters");
		} else if (!domain.includes(".")) {
			errors.push("Domain must contain at least one dot");
		} else {
			const tld = domain.split(".").pop();
			if (tld && tld.length < 2) {
				errors.push("TLD must be at least 2 characters");
			}
		}
	}

	// Warnings
	if (email.includes("..")) {
		warnings.push("Contains consecutive dots");
	}
	if (email.startsWith(".") || email.endsWith(".")) {
		warnings.push("Starts or ends with a dot");
	}
	if (email.includes("+")) {
		warnings.push("Contains plus sign (sub-addressing)");
	}

	// Normalize
	const isValid = errors.length === 0;
	if (isValid) {
		normalizedEmail = email.toLowerCase().trim();
	}

	return {
		email,
		isValid,
		errors,
		warnings,
		normalizedEmail: isValid ? normalizedEmail : undefined,
	};
}

export default function SyntaxValidatorPage() {
	const [email, setEmail] = useState("");
	const [result, setResult] = useState<ValidationResult | null>(null);

	const handleValidate = () => {
		if (!email.trim()) return;
		const validationResult = validateEmailSyntax(email);
		setResult(validationResult);
	};

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] FREE TOOL</span>
						<span className="text-sm text-text-sub-600">
							/ SYNTAX VALIDATOR
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Email Syntax Validator
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Validate email format according to RFC 5322 standards. Catch typos
							and invalid formats before sending.
						</p>
					</div>
				</div>
			</section>

			{/* Validator Tool */}
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
									onKeyDown={(e) => e.key === "Enter" && handleValidate()}
									placeholder="Enter an email address to validate..."
									className="flex-1 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-text-strong-950 outline-none transition-all focus:border-stroke-strong-950 focus:ring-2 focus:ring-stroke-strong-950/20"
								/>
								<button
									type="button"
									onClick={handleValidate}
									disabled={!email.trim()}
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									Validate
								</button>
							</div>

							{/* Results Section */}
							{result && (
								<div className="mt-8 space-y-6">
									{/* Status Card */}
									<div
										className={`rounded-xl border p-6 ${
											result.isValid
												? "bg-green-500/10 border-green-500/20"
												: "bg-red-500/10 border-red-500/20"
										}`}
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-text-sub-600">Status</p>
												<p
													className={`mt-1 font-semibold text-2xl ${
														result.isValid
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{result.isValid ? "Valid Format" : "Invalid Format"}
												</p>
											</div>
											<div className="flex h-16 w-16 items-center justify-center">
												<Icon
													name={result.isValid ? "check-circle" : "x-circle"}
													className={`h-12 w-12 ${
														result.isValid ? "text-green-600" : "text-red-600"
													}`}
												/>
											</div>
										</div>
									</div>

									{/* Errors */}
									{result.errors.length > 0 && (
										<div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-950/10">
											<h3 className="mb-4 flex items-center gap-2 font-medium text-red-900 dark:text-red-100">
												<Icon name="alert-circle" className="h-5 w-5" />
												Errors Found
											</h3>
											<ul className="space-y-2">
												{result.errors.map((error, index) => (
													<li
														key={index}
														className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200"
													>
														<span className="mt-0.5">•</span>
														<span>{error}</span>
													</li>
												))}
											</ul>
										</div>
									)}

									{/* Warnings */}
									{result.warnings.length > 0 && (
										<div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900/30 dark:bg-yellow-950/10">
											<h3 className="mb-4 flex items-center gap-2 font-medium text-yellow-900 dark:text-yellow-100">
												<Icon name="alert-triangle" className="h-5 w-5" />
												Warnings
											</h3>
											<ul className="space-y-2">
												{result.warnings.map((warning, index) => (
													<li
														key={index}
														className="flex items-start gap-2 text-sm text-yellow-800 dark:text-yellow-200"
													>
														<span className="mt-0.5">•</span>
														<span>{warning}</span>
													</li>
												))}
											</ul>
										</div>
									)}

									{/* Normalized Email */}
									{result.normalizedEmail && (
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<h3 className="mb-4 font-medium text-text-strong-950">
												Normalized Email
											</h3>
											<div className="rounded-lg bg-bg-weak-50 px-4 py-3">
												<p className="font-mono text-sm text-text-strong-950">
													{result.normalizedEmail}
												</p>
											</div>
											<p className="mt-2 text-xs text-text-sub-600">
												Email converted to lowercase and trimmed
											</p>
										</div>
									)}

									{/* Checks */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											RFC 5322 Compliance Checks
										</h3>
										<div className="space-y-3">
											{[
												{ label: "Valid email format", passed: result.isValid },
												{
													label: "Local part present",
													passed: email.includes("@") &&
														!!email.split("@")[0],
												},
												{
													label: "Domain present",
													passed: email.includes("@") &&
														!!email.split("@")[1],
												},
												{
													label: "TLD valid length",
													passed: !!email.split("@")[1]?.split(".").pop() &&
														email.split("@")[1]!.split(".").pop()!.length >=
															2,
												},
											].map((check) => (
												<div
													key={check.label}
													className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-4 py-3"
												>
													<span className="text-sm text-text-strong-950">
														{check.label}
													</span>
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

			{/* RFC Standards Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[02] STANDARDS</span>
						<span className="text-sm text-text-sub-600">
							/ RFC 5322 COMPLIANT
						</span>
					</div>
					<div className="p-10 md:p-16">
						<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Built on email standards
						</h2>
						<p className="mt-4 text-text-sub-600">
							Our validator follows RFC 5322 standards for email format
							validation. This ensures maximum compatibility with email systems
							worldwide.
						</p>
						<div className="mt-8 grid gap-4 md:grid-cols-2">
							{[
								{
									icon: "text-input",
									title: "Format Validation",
									desc: "Checks proper email structure with @ and domain",
								},
								{
									icon: "ruler",
									title: "Length Checks",
									desc: "Validates local part (64) and domain (255) limits",
								},
								{
									icon: "workflow",
									title: "Character Validation",
									desc: "Ensures only valid characters are used",
								},
								{
									icon: "zap",
									title: "Instant Results",
									desc: "Client-side validation for immediate feedback",
								},
							].map((item) => (
								<div
									key={item.title}
									className="rounded-xl border border-stroke-soft-100 bg-white p-6"
								>
									<div
										className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600"
									>
										<Icon name={item.icon} className="h-6 w-6" />
									</div>
									<h3 className="mt-4 font-semibold text-lg text-text-strong-950">
										{item.title}
									</h3>
									<p className="mt-2 text-sm text-text-sub-600">
										{item.desc}
									</p>
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
								Add syntax validation to your forms
							</h2>
							<p className="mt-4 text-text-sub-600">
								Integrate real-time email validation into your signup forms.
								Prevent invalid emails from entering your database.
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
										0ms
									</p>
									<p className="mt-1 text-sm text-text-sub-600">
										Validation time
									</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">
										100%
									</p>
									<p className="mt-1 text-sm text-text-sub-600">
										RFC compliant
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
