import { TableOfContents } from "@verifio/web/components/table-of-contents";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
	title: "Terms of Service | Verifio - Email Verification Service",
	description:
		"Read Verifio's Terms of Service. These terms govern your use of our email verification services, API, and platform.",
	keywords: [
		"verifio terms of service",
		"email verification terms",
		"terms and conditions",
		"user agreement",
	],
	openGraph: {
		title: "Terms of Service | Verifio",
		description:
			"Read Verifio's Terms of Service for our email verification platform.",
		type: "website",
		url: "https://verifio.com/terms",
		siteName: "Verifio",
	},
	twitter: {
		card: "summary_large_image",
		title: "Terms of Service | Verifio",
		description:
			"Read Verifio's Terms of Service for our email verification platform.",
	},
	alternates: {
		canonical: "https://verifio.com/terms",
	},
	robots: {
		index: true,
		follow: true,
	},
};

const breadcrumbSchema = {
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: [
		{
			"@type": "ListItem",
			position: 1,
			name: "Home",
			item: "https://verifio.com",
		},
		{
			"@type": "ListItem",
			position: 2,
			name: "Terms of Service",
			item: "https://verifio.com/terms",
		},
	],
};

const sections = [
	{ id: "overview", title: "Overview", num: "01" },
	{ id: "the-service", title: "The Service", num: "02" },
	{ id: "your-account", title: "Your Account", num: "03" },
	{ id: "acceptable-use", title: "Acceptable Use", num: "04" },
	{ id: "api-usage", title: "API & Rate Limits", num: "05" },
	{ id: "payment", title: "Payment & Billing", num: "06" },
	{ id: "disclaimer", title: "Disclaimer", num: "07" },
	{ id: "termination", title: "Termination", num: "08" },
	{ id: "contact", title: "Contact", num: "09" },
];

