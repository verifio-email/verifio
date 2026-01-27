import { Icon } from "@verifio/ui/icon";
import Link from "next/link";

// Schema for glossary page
const GlossarySchema = {
	"@context": "https://schema.org",
	"@type": "CollectionPage",
	name: "Email Verification Glossary",
	description:
		"Complete glossary of email verification terminology and definitions",
};

const glossaryTerms = [
	{
		letter: "A",
		terms: [
			{
				term: "Accept-All Domain",
				definition:
					"A domain configured to accept all email addresses regardless of whether the mailbox exists. These domains return a positive response for any email verification attempt, making it difficult to determine if the email is truly valid.",
				related: "/tools/domain-lookup",
			},
			{
				term: "API (Application Programming Interface)",
				definition:
					"A set of protocols and tools for building software applications. In email verification, APIs allow developers to integrate email verification directly into their applications and websites.",
				related: "/features/api-reference",
			},
		],
	},
	{
		letter: "B",
		terms: [
			{
				term: "Bounce Rate",
				definition:
					"The percentage of email addresses in a list that fail to deliver. High bounce rates can damage sender reputation and lead to emails being marked as spam. Industry standard is below 2%.",
				related: "/tools/email-checker",
			},
			{
				term: "Bulk Email Verification",
				definition:
					"The process of verifying multiple email addresses simultaneously, typically by uploading a CSV or text file. Essential for cleaning large email lists before marketing campaigns.",
				related: "/tools/bulk-tester",
			},
		],
	},
	{
		letter: "C",
		terms: [
			{
				term: "Catch-All Detection",
				definition:
					"The process of identifying domains that accept all emails regardless of the mailbox. These domains make accurate verification challenging and require special handling.",
				related: "/tools/domain-lookup",
			},
			{
				term: "Compliance",
				definition:
					"Adherence to email marketing regulations such as GDPR, CAN-SPAM, and CASL. Email verification helps maintain compliance by ensuring consented, valid email addresses.",
				related: null,
			},
		],
	},
	{
		letter: "D",
		terms: [
			{
				term: "Deliverability",
				definition:
					"The ability of an email to successfully reach the recipient's inbox. High deliverability rates depend on sender reputation, list quality, and email authentication.",
				related: "/tools/email-checker",
			},
			{
				term: "Disposable Email",
				definition:
					"Temporary email addresses created for short-term use, often to avoid spam or sign up for services without providing a real email. These should be filtered from marketing lists.",
				related: "/tools/disposable-detector",
			},
			{
				term: "DNS (Domain Name System)",
				definition:
					"The system that translates domain names into IP addresses. Email verification checks DNS records to verify domain configuration and mail server settings.",
				related: "/tools/domain-lookup",
			},
			{
				term: "DMARC (Domain-based Message Authentication, Reporting, and Conformance)",
				definition:
					"An email authentication protocol that helps prevent email spoofing. DMARC records tell receiving servers how to handle emails that fail SPF or DKIM checks.",
				related: "/tools/domain-lookup",
			},
		],
	},
	{
		letter: "E",
		terms: [
			{
				term: "Email Authentication",
				definition:
					"Technical standards that verify an email's legitimacy, including SPF, DKIM, and DMARC. Proper authentication improves deliverability and prevents phishing.",
				related: "/tools/domain-lookup",
			},
			{
				term: "Email Hygiene",
				definition:
					"The practice of maintaining a clean email list by regularly removing invalid, inactive, and unengaged subscribers. Good hygiene improves deliverability and sender reputation.",
				related: "/tools/bulk-tester",
			},
			{
				term: "Email List Cleaning",
				definition:
					"The process of removing invalid, duplicate, and risky email addresses from a mailing list. Also known as list scrubbing or list validation.",
				related: "/tools/bulk-tester",
			},
			{
				term: "Email Validation",
				definition:
					"The process of checking if an email address is valid, properly formatted, and capable of receiving emails. Includes syntax, domain, and mailbox verification.",
				related: "/tools/email-checker",
			},
			{
				term: "Email Verifier",
				definition:
					"A tool or service that checks the validity and deliverability of email addresses. Can verify single emails or bulk lists.",
				related: "/tools/email-checker",
			},
		],
	},
	{
		letter: "F",
		terms: [
			{
				term: "Free Email Provider",
				definition:
					"Services that offer free email accounts such as Gmail, Yahoo, Outlook, and AOL. While legitimate, these addresses are often used for personal rather than business communications.",
				related: "/tools/verify-company-domain-email",
			},
			{
				term: "From Address",
				definition:
					"The email address that appears in the 'From' field of an email. Using a verified, authenticated from address improves deliverability.",
				related: null,
			},
		],
	},
	{
		letter: "H",
		terms: [
			{
				term: "Hard Bounce",
				definition:
					"A permanent email delivery failure caused by invalid addresses, non-existent domains, or blocked senders. Hard bounces should be removed from email lists immediately.",
				related: "/tools/email-checker",
			},
			{
				term: "Honeypot",
				definition:
					"A fake email address planted by spam traps to catch senders who don't verify their lists. Emails to honeypots can severely damage sender reputation.",
				related: "/tools/disposable-detector",
			},
		],
	},
	{
		letter: "I",
		terms: [
			{
				term: "IP Address",
				definition:
					"A unique numerical label assigned to each device connected to a computer network. Email servers use IP addresses to identify sender reputation.",
				related: null,
			},
			{
				term: "Inbox Placement",
				definition:
					"The percentage of emails that successfully reach the recipient's inbox (rather than spam or promotions folders). High inbox placement is the goal of email marketing.",
				related: "/tools/email-checker",
			},
		],
	},
	{
		letter: "M",
		terms: [
			{
				term: "MX Record (Mail Exchange Record)",
				definition:
					"A DNS record that specifies which mail server is responsible for accepting email messages for a domain. Essential for email delivery.",
				related: "/tools/mx-checker",
			},
			{
				term: "Mailbox",
				definition:
					"The storage location where email messages are received and stored for a user. SMTP verification checks if a mailbox exists without sending an email.",
				related: "/tools/email-checker",
			},
		],
	},
	{
		letter: "O",
		terms: [
			{
				term: "Opt-In",
				definition:
					"When a user explicitly consents to receive emails, typically through a checkbox or signup form. Double opt-in requires email confirmation.",
				related: null,
			},
			{
				term: "Open Rate",
				definition:
					"The percentage of email recipients who open an email. Verified email lists typically have higher open rates because emails reach valid inboxes.",
				related: "/tools/email-checker",
			},
		],
	},
	{
		letter: "Q",
		terms: [
			{
				term: "Quality Score",
				definition:
					"A numerical rating (0-100) indicating the likelihood that an email address is valid and deliverable. Higher scores indicate better email quality.",
				related: "/tools/email-checker",
			},
		],
	},
	{
		letter: "R",
		terms: [
			{
				term: "RFC 5322",
				definition:
					"The internet standard that defines the format of email messages. Email syntax validation checks compliance with RFC 5322.",
				related: "/tools/syntax-validator",
			},
			{
				term: "Role-Based Email",
				definition:
					"Email addresses that represent a function or department rather than an individual (e.g., info@, support@, sales@). These often have lower engagement rates.",
				related: null,
			},
			{
				term: "Real-Time Verification",
				definition:
					"Email verification that happens instantly when an address is entered, typically through API integration. Prevents invalid emails from entering databases.",
				related: "/features/api-reference",
			},
		],
	},
	{
		letter: "S",
		terms: [
			{
				term: "SMTP (Simple Mail Transfer Protocol)",
				definition:
					"The standard protocol for sending email. SMTP verification connects to mail servers to confirm mailbox existence without sending an email.",
				related: "/tools/email-checker",
			},
			{
				term: "SMTP Verification",
				definition:
					"The process of connecting to a mail server via SMTP to check if a mailbox exists. The most accurate method of email verification.",
				related: "/tools/email-checker",
			},
			{
				term: "Sender Reputation",
				definition:
					"A score assigned to sending IP addresses and domains based on email practices. Good reputation improves deliverability; bad reputation leads to spam filtering.",
				related: "/tools/email-checker",
			},
			{
				term: "Soft Bounce",
				definition:
					"A temporary email delivery failure caused by issues like full mailboxes or server problems. Soft bounces may resolve themselves but should be monitored.",
				related: "/tools/email-checker",
			},
			{
				term: "Spam Trap",
				definition:
					"Email addresses used to identify senders who don't verify their lists or follow email best practices. Hitting spam traps can severely damage sender reputation.",
				related: "/tools/disposable-detector",
			},
			{
				term: "SPF (Sender Policy Framework)",
				definition:
					"An email authentication protocol that specifies which mail servers are authorized to send emails for a domain. SPF records are published in DNS.",
				related: "/tools/domain-lookup",
			},
			{
				term: "Syntax Validation",
				definition:
					"Checking if an email address is properly formatted according to internet standards (RFC 5322). The first step in email verification.",
				related: "/tools/syntax-validator",
			},
		],
	},
	{
		letter: "T",
		terms: [
			{
				term: "Temporary Email",
				definition:
					"Also known as disposable email, these are short-lived email addresses often used to avoid giving out real email addresses. Should be filtered from marketing lists.",
				related: "/tools/disposable-detector",
			},
			{
				term: "Typo Detection",
				definition:
					"Identifying common email address typos such as 'gmial.com' instead of 'gmail.com'. Some verification tools suggest corrections for typos.",
				related: "/tools/syntax-validator",
			},
		],
	},
	{
		letter: "V",
		terms: [
			{
				term: "Validation",
				definition:
					"The process of checking if an email address meets formatting standards and can receive emails. Often used interchangeably with verification.",
				related: "/tools/email-checker",
			},
			{
				term: "Verification",
				definition:
					"The comprehensive process of confirming an email address is valid, the domain exists, and the mailbox is active. Includes multiple checks.",
				related: "/tools/email-checker",
			},
		],
	},
];

