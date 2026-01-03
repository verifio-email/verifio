import { Icon } from "@verifio/ui/icon";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { TableOfContents } from "@verifio/web/components/table-of-contents";

export const metadata: Metadata = {
	title: "Privacy Policy | Verifio - Email Verification Service",
	description:
		"Learn how Verifio protects your privacy. Our privacy policy explains how we collect, use, and safeguard your personal information when using our email verification services.",
	keywords: [
		"verifio privacy policy",
		"email verification privacy",
		"data protection",
		"privacy",
		"data security",
	],
	openGraph: {
		title: "Privacy Policy | Verifio",
		description:
			"Learn how Verifio protects your privacy and handles your personal data.",
		type: "website",
		url: "https://verifio.com/privacy",
		siteName: "Verifio",
	},
	twitter: {
		card: "summary_large_image",
		title: "Privacy Policy | Verifio",
		description:
			"Learn how Verifio protects your privacy and handles your personal data.",
	},
	alternates: {
		canonical: "https://verifio.com/privacy",
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
			name: "Privacy Policy",
			item: "https://verifio.com/privacy",
		},
	],
};

const sections = [
	{ id: "overview", title: "Overview", num: "01" },
	{ id: "data-collection", title: "Data We Collect", num: "02" },
	{ id: "data-usage", title: "How We Use Data", num: "03" },
	{ id: "data-sharing", title: "Data Sharing", num: "04" },
	{ id: "data-retention", title: "Data Retention", num: "05" },
	{ id: "your-rights", title: "Your Rights", num: "06" },
	{ id: "security", title: "Security", num: "07" },
	{ id: "cookies", title: "Cookies", num: "08" },
	{ id: "contact", title: "Contact Us", num: "09" },
];

