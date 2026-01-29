import { DeveloperLogRow } from "../developer-log-row";
import type {
	ActivityLog,
	BulkJobInfo,
	VerificationEnrichment,
} from "../types";
import { UserLogRow } from "../user-log-row";

type LogsListProps = {
	logs: ActivityLog[];
	developerMode: boolean;
	expandedLogId: string | null;
	onToggleExpand: (logId: string) => void;
	verificationMap: Map<string, VerificationEnrichment>;
	bulkJobMap: Map<string, BulkJobInfo>;
	formatDate: (date: string) => string;
	onNavigate: (log: ActivityLog) => void;
};

export function LogsList({
	logs,
	developerMode,
	expandedLogId,
	onToggleExpand,
	verificationMap,
	bulkJobMap,
	formatDate,
	onNavigate,
}: LogsListProps) {
	return (
		<div>
			{logs.map((log) =>
				developerMode ? (
					<DeveloperLogRow
						key={log.id}
						log={log}
						formatDate={formatDate}
						isExpanded={expandedLogId === log.id}
						onToggle={() => onToggleExpand(log.id)}
						enrichment={
							log.resource_id ? verificationMap.get(log.resource_id) : undefined
						}
						bulkJobInfo={
							log.resource_id?.startsWith("vj_")
								? bulkJobMap.get(log.resource_id)
								: undefined
						}
						onNavigate={() => onNavigate(log)}
					/>
				) : (
					<UserLogRow
						key={log.id}
						log={log}
						formatDate={formatDate}
						enrichment={
							log.resource_id ? verificationMap.get(log.resource_id) : undefined
						}
						bulkJobInfo={
							log.resource_id?.startsWith("vj_")
								? bulkJobMap.get(log.resource_id)
								: undefined
						}
						onNavigate={() => onNavigate(log)}
					/>
				),
			)}
		</div>
	);
}
