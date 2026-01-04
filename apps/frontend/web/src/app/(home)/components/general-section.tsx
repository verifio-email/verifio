import { Icon } from "@verifio/ui/icon";
import * as Badge from "@verifio/ui/badge";

interface GeneralSectionProps {
	state: string;
	reason: string;
	domain: string;
	didYouMean?: string;
}

export function GeneralSection({
	state,
	reason,
	domain,
	didYouMean,
}: GeneralSectionProps) {
	return (
		<div>
			<h4 className=" border-stroke-soft-100/60 border-b px-6 py-4 font-semibold text-sm text-text-strong-950">
				General
			</h4>
			<div className="divide-y divide-stroke-soft-100/60">
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-white-200">
					<span className="text-sm text-text-sub-600">Full Name</span>
					<span className="text-sm text-text-sub-600">—</span>
				</div>
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-white-200">
					<span className="text-sm text-text-sub-600">Gender</span>
					<span className="text-sm text-text-sub-600">—</span>
				</div>
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-white-200">
					<span className="text-sm text-text-sub-600">State</span>
					<div className="flex items-center gap-2">
						<Badge.Root
							variant="light"
							color={state === "deliverable" ? "green" : "red"}
							size="small"
						>
							<Icon
								name={state === "deliverable" ? "check-circle" : "cross-circle"}
								className="h-3 w-3"
							/>
							{state === "deliverable" ? "Deliverable" : state}
						</Badge.Root>
						{state !== "deliverable" && (
							<Badge.Root variant="lighter" color="red" size="small">
								0x
							</Badge.Root>
						)}
					</div>
				</div>
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-white-200">
					<span className="text-sm text-text-sub-600">Reason</span>
					<Badge.Root variant="lighter" color="blue" size="small">
						{reason.toUpperCase().replace(/_/g, " ")}
					</Badge.Root>
				</div>
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-white-200">
					<span className="text-sm text-text-sub-600">Domain</span>
					<span className="text-sm font-mono text-primary-base">{domain}</span>
				</div>
				{didYouMean && (
					<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-white-200">
						<span className="text-sm text-text-sub-600">Did you mean</span>
						<div className="flex items-center gap-2">
							<span className="text-sm font-mono text-text-strong-950">
								{didYouMean}
							</span>
							<Badge.Root variant="lighter" color="blue" size="small">
								0.9x
							</Badge.Root>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
