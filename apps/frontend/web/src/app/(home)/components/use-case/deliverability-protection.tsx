import { Icon } from "@verifio/ui/icon";

export const DeliverabilityProtection = () => {
	return (
		<div className="border-stroke-soft-100 border-b">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="order-2 flex items-center justify-center border-stroke-soft-100 bg-bg-weak-50 p-10 md:order-1 md:border-r">
					<div className="w-full max-w-md">
						<div className="rounded-lg border border-stroke-soft-100 bg-white p-8">
							<h4 className="mb-6 font-semibold text-lg text-text-strong-950">
								Sender Reputation Score
							</h4>
							<div className="space-y-4">
								<div>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm text-text-sub-600">
											Domain Reputation
										</span>
										<span className="font-semibold text-green-600">
											Excellent
										</span>
									</div>
									<div className="h-2 w-full rounded-full bg-gray-200">
										<div className="h-2 w-[95%] rounded-full bg-green-600" />
									</div>
								</div>
								<div>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm text-text-sub-600">
											IP Reputation
										</span>
										<span className="font-semibold text-green-600">
											Excellent
										</span>
									</div>
									<div className="h-2 w-full rounded-full bg-gray-200">
										<div className="h-2 w-[92%] rounded-full bg-green-600" />
									</div>
								</div>
								<div>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm text-text-sub-600">
											Spam Score
										</span>
										<span className="font-semibold text-green-600">Low</span>
									</div>
									<div className="h-2 w-full rounded-full bg-gray-200">
										<div className="h-2 w-[8%] rounded-full bg-green-600" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="order-1 flex flex-col justify-center space-y-6 p-10 md:order-2 md:p-20">
					<div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-bg-weak-50">
						<Icon name="verified" className="h-6 w-6 text-text-sub-600" />
					</div>
					<h3 className="font-semibold text-2xl text-text-strong-950">
						Protect Your Sender Reputation
					</h3>
					<p className="max-w-md text-text-sub-600 leading-7">
						High bounce rates damage your sender reputation and land your emails
						in spam. Free email verification helps maintain a clean sender score
						by filtering out invalid addresses before they hurt your
						deliverability.
					</p>
					<div className="flex flex-col gap-3 pt-2">
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Maintain high inbox placement rates
							</span>
						</div>
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Avoid spam folder and blacklists
							</span>
						</div>
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Build trust with email service providers
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
