export default function TermsPage() {
	return (
		<div>
			<section className="border-stroke-soft-100">
				<div className="mx-4 max-w-7xl border-stroke-soft-100 border-r border-l md:mx-auto">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-4 py-3 md:px-10 md:py-4">
						<span className="text-xs text-text-sub-600 md:text-sm">
							[01] LEGAL
						</span>
						<span className="text-xs text-text-sub-600 md:text-sm">
							/ TERMS OF SERVICE
						</span>
					</div>
					<div className="px-4 py-8 md:px-10 md:py-16">
						<h1 className="font-semibold text-2xl text-text-strong-950 md:text-4xl">
							Terms of Service
						</h1>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
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

			<section className="border-stroke-soft-100">
				<div className="mx-4 max-w-7xl border-stroke-soft-100 border-r border-l md:mx-auto">
					<div className="prose prose-gray max-w-none px-4 py-6 md:px-10 md:py-10">
						<h2 className="font-semibold text-lg text-text-strong-950 md:text-xl">
							1. Acceptance of Terms
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							By accessing or using Verifio's email verification services, you
							agree to be bound by these Terms of Service and all applicable
							laws and regulations.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							2. Description of Service
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							Verifio provides email verification services including syntax
							validation, MX record checking, disposable email detection, and
							SMTP verification. Service availability is subject to our
							operational capacity.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							3. Acceptable Use
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							You agree not to use our services for spamming, harvesting email
							addresses, or any illegal activities. Violation may result in
							immediate account termination.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							4. API Usage
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							API access is subject to rate limits based on your subscription
							tier. Exceeding limits may result in temporary suspension of
							service. API keys must be kept confidential.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							5. Payment Terms
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							Paid subscriptions are billed monthly or annually. Refunds are
							available within 14 days of purchase for unused credits. Prices
							may change with 30 days notice.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							6. Limitation of Liability
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							Verifio provides verification results on a best-effort basis. We
							are not liable for any damages arising from inaccurate
							verification results or service interruptions.
						</p>

						<h2 className="mt-6 font-semibold text-lg text-text-strong-950 md:mt-10 md:text-xl">
							7. Contact
						</h2>
						<p className="mt-3 text-sm text-text-sub-600 md:mt-4 md:text-base">
							For questions about these terms, contact{" "}
							<a
								href="mailto:legal@verifio.email"
								className="text-primary-500 hover:underline"
							>
								legal@verifio.email
							</a>
						</p>
					</div>
				</div>
			</section>
			<div className="h-10 border-stroke-soft-100 border-t" />
		</div>
	);
}