export default function TermsPage() {
	return (
		<>
			<Script
				id="breadcrumb-schema"
				type="application/ld+json"
				strategy="afterInteractive"
			>
				{JSON.stringify(breadcrumbSchema)}
			</Script>

			<main>
				{/* Header */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-4 max-w-5xl border-stroke-soft-100/60 border-r border-l md:mx-auto">
						<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
							<span className="text-text-sub-600 text-xs">[01] TERMS</span>
							<span className="text-text-sub-600 text-xs">
								/ TERMS OF SERVICE
							</span>
						</div>
						<div className="px-4 py-8 md:px-10 md:py-16">
							<h1 className="max-w-3xl font-semibold text-3xl text-text-strong-950 md:text-5xl">
								Terms of Service
							</h1>
							<p className="mt-4 max-w-2xl text-base text-text-sub-600 md:mt-6 md:text-lg">
								Simple, fair terms. Use our service responsibly, and we'll do
								our best to provide a great experience.
							</p>
							<p className="mt-4 text-text-soft-400 text-xs">
								Last updated:{" "}
								{new Date().toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					</div>
				</section>

				{/* Main Content */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-4 max-w-5xl border-stroke-soft-100/60 border-r border-l md:mx-auto">
						<div className="flex flex-col lg:flex-row">
							{/* Content */}
							<div className="flex-1 lg:border-stroke-soft-100/60 lg:border-r">
								{/* Overview */}
								<div
									id="overview"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[01] OVERVIEW
										</span>
										<span className="text-text-sub-600 text-xs">
											/ INTRODUCTION
										</span>
									</div>
									<div className="p-4 md:p-10">
										<p className="text-sm text-text-sub-600 leading-relaxed md:text-base">
											These Terms of Service ("Terms") govern your access to and
											use of Verifio's email verification services, website, and
											API. By using Verifio, you agree to be bound by these
											Terms. If you don't agree, please don't use the service.
										</p>
									</div>
								</div>

								{/* The Service */}
								<div
									id="the-service"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[02] SERVICE
										</span>
										<span className="text-text-sub-600 text-xs">
											/ WHAT WE OFFER
										</span>
									</div>
									<div className="grid gap-0 md:grid-cols-3">
										{[
											{
												title: "Email Verification",
												desc: "Check if email addresses are valid and deliverable",
											},
											{
												title: "API Access",
												desc: "Integrate verification into your apps",
											},
											{
												title: "Bulk Processing",
												desc: "Verify large lists of emails at once",
											},
										].map((item, index) => (
											<div
												key={item.title}
												className={`border-stroke-soft-100/60 p-4 md:p-8 ${index < 2 ? "border-b md:border-r md:border-b-0" : ""}`}
											>
												<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
													{item.title}
												</h3>
												<p className="mt-2 text-text-sub-600 text-xs md:text-sm">
													{item.desc}
												</p>
											</div>
										))}
									</div>
								</div>

								{/* Your Account */}
								<div
									id="your-account"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[03] ACCOUNT
										</span>
										<span className="text-text-sub-600 text-xs">
											/ YOUR RESPONSIBILITIES
										</span>
									</div>
									<div className="p-4 md:p-10">
										<p className="mb-4 text-text-sub-600 text-xs md:text-sm">
											When you create an account, you're responsible for:
										</p>
										<ul className="space-y-3 text-text-sub-600 text-xs md:text-sm">
											<li className="flex items-start gap-3">
												<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-base" />
												<span>Keeping your login credentials secure</span>
											</li>
											<li className="flex items-start gap-3">
												<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-base" />
												<span>Keeping your API keys confidential</span>
											</li>
											<li className="flex items-start gap-3">
												<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-base" />
												<span>Everything that happens under your account</span>
											</li>
											<li className="flex items-start gap-3">
												<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-base" />
												<span>
													Notifying us immediately if you suspect unauthorized
													access
												</span>
											</li>
										</ul>
									</div>
								</div>

								{/* Acceptable Use */}
								<div
									id="acceptable-use"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[04] RULES
										</span>
										<span className="text-text-sub-600 text-xs">
											/ ACCEPTABLE USE
										</span>
									</div>
									<div className="grid gap-0 md:grid-cols-2">
										<div className="border-stroke-soft-100/60 border-b p-4 md:border-r md:border-b-0 md:p-10">
											<h3 className="flex items-center gap-2 font-medium text-sm text-text-strong-950 md:text-base">
												<span className="text-red-500">✕</span>
												Don't
											</h3>
											<ul className="mt-4 space-y-2 text-text-sub-600 text-xs md:text-sm">
												<li>Use for spamming or unsolicited emails</li>
												<li>Harvest or scrape email addresses</li>
												<li>Circumvent rate limits</li>
												<li>Anything illegal or harmful</li>
												<li>Share your API keys with others</li>
											</ul>
										</div>
										<div className="p-4 md:p-10">
											<h3 className="flex items-center gap-2 font-medium text-sm text-text-strong-950 md:text-base">
												<span className="text-green-500">✓</span>
												Do
											</h3>
											<ul className="mt-4 space-y-2 text-text-sub-600 text-xs md:text-sm">
												<li>Use for legitimate email list cleaning</li>
												<li>Integrate into your signup flows</li>
												<li>Respect rate limits</li>
												<li>Report bugs or issues you find</li>
												<li>Reach out if you need higher limits</li>
											</ul>
										</div>
									</div>
								</div>

								{/* API Usage */}
								<div
									id="api-usage"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">[05] API</span>
										<span className="text-text-sub-600 text-xs">
											/ RATE LIMITS
										</span>
									</div>
									<div className="divide-y divide-stroke-soft-100/60">
										{[
											{ plan: "Free", limit: "100 requests/hour" },
											{ plan: "Starter", limit: "1,000 requests/hour" },
											{ plan: "Pro", limit: "10,000 requests/hour" },
											{ plan: "Enterprise", limit: "Custom" },
										].map((item) => (
											<div
												key={item.plan}
												className="flex items-center justify-between px-4 py-3 md:px-10 md:py-4"
											>
												<span className="font-medium text-text-strong-950 text-xs md:text-sm">
													{item.plan}
												</span>
												<span className="text-text-sub-600 text-xs md:text-sm">
													{item.limit}
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Payment */}
								<div
									id="payment"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[06] PAYMENT
										</span>
										<span className="text-text-sub-600 text-xs">/ BILLING</span>
									</div>
									<div className="grid gap-0 md:grid-cols-2">
										<div className="border-stroke-soft-100/60 border-b p-4 md:border-r md:border-b-0 md:p-10">
											<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
												How it works
											</h3>
											<ul className="mt-4 space-y-2 text-text-sub-600 text-xs md:text-sm">
												<li className="flex items-start gap-3">
													<span className="mt-0.5 text-text-soft-400">•</span>
													<span>
														Pay monthly or annually (annual = 2 months free)
													</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="mt-0.5 text-text-soft-400">•</span>
													<span>
														Credits don't expire while you're subscribed
													</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="mt-0.5 text-text-soft-400">•</span>
													<span>Cancel anytime from your dashboard</span>
												</li>
											</ul>
										</div>
										<div className="p-4 md:p-10">
											<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
												Refunds
											</h3>
											<p className="mt-4 text-text-sub-600 text-xs md:text-sm">
												We offer refunds within 14 days if you haven't used many
												credits. After that, it's case-by-case. Just{" "}
												<a
													href="mailto:hello@verifio.email"
													className="text-primary-base hover:underline"
												>
													reach out
												</a>{" "}
												and we'll try to help.
											</p>
										</div>
									</div>
								</div>

								{/* Disclaimer */}
								<div
									id="disclaimer"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[07] DISCLAIMER
										</span>
										<span className="text-text-sub-600 text-xs">
											/ BEING HONEST
										</span>
									</div>
									<div className="p-4 md:p-10">
										<p className="text-text-sub-600 text-xs leading-relaxed md:text-sm">
											Verifio is provided "as is" without warranties of any
											kind. We do our best to keep things running smoothly, but
											we can't guarantee 100% uptime or perfect accuracy. Email
											verification depends on external mail servers which can be
											unpredictable. We're not responsible for any damages that
											might result from using the service.
										</p>
									</div>
								</div>

								{/* Termination */}
								<div
									id="termination"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[08] ENDING
										</span>
										<span className="text-text-sub-600 text-xs">
											/ TERMINATION
										</span>
									</div>
									<div className="grid gap-0 md:grid-cols-2">
										<div className="border-stroke-soft-100/60 border-b p-4 md:border-r md:border-b-0 md:p-10">
											<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
												You can
											</h3>
											<p className="mt-4 text-text-sub-600 text-xs md:text-sm">
												Delete your account anytime from your dashboard. We'll
												remove your data as described in our privacy policy.
											</p>
										</div>
										<div className="p-4 md:p-10">
											<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
												We can
											</h3>
											<p className="mt-4 text-text-sub-600 text-xs md:text-sm">
												Suspend or terminate accounts that violate these terms,
												abuse the service, or do anything harmful. We'll try to
												give notice when possible.
											</p>
										</div>
									</div>
								</div>

								{/* Contact */}
								<div id="contact">
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[09] CONTACT
										</span>
										<span className="text-text-sub-600 text-xs">
											/ GET IN TOUCH
										</span>
									</div>
									<div className="p-4 md:p-10">
										<p className="mb-4 text-text-sub-600 text-xs md:text-sm">
											Questions about these terms? We're happy to help.
										</p>
										<a
											href="mailto:hello@verifio.email"
											className="inline-flex items-center gap-2 text-primary-base text-xs hover:underline md:text-sm"
										>
											<span>hello@verifio.email</span>
											<span>→</span>
										</a>
										<p className="mt-6 text-text-soft-400 text-xs">
											We might update these terms occasionally. If we make
											significant changes, we'll let you know through the app or
											via email. Continuing to use Verifio after changes means
											you accept them.
										</p>
									</div>
								</div>
							</div>

							{/* Table of Contents - Right Side */}
							<aside className="hidden w-64 shrink-0 lg:block">
								<TableOfContents
									sections={sections}
									relatedLink={{ href: "/privacy", label: "Privacy Policy" }}
								/>
							</aside>
						</div>
					</div>
				</section>

				{/* Related Links */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-4 max-w-5xl border-stroke-soft-100/60 border-r border-l md:mx-auto">
						<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
							<span className="text-text-sub-600 text-xs">[10] RELATED</span>
							<span className="text-text-sub-600 text-xs">/ OTHER PAGES</span>
						</div>
						<div className="grid gap-0 md:grid-cols-2">
							<Link
								href="/privacy"
								className="group flex items-center justify-between border-stroke-soft-100/60 border-b p-4 transition-colors hover:bg-bg-weak-50 md:border-r md:border-b-0 md:p-8"
							>
								<div>
									<p className="font-medium text-sm text-text-strong-950">
										Privacy Policy
									</p>
									<p className="mt-1 text-text-sub-600 text-xs">
										Learn how we handle your data
									</p>
								</div>
								<span className="text-text-sub-600 transition-transform group-hover:translate-x-1">
									→
								</span>
							</Link>
							<Link
								href="/contact"
								className="group flex items-center justify-between p-4 transition-colors hover:bg-bg-weak-50 md:p-8"
							>
								<div>
									<p className="font-medium text-sm text-text-strong-950">
										Contact Us
									</p>
									<p className="mt-1 text-text-sub-600 text-xs">
										Get in touch with our team
									</p>
								</div>
								<span className="text-text-sub-600 transition-transform group-hover:translate-x-1">
									→
								</span>
							</Link>
						</div>
					</div>
				</section>

				<div className="h-10" />
			</main>
		</>
	);
}
