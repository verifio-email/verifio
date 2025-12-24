import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen">
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
                        <span className="text-sm text-text-sub-600">[01] LEGAL</span>
                        <span className="text-sm text-text-sub-600">
                            / TERMS OF SERVICE
                        </span>
                    </div>
                    <div className="px-10 py-16">
                        <h1 className="font-semibold text-4xl text-text-strong-950">
                            Terms of Service
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
                            1. Acceptance of Terms
                        </h2>
                        <p className="mt-4 text-text-sub-600">
                            By accessing or using Verifio's email verification services, you
                            agree to be bound by these Terms of Service and all applicable
                            laws and regulations.
                        </p>

                        <h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
                            2. Description of Service
                        </h2>
                        <p className="mt-4 text-text-sub-600">
                            Verifio provides email verification services including syntax
                            validation, MX record checking, disposable email detection, and
                            SMTP verification. Service availability is subject to our
                            operational capacity.
                        </p>

                        <h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
                            3. Acceptable Use
                        </h2>
                        <p className="mt-4 text-text-sub-600">
                            You agree not to use our services for spamming, harvesting email
                            addresses, or any illegal activities. Violation may result in
                            immediate account termination.
                        </p>

                        <h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
                            4. API Usage
                        </h2>
                        <p className="mt-4 text-text-sub-600">
                            API access is subject to rate limits based on your subscription
                            tier. Exceeding limits may result in temporary suspension of
                            service. API keys must be kept confidential.
                        </p>

                        <h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
                            5. Payment Terms
                        </h2>
                        <p className="mt-4 text-text-sub-600">
                            Paid subscriptions are billed monthly or annually. Refunds are
                            available within 14 days of purchase for unused credits. Prices
                            may change with 30 days notice.
                        </p>

                        <h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
                            6. Limitation of Liability
                        </h2>
                        <p className="mt-4 text-text-sub-600">
                            Verifio provides verification results on a best-effort basis. We
                            are not liable for any damages arising from inaccurate
                            verification results or service interruptions.
                        </p>

                        <h2 className="mt-10 font-semibold text-text-strong-950 text-xl">
                            7. Contact
                        </h2>
                        <p className="mt-4 text-text-sub-600">
                            For questions about these terms, contact{" "}
                            <a
                                href="mailto:legal@verifio.com"
                                className="text-primary-500 hover:underline"
                            >
                                legal@verifio.com
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