export default function GlossaryPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(GlossarySchema),
				}}
			/>

			<div className="min-h-screen">
				{/* Hero Section */}
				<section className="border-stroke-soft-100 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
						<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
							<span className="text-sm text-text-sub-600">GLOSSARY</span>
							<span className="text-sm text-text-sub-600">
								/ EMAIL TERMINOLOGY
							</span>
						</div>
						<div className="px-10 py-16 text-center">
							<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
								Email Verification Glossary
							</h1>
							<p className="mx-auto mt-6 max-w-2xl text-lg text-text-sub-600">
								Comprehensive guide to email verification terminology and
								definitions. Master the language of email deliverability,
								marketing, and list management.
							</p>
						</div>
					</div>
				</section>

				{/* Quick Navigation */}
				<section className="border-stroke-soft-100 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
						<div className="border-stroke-soft-100 border-b px-10 py-4">
							<span className="text-sm text-text-sub-600">JUMP TO LETTER</span>
						</div>
						<div className="flex flex-wrap gap-2 p-10">
							{glossaryTerms.map((section) => (
								<a
									key={section.letter}
									href={`#${section.letter}`}
									className="rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-4 py-2 font-semibold text-text-strong-950 transition-all hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600"
								>
									{section.letter}
								</a>
							))}
						</div>
					</div>
				</section>

				{/* Glossary Content */}
				<section className="border-stroke-soft-100 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
						{glossaryTerms.map((section) => (
							<div
								key={section.letter}
								id={section.letter}
								className="border-stroke-soft-100 border-b last:border-b-0"
							>
								<div className="border-stroke-soft-100 border-b px-10 py-4">
									<h2 className="font-bold text-2xl text-text-strong-950">
										{section.letter}
									</h2>
								</div>
								<div className="space-y-0">
									{section.terms.map((item, index) => (
										<div
											key={item.term}
											className={`border-stroke-soft-100 p-10 ${
												index < section.terms.length - 1 ? "border-b" : ""
											}`}
										>
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<h3 className="mb-3 font-semibold text-text-strong-950 text-xl">
														{item.term}
													</h3>
													<p className="text-text-sub-600 leading-relaxed">
														{item.definition}
													</p>
												</div>
												{item.related && (
													<Link
														href={item.related}
														className="group mt-2 flex shrink-0 items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-4 py-2 text-sm transition-all hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600"
													>
														<Icon
															name="link"
															className="h-4 w-4 text-text-sub-600 group-hover:text-purple-600"
														/>
														Learn More
													</Link>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Tools Section */}
				<section className="border-stroke-soft-100 border-b">
					<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
						<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
							<span className="text-sm text-text-sub-600">RELATED TOOLS</span>
							<span className="text-sm text-text-sub-600">
								/ FREE VERIFICATION TOOLS
							</span>
						</div>
						<div className="grid gap-0 border-stroke-soft-100 md:grid-cols-3">
							{[
								{
									title: "Email Verifier",
									desc: "Verify any email address instantly",
									href: "/tools/email-checker",
									icon: "mail-single",
								},
								{
									title: "Bulk Email Tester",
									desc: "Test up to 100 emails at once",
									href: "/tools/bulk-tester",
									icon: "layers",
								},
								{
									title: "Domain Lookup",
									desc: "Check MX records and DNS configuration",
									href: "/tools/domain-lookup",
									icon: "search",
								},
								{
									title: "Disposable Detector",
									desc: "Identify temporary email addresses",
									href: "/tools/disposable-detector",
									icon: "shield",
								},
								{
									title: "Syntax Validator",
									desc: "Validate email format",
									href: "/tools/syntax-validator",
									icon: "text-input",
								},
								{
									title: "MX Record Checker",
									desc: "Analyze mail server configuration",
									href: "/tools/mx-checker",
									icon: "workflow",
								},
							].map((tool, index) => (
								<Link
									key={tool.title}
									href={tool.href}
									className={`group border-stroke-soft-100 p-8 transition-all hover:bg-bg-weak-50 ${
										index < 3 ? "md:border-b" : ""
									} ${index % 3 !== 2 ? "md:border-r" : ""}`}
								>
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
										<Icon name={tool.icon as any} className="h-6 w-6" />
									</div>
									<h3 className="mt-4 font-semibold text-lg text-text-strong-950 group-hover:text-purple-600">
										{tool.title}
									</h3>
									<p className="mt-2 text-sm text-text-sub-600">{tool.desc}</p>
								</Link>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section>
					<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
						<div className="grid gap-8 p-10 md:grid-cols-2 md:p-16">
							<div>
								<h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
									Need email verification for your business?
								</h2>
								<p className="mt-4 text-text-sub-600">
									Our tools help you maintain clean email lists, improve
									deliverability, and protect your sender reputation. Get
									started with our free tools or upgrade for bulk verification
									and API access.
								</p>
								<div className="mt-6 flex flex-col gap-3 sm:flex-row">
									<Link
										href="/tools"
										className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700"
									>
										Browse All Tools
									</Link>
									<Link
										href="/pricing"
										className="inline-flex items-center justify-center rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-6 py-3 font-semibold text-text-strong-950 transition-colors hover:border-stroke-strong-950"
									>
										View Pricing
									</Link>
								</div>
							</div>
							<div className="flex items-center justify-center">
								<div className="grid grid-cols-2 gap-4 text-center">
									<div className="rounded-xl border border-stroke-soft-100 bg-bg-white-0 p-6">
										<p className="font-bold text-3xl text-text-strong-950">
											50+
										</p>
										<p className="mt-1 text-sm text-text-sub-600">
											Terms Defined
										</p>
									</div>
									<div className="rounded-xl border border-stroke-soft-100 bg-bg-white-0 p-6">
										<p className="font-bold text-3xl text-text-strong-950">6</p>
										<p className="mt-1 text-sm text-text-sub-600">Free Tools</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
