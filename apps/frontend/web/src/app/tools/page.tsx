import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";

const tools = [
	{
		title: "Email Checker",
		description: "Verify any email address instantly. Check syntax, MX records, disposable domains, and more — completely free.",
		href: "/tools/email-checker",
		icon: "mail-single",
		status: "Live",
		statusColor: "green",
		feature: "Real-time verification",
		stats: { label: "100% Free", value: "Free Forever" },
	},
	{
		title: "Domain Lookup",
		description: "Check MX records, DNS configuration, and domain health. Ensure your emails can reach the destination.",
		href: "/tools/domain-lookup",
		icon: "search",
		status: "Live",
		statusColor: "green",
		feature: "DNS analysis",
		stats: { label: "Instant", value: "Results" },
	},
	{
		title: "Disposable Email Detector",
		description: "Identify temporary and throwaway email addresses. Protect your forms from fake signups.",
		href: "/tools/disposable-detector",
		icon: "shield",
		status: "Live",
		statusColor: "green",
		feature: "5000+ domains",
		stats: { label: "Database", value: "Updated Daily" },
	},
	{
		title: "Syntax Validator",
		description: "Validate email format according to RFC 5322 standards. Catch typos and invalid formats before sending.",
		href: "/tools/syntax-validator",
		icon: "text-input",
		status: "Live",
		statusColor: "green",
		feature: "RFC compliant",
		stats: { label: "Instant", value: "Validation" },
	},
	{
		title: "MX Record Checker",
		description: "Verify mail server configuration for any domain. Troubleshoot email delivery issues.",
		href: "/tools/mx-checker",
		icon: "workflow",
		status: "Live",
		statusColor: "green",
		feature: "Deep analysis",
		stats: { label: "All", value: "Records" },
	},
	{
		title: "Bulk Email Tester",
		description: "Test up to 100 emails at once. Perfect for small list cleaning before committing to a paid plan.",
		href: "/tools/bulk-tester",
		icon: "layers",
		status: "Live",
		statusColor: "green",
		feature: "100 emails",
		stats: { label: "Free", value: "Per Day" },
	},
];