export default function PrivacyPage() {
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
					<div className="mx-4 max-w-7xl border-stroke-soft-100/60 border-r border-l md:mx-auto">
						<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
							<span className="text-text-sub-600 text-xs">[01] PRIVACY</span>
							<span className="text-text-sub-600 text-xs">
								/ PRIVACY POLICY
							</span>
						</div>
						<div className="px-4 py-8 md:px-10 md:py-16">
							<h1 className="max-w-3xl font-semibold text-3xl text-text-strong-950 md:text-5xl">
								Privacy Policy
							</h1>
							<p className="mt-4 max-w-2xl text-base text-text-sub-600 md:mt-6 md:text-lg">
								We believe in being transparent about how we collect and use
								your data. This policy explains what we collect, why, and your
								rights.
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

				{/* Key Points */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-4 max-w-7xl border-stroke-soft-100/60 border-r border-l md:mx-auto">
						<div className="grid gap-0 md:grid-cols-3">
							{[
								{
									icon: "shield-check",
									title: "Minimal Data",
									desc: "We only collect what we need",
								},
								{
									icon: "cross-circle",
									title: "Never Sold",
									desc: "Your data stays with us",
								},
								{
									icon: "sliders-horiz-2",
									title: "Your Control",
									desc: "Access, export, or delete anytime",
								},
							].map((item, index) => (
								<div
									key={item.title}
									className={`flex items-start gap-4 border-stroke-soft-100/60 p-4 md:p-8 ${index < 2 ? "border-b md:border-r md:border-b-0" : ""}`}
								>
									<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
										<Icon
											name={item.icon}
											className="size-5 text-primary-base"
										/>
									</div>
									<div>
										<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
											{item.title}
										</h3>
										<p className="mt-1 text-xs text-text-sub-600 md:text-sm">
											{item.desc}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Main Content */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-4 max-w-7xl border-stroke-soft-100/60 border-r border-l md:mx-auto">
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
											Verifio provides email verification services. When you use
											our service, you trust us with your information. We take
											that responsibility seriously. This privacy policy is
											designed to help you understand what data we collect, why
											we collect it, and what we do with it.
										</p>
									</div>
								</div>

								{/* Data Collection */}
								<div
									id="data-collection"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">[02] DATA</span>
										<span className="text-text-sub-600 text-xs">
											/ WHAT WE COLLECT
										</span>
									</div>
									<div className="grid gap-0 md:grid-cols-2">
										<div className="border-stroke-soft-100/60 border-b p-4 md:border-r md:border-b-0 md:p-10">
											<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
												Information you provide
											</h3>
											<ul className="mt-4 space-y-3 text-xs text-text-sub-600 md:text-sm">
												<li className="flex items-start gap-3">
													<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-base" />
													<span>
														<strong className="text-text-strong-950">
															Account info
														</strong>{" "}
														— Email and name when you sign up
													</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-base" />
													<span>
														<strong className="text-text-strong-950">
															Payment details
														</strong>{" "}
														— Billing info for paid plans
													</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-base" />
													<span>
														<strong className="text-text-strong-950">
															Email lists
														</strong>{" "}
														— Lists you upload for verification
													</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-base" />
													<span>
														<strong className="text-text-strong-950">
															Support messages
														</strong>{" "}
														— When you contact us
													</span>
												</li>
											</ul>
										</div>
										<div className="p-4 md:p-10">
											<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
												Collected automatically
											</h3>
											<ul className="mt-4 space-y-3 text-xs text-text-sub-600 md:text-sm">
												<li className="flex items-start gap-3">
													<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-soft-400" />
													<span>Device and browser information</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-soft-400" />
													<span>Usage data (features used, API calls)</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-soft-400" />
													<span>Cookies for session management</span>
												</li>
											</ul>
										</div>
									</div>
								</div>

								{/* Data Usage */}
								<div
									id="data-usage"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[03] USAGE
										</span>
										<span className="text-text-sub-600 text-xs">
											/ HOW WE USE DATA
										</span>
									</div>
									<div className="grid gap-0 md:grid-cols-2">
										{[
											{
												title: "Provide the service",
												desc: "Process your email verifications and manage your account",
											},
											{
												title: "Improve Verifio",
												desc: "Understand usage patterns to make the product better",
											},
											{
												title: "Communicate",
												desc: "Send important updates and respond to your questions",
											},
											{
												title: "Security",
												desc: "Detect and prevent fraud or abuse of our service",
											},
										].map((item, index) => (
											<div
												key={item.title}
												className={`border-stroke-soft-100/60 p-4 md:p-8 ${index % 2 === 0 ? "border-b md:border-r" : "border-b"} ${index >= 2 ? "md:border-b-0" : ""}`}
											>
												<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
													{item.title}
												</h3>
												<p className="mt-2 text-xs text-text-sub-600 md:text-sm">
													{item.desc}
												</p>
											</div>
										))}
									</div>
								</div>

								{/* Data Sharing */}
								<div
									id="data-sharing"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[04] SHARING
										</span>
										<span className="text-text-sub-600 text-xs">
											/ WHO SEES YOUR DATA
										</span>
									</div>
									<div className="p-4 md:p-10">
										<p className="mb-4 font-medium text-sm text-text-strong-950 md:mb-6 md:text-base">
											We never sell your personal data. Ever.
										</p>
										<p className="mb-4 text-xs text-text-sub-600 md:text-sm">
											We only share your data in these limited circumstances:
										</p>
										<ul className="space-y-3 text-xs text-text-sub-600 md:text-sm">
											<li className="flex items-start gap-3">
												<span className="mt-0.5 text-text-soft-400">1.</span>
												<span>
													<strong className="text-text-strong-950">
														Service providers
													</strong>{" "}
													— Payment processors (Stripe), hosting, and essential
													tools
												</span>
											</li>
											<li className="flex items-start gap-3">
												<span className="mt-0.5 text-text-soft-400">2.</span>
												<span>
													<strong className="text-text-strong-950">
														Legal requirements
													</strong>{" "}
													— When required by law or to protect our rights
												</span>
											</li>
											<li className="flex items-start gap-3">
												<span className="mt-0.5 text-text-soft-400">3.</span>
												<span>
													<strong className="text-text-strong-950">
														With your consent
													</strong>{" "}
													— When you explicitly ask us to share something
												</span>
											</li>
										</ul>
									</div>
								</div>

								{/* Data Retention */}
								<div
									id="data-retention"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[05] RETENTION
										</span>
										<span className="text-text-sub-600 text-xs">
											/ HOW LONG WE KEEP DATA
										</span>
									</div>
									<div className="divide-y divide-stroke-soft-100/60">
										{[
											{
												data: "Email lists for verification",
												period: "Deleted within 24 hours",
											},
											{
												data: "Account information",
												period: "Until you delete your account",
											},
											{
												data: "Usage logs",
												period: "90 days",
											},
											{
												data: "Support conversations",
												period: "2 years",
											},
										].map((item) => (
											<div
												key={item.data}
												className="flex flex-col justify-between gap-2 px-4 py-3 md:flex-row md:items-center md:px-10 md:py-4"
											>
												<span className="font-medium text-xs text-text-strong-950 md:text-sm">
													{item.data}
												</span>
												<span className="text-xs text-text-sub-600 md:text-sm">
													{item.period}
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Your Rights */}
								<div
									id="your-rights"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[06] RIGHTS
										</span>
										<span className="text-text-sub-600 text-xs">
											/ YOUR CONTROL
										</span>
									</div>
									<div className="grid gap-0 md:grid-cols-3">
										{[
											{
												title: "Access",
												desc: "Download all data we have about you",
											},
											{
												title: "Update",
												desc: "Correct any inaccurate information",
											},
											{
												title: "Delete",
												desc: "Remove your account and data",
											},
										].map((item, index) => (
											<div
												key={item.title}
												className={`border-stroke-soft-100/60 p-4 text-center md:p-8 ${index < 2 ? "border-b md:border-r md:border-b-0" : ""}`}
											>
												<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
													{item.title}
												</h3>
												<p className="mt-2 text-xs text-text-sub-600 md:text-sm">
													{item.desc}
												</p>
											</div>
										))}
									</div>
								</div>

								{/* Security */}
								<div
									id="security"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[07] SECURITY
										</span>
										<span className="text-text-sub-600 text-xs">
											/ HOW WE PROTECT DATA
										</span>
									</div>
									<div className="grid gap-0 md:grid-cols-2">
										{[
											{
												title: "Encryption",
												desc: "All data encrypted in transit (TLS) and at rest",
											},
											{
												title: "Infrastructure",
												desc: "Secure cloud with strict access controls",
											},
											{
												title: "Monitoring",
												desc: "Regular security reviews and monitoring",
											},
											{
												title: "Access",
												desc: "Limited employee access on need-to-know basis",
											},
										].map((item, index) => (
											<div
												key={item.title}
												className={`border-stroke-soft-100/60 p-4 md:p-8 ${index % 2 === 0 ? "border-b md:border-r" : "border-b"} ${index >= 2 ? "md:border-b-0" : ""}`}
											>
												<h3 className="font-medium text-sm text-text-strong-950 md:text-base">
													{item.title}
												</h3>
												<p className="mt-2 text-xs text-text-sub-600 md:text-sm">
													{item.desc}
												</p>
											</div>
										))}
									</div>
								</div>

								{/* Cookies */}
								<div
									id="cookies"
									className="border-stroke-soft-100/60 border-b"
								>
									<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
										<span className="text-text-sub-600 text-xs">
											[08] COOKIES
										</span>
										<span className="text-text-sub-600 text-xs">
											/ WHAT WE USE
										</span>
									</div>
									<div className="p-4 md:p-10">
										<p className="mb-4 text-xs text-text-sub-600 md:mb-6 md:text-sm">
											We use cookies to keep you logged in and remember your
											preferences. We don't use cookies for advertising or
											cross-site tracking.
										</p>
										<div className="divide-y divide-stroke-soft-100/60 rounded-lg border border-stroke-soft-100/60">
											<div className="flex items-center justify-between px-4 py-3">
												<span className="font-mono text-xs text-text-strong-950 md:text-sm">
													session
												</span>
												<span className="text-xs text-text-sub-600 md:text-sm">
													Keeps you logged in
												</span>
											</div>
											<div className="flex items-center justify-between px-4 py-3">
												<span className="font-mono text-xs text-text-strong-950 md:text-sm">
													preferences
												</span>
												<span className="text-xs text-text-sub-600 md:text-sm">
													Remembers your settings
												</span>
											</div>
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
										<p className="mb-4 text-xs text-text-sub-600 md:text-sm">
											If you have any questions about this privacy policy or how
											we handle your data, we're here to help.
										</p>
										<a
											href="mailto:hello@verifio.email"
											className="inline-flex items-center gap-2 text-xs text-primary-base hover:underline md:text-sm"
										>
											<span>hello@verifio.email</span>
											<span>→</span>
										</a>
										<p className="mt-6 text-xs text-text-soft-400">
											We may update this policy from time to time. We'll notify
											you of significant changes via email or through the app.
										</p>
									</div>
								</div>
							</div>

							{/* Table of Contents - Right Side */}
							<aside className="hidden w-64 shrink-0 lg:block">
								<TableOfContents
									sections={sections}
									relatedLink={{ href: "/terms", label: "Terms of Service" }}
								/>
							</aside>
						</div>
					</div>
				</section>

				{/* Related Links */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-4 max-w-7xl border-stroke-soft-100/60 border-r border-l md:mx-auto">
						<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
							<span className="text-text-sub-600 text-xs">[10] RELATED</span>
							<span className="text-text-sub-600 text-xs">/ OTHER PAGES</span>
						</div>
						<div className="grid gap-0 md:grid-cols-2">
							<Link
								href="/terms"
								className="group flex items-center justify-between border-stroke-soft-100/60 border-b p-4 transition-colors hover:bg-bg-weak-50 md:border-r md:border-b-0 md:p-8"
							>
								<div>
									<p className="font-medium text-sm text-text-strong-950">
										Terms of Service
									</p>
									<p className="mt-1 text-xs text-text-sub-600">
										Read our terms and conditions
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
									<p className="mt-1 text-xs text-text-sub-600">
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
