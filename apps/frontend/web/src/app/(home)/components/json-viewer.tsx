import * as Button from "@verifio/ui/button";
import { CodeBlock } from "@verifio/ui/code-block";
import { Icon } from "@verifio/ui/icon";

interface JsonViewerProps {
	data: any;
	filename?: string;
}

const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error("Failed to copy:", err);
	}
};

export function JsonViewer({
	data,
	filename = "response.json",
}: JsonViewerProps) {
	const jsonString = JSON.stringify(data, null, 2);

	return (
		<div>
			<div className="flex items-center justify-between border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-b px-4 py-4">
				<div className="flex items-center gap-2">
					<div className="h-3.5 w-3.5 rounded-full border border-stroke-soft-100/60 dark:border-stroke-soft-100/40" />
					<div className="h-3.5 w-3.5 rounded-full border border-stroke-soft-100/60 dark:border-stroke-soft-100/40" />
					<div className="h-3.5 w-3.5 rounded-full border border-stroke-soft-100/60 dark:border-stroke-soft-100/40" />
				</div>
				<span className="text-text-sub-600 text-xs">[ .JSON ]</span>
			</div>
			<div className="max-h-96 overflow-auto">
				<CodeBlock code={jsonString} lang="json" />
			</div>
			<div className="flex items-center justify-end border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-t">
				<div className="border-stroke-soft-100/60 dark:border-stroke-soft-100/40 border-l px-4 py-3">
					<Button.Root
						mode="stroke"
						size="small"
						variant="neutral"
						onClick={() => copyToClipboard(jsonString)}
						className="rounded-full"
					>
						<Icon
							name="copy"
							className="h-3.5 w-3.5 stroke-1 text-text-sub-600"
						/>
						Copy as JSON
					</Button.Root>
				</div>
			</div>
		</div>
	);
}
