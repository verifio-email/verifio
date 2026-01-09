import {
	getStateBadge,
	getStateColor,
} from "@fe/dashboard/utils/verification-state";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { AnimatePresence, motion } from "framer-motion";
import type { VerificationResult } from "../types";

interface VerificationResultCardProps {
	result: VerificationResult;
}

export const VerificationResultCard = ({
	result,
}: VerificationResultCardProps) => {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				className="border-stroke-soft-200/50 border-b"
			>
				<div className="px-52 2xl:px-[350px]">
					<div className="border-stroke-soft-200/50 border-r border-l px-7 py-8">
						<div className="mx-auto max-w-3xl">
							<h3 className="mb-4 font-semibold text-lg text-text-strong-950">
								Verification Result
							</h3>

							{/* Main Result Card */}
							<div className="overflow-hidden rounded-xl border border-stroke-soft-200/50 bg-bg-white-0">
								{/* Header with email and score */}
								<div className="flex items-center justify-between border-stroke-soft-200/50 border-b p-4">
									<div className="flex items-center gap-3">
										<div
											className={cn(
												"flex h-10 w-10 items-center justify-center rounded-lg",
												result.state === "deliverable"
													? "bg-success-alpha-10"
													: result.state === "risky"
														? "bg-warning-alpha-10"
														: "bg-error-alpha-10",
											)}
										>
											<Icon
												name={
													result.state === "deliverable"
														? "check-circle"
														: result.state === "risky"
															? "alert-triangle"
															: "x-circle"
												}
												className={cn(
													"h-5 w-5",
													result.state === "deliverable"
														? "text-success-base"
														: result.state === "risky"
															? "text-warning-base"
															: "text-error-base",
												)}
											/>
										</div>
										<div>
											<p className="font-medium font-mono text-text-strong-950">
												{result.email}
											</p>
											<div className="mt-0.5 flex items-center gap-2">
												<span
													className={cn(
														"rounded-full px-2 py-0.5 font-medium text-xs",
														getStateBadge(result.state),
													)}
												>
													{result.state.charAt(0).toUpperCase() +
														result.state.slice(1)}
												</span>
												<span className="text-text-soft-400 text-xs">
													{result.reason.replace(/_/g, " ")}
												</span>
											</div>
										</div>
									</div>
									<div className="text-right">
										<p
											className={cn(
												"font-bold text-3xl",
												getStateColor(result.state),
											)}
										>
											{result.score}
										</p>
										<p className="text-text-soft-400 text-xs">Quality Score</p>
									</div>
								</div>

								{/* Checks Grid */}
								<div className="grid grid-cols-3 gap-px bg-stroke-soft-200/50">
									{/* Syntax Check */}
									<div className="bg-bg-white-0 p-3">
										<div className="flex items-center gap-2">
											<Icon
												name={result.checks.syntax.valid ? "check" : "x"}
												className={cn(
													"h-4 w-4",
													result.checks.syntax.valid
														? "text-success-base"
														: "text-error-base",
												)}
											/>
											<span className="text-sm text-text-sub-600">
												Syntax Valid
											</span>
										</div>
									</div>

									{/* MX Records */}
									<div className="bg-bg-white-0 p-3">
										<div className="flex items-center gap-2">
											<Icon
												name={result.checks.dns.hasMx ? "check" : "x"}
												className={cn(
													"h-4 w-4",
													result.checks.dns.hasMx
														? "text-success-base"
														: "text-error-base",
												)}
											/>
											<span className="text-sm text-text-sub-600">
												MX Records
											</span>
										</div>
									</div>

									{/* Domain Exists */}
									<div className="bg-bg-white-0 p-3">
										<div className="flex items-center gap-2">
											<Icon
												name={result.checks.dns.domainExists ? "check" : "x"}
												className={cn(
													"h-4 w-4",
													result.checks.dns.domainExists
														? "text-success-base"
														: "text-error-base",
												)}
											/>
											<span className="text-sm text-text-sub-600">
												Domain Exists
											</span>
										</div>
									</div>

									{/* Disposable */}
									<div className="bg-bg-white-0 p-3">
										<div className="flex items-center gap-2">
											<Icon
												name={
													result.checks.disposable.isDisposable
														? "alert-triangle"
														: "check"
												}
												className={cn(
													"h-4 w-4",
													result.checks.disposable.isDisposable
														? "text-warning-base"
														: "text-success-base",
												)}
											/>
											<span className="text-sm text-text-sub-600">
												{result.checks.disposable.isDisposable
													? "Disposable"
													: "Not Disposable"}
											</span>
										</div>
									</div>

									{/* Role-based */}
									<div className="bg-bg-white-0 p-3">
										<div className="flex items-center gap-2">
											<Icon
												name={
													result.checks.role.isRole ? "alert-triangle" : "check"
												}
												className={cn(
													"h-4 w-4",
													result.checks.role.isRole
														? "text-warning-base"
														: "text-success-base",
												)}
											/>
											<span className="text-sm text-text-sub-600">
												{result.checks.role.isRole
													? `Role (${result.checks.role.role})`
													: "Personal Email"}
											</span>
										</div>
									</div>

									{/* Free Provider */}
									<div className="bg-bg-white-0 p-3">
										<div className="flex items-center gap-2">
											<Icon
												name="info"
												className="h-4 w-4 text-text-soft-400"
											/>
											<span className="text-sm text-text-sub-600">
												{result.checks.freeProvider.isFree
													? result.checks.freeProvider.provider
													: "Business Email"}
											</span>
										</div>
									</div>
								</div>

								{/* Analytics Section */}
								<div className="border-stroke-soft-200/50 border-t p-4">
									<div className="flex flex-wrap gap-4 text-sm">
										<div>
											<span className="text-text-soft-400">Risk Level:</span>
											<span
												className={cn(
													"ml-2 font-medium",
													result.analytics.riskLevel === "low"
														? "text-success-base"
														: result.analytics.riskLevel === "medium"
															? "text-warning-base"
															: "text-error-base",
												)}
											>
												{result.analytics.riskLevel.toUpperCase()}
											</span>
										</div>
										{result.analytics.smtpProvider && (
											<div>
												<span className="text-text-soft-400">Provider:</span>
												<span className="ml-2 text-text-strong-950">
													{result.analytics.smtpProvider}
												</span>
											</div>
										)}
										<div>
											<span className="text-text-soft-400">Verified in:</span>
											<span className="ml-2 text-text-strong-950">
												{result.duration}ms
											</span>
										</div>
									</div>

									{/* Did you mean? */}
									{result.analytics.didYouMean && (
										<div className="flex items-center gap-2 rounded-lg bg-primary-alpha-10 px-3 py-2">
											<Icon
												name="lightbulb-single"
												className="h-4 w-4 text-primary-base"
											/>
											<span className="text-primary-darker text-sm">
												Did you mean:{" "}
												<span className="font-medium">
													{result.analytics.didYouMean}
												</span>
												?
											</span>
										</div>
									)}

									{/* Warnings */}
									{result.analytics.warnings.length > 0 && (
										<div className="mt-3 flex flex-wrap gap-2">
											{result.analytics.warnings.map((warning) => (
												<span
													key={warning}
													className="rounded-full bg-warning-alpha-10 px-2 py-0.5 text-warning-base text-xs"
												>
													{warning.replace(/_/g, " ")}
												</span>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};
