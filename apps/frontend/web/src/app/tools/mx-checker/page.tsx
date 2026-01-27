"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { useState } from "react";

type MXRecord = {
	priority: number;
	server: string;
	ip: string;
	distance: number;
	status: "active" | "inactive" | "timeout";
};

type MXResult = {
	domain: string;
	hasMX: boolean;
	records: MXRecord[];
	totalServers: number;
	backupServers: number;
};

async function mockMXLookup(domain: string): Promise<MXResult> {
	await new Promise((resolve) => setTimeout(resolve, 1500));

	const hasMX = Math.random() > 0.1;

	if (!hasMX) {
		return {
			domain,
			hasMX: false,
			records: [],
			totalServers: 0,
			backupServers: 0,
		};
	}

	const records: MXRecord[] = [
		{
			priority: 10,
			server: `mail1.${domain}`,
			ip: "192.168.1.1",
			distance: 10,
			status: "active",
		},
		{
			priority: 20,
			server: `mail2.${domain}`,
			ip: "192.168.1.2",
			distance: 20,
			status: "active",
		},
		{
			priority: 30,
			server: `mail3.${domain}`,
			ip: "192.168.1.3",
			distance: 30,
			status: "active",
		},
		{
			priority: 40,
			server: `backup.${domain}`,
			ip: "192.168.1.4",
			distance: 40,
			status: "inactive",
		},
	];

	return {
		domain,
		hasMX: true,
		records,
		totalServers: records.length,
		backupServers: records.filter((r) => r.priority > 20).length,
	};
}

export default function MXCheckerPage() {
	const [domain, setDomain] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<MXResult | null>(null);

	const handleLookup = async () => {
		if (!domain.trim()) return;
		setIsLoading(true);
		try {
			const lookupResult = await mockMXLookup(domain);
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
						<span className="text-sm text-text-sub-600">
							/ MX RECORD CHECKER
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							MX Record Checker
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Lookup and analyze MX records for any domain. Troubleshoot email
							delivery issues and verify mail server configuration.
						</p>
					</div>
				</div>
			</section>

			{/* MX Checker Tool */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="p-10">
						<div className="mx-auto max-w-3xl">
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
									{isLoading ? "Checking..." : "Check MX Records"}
								</button>
							</div>

							{/* Results Section */}
							{result && (
								<div className="mt-8 space-y-6">
									{/* Status Card */}
									<div
										className={`rounded-xl border p-6 ${
											result.hasMX
												? "border-green-500/20 bg-green-500/10"
												: "border-red-500/20 bg-red-500/10"
										}`}
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-text-sub-600">
													MX Records Status
												</p>
												<p
													className={`mt-1 font-semibold text-2xl ${
														result.hasMX ? "text-green-600" : "text-red-600"
													}`}
												>
													{result.hasMX ? "Records Found" : "No Records Found"}
												</p>
											</div>
											<div className="flex gap-4">
												<div className="text-center">
													<p className="text-text-sub-600 text-xs">Primary</p>
													<p
														className={`font-bold text-2xl ${
															result.hasMX ? "text-green-600" : "text-red-600"
														}`}
													>
														{result.totalServers - result.backupServers}
													</p>
												</div>
												<div className="text-center">
													<p className="text-text-sub-600 text-xs">Backup</p>
													<p
														className={`font-bold text-2xl ${
															result.hasMX ? "text-green-600" : "text-red-600"
														}`}
													>
														{result.backupServers}
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* MX Records Table */}
									{result.records.length > 0 && (
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<h3 className="mb-4 font-medium text-text-strong-950">
												MX Records Details
											</h3>
											<div className="overflow-x-auto">
												<table className="w-full">
													<thead>
														<tr className="border-stroke-soft-100 border-b">
															<th className="pb-3 text-left font-medium text-text-sub-600 text-xs">
																Priority
															</th>
															<th className="pb-3 text-left font-medium text-text-sub-600 text-xs">
																Mail Server
															</th>
															<th className="pb-3 text-left font-medium text-text-sub-600 text-xs">
																IP Address
															</th>
															<th className="pb-3 text-left font-medium text-text-sub-600 text-xs">
																Status
															</th>
														</tr>
													</thead>
													<tbody>
														{result.records.map((record, index) => (
															<tr
																key={index}
																className="border-stroke-soft-100 border-b last:border-0"
															>
																<td className="py-3">
																	<span className="rounded-full bg-purple-500/10 px-2 py-1 font-medium font-mono text-purple-600 text-xs">
																		{record.priority}
																	</span>
																</td>
																<td className="py-3 font-mono text-sm text-text-strong-950">
																	{record.server}
																</td>
																<td className="py-3 font-mono text-sm text-text-sub-600">
																	{record.ip}
																</td>
																<td className="py-3">
																	<span
																		className={`rounded-full px-2 py-1 font-medium text-xs ${
																			record.status === "active"
																				? "bg-green-500/10 text-green-600"
																				: "bg-gray-500/10 text-gray-600"
																		}`}
																	>
																		{record.status}
																	</span>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										</div>
									)}

									{/* Info Cards */}
									<div className="grid gap-4 md:grid-cols-2">
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
													<Icon name="info" className="h-5 w-5" />
												</div>
												<div>
													<h4 className="font-medium text-text-strong-950">
														Priority Explained
													</h4>
													<p className="mt-1 text-text-sub-600 text-xs">
														Lower numbers = higher priority. Mail servers try
														priority 10 first.
													</p>
												</div>
											</div>
										</div>
										<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
													<Icon name="shield" className="h-5 w-5" />
												</div>
												<div>
													<h4 className="font-medium text-text-strong-950">
														Backup Servers
													</h4>
													<p className="mt-1 text-text-sub-600 text-xs">
														Higher priority servers are used if primary servers
														fail.
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* How MX Records Work */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[02] HOW IT WORKS</span>
						<span className="text-sm text-text-sub-600">
							/ MX RECORDS EXPLAINED
						</span>
					</div>
					<div className="p-10 md:p-16">
						<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
							Understanding MX Records
						</h2>
						<p className="mt-4 text-text-sub-600">
							MX (Mail Exchange) records tell sending servers which mail servers
							accept emails for your domain. They're essential for email
							delivery.
						</p>
						<div className="mt-8 space-y-4">
							{[
								{
									step: "01",
									title: "DNS Query",
									desc: "Sending server looks up MX records for the domain",
								},
								{
									step: "02",
									title: "Priority Selection",
									desc: "Server with lowest priority number is tried first",
								},
								{
									step: "03",
									title: "Connection Attempt",
									desc: "Sending server connects to the mail server via SMTP",
								},
								{
									step: "04",
									title: "Delivery",
									desc: "Email is delivered if connection succeeds",
								},
							].map((item) => (
								<div
									key={item.step}
									className="flex gap-4 rounded-xl border border-stroke-soft-100 bg-white p-6"
								>
									<span className="flex shrink-0 items-center justify-center rounded-lg bg-purple-500/10 font-bold font-mono text-purple-600 text-sm">
										{item.step}
									</span>
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

			{/* CTA Section */}
			<section>
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="grid gap-8 p-10 md:grid-cols-2 md:p-16">
						<div>
							<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
								Need automated MX checks?
							</h2>
							<p className="mt-4 text-text-sub-600">
								Use our API to programmatically check MX records for thousands
								of domains. Perfect for email validation workflows.
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
										Response time
									</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-white p-6">
									<p className="font-bold text-3xl text-text-strong-950">
										100%
									</p>
									<p className="mt-1 text-sm text-text-sub-600">Accuracy</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
