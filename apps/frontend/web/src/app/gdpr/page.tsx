import * as Button from "@verifio/ui/button";
import Link from "next/link";

export default function GDPRPage() {
	return (
		<div className="min-h-screen">
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] COMPLIANCE</span>
						<span className="text-sm text-text-sub-600">/ GDPR</span>
					</div>
					<div className="px-10 py-16">
						<h1 className="font-semibold text-4xl text-text-strong-950">
							GDPR Compliance
						</h1>
						<p className="mt-4 max-w-2xl text-lg text-text-sub-600">
							Verifio is committed to protecting your privacy and complying with
							the General Data Protection Regulation (GDPR).
						</p>
					</div>
				</div>
			</section>

			{/* Key Points */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="grid gap-0 md:grid-cols-3">
						{[
							{
								title: "Data Minimization",
								desc: "We only collect data necessary for email verification. Emails are processed in real-time and not stored.",
							},
							{
								title: "Your Rights",
								desc: "Access, rectify, delete, or export your data at any time through your account dashboard.",
							},
							{
								title: "EU Data Centers",
								desc: "European customer data is processed and stored within EU-based data centers.",
							},
						].map((item, index) => (
							<div
								key={item.title}
								className={`border-stroke-soft-100 p-10 ${index < 2 ? "border-r" : ""}`}
							>
								<h3 className="font-semibold text-text-strong-950 text-xl">
									{item.title}
								</h3>
								<p className="mt-3 text-text-sub-600">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Detailed Rights */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[02] YOUR RIGHTS</span>
						<span className="text-sm text-text-sub-600">/ UNDER GDPR</span>
					</div>
					<div className="px-10 py-10">
						<div className="grid gap-6 md:grid-cols-2">
							{[
								{
									right: "Right to Access",
									desc: "Request a copy of your personal data",
								},
								{
									right: "Right to Rectification",
									desc: "Correct inaccurate personal data",
								},
								{
									right: "Right to Erasure",
									desc: "Request deletion of your personal data",
								},
								{
									right: "Right to Portability",
									desc: "Export your data in a machine-readable format",
								},
								{
									right: "Right to Object",
									desc: "Object to processing of your personal data",
								},
								{
									right: "Right to Restrict",
									desc: "Request restriction of data processing",
								},
							].map((item) => (
								<div
									key={item.right}
									className="rounded-lg border border-stroke-soft-100 p-6"
								>
									<h4 className="font-medium text-text-strong-950">
										{item.right}
									</h4>
									<p className="mt-1 text-sm text-text-sub-600">{item.desc}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* DPO Contact */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="p-10 text-center md:p-16">
						<h2 className="font-semibold text-2xl text-text-strong-950">
							Data Protection Officer
						</h2>
						<p className="mt-2 text-text-sub-600">
							For GDPR-related inquiries, contact our Data Protection Officer
						</p>
						<a
							href="mailto:dpo@verifio.email"
							className="mt-4 inline-block text-primary-500 hover:underline"
						>
							dpo@verifio.email
						</a>
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
