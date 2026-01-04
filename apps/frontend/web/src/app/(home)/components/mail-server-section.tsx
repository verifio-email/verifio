import { Icon } from "@verifio/ui/icon";

interface MailServerSectionProps {
	smtpProvider: string | null;
	mxRecord: string | null;
}

export function MailServerSection({
	smtpProvider,
	mxRecord,
}: MailServerSectionProps) {
	return (
		<div className="border-stroke-soft-100/60 border-t ">
			<h4 className="flex items-center gap-2 border-stroke-soft-100/60 border-b px-6 py-4 font-semibold text-sm text-text-strong-950">
				<Icon name="server" className="h-4 w-4 text-primary-base" />
				Mail Server
			</h4>

			<div className="divide-y divide-stroke-soft-100/60">
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-soft-200/50">
					<span className="text-sm text-text-sub-600">SMTP Provider</span>
					<span className="text-sm text-text-sub-600">
						{smtpProvider || "—"}
					</span>
				</div>
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-soft-200/50">
					<span className="text-sm text-text-sub-600">MX Record</span>
					<span className="text-sm font-mono text-text-strong-950">
						{mxRecord || "—"}
					</span>
				</div>
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-soft-200/50">
					<span className="text-sm text-text-sub-600">Implicit MX Record</span>
					<span className="text-sm text-text-sub-600">—</span>
				</div>
			</div>
		</div>
	);
}
