export default function PrivacyPage() {
	return (
		<div>
			<section className="border-stroke-soft-100">
				<div className="mx-4 max-w-7xl border-stroke-soft-100 border-r border-l md:mx-auto">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-4 py-3 md:px-10 md:py-4">
						<span className="text-xs text-text-sub-600 md:text-sm">
							[01] LEGAL
						</span>
						<span className="text-xs text-text-sub-600 md:text-sm">
							/ PRIVACY POLICY
						</span>
					</div>
					<div className="px-4 py-8 md:px-10 md:py-16">
						<h1 className="font-semibold text-2xl text-text-strong-950 md:text-4xl">
							Privacy Policy
						</h1>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							Last updated: December 24, 2024
						</p>
					</div>
				</div>
			</section>

			<section className="border-stroke-soft-100">
				<div className="mx-4 max-w-7xl border-stroke-soft-100 border-r border-l md:mx-auto">
					<div className="prose prose-gray max-w-none px-4 py-6 md:px-10 md:py-10">
						<h2 className="font-semibold text-lg text-text-strong-950 md:text-xl">
							1. Information We Collect
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							We collect information you provide directly, such as email
							addresses for verification, account information, and payment
							details. We also collect usage data to improve our services.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							2. How We Use Your Information
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							We use collected information to provide email verification
							services, process payments, send service updates, and improve our
							platform. We never sell your data to third parties.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							3. Data Retention
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							Email addresses submitted for verification are processed in
							real-time and not stored permanently. Account data is retained
							while your account is active and for a reasonable period
							afterward.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							4. Data Security
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							We implement industry-standard security measures including
							encryption, secure data centers, and regular security audits to
							protect your information.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							5. Your Rights
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							You have the right to access, correct, or delete your personal
							data. Contact us to exercise these rights.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							6. Contact Us
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
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
			<div className="h-10 border-stroke-soft-100 border-t" />
		</div>
	);
}
