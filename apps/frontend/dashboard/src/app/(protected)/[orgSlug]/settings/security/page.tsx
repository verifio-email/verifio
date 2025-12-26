"use client";
import { ConnectedAccounts } from "@fe/dashboard/components/connected-accounts";
import { SessionManagement } from "@fe/dashboard/components/session-management";

const SecurityPage = () => {
	return (
		<div className="flex h-full flex-col">
			{/* Connected Accounts Section */}
			<div className="relative">
				<div className="px-5 pt-5 pb-4 lg:px-6">
					<h3 className="font-medium text-label-md text-text-strong-950">
						Connected Accounts
					</h3>
					<p className="text-paragraph-sm text-text-sub-600">
						Manage your linked social accounts
					</p>
				</div>
				<div className="">
					<ConnectedAccounts />
				</div>
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Session Management Section */}
			<div className="relative">
				<div className="px-5 py-5 lg:px-6">
					<SessionManagement />
				</div>
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Bottom spacer */}
			<div className="flex-1" />
		</div>
	);
};

export default SecurityPage;
