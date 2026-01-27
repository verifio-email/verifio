"use client";

import * as Accordion from "@verifio/ui/accordion";
import { Icon } from "@verifio/ui/icon";
import Script from "next/script";

const faqCategories = [
	{
		name: "Email Verification Basics",
		questions: [
			{
				question: "What is email verification?",
				answer:
					"Email verification is the process of validating email addresses to ensure they are valid, deliverable, and safe to send emails to. It checks syntax, domain validity, mailbox existence, and identifies risky addresses like disposable emails or spam traps.",
			},
			{
				question: "How does email verification work?",
				answer:
					"Our email verification API performs multiple checks: syntax validation to catch typos, DNS/MX record verification to confirm the domain exists, SMTP validation to verify the mailbox is active, and risk assessment to identify disposable or role-based addresses. All of this happens in under 200ms.",
			},
			{
				question: "Why should I verify email addresses?",
				answer:
					"Verifying emails reduces bounce rates by up to 98%, protects your sender reputation, improves email deliverability, prevents fake signups, and saves money by not sending to invalid addresses. It's essential for maintaining a healthy email list and avoiding spam filters.",
			},
			{
				question: "Is email verification free?",
				answer:
					"Yes! Verifio offers 10,000 free email verifications per month with no credit card required. This is perfect for small businesses and developers getting started. For higher volumes, we offer affordable paid plans.",
			},
			{
				question:
					"What's the difference between syntax validation and email verification?",
				answer:
					"Syntax validation only checks if an email follows the correct format (e.g., user@domain.com), but doesn't verify if the email actually exists. Email verification goes further by checking DNS records, SMTP servers, and mailbox existence to confirm the email is real and deliverable. Verifio performs comprehensive verification, not just syntax checks.",
			},
		],
	},
	{
		name: "Features & Accuracy",
		questions: [
			{
				question: "How accurate is Verifio's email verification?",
				answer:
					"Verifio maintains a 99.9% accuracy rate through advanced validation techniques including real-time SMTP checks, comprehensive domain validation, and continuous updates to our disposable email database. We verify millions of emails daily with industry-leading precision.",
			},
			{
				question: "Can I verify emails in bulk?",
				answer:
					"Absolutely! Our bulk email verification tool can process up to 1 million email addresses at once. Simply upload your CSV file, and we'll return a detailed report with validation results, quality scores, and actionable insights within minutes.",
			},
			{
				question: "What types of email addresses can be verified?",
				answer:
					"Verifio can verify all types of email addresses including personal emails (Gmail, Yahoo, Outlook), business emails, educational domains, and international addresses. We detect and flag disposable emails, role-based addresses (info@, support@), and catch-all domains.",
			},
			{
				question: "How fast is the email verification API?",
				answer:
					"Our email verification API delivers results in under 200ms on average, making it one of the fastest in the industry. This speed allows you to verify emails in real-time during signup forms without impacting user experience.",
			},
			{
				question:
					"Does Verifio detect disposable and temporary email addresses?",
				answer:
					"Yes! Verifio maintains an up-to-date database of over 100,000 disposable email domains. We detect temporary email services like Mailinator, Guerrilla Mail, and 10 Minute Mail to help you prevent fake signups and maintain list quality.",
			},
		],
	},
	{
		name: "API & Integration",
		questions: [
			{
				question: "How do I integrate the email verification API?",
				answer:
					"Integration is simple! Sign up for a free API key, then make a REST API call to our verification endpoint with the email address. We provide SDKs for JavaScript, Python, PHP, Ruby, and more. Most developers complete integration in under 10 minutes with our comprehensive documentation and code examples.",
			},
			{
				question: "What programming languages does Verifio support?",
				answer:
					"Verifio provides official SDKs for JavaScript/Node.js, Python, PHP, Ruby, Go, and Java. Our REST API works with any language that can make HTTP requests. We also offer plugins for popular platforms like WordPress, Shopify, and Zapier.",
			},
			{
				question: "Can I use Verifio with my signup forms?",
				answer:
					"Yes! Verifio is perfect for real-time email validation on signup forms. Our API's sub-200ms response time ensures a smooth user experience. You can validate emails as users type or on form submission to catch typos and prevent invalid signups immediately.",
			},
			{
				question: "Does Verifio offer webhooks for bulk verification?",
				answer:
					"Yes, for bulk email verification jobs, we offer webhook notifications to alert you when processing is complete. This allows you to upload large lists and receive results asynchronously without waiting or polling our API.",
			},
		],
	},
	{
		name: "Security & Compliance",
		questions: [
			{
				question: "Is my email data secure with Verifio?",
				answer:
					"Absolutely. We use enterprise-grade encryption (TLS 1.3) for all data in transit and at rest. We never store, share, or sell your email data. All verifications are processed in real-time and data is immediately discarded after verification.",
			},
			{
				question: "What are your API rate limits?",
				answer:
					"Free plans include 10,000 verifications per month with a rate limit of 10 requests per second. Paid plans offer higher rate limits up to 1,000 requests per second for enterprise customers. All plans include burst capacity to handle traffic spikes without interruption.",
			},
		],
	},
];