const statusColors = {
	green: "bg-green-500/10 text-green-600 border-green-500/20",
	blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const iconBgColors = {
	green: "bg-green-500/10 text-green-600",
	blue: "bg-blue-500/10 text-blue-600",
};

export default function ToolsPage() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] TOOLS</span>
						<span className="text-sm text-text-sub-600">
							/ FREE EMAIL VERIFICATION TOOLS
						</span>
					</div>
					<div className="px-10 py-16 text-center md:py-20">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-white-0 px-4 py-2">
							<Icon name="sparkles" className="h-4 w-4 text-purple-600" />
							<span className="font-medium text-sm text-text-sub-600">
								100% Free Tools
							</span>
						</div>
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Free Email Verification Tools
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-lg text-text-sub-600">
							Verify emails, check domains, and clean your lists with our free
							tools. No signup required for most tools. Start improving your email
							deliverability today.
						</p>
					</div>
				</div>
			</section>

			{/* Tools Grid */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[02] AVAILABLE TOOLS</span>
						<span className="text-sm text-text-sub-600">
							/ START USING RIGHT NOW
						</span>
					</div>
					<div className="grid gap-0 md:grid-cols-2">
						{tools.map((tool, index) => (
							<div
								key={tool.title}
								className={`group border-stroke-soft-100 border-b p-8 transition-all hover:bg-bg-weak-50 ${
									index % 2 === 0 ? "md:border-r" : ""
								}`}
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										{/* Icon and Title */}
										<div className="flex items-center gap-3">
											<div
												className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
													iconBgColors[
														tool.statusColor as keyof typeof iconBgColors
													]
												}`}
											>
												<Icon name={tool.icon} className="h-6 w-6" />
											</div>
											<div>
												<h3 className="font-semibold text-xl text-text-strong-950">
													{tool.title}
												</h3>
												<span
													className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 font-medium text-[10px] ${
														statusColors[
															tool.statusColor as keyof typeof statusColors
														]
													}`}
												>
													{tool.status}
												</span>
											</div>
										</div>

										{/* Description */}
										<p className="mt-4 text-text-sub-600 leading-relaxed">
											{tool.description}
										</p>

										{/* Feature Badge */}
										<div className="mt-4 flex items-center gap-2">
											<Icon
												name="check-circle"
												className="h-4 w-4 text-green-600"
											/>
											<span className="text-sm font-medium text-text-sub-600">
												{tool.feature}
											</span>
										</div>

										{/* Action Button */}
										<div className="mt-6">
											{tool.status === "Live" ? (
												<Link
													href={tool.href}
													className={Button.buttonVariants({
														variant: "primary",
														size: "medium",
													}).root({})}
												>
													Try It Free
												</Link>
											) : (
												<button
													type="button"
													className={Button.buttonVariants({
														variant: "neutral",
														mode: "stroke",
														size: "medium",
													}).root({})}
													disabled
												>
													Coming Soon
												</button>
											)}
										</div>
									</div>

									{/* Stats Badge */}
									<div className="ml-4 hidden rounded-xl border border-stroke-soft-100 bg-bg-white-0 px-4 py-3 text-center md:block">
										<p className="font-bold text-2xl text-text-strong-950">
											{tool.stats.value}
										</p>
										<p className="mt-1 text-[10px] text-text-sub-600">
											{tool.stats.label}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Domain-Specific Tools Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[03] DOMAIN-SPECIFIC</span>
						<span className="text-sm text-text-sub-600">
							/ VERIFY BY EMAIL PROVIDER
						</span>
					</div>
					<div className="border-stroke-soft-100 border-b p-10">
						<h2 className="mb-3 font-semibold text-2xl text-text-strong-950">
							Verify Emails by Provider
						</h2>
						<p className="max-w-2xl text-text-sub-600">
							Specialized verification tools for popular email providers. Get
							provider-specific insights and validation.
						</p>
					</div>
					<div className="grid gap-0 md:grid-cols-2">
						{[
							{
								title: "Gmail Email Verification",
								desc: "Verify @gmail.com addresses with Gmail-specific format validation",
								href: "/tools/verify-gmail-email-address",
								color: "red",
							},
							{
								title: "Company Email Verification",
								desc: "Verify corporate and business email addresses (B2B focused)",
								href: "/tools/verify-company-domain-email",
								color: "blue",
							},
							{
								title: "Yahoo Email Verification",
								desc: "Verify @yahoo.com addresses and Yahoo Mail accounts",
								href: "/tools/verify-yahoo-email-address",
								color: "purple",
							},
							{
								title: "Outlook Email Verification",
								desc: "Verify @outlook.com and @hotmail.com addresses",
								href: "/tools/verify-outlook-email-address",
								color: "blue",
							},
						].map((tool, index) => (
							<Link
								key={tool.title}
								href={tool.href}
								className={`group border-stroke-soft-100 border-b p-8 transition-all hover:bg-bg-weak-50 ${
									index % 2 === 0 ? "md:border-r" : ""
								}`}
							>
								<div className="flex items-start gap-4">
									<div
										className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
											index === 0
												? "bg-red-500/10 text-red-600"
												: index === 1
													? "bg-blue-500/10 text-blue-600"
													: index === 2
														? "bg-purple-500/10 text-purple-600"
														: "bg-cyan-500/10 text-cyan-600"
										}`}
									>
										<Icon name="mail-single" className="h-6 w-6" />
									</div>
									<div className="flex-1">
										<h3 className="font-semibold text-lg text-text-strong-950 group-hover:text-purple-600">
											{tool.title}
										</h3>
										<p className="mt-2 text-sm text-text-sub-600">
											{tool.desc}
										</p>
									</div>
									<Icon
										name="arrow-right"
										className="h-5 w-5 text-text-sub-600 group-hover:text-purple-600"
									/>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[03] WHY FREE?</span>
						<span className="text-sm text-text-sub-600">
							/ TRANSPARENCY IN ACTION
						</span>
					</div>
					<div className="grid gap-0 md:grid-cols-3">
						{[
							{
								icon: "zap",
								title: "No Credit Card",
								description:
									"Use our free tools without signing up or providing payment details.",
							},
							{
								icon: "shield",
								title: "Privacy First",
								description:
									"We don't store the emails you verify. Your data stays private.",
							},
							{
								icon: "open-source",
								title: "Open Source",
								description:
									"All verification logic is open-source. See exactly how we verify emails.",
							},
						].map((benefit, index) => (
							<div
								key={benefit.title}
								className={`border-stroke-soft-100 p-8 ${
									index < 2 ? "md:border-r" : ""
								}`}
							>
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-lg ${
										index === 0
											? "bg-yellow-500/10 text-yellow-600"
											: index === 1
												? "bg-green-500/10 text-green-600"
												: "bg-purple-500/10 text-purple-600"
									}`}
								>
									<Icon name={benefit.icon} className="h-6 w-6" />
								</div>
								<h3 className="mt-4 font-semibold text-lg text-text-strong-950">
									{benefit.title}
								</h3>
								<p className="mt-2 text-sm text-text-sub-600 leading-relaxed">
									{benefit.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section>
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[04] NEED MORE?</span>
						<span className="text-sm text-text-sub-600">
							/ POWERFUL API FOR DEVELOPERS
						</span>
					</div>
					<div className="grid gap-8 p-10 md:grid-cols-2 md:p-16">
						<div>
							<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
								Need bulk verification or API access?
							</h2>
							<p className="mt-4 text-text-sub-600">
								Upgrade to our paid plans for bulk email verification, API
								access, and advanced features. Clean thousands of emails in minutes
								with our powerful infrastructure.
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
								<div className="rounded-xl border border-stroke-soft-100 bg-bg-white-0 p-6">
									<p className="font-bold text-3xl text-text-strong-950">
										10,000+
									</p>
									<p className="mt-1 text-sm text-text-sub-600">
										Free verifications
									</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-bg-white-0 p-6">
									<p className="font-bold text-3xl text-text-strong-950">99.9%</p>
									<p className="mt-1 text-sm text-text-sub-600">Uptime SLA</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-bg-white-0 p-6">
									<p className="font-bold text-3xl text-text-strong-950">
										{"<"}100ms
									</p>
									<p className="mt-1 text-sm text-text-sub-600">Response time</p>
								</div>
								<div className="rounded-xl border border-stroke-soft-100 bg-bg-white-0 p-6">
									<p className="font-bold text-3xl text-text-strong-950">24/7</p>
									<p className="mt-1 text-sm text-text-sub-600">Support</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
