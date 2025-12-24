import Link from "next/link";

export default function PrivacyPage() {
	return (
		<div className="min-h-screen">
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] LEGAL</span>
						<span className="text-sm text-text-sub-600">/ PRIVACY POLICY</span>
					</div>
					<div className="px-10 py-16">
						<h1 className="font-semibold text-4xl text-text-strong-950">
							Privacy Policy
						</h1>
						<p className="mt-4 text-text-sub-600">
							Last updated: December 24, 2024
						</p>
					</div>
				</div>
			</section>

			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="prose prose-gray max-w-none px-10 py-10">
						<h2 className="font-semibold text-text-strong-950 text-xl">
							1. Information We Collect
						</h2>
						<p className="mt-4 text-text-sub-600">
							We collect information you provide directly, such as email
							addresses for verification, account information, and payment
							details. We also collect usage data to improve our services.
						</p>

						<h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
							2. How We Use Your Information
						</h2>
						<p className="mt-4 text-text-sub-600">
							We use collected information to provide email verification
							services, process payments, send service updates, and improve our
							platform. We never sell your data to third parties.
						</p>

						<h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
							3. Data Retention
						</h2>
						<p className="mt-4 text-text-sub-600">
							Email addresses submitted for verification are processed in
							real-time and not stored permanently. Account data is retained
							while your account is active and for a reasonable period
							afterward.
						</p>

						<h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
							4. Data Security
						</h2>
						<p className="mt-4 text-text-sub-600">
							We implement industry-standard security measures including
							encryption, secure data centers, and regular security audits to
							protect your information.
						</p>

						<h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
							5. Your Rights
						</h2>
						<p className="mt-4 text-text-sub-600">
							You have the right to access, correct, or delete your personal
							data. For GDPR-specific rights, see our{" "}
							<Link href="/gdpr" className="text-primary-500 hover:underline">
								GDPR Compliance
							</Link>{" "}
							page.
						</p>

						<h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
							6. Contact Us
						</h2>
						<p className="mt-4 text-text-sub-600">
							For privacy-related questions, contact us at{" "}
							<a
								href="mailto:privacy@verifio.email"
								className="text-primary-500 hover:underline"
							>
								privacy@verifio.email
							</a>
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
