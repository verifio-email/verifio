import { Icon } from "@verifio/ui/icon";
import type { Metadata } from "next";
import Script from "next/script";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
	title: "Contact Us | Verifio - Email Verification Service",
	description:
		"Get in touch with Verifio's team. Have questions about our email verification service? Contact us via email at hello@verifio.email or call us. We're here to help.",
	keywords: [
		"contact verifio",
		"email verification support",
		"verifio support",
		"email verification help",
		"contact email verification service",
	],
	openGraph: {
		title: "Contact Us | Verifio",
		description:
			"Have questions about our email verification service? Get in touch with our team. We're here to help you achieve better email deliverability.",
		type: "website",
		url: "https://verifio.com/contact",
		siteName: "Verifio",
		// Images are auto-generated from opengraph-image.tsx
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact Us | Verifio",
		description:
			"Have questions about our email verification service? Get in touch with our team.",
		// Images are auto-generated from opengraph-image.tsx
	},
	alternates: {
		canonical: "https://verifio.com/contact",
	},
	robots: {
		index: true,
		follow: true,
	},
};

// JSON-LD Structured Data for Contact Page
const contactPageSchema = {
	"@context": "https://schema.org",
	"@type": "ContactPage",
	name: "Contact Verifio",
	description:
		"Get in touch with Verifio's team for questions about our email verification service.",
	url: "https://verifio.com/contact",
	mainEntity: {
		"@type": "Organization",
		name: "Verifio",
		url: "https://verifio.com",
		email: "hello@verifio.email",
		telephone: "+917411367725",
		contactPoint: [
			{
				"@type": "ContactPoint",
				telephone: "+917411367725",
				contactType: "customer service",
				email: "hello@verifio.email",
				availableLanguage: ["English"],
			},
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
			name: "Contact",
			item: "https://verifio.com/contact",
		},
	],
};

export default function ContactPage() {
	return (
		<>
			{/* JSON-LD Structured Data */}
			<Script
				id="contact-page-schema"
				type="application/ld+json"
				strategy="afterInteractive"
			>
				{JSON.stringify(contactPageSchema)}
			</Script>
			<Script
				id="breadcrumb-schema"
				type="application/ld+json"
				strategy="afterInteractive"
			>
				{JSON.stringify(breadcrumbSchema)}
			</Script>

			<main>
				<section
					className="border-stroke-soft-100/60 border-b"
					aria-labelledby="contact-heading"
				>
					<div className="mx-4 max-w-5xl border-stroke-soft-100/60 border-r border-l md:mx-auto">
						<div className="sticky top-[66px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
							<span className="text-text-sub-600 text-xs" aria-hidden="true">
								[01] CONTACT
							</span>
							<span className="text-text-sub-600 text-xs" aria-hidden="true">
								/ GET IN TOUCH
							</span>
						</div>
						<header className="px-4 py-8 text-center md:px-10 md:py-12">
							<h1
								id="contact-heading"
								className="mx-auto max-w-3xl font-semibold text-3xl text-text-strong-950 md:text-5xl"
							>
								Get in touch
							</h1>
							<p className="mx-auto mt-4 max-w-xl text-base text-text-sub-600 md:mt-6 md:text-lg">
								Have questions about our email verification service? We'd love
								to help.
							</p>
						</header>
					</div>
				</section>

				<section
					className="border-stroke-soft-100/60 border-b"
					aria-label="Contact form and information"
				>
					<div className="mx-4 max-w-5xl border-stroke-soft-100/60 border-r border-l md:mx-auto">
						<div className="grid gap-0 md:grid-cols-2">
							{/* Contact Info - Box Style (shown first on mobile) */}
							<address
								className="order-first not-italic md:order-last"
								itemScope
								itemType="https://schema.org/Organization"
							>
								<h2 className="border-stroke-soft-100/60 border-b px-4 py-4 font-semibold text-lg text-text-strong-950 md:px-6 md:py-6 md:text-xl">
									Contact Information
								</h2>

								{/* Chat to us */}
								<a
									href="mailto:hello@verifio.email"
									className="flex items-center gap-4 border-stroke-soft-100/60 border-b px-4 py-4 transition-colors hover:bg-bg-weak-50 md:p-6"
									aria-label="Send us an email at hello@verifio.email"
									itemProp="email"
								>
									<div
										className="flex size-10 items-center justify-center rounded-full bg-primary-100"
										aria-hidden="true"
									>
										<Icon name="mail-single" className="size-5" />
									</div>
									<div>
										<h3 className="font-medium text-text-sub-600">
											Chat to us
										</h3>
										<p className="text-sm text-text-strong-950">
											hello@verifio.email
										</p>
									</div>
								</a>

								{/* Call us */}
								<a
									href="tel:+917411367725"
									className="flex items-center gap-4 border-stroke-soft-100/60 border-b px-4 py-4 transition-colors hover:bg-bg-weak-50 md:p-6"
									aria-label="Call us at +91 7411367725"
									itemProp="telephone"
								>
									<div
										className="flex size-10 items-center justify-center rounded-full bg-primary-100"
										aria-hidden="true"
									>
										<Icon name="smartphone" className="size-5" />
									</div>
									<div>
										<h3 className="font-medium text-text-sub-600">Call us</h3>
										<p className="text-sm text-text-strong-950">
											+91 7411367725
										</p>
									</div>
								</a>
							</address>

							{/* Contact Form */}
							<div className="order-last border-stroke-soft-100/60 p-6 md:order-first md:border-r md:p-10">
								<ContactForm />
							</div>
						</div>
					</div>
				</section>

				<div className="h-10" aria-hidden="true" />
			</main>
		</>
	);
}
