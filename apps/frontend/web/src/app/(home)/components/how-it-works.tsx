"use client";
import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import DotPattern from "@verifio/web/components/dot-pattern";
import {
	Background,
	BackgroundVariant,
	type Edge,
	type EdgeProps,
	getBezierPath,
	Handle,
	type Node,
	type NodeProps,
	Position,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import { motion } from "framer-motion";
import "@xyflow/react/dist/style.css";

// Flow step data
const flowSteps = [
	{
		id: "syntax",
		icon: "text-input" as const,
		title: "Syntax & domain validation",
		badge: "Format Check",
		badgeColor: "primary",
		description: "Checks formatting and domain structure",
		status: "✓ Validated",
	},
	{
		id: "mx-dns",
		icon: "search" as const,
		title: "MX & DNS resolution",
		badge: "DNS Lookup",
		badgeColor: "blue",
		description: "Confirms mail servers exist and are reachable",
		status: "✓ Resolved",
	},
	{
		id: "smtp",
		icon: "message" as const,
		title: "SMTP handshake",
		badge: "Verification",
		badgeColor: "emerald",
		description: "Verifies mailbox availability without sending an email",
		status: "✓ Verified",
	},
];

const badgeColors = {
	primary:
		"bg-text-strong-950/10 text-text-strong-950 border-stroke-soft-200/20",
	blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
	emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
	violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
};

const iconBgColors = {
	primary: "bg-text-strong-950/10 text-text-strong-950",
	blue: "bg-blue-500/10 text-blue-500",
	emerald: "bg-emerald-500/10 text-emerald-500",
	violet: "bg-violet-500/10 text-violet-500",
};

// Custom Node Component for React Flow
function VerificationNode({ data }: NodeProps) {
	const step = data as (typeof flowSteps)[0];
	return (
		<div className="relative flex flex-col items-center">
			{/* Main Card */}
			<div className="relative w-72 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-sm transition-all hover:border-stroke-soft-200/30 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
				{/* Card Header */}
				<div className="flex items-start gap-3">
					{/* Icon */}
					<div
						className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBgColors[step.badgeColor as keyof typeof iconBgColors]}`}
					>
						<Icon name={step.icon} className="h-5 w-5" />
					</div>

					<div className="flex-1">
						{/* Title */}
						<h4 className="font-semibold text-sm text-text-strong-950">
							{step.title}
						</h4>

						{/* Badge */}
						<span
							className={`mt-1.5 inline-flex rounded-full border px-2 py-0.5 font-medium text-[10px] ${badgeColors[step.badgeColor as keyof typeof badgeColors]}`}
						>
							{step.badge}
						</span>
					</div>
				</div>

				{/* Description */}
				<p className="mt-3 text-text-sub-600 text-xs leading-relaxed">
					{step.description}
				</p>

				{/* Handles for connections */}
				<Handle
					type="target"
					position={Position.Top}
					className="!bg-transparent !border-0 !w-0 !h-0"
				/>
				<Handle
					type="source"
					position={Position.Bottom}
					className="!bg-text-strong-950 !w-3 !h-3 !border-2 !border-bg-white-0 dark:!border-gray-900"
				/>
			</div>
		</div>
	);
}

// Custom Edge Component with Status Badge
function StatusEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
}: EdgeProps) {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY: sourceY + 6, // Offset for the dot
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
	});

	const status = data?.status as string;

	return (
		<>
			<path
				id={id}
				className="stroke-neutral-300 dark:stroke-neutral-600"
				d={edgePath}
				fill="none"
				strokeWidth={1.5}
			/>
			{/* Status Badge in the middle of the edge */}
			<foreignObject
				x={labelX - 45}
				y={labelY - 12}
				width={90}
				height={24}
				className="overflow-visible"
			>
				<div className="flex items-center justify-center">
					<div className="flex items-center gap-1 whitespace-nowrap rounded-full border border-green-500/20 bg-green-500/5 px-2.5 py-0.5 font-medium text-[10px] text-green-600">
						{status}
					</div>
				</div>
			</foreignObject>
		</>
	);
}

// Node types registration
const nodeTypes = {
	verification: VerificationNode,
};

// Edge types registration
const edgeTypes = {
	status: StatusEdge,
};

// Verification Pipeline Flow Component
function VerificationPipelineFlow() {
	// Initial nodes from flowSteps
	const initialNodes: Node[] = flowSteps.map((step, index) => ({
		id: step.id,
		type: "verification",
		position: { x: 0, y: index * 180 },
		data: step,
		draggable: true,
	}));

	// Initial edges between nodes with status labels
	const initialEdges: Edge[] = [
		{
			id: "syntax-mx",
			source: "syntax",
			target: "mx-dns",
			type: "status",
			data: { status: "✓ Resolved" },
		},
		{
			id: "mx-smtp",
			source: "mx-dns",
			target: "smtp",
			type: "status",
			data: { status: "✓ Verified" },
		},
	];

	const [nodes, , onNodesChange] = useNodesState(initialNodes);
	const [edges, , onEdgesChange] = useEdgesState(initialEdges);

	return (
		<div className="h-[620px] w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				fitView
				fitViewOptions={{ padding: 0.3, maxZoom: 1, minZoom: 1 }}
				nodesDraggable={true}
				nodesConnectable={false}
				elementsSelectable={true}
				zoomOnScroll={false}
				zoomOnPinch={false}
				panOnScroll={false}
				panOnDrag={true}
				preventScrolling={false}
				proOptions={{ hideAttribution: true }}
				className="!bg-transparent"
			>
				<Background
					variant={BackgroundVariant.Dots}
					gap={16}
					size={1}
					color="rgba(0, 0, 0, 0.15)"
					className="dark:!bg-gray-900"
				/>
			</ReactFlow>
		</div>
	);
}

function CascadingList() {
	const items = [
		{ label: "Syntax validation", focus: 0.4 },
		{ label: "MX record lookup", focus: 0.6 },
		{ label: "SMTP verification", focus: 1, active: true },
		{ label: "Disposable detection", focus: 0.6 },
		{ label: "Catch-all detection", focus: 0.4 },
		{ label: "Risk scoring", focus: 0.3 },
	];

	return (
		<div className="space-y-2">
			{items.map((item) => (
				<div
					key={item.label}
					style={{ opacity: item.focus }}
					className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
						item.active
							? "border border-stroke-soft-200 bg-bg-white-0 font-semibold text-text-strong-950 shadow-sm dark:border-gray-700 dark:bg-gray-900"
							: "text-text-sub-600"
					}`}
				>
					<div
						className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
							item.active
								? "bg-text-strong-950/10 text-text-strong-950"
								: "bg-bg-soft-200/50 text-text-sub-600"
						}`}
					>
						<Icon name="workflow" className="h-4 w-4" />
					</div>
					<span className={item.active ? "text-sm" : "text-sm"}>
						{item.label}
					</span>
				</div>
			))}

			{/* 3D Illustration box */}
			<div className="mt-4 flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-gray-800 dark:to-gray-900">
				<div className="relative">
					<svg
						width="48"
						height="48"
						viewBox="0 0 48 48"
						className="text-text-strong-950"
					>
						<motion.path
							d="M24 4L4 16v16l20 12 20-12V16L24 4z"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinejoin="round"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{
								duration: 2,
								ease: "easeInOut",
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "loop",
								repeatDelay: 1,
							}}
						/>
						<motion.path
							d="M4 16l20 12M24 28l20-12M24 28v16"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinejoin="round"
							opacity={0.5}
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{
								duration: 1.5,
								ease: "easeInOut",
								delay: 0.5,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "loop",
								repeatDelay: 1.5,
							}}
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}

export function HowItWorks() {
	return (
		<div className="border-stroke-soft-100/60 border-t border-b dark:border-stroke-soft-100/40">
			<div className="mx-auto max-w-5xl border-stroke-soft-100/60 border-r border-l dark:border-stroke-soft-100/40">
				{/* Sticky Header */}
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100/60 border-b bg-bg-white-0 px-4 py-4 dark:border-stroke-soft-100/40">
					<span className="text-text-sub-600 text-xs">[04] HOW IT WORKS</span>
					<span className="text-text-sub-600 text-xs">/ OPENLY</span>
				</div>

				{/* Hero Title Section */}
				<div className="flex flex-col items-center gap-4 border-stroke-soft-100/60 border-b px-6 py-10 text-center md:py-12 dark:border-stroke-soft-100/40">
					{/* Heading */}
					<div className="space-y-2">
						<h2 className="font-semibold text-2xl text-text-sub-600 md:text-3xl">
							How email verification{" "}
							<span className="text-text-strong-950">works</span>
						</h2>
						<p className="mx-auto max-w-md text-sm text-text-sub-600">
							Every step is transparent. All logic lives in our open-source
							core.
						</p>
					</div>
				</div>

				{/* Flowchart Section - 3 columns with borders */}
				<div className="flex h-full items-stretch border-stroke-soft-100 dark:border-stroke-soft-100/60">
					{/* Column 1: Left side content label */}
					<div className="hidden flex-1 border-stroke-soft-100/60 border-r px-6 py-12 md:block md:px-10 md:py-16 dark:border-stroke-soft-200/40">
						<div className="sticky top-[106px]">
							<h3 className="font-semibold text-lg text-text-strong-950">
								Verify everything
							</h3>
							<p className="mt-2 font-medium text-text-sub-600 leading-relaxed">
								No black boxes. See the exact signals behind every decision —
								not just a pass/fail.
							</p>
							<Button.Root
								variant="neutral"
								mode="stroke"
								size="xsmall"
								asChild
								className="mt-4"
							>
								<a href="/docs/api">
									Explore API docs
									<Button.Icon
										as={Icon}
										name="arrow-left"
										className="h-3 w-3 rotate-180"
									/>
								</a>
							</Button.Root>
						</div>
					</div>

					{/* Column 2: Main Flowchart */}
					<div className="relative flex flex-1 flex-col items-center border-stroke-soft-100/60 border-r px-6 py-12 md:px-10 md:py-16 dark:border-stroke-soft-100/40">
						<DotPattern className="absolute inset-0 top-2 right-1 left-3 z-0" />
						<div className="z-10 mb-2 flex items-center gap-2 text-text-sub-600 text-xs">
							<Icon name="flash" className="h-3.5 w-3.5" />
							<span>Verification Pipeline</span>
							<div className="rounded-full bg-text-strong-950/10 px-2 py-0.5 font-medium text-[10px] text-text-strong-950">
								Automated
							</div>
						</div>

						{/* Initial Validated badge */}
						<div className="z-10 mb-3 flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/5 px-2.5 py-0.5 font-medium text-[10px] text-green-600">
							✓ Validated
						</div>

						{/* React Flow Pipeline */}
						<VerificationPipelineFlow />
					</div>

					{/* Column 3: Cascading List */}
					<div className="hidden flex-1 px-6 py-12 md:block md:px-10 md:py-16">
						<div className="sticky top-[106px]">
							<CascadingList />
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex flex-col items-center gap-3 border-stroke-soft-100/60 border-t px-6 py-8 text-center md:px-10 md:py-10 dark:border-stroke-soft-100/40">
					<div className="flex items-center gap-2">
						<Icon name="open-source" className="h-5 w-5 text-text-strong-950" />
						<span className="font-semibold text-text-strong-950">
							All logic lives in the open-source code
						</span>
					</div>
					<a
						href="https://github.com/reloop-labs/verifio"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-white-0 px-5 py-2 font-medium text-sm text-text-strong-950 transition-all hover:scale-[1.02] hover:bg-bg-soft-200 active:scale-[0.98]"
					>
						<Icon name="open-source" className="h-4 w-4" />
						View on GitHub
					</a>
				</div>
			</div>
		</div>
	);
}

export default HowItWorks;
