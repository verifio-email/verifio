import { Icon } from "@verifio/ui/icon";

export const BounceReduction = () => {
	return (
		<div className="border-stroke-soft-100 border-b">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex flex-col justify-center space-y-6 p-10 md:p-20">
					<div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-bg-weak-50">
						<Icon name="shield-check" className="h-6 w-6 text-text-sub-600" />
					</div>
					<h3 className="font-semibold text-2xl text-text-strong-950">
						Reduce Bounce Rates by 98%
					</h3>
					<p className="max-w-md text-text-sub-600 leading-7">
						Verify email addresses before sending to eliminate hard bounces. Our
						real-time email verification API checks syntax, domain validity, and
						mailbox existence to ensure every email reaches its destination.
					</p>
					<div className="flex flex-col gap-3 pt-2">
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Catch typos and invalid formats instantly
							</span>
						</div>
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Verify domain MX records in real-time
							</span>
						</div>
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Detect disposable and temporary email addresses
							</span>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-center border-stroke-soft-100 bg-bg-weak-50 p-10 md:border-l">
					<div className="w-full max-w-md space-y-4">
						<div className="rounded-lg border border-stroke-soft-100 bg-white p-6">
							<div className="mb-4 flex items-center justify-between">
								<span className="font-medium text-sm text-text-sub-600">
									Bounce Rate
								</span>
								<span className="font-semibold text-2xl text-red-600">
									12.3%
								</span>
							</div>
							<div className="h-2 w-full rounded-full bg-gray-200">
								<div className="h-2 w-[12%] rounded-full bg-red-600" />
							</div>
							<p className="mt-2 text-text-sub-600 text-xs">
								Before verification
							</p>
						</div>
						<div className="flex justify-center">
							<Icon name="arrow-down" className="h-6 w-6 text-text-sub-600" />
						</div>
						<div className="rounded-lg border border-stroke-soft-100 bg-white p-6">
							<div className="mb-4 flex items-center justify-between">
								<span className="font-medium text-sm text-text-sub-600">
									Bounce Rate
								</span>
								<span className="font-semibold text-2xl text-green-600">
									0.2%
								</span>
							</div>
							<div className="h-2 w-full rounded-full bg-gray-200">
								<div className="h-2 w-[0.2%] rounded-full bg-green-600" />
							</div>
							<p className="mt-2 text-text-sub-600 text-xs">
								After verification
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
