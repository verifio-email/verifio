import * as Button from "@verifio/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
	title: "About Verifio | Open Source Email Verification Infrastructure",
	description:
		"Verifio is building the modern infrastructure for email verification. Open source, privacy-first, and built by developers for developers. Learn about our mission and technology.",
	keywords: [
		"about verifio",
		"open source email verification",
		"email validation infrastructure",
		"email deliverability",
		"developer tools",
	],
	openGraph: {
		title: "About Verifio | Open Source Email Verification",
		description:
			"Verifio is building the modern infrastructure for email verification. Open source, privacy-first, and built by developers for developers.",
		type: "website",
		url: "https://verifio.com/about",
		siteName: "Verifio",
	},
	twitter: {
		card: "summary_large_image",
		title: "About Verifio | Open Source Email Verification",
		description:
			"Verifio is building the modern infrastructure for email verification. Open source, privacy-first, and built by developers for developers.",
	},
	alternates: {
		canonical: "https://verifio.com/about",
	},
};

// JSON-LD Structured Data for About Page
const aboutPageSchema = {
	"@context": "https://schema.org",
	"@type": "AboutPage",
	name: "About Verifio",
	description:
		"Verifio is building the modern infrastructure for email verification. Open source, privacy-first, and built by developers for developers.",
	url: "https://verifio.com/about",
	mainEntity: {
		"@type": "Organization",
		name: "Verifio",
		url: "https://verifio.com",
		logo: "https://verifio.com/logo.png",
		sameAs: [
			"https://github.com/reloop-labs/verifio",
			"https://x.com/verifiohq",
			"https://linkedin.com/company/reloop",
		],
	},
};

// Breadcrumb structured data
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
			name: "About",
			item: "https://verifio.com/about",
		},
	],
};

export default function AboutPage() {
	return (
		<>
			{/* JSON-LD Structured Data */}
			<Script
				id="about-page-schema"
				type="application/ld+json"
				strategy="afterInteractive"
			>
				{JSON.stringify(aboutPageSchema)}
			</Script>
			<Script
				id="breadcrumb-schema"
				type="application/ld+json"
				strategy="afterInteractive"
			>
				{JSON.stringify(breadcrumbSchema)}
			</Script>

			<div className="min-h-screen">
				{/* Hero Section */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l">
						<div className="sticky top-[65.5px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-4 md:px-10">
							<span className="text-xs text-text-sub-600">[01] ABOUT</span>
							<span className="text-xs text-text-sub-600">/ OUR STORY</span>
						</div>
						<div className="px-10 py-16 md:py-20">
							<h1 className="max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
								Building the future of email verification
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-text-sub-600 leading-relaxed">
								We started Verifio because we believed email verification should
								be accurate, affordable, and accessible to everyone. Today, we
								are building the modern infrastructure that businesses rely on
								to deliver emails to real inboxes.
							</p>
						</div>
					</div>
				</section>

				{/* Mission */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l">
						<div className="grid gap-0 md:grid-cols-2">
							<div className="border-stroke-soft-100/60 p-10 md:border-r md:p-16">
								<span className="font-mono text-primary-500 text-sm">
									MISSION
								</span>
								<h2 className="mt-4 font-semibold text-2xl text-text-strong-950">
									Making email verification simple
								</h2>
								<p className="mt-4 text-text-sub-600">
									Email deliverability shouldn't be complicated. Our mission is to
									provide the most accurate, fastest, and most affordable email
									verification service in the market.
								</p>
							</div>
							<div className="p-10 md:p-16">
								<span className="font-mono text-primary-500 text-sm">VISION</span>
								<h2 className="mt-4 font-semibold text-2xl text-text-strong-950">
									A world without email bounces
								</h2>
								<p className="mt-4 text-text-sub-600">
									We envision a future where every email sent reaches its intended
									recipient. No more wasted resources, damaged sender reputations,
									or missed opportunities.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Stats */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l">
						<div className="grid gap-0 md:grid-cols-4">
							{[
								{ value: "100%", label: "Open Source" },
								{ value: "Global", label: "Availability" },
								{ value: "99.9%", label: "Uptime SLA" },
								{ value: "Zero", label: "Hidden Fees" },
							].map((stat, index) => (
								<div
									key={stat.label}
									className={`border-stroke-soft-100/60 p-8 text-center ${index < 3 ? "border-r" : ""}`}
								>
									<p className="font-bold text-3xl text-primary-500">
										{stat.value}
									</p>
									<p className="mt-1 text-sm text-text-sub-600">{stat.label}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Values */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l">
						<div className="sticky top-[65.5px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-4 md:px-10">
							<span className="text-xs text-text-sub-600">[02] VALUES</span>
							<span className="text-xs text-text-sub-600">/ WHAT WE BELIEVE</span>
						</div>
						<div className="grid gap-0 md:grid-cols-3">
							{[
								{
									title: "Accuracy First",
									desc: "We never sacrifice accuracy for speed. Every verification is thorough and reliable.",
								},
								{
									title: "Transparency",
									desc: "No hidden fees, no surprises. What you see is what you get, always.",
								},
								{
									title: "Developer Focus",
									desc: "Built by developers, for developers. We prioritize API capabilities and documentation.",
								},
							].map((value, index) => (
								<div
									key={value.title}
									className={`border-stroke-soft-100/60 p-10 ${index < 2 ? "border-r" : ""}`}
								>
									<h3 className="font-semibold text-text-strong-950 text-xl">
										{value.title}
									</h3>
									<p className="mt-3 text-text-sub-600">{value.desc}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Technology */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l">
						<div className="sticky top-[65.5px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-4 md:px-10">
							<span className="text-xs text-text-sub-600">[03] TECHNOLOGY</span>
							<span className="text-xs text-text-sub-600">/ HOW IT WORKS</span>
						</div>
						<div className="grid gap-0 md:grid-cols-2">
							<div className="border-stroke-soft-100/60 p-10 md:border-r md:p-16">
								<h3 className="font-semibold text-text-strong-950 text-xl">
									Privacy by Design
								</h3>
								<p className="mt-3 text-text-sub-600">
									We don't store your data longer than necessary. Our architecture
									is built to process verifications continuously without persistent storage
									of sensitive customer information.
								</p>
							</div>
							<div className="p-10 md:p-16">
								<h3 className="font-semibold text-text-strong-950 text-xl">
									Modern API Architecture
								</h3>
								<p className="mt-3 text-text-sub-600">
									Built on a globally distributed edge network for minimum latency.
									Our RESTful API is typed, documented, and ready for production
									workloads from day one.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="border-stroke-soft-100/60 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l">
						<div className="p-10 text-center md:p-16">
							<h2 className="font-semibold text-2xl text-text-strong-950">
								Ready to get started?
							</h2>
							<p className="mt-2 text-text-sub-600">
								Start improving your email deliverability with the verifier
								developers trust.
							</p>
							<div className="mt-6 flex justify-center gap-4">
								<Link
									href="/dashboard/sign-in"
									className={Button.buttonVariants({
										variant: "neutral",
										size: "medium",
									}).root({})}
								>
									Start for Free
								</Link>
								<Link
									href="/contact"
									className={Button.buttonVariants({
										variant: "neutral",
										mode: "stroke",
										size: "medium",
									}).root({})}
								>
									Contact Us
								</Link>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
