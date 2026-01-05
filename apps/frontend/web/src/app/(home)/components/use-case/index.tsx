import { BounceReduction } from "./bounce-reduction";
import { DeliverabilityProtection } from "./deliverability-protection";
import { FraudPrevention } from "./fraud-prevention";
import { ListCleaning } from "./list-cleaning";

export default function UseCase() {
	return (
		<div className="border-stroke-soft-200/50 border-t">
			<div className="mx-auto max-w-7xl border-stroke-soft-200/50 border-r border-l">
				<div className="sticky top-[66px] z-10 flex items-center justify-between border-stroke-soft-200/50 border-b bg-bg-white-0 px-4 py-2 md:px-10 md:py-4">
					<span className="text-text-sub-600 text-xs">[03] USE CASES</span>
					<span className="text-text-sub-600 text-xs">
						/ EMAIL VERIFICATION BENEFITS
					</span>
				</div>
				<div>
					<BounceReduction />
					<DeliverabilityProtection />
					<FraudPrevention />
					<ListCleaning />
				</div>
			</div>
		</div>
	);
}