const Faq = () => {
	// Generate JSON-LD structured data for SEO
	const faqStructuredData = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqCategories.flatMap((category) =>
			category.questions.map((faq) => ({
				"@type": "Question",
				name: faq.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: faq.answer,
				},
			})),
		),
	};

	return (
		<>
			{/* JSON-LD Structured Data for SEO */}
			<Script
				id="faq-structured-data"
				type="application/ld+json"
				strategy="afterInteractive"
			>
				{JSON.stringify(faqStructuredData)}
			</Script>

			<section
				className="border-stroke-soft-100/60 border-t border-b dark:border-stroke-soft-100/40"
				aria-labelledby="faq-heading"
			>
				<div className="mx-auto max-w-5xl border-stroke-soft-100/60 md:border-r md:border-l dark:border-stroke-soft-100/40">
					<div className="sticky top-[65.5px] flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4 dark:border-stroke-soft-100/40">
						<span className="text-text-sub-600 text-xs">[06] FAQ</span>
						<span className="text-text-sub-600 text-xs">
							/ EMAIL VERIFICATION QUESTIONS
						</span>
					</div>
					<div className="flex-1">
						{faqCategories.map((category, categoryIndex) => (
							<div key={categoryIndex} className="flex flex-col lg:flex-row">
								<div
									className={`w-full border-stroke-soft-100/60 lg:w-3xl lg:border-r dark:border-stroke-soft-100/40 ${categoryIndex !== faqCategories.length - 1 ? "border-b" : ""}`}
								>
									<h2
										className="border-b border-b-stroke-soft-100/60 px-4 py-[18px] font-semibold text-lg text-text-strong-950 sm:px-6 sm:text-xl md:px-10"
										id={
											categoryIndex === 0
												? "faq-heading"
												: `faq-category-${categoryIndex}`
										}
									>
										{category.name}
									</h2>
								</div>
								<Accordion.Root type="multiple" className="w-full">
									{category.questions.map((faq, questionIndex) => {
										const itemValue = `${categoryIndex}-${questionIndex}`;
										const isLastCategory =
											categoryIndex === faqCategories.length - 1;
										const isLastItem =
											questionIndex === category.questions.length - 1;
										const isVeryLastItem = isLastCategory && isLastItem;
										return (
											<Accordion.Item
												className={`rounded-none border-stroke-soft-100/60 dark:border-stroke-soft-100/40 ${!isVeryLastItem ? "border-b" : ""} bg-transparent p-0! ring-0 hover:bg-transparent has-[:focus-visible]:bg-transparent data-[state=open]:bg-transparent`}
												value={itemValue}
												key={questionIndex}
											>
												<Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-5 text-left font-medium text-sm sm:px-6 sm:text-base md:px-10">
													{faq.question}
													<Icon
														name="plus"
														className="size-4 shrink-0 text-text-sub-600 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-45 sm:size-5"
													/>
												</Accordion.Trigger>
												<Accordion.Content className="px-4 pb-3 text-sm sm:px-6 sm:pb-4 sm:text-base md:px-10">
													{faq.answer}
												</Accordion.Content>
											</Accordion.Item>
										);
									})}
								</Accordion.Root>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default Faq;
