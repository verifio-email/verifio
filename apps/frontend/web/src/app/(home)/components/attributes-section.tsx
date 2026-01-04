import { Icon } from "@verifio/ui/icon";

interface AttributesSectionProps {
	isFree: boolean;
	isRole: boolean;
	isDisposable: boolean;
	isCatchAll: boolean | null;
	tag: string | null;
}

export function AttributesSection({
	isFree,
	isRole,
	isDisposable,
	isCatchAll,
	tag,
}: AttributesSectionProps) {
	return (
		<div className="px-6 py-4">
			<h4 className="mb-4 font-semibold text-sm text-text-strong-950">
				Attributes
			</h4>
			<div className="divide-y divide-stroke-soft-100/60">
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon name="dollar" className="h-3.5 w-3.5 text-primary-base" />
						<span className="text-sm text-text-sub-600">Free</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isFree ? "Yes" : "No"}
					</span>
				</div>
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon name="users" className="h-3.5 w-3.5 text-primary-base" />
						<span className="text-sm text-text-sub-600">Role</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isRole ? "Yes" : "No"}
					</span>
				</div>
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon name="trash" className="h-3.5 w-3.5 text-primary-base" />
						<span className="text-sm text-text-sub-600">Disposable</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isDisposable ? "Yes" : "No"}
					</span>
				</div>
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon
							name="check-circle"
							className="h-3.5 w-3.5 text-primary-base"
						/>
						<span className="text-sm text-text-sub-600">Accept-All</span>
					</div>
					<span className="text-sm text-text-strong-950">
						{isCatchAll === null ? "No" : isCatchAll ? "Yes" : "No"}
					</span>
				</div>
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon name="hash" className="h-3.5 w-3.5 text-primary-base" />
						<span className="text-sm text-text-sub-600">Tag</span>
					</div>
					<span className="text-sm text-text-strong-950">{tag || "No"}</span>
				</div>
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon name="hash" className="h-3.5 w-3.5 text-primary-base" />
						<span className="text-sm text-text-sub-600">
							Numerical Characters
						</span>
					</div>
					<span className="text-sm text-text-strong-950">0</span>
				</div>
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon name="file-text" className="h-3.5 w-3.5 text-primary-base" />
						<span className="text-sm text-text-sub-600">
							Alphabetical Characters
						</span>
					</div>
					<span className="text-sm text-text-strong-950">6</span>
				</div>
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon name="globe" className="h-3.5 w-3.5 text-primary-base" />
						<span className="text-sm text-text-sub-600">Unicode Symbols</span>
					</div>
					<span className="text-sm text-text-strong-950">0</span>
				</div>
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon name="at-filled" className="h-3.5 w-3.5 text-primary-base" />
						<span className="text-sm text-text-sub-600">Mailbox Full</span>
					</div>
					<span className="text-sm text-text-strong-950">No</span>
				</div>
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon
							name="cross-circle"
							className="h-3.5 w-3.5 text-primary-base"
						/>
						<span className="text-sm text-text-sub-600">No Reply</span>
					</div>
					<span className="text-sm text-text-strong-950">No</span>
				</div>
				<div className="flex items-center justify-between py-3 first:pt-0">
					<div className="flex items-center gap-2">
						<Icon name="lock" className="h-3.5 w-3.5 text-primary-base" />
						<span className="text-sm text-text-sub-600">
							Secure Email Gateway
						</span>
					</div>
					<span className="text-sm text-text-strong-950">No</span>
				</div>
			</div>
		</div>
	);
}
