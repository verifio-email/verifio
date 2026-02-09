type LogsTableHeaderProps = {
	developerMode: boolean;
};

export function LogsTableHeader({ developerMode }: LogsTableHeaderProps) {
	return (
		<div className="border-stroke-soft-200/50 border-b bg-bg-weak-50/50">
			{developerMode ? (
				<div className="grid grid-cols-[70px_140px_1fr_120px_80px_80px_80px_60px] items-center gap-3 px-6 py-3 text-[11px] text-text-sub-600 uppercase tracking-wide">
					<div className="font-semibold">Method</div>
					<div className="font-semibold">Endpoint</div>
					<div className="font-semibold">Email ID</div>
					<div className="font-semibold">Verified At</div>
					<div className="font-semibold">Credit</div>
					<div className="text-right font-semibold">Duration</div>
					<div className="text-center font-semibold">Status</div>
					<div className="text-right font-semibold">Actions</div>
				</div>
			) : (
				<div className="flex items-center justify-between px-6 py-3 text-[11px] text-text-sub-600 uppercase tracking-wide">
					<div className="font-semibold">Email</div>
					<div className="flex items-center gap-12">
						<span className="w-[220px] font-semibold">Verified At</span>
						<span className="w-[80px] font-semibold">Credit</span>
						<span className="w-[100px] font-semibold">Status</span>
						<span className="font-semibold">Score</span>
					</div>
				</div>
			)}
		</div>
	);
}
