import { Icon } from "@verifio/ui/icon";

export const FraudPrevention = () => {
	return (
		<div className="border-stroke-soft-100 border-b">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex flex-col justify-center space-y-6 p-10 md:p-20">
					<div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-bg-weak-50">
						<Icon name="shield-check" className="h-6 w-6 text-text-sub-600" />
					</div>
					<h3 className="font-semibold text-2xl text-text-strong-950">
						Prevent Fake Signups & Fraud
					</h3>
					<p className="max-w-md text-text-sub-600 leading-7">
						Stop bots and fraudsters at the door. Our email verification API
						detects disposable emails, role-based addresses, and suspicious
						patterns to keep your user base authentic and your platform secure.
					</p>
					<div className="flex flex-col gap-3 pt-2">
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Block temporary and disposable email services
							</span>
						</div>
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Identify role-based emails (support@, info@)
							</span>
						</div>
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Detect spam traps and honeypots
							</span>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-center border-stroke-soft-100 bg-bg-weak-50 p-10 md:border-l">
					<div className="w-full max-w-md space-y-6">
						<div className="rounded-lg border border-red-200 bg-red-50 p-6">
							<div className="mb-3 flex items-center gap-3">
								<Icon name="alert-triangle" className="h-5 w-5 text-red-600" />
								<span className="font-semibold text-red-900">Blocked</span>
							</div>
							<p className="font-mono text-sm text-red-800">
								temp123@tempmail.com
							</p>
							<p className="mt-2 text-red-700 text-xs">
								Disposable email detected
							</p>
						</div>
						<div className="rounded-lg border border-red-200 bg-red-50 p-6">
							<div className="mb-3 flex items-center gap-3">
								<Icon name="alert-triangle" className="h-5 w-5 text-red-600" />
								<span className="font-semibold text-red-900">Blocked</span>
							</div>
							<p className="font-mono text-sm text-red-800">
								abuse@example.com
							</p>
							<p className="mt-2 text-red-700 text-xs">
								Role-based address detected
							</p>
						</div>
						<div className="rounded-lg border border-green-200 bg-green-50 p-6">
							<div className="mb-3 flex items-center gap-3">
								<Icon name="check-circle" className="h-5 w-5 text-green-600" />
								<span className="font-semibold text-green-900">Verified</span>
							</div>
							<p className="font-mono text-sm text-green-800">user@gmail.com</p>
							<p className="mt-2 text-green-700 text-xs">Valid email address</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
