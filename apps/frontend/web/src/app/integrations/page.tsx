import * as Button from "@verifio/ui/button";
import Link from "next/link";

const integrations = [
	{
		category: "CRM",
		items: [
			{ name: "HubSpot", desc: "Verify contacts on import", popular: true },
			{
				name: "Salesforce",
				desc: "Real-time lead verification",
				popular: true,
			},
			{ name: "Pipedrive", desc: "Clean your pipeline", popular: false },
			{ name: "Zoho CRM", desc: "Automated verification", popular: false },
		],
	},
	{
		category: "Email Marketing",
		items: [
			{ name: "Mailchimp", desc: "List cleaning integration", popular: true },
			{ name: "Klaviyo", desc: "E-commerce email verification", popular: true },
			{ name: "SendGrid", desc: "Pre-send verification", popular: false },
			{ name: "Mailgun", desc: "API-level integration", popular: false },
		],
	},
	{
		category: "Automation",
		items: [
			{ name: "Zapier", desc: "Connect 5000+ apps", popular: true },
			{ name: "Make", desc: "Visual automation builder", popular: false },
			{ name: "n8n", desc: "Self-hosted automation", popular: false },
			{ name: "Webhooks", desc: "Custom integrations", popular: true },
		],
	},
	{
		category: "Forms & Landing Pages",
		items: [
			{ name: "Typeform", desc: "Verify on submission", popular: true },
			{ name: "Webflow", desc: "Form verification", popular: false },
			{ name: "WordPress", desc: "Plugin available", popular: true },
			{ name: "Shopify", desc: "Customer verification", popular: false },
		],
	},
];

export default function IntegrationsPage() {
	return (
		<div className="min-h-screen">
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] INTEGRATIONS</span>
						<span className="text-sm text-text-sub-600">
							/ CONNECT YOUR STACK
						</span>
					</div>
					<div className="px-10 py-16 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Works with your tools
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Connect Verifio with 50+ popular tools and platforms
						</p>
					</div>
				</div>
			</section>

			{/* Integration Categories */}
			{integrations.map((category, catIndex) => (
				<section
					key={category.category}
					className="border-stroke-soft-100 border-b"
				>
					<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
						<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
							<span className="text-sm text-text-sub-600">
								[0{catIndex + 2}] {category.category.toUpperCase()}
							</span>
						</div>
						<div className="grid gap-0 md:grid-cols-4">
							{category.items.map((item, index) => (
								<div
									key={item.name}
									className={`relative border-stroke-soft-100 p-8 ${index < 3 ? "border-r" : ""}`}
								>
									{item.popular && (
										<span className="absolute top-4 right-4 rounded-full bg-green-100 px-2 py-0.5 text-green-600 text-xs">
											Popular
										</span>
									)}
									<h3 className="font-semibold text-text-strong-950">
										{item.name}
									</h3>
									<p className="mt-1 text-sm text-text-sub-600">{item.desc}</p>
								</div>
							))}
						</div>
					</div>
				</section>
			))}

			{/* API Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="grid gap-0 md:grid-cols-2">
						<div className="border-stroke-soft-100 p-10 md:border-r md:p-16">
							<h2 className="font-semibold text-2xl text-text-strong-950">
								Build custom integrations
							</h2>
							<p className="mt-4 text-text-sub-600">
								Use our REST API to build custom integrations with any platform.
								SDKs available for Node.js, Python, PHP, Ruby, and Go.
							</p>
							<div className="mt-6">
								<Link
									href="/docs/api-reference"
									className={Button.buttonVariants({
										variant: "primary",
										size: "medium",
									}).root({})}
								>
									View API Docs
								</Link>
							</div>
						</div>
						<div className="flex items-center justify-center p-10">
							<pre className="w-full overflow-x-auto rounded-lg bg-gray-900 p-6 text-green-400 text-sm">
								<code>
									{`curl -X POST \\
  https://api.verifio.email/v1/verify \\
  -H "Authorization: Bearer $API_KEY" \\
  -d '{"email": "test@example.com"}'`}
								</code>
							</pre>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
					<div className="p-10 text-center md:p-16">
						<h2 className="font-semibold text-2xl text-text-strong-950">
							Need a custom integration?
						</h2>
						<p className="mt-2 text-text-sub-600">
							Our team can help build custom solutions for your workflow
						</p>
						<div className="mt-6">
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
	);
}
