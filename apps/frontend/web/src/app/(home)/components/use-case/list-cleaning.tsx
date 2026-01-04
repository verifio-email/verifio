import { Icon } from "@verifio/ui/icon";

export const ListCleaning = () => {
	return (
		<div className="border-stroke-soft-100 border-b">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="order-2 flex items-center justify-center border-stroke-soft-100 bg-bg-weak-50 p-10 md:order-1 md:border-r">
					<div className="w-full max-w-md">
						<div className="rounded-lg border border-stroke-soft-100 bg-white p-8">
							<h4 className="mb-6 font-semibold text-lg text-text-strong-950">
								Email List Health
							</h4>
							<div className="mb-6 grid grid-cols-2 gap-4">
								<div className="rounded-lg bg-bg-weak-50 p-4">
									<p className="mb-1 text-text-sub-600 text-xs">Total Emails</p>
									<p className="font-semibold text-2xl text-text-strong-950">
										50,000
									</p>
								</div>
								<div className="rounded-lg bg-green-50 p-4">
									<p className="mb-1 text-green-700 text-xs">Valid</p>
									<p className="font-semibold text-2xl text-green-700">
										47,250
									</p>
								</div>
								<div className="rounded-lg bg-red-50 p-4">
									<p className="mb-1 text-red-700 text-xs">Invalid</p>
									<p className="font-semibold text-2xl text-red-700">2,100</p>
								</div>
								<div className="rounded-lg bg-yellow-50 p-4">
									<p className="mb-1 text-yellow-700 text-xs">Risky</p>
									<p className="font-semibold text-2xl text-yellow-700">650</p>
								</div>
							</div>
							<div className="rounded-lg bg-green-50 p-4">
								<div className="flex items-center justify-between">
									<span className="font-medium text-green-900 text-sm">
										List Quality
									</span>
									<span className="font-semibold text-green-700 text-xl">
										94.5%
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="order-1 flex flex-col justify-center space-y-6 p-10 md:order-2 md:p-20">
					<div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-bg-weak-50">
						<Icon name="mail-single" className="h-6 w-6 text-text-sub-600" />
					</div>
					<h3 className="font-semibold text-2xl text-text-strong-950">
						Clean Your Email Lists Instantly
					</h3>
					<p className="max-w-md text-text-sub-600 leading-7">
						Upload and verify thousands of email addresses in seconds with our
						bulk email verification tool. Get detailed reports on list quality
						and remove invalid contacts to improve campaign performance.
					</p>
					<div className="flex flex-col gap-3 pt-2">
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Bulk verify up to 1M emails at once
							</span>
						</div>
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Get detailed quality scores and insights
							</span>
						</div>
						<div className="flex items-start gap-3">
							<Icon
								name="check-circle"
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-sub-600"
							/>
							<span className="text-sm text-text-sub-600">
								Export cleaned lists in CSV format
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
