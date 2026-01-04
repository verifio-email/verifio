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
			<h4 className="border-stroke-soft-100/60 border-b px-6 py-4 font-semibold text-sm text-text-strong-950">
				Mail Server
			</h4>

			<div className="divide-y divide-stroke-soft-100/60">
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-white-200">
					<span className="text-sm text-text-sub-600">SMTP Provider</span>
					<span className="text-sm text-text-sub-600">
						{smtpProvider || "—"}
					</span>
				</div>
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-white-200">
					<span className="text-sm text-text-sub-600">MX Record</span>
					<span className="text-sm font-mono text-text-strong-950">
						{mxRecord || "—"}
					</span>
				</div>
				<div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-bg-white-200">
					<span className="text-sm text-text-sub-600">Implicit MX Record</span>
					<span className="text-sm text-text-sub-600">—</span>
				</div>
			</div>
		</div>
	);
}
