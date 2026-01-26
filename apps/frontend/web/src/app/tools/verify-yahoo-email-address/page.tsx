"use client";

import Link from "next/link";

export default function VerifyYahooEmailPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="mx-auto max-w-2xl rounded-xl border border-stroke-soft-100 bg-white p-12 text-center">
				<h1 className="mb-4 font-semibold text-3xl text-text-strong-950">
					Yahoo Email Verification
				</h1>
				<p className="mb-8 text-text-sub-600">
					Verify Yahoo Mail email addresses instantly. Use our free email
					verification tool to check if Yahoo addresses are valid.
				</p>
				<Link
					href="/tools/email-checker"
					className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700"
				>
					Go to Email Verifier
				</Link>
			</div>
		</div>
	);
}
