"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useState } from "react";

type MXRecord = {
	priority: number;
	server: string;
};

type DomainResult = {
	domain: string;
	hasMX: boolean;
	mxRecords: MXRecord[];
	hasSPF: boolean;
	spfRecord?: string;
	hasDMARC: boolean;
	dmarcRecord?: string;
};

async function mockDomainLookup(domain: string): Promise<DomainResult> {
	await new Promise((resolve) => setTimeout(resolve, 1500));

	const mockResults: DomainResult = {
		domain,
		hasMX: Math.random() > 0.2,
		mxRecords:
			Math.random() > 0.2
				? [
						{ priority: 10, server: `mail1.${domain}` },
						{ priority: 20, server: `mail2.${domain}` },
						{ priority: 30, server: `mail3.${domain}` },
				  ]
				: [],
		hasSPF: Math.random() > 0.3,
		spfRecord: Math.random() > 0.3
			? `v=spf1 include:_spf.google.com ~all`
			: undefined,
		hasDMARC: Math.random() > 0.5,
		dmarcRecord: Math.random() > 0.5
			? `v=DMARC1; p=none; rua=mailto:dmarc@${domain}`
			: undefined,
	};

	return mockResults;
}

export default function DomainLookupPage() {
	const [domain, setDomain] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<DomainResult | null>(null);

	const handleLookup = async () => {
		if (!domain.trim()) return;
		setIsLoading(true);
		try {
			const lookupResult = await mockDomainLookup(domain);
			setResult(lookupResult);
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
						<span className="text-sm text-text-sub-600">/ DOMAIN LOOKUP</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Free Domain Lookup Tool
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Check MX records, SPF, DMARC, and DNS configuration for any domain.
							Ensure your emails can reach the destination.
						</p>
					</div>
				</div>
			</section>

			{/* Domain Lookup Tool */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="p-10">
						<div className="mx-auto max-w-2xl">
							{/* Input Section */}
							<div className="flex gap-3">
								<input
									type="text"
									value={domain}
									onChange={(e) => setDomain(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleLookup()}
									placeholder="Enter a domain (e.g., gmail.com)"
									className="flex-1 rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 text-text-strong-950 outline-none transition-all focus:border-stroke-strong-950 focus:ring-2 focus:ring-stroke-strong-950/20"
								/>
								<button
									type="button"
									onClick={handleLookup}
									disabled={isLoading || !domain.trim()}
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									{isLoading ? "Looking up..." : "Lookup Domain"}
								</button>
							</div>

							{/* Results Section */}
							{result && (
								<div className="mt-8 space-y-6">
									{/* Status Card */}
									<div
										className={`rounded-xl border p-6 ${
											result.hasMX
												? "bg-green-500/10 border-green-500/20"
												: "bg-red-500/10 border-red-500/20"
										}`}
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-text-sub-600">
													Domain Status
												</p>
												<p
													className={`mt-1 font-semibold text-2xl ${
														result.hasMX
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{result.hasMX
														? "Can Receive Emails"
														: "Cannot Receive Emails"}
												</p>
											</div>
											<div className="text-right">
												<p className="text-sm text-text-sub-600">
													MX Records
												</p>
												<p
													className={`mt-1 font-bold text-3xl ${
														result.hasMX
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{result.mxRecords.length}
												</p>
											</div>
										</div>
									</div>

									{/* MX Records */}
									{result.mxRecords.length > 0 && (
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<h3 className="mb-4 font-medium text-text-strong-950">
												MX Records
											</h3>
											<div className="space-y-2">
												{result.mxRecords.map((record, index) => (
													<div
														key={index}
														className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-4 py-3"
													>
														<span className="font-medium text-text-strong-950">
															{record.server}
														</span>
														<span className="text-sm text-text-sub-600">
															Priority: {record.priority}
														</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Security Records */}
									<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
										<h3 className="mb-4 font-medium text-text-strong-950">
											Email Security
										</h3>
										<div className="space-y-3">
											<div className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-4 py-3">
												<div>
													<p className="font-medium text-sm text-text-strong-950">
														SPF Record
													</p>
													{result.spfRecord && (
														<p className="mt-1 text-xs text-text-sub-600">
															{result.spfRecord}
														</p>
													)}
												</div>
												<span
													className={
														result.hasSPF
															? "text-green-500"
															: "text-red-500"
													}
												>
													{result.hasSPF ? "✓" : "✗"}
												</span>
											</div>
											<div className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-4 py-3">
												<div>
													<p className="font-medium text-sm text-text-strong-950">
														DMARC Record
													</p>
													{result.dmarcRecord && (
														<p className="mt-1 text-xs text-text-sub-600">
															{result.dmarcRecord}
														</p>
													)}
												</div>
												<span
													className={
														result.hasDMARC
															? "text-green-500"
															: "text-red-500"
													}
												>
													{result.hasDMARC ? "✓" : "✗"}
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

			{/* CTA Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[02] NEED MORE?</span>
						<span className="text-sm text-text-sub-600">
							/ AUTOMATE DOMAIN CHECKS
						</span>
					</div>
					<div className="grid gap-8 p-10 md:grid-cols-2 md:p-16">
						<div>
							<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
								Need to check domains at scale?
							</h2>
							<p className="mt-4 text-text-sub-600">
								Use our API to automate domain lookups. Check thousands of domains
								for MX records, SPF, DMARC, and more in real-time.
							</p>
							<div className="mt-6 flex flex-col gap-3 sm:flex-row">
								<Link
									href="/pricing"
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									View Pricing
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
										{"<"}1s
									</p>
									<p className="mt-1 text-sm text-text-sub-600">
										Per lookup
									</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">
										100+
									</p>
									<p className="mt-1 text-sm text-text-sub-600">
										DNS checks
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
