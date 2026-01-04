import { Icon } from "@verifio/ui/icon";
import * as Button from "@verifio/ui/button";

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

const highlightJSON = (json: string) => {
	const lines = json.split("\n");
	return lines.map((line, lineIndex) => {
		// Basic JSON syntax highlighting
		const patterns = [
			// String values (after colon)
			{
				regex: /: "([^"]*)"/g,
				className: "text-[#ce9178]",
			},
			// Property names
			{
				regex: /"([^"]+)":/g,
				className: "text-[#9cdcfe]",
			},
			// Numbers
			{
				regex: /\b(\d+)\b/g,
				className: "text-[#b5cea8]",
			},
			// Booleans and null
			{
				regex: /\b(true|false|null)\b/g,
				className: "text-[#569cd6]",
			},
		];

		const parts: Array<{ text: string; className?: string }> = [];
		let lastIndex = 0;

		const matches: Array<{
			start: number;
			end: number;
			className: string;
		}> = [];

		patterns.forEach((pattern) => {
			const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
			let match = regex.exec(line);
			while (match !== null) {
				matches.push({
					start: match.index,
					end: match.index + match[0].length,
					className: pattern.className,
				});
				match = regex.exec(line);
			}
		});

		matches.sort((a, b) => a.start - b.start);

		const mergedMatches: Array<{
			start: number;
			end: number;
			className: string;
		}> = [];
		matches.forEach((match) => {
			const overlapping = mergedMatches.find(
				(m) => !(match.end <= m.start || match.start >= m.end),
			);
			if (!overlapping) {
				mergedMatches.push(match);
			}
		});

		mergedMatches.forEach((match) => {
			if (match.start > lastIndex) {
				parts.push({ text: line.slice(lastIndex, match.start) });
			}
			parts.push({
				text: line.slice(match.start, match.end),
				className: match.className,
			});
			lastIndex = Math.max(lastIndex, match.end);
		});

		if (lastIndex < line.length) {
			parts.push({ text: line.slice(lastIndex) });
		}

		if (parts.length === 0) {
			parts.push({ text: line });
		}

		return (
			<span key={lineIndex} className="block">
				{parts.map((part, partIndex) => (
					<span key={partIndex} className={part.className}>
						{part.text}
					</span>
				))}
				{line === "" && "\u00A0"}
			</span>
		);
	});
};

export function JsonViewer({
	data,
	filename = "response.json",
}: JsonViewerProps) {
	const jsonString = JSON.stringify(data, null, 2);

	return (
		<div className="border-stroke-soft-100/60 border-t">
			<div className="flex items-center justify-between border-stroke-soft-100/60 border-b px-4 py-2">
				<span className="text-xs font-mono text-text-sub-600">{filename}</span>
				<Button.Root
					mode="lighter"
					size="xsmall"
					onClick={() => copyToClipboard(jsonString)}
				>
					<Icon
						name="copy"
						className="h-3.5 w-3.5 stroke-1 text-text-sub-600"
					/>
					Copy
				</Button.Root>
			</div>
			<div className="max-h-96 overflow-auto bg-[#1e1e1e]">
				<div className="flex">
					{/* Line Numbers */}
					<div className="sticky left-0 z-10 border-r border-stroke-soft-200 bg-[#252526] px-4 py-4 text-right text-xs font-mono leading-6 text-[#858585]">
						{jsonString.split("\n").map((_, index) => (
							<div key={index} className="select-none">
								{index + 1}
							</div>
						))}
					</div>
					{/* JSON Content */}
					<div className="flex-1 px-6 py-4">
						<pre className="font-mono text-sm leading-6">
							<code className="block text-[#d4d4d4]">
								{highlightJSON(jsonString)}
							</code>
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
