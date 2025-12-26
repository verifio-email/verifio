"use client";

import {
	Apple,
	BraveBrowser,
	Chrome,
	Edge,
	Firefox,
	Opera,
	Safari,
	Ubuntu,
	Windows,
} from "@fe/dashboard/app/(protected)/[orgSlug]/settings/security/session-icons";
import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import { Icon } from "@verifio/ui/icon";
import { Skeleton } from "@verifio/ui/skeleton";
import Spinner from "@verifio/ui/spinner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

interface Session {
	id: string;
	token: string;
	userId: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
	ipAddress?: string | null;
	userAgent?: string | null;
}

interface SessionManagementProps {
	className?: string;
}

// Parse user agent to extract browser, device type, and OS info
const parseUserAgent = (userAgent: string | null | undefined) => {
	if (!userAgent)
		return { browser: "Unknown", device: "Unknown", isMobile: false };

	let browser = "Unknown";
	let device = "Unknown";
	let isMobile = false;

	// Detect browser
	if (userAgent.includes("Brave")) {
		browser = "Brave";
	} else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
		browser = "Chrome";
	} else if (userAgent.includes("Firefox")) {
		browser = "Firefox";
	} else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
		browser = "Safari";
	} else if (userAgent.includes("Edg")) {
		browser = "Edge";
	} else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
		browser = "Opera";
	}

	// Detect device/OS
	if (userAgent.includes("Mac OS X")) {
		device = "macOS";
	} else if (userAgent.includes("Windows")) {
		device = "Windows";
	} else if (userAgent.includes("Ubuntu")) {
		device = "Ubuntu";
	} else if (userAgent.includes("Linux") && !userAgent.includes("Android")) {
		device = "Linux";
	} else if (userAgent.includes("Android")) {
		device = "Android";
		isMobile = true;
	} else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
		device = "iOS";
		isMobile = userAgent.includes("iPhone");
	}

	// Also check for mobile indicators
	if (userAgent.includes("Mobile") || userAgent.includes("Android")) {
		isMobile = true;
	}

	return { browser, device, isMobile };
};

export const SessionManagement = ({ className }: SessionManagementProps) => {
	const [terminatingSession, setTerminatingSession] = useState<string | null>(
		null,
	);
	const [terminatingAll, setTerminatingAll] = useState(false);
	const { data: currentSession } = authClient.useSession();

	const {
		data: sessions = [],
		isLoading: loading,
		mutate,
	} = useSWR<Session[]>(
		"active-sessions",
		async () => {
			const { data, error } = await authClient.listSessions();
			if (error) {
				throw new Error(error.message || "Failed to fetch sessions");
			}
			return data || [];
		},
		{
			revalidateOnFocus: false,
			onError: () => {
				toast.error("Failed to load sessions");
			},
		},
	);

	const handleTerminateSession = async (token: string) => {
		setTerminatingSession(token);
		try {
			const { error } = await authClient.revokeSession({ token });

			if (error) {
				throw new Error(error.message || "Failed to terminate session");
			}

			mutate(
				sessions.filter((session) => session.token !== token),
				false,
			);
			toast.success("Session terminated successfully");
		} catch (error) {
			toast.error("Failed to terminate session");
		} finally {
			setTerminatingSession(null);
		}
	};

	const handleTerminateAllSessions = async () => {
		setTerminatingAll(true);
		try {
			const { error } = await authClient.revokeOtherSessions();

			if (error) {
				throw new Error(error.message || "Failed to terminate sessions");
			}

			// Keep only the current session
			mutate(
				sessions.filter(
					(session) => session.token === currentSession?.session?.token,
				),
				false,
			);
			toast.success("All other sessions terminated successfully");
		} catch (error) {
			toast.error("Failed to terminate all sessions");
		} finally {
			setTerminatingAll(false);
		}
	};

	// Get browser icon component
	const getBrowserIcon = (browser: string) => {
		const iconClass = "h-full w-full";
		switch (browser) {
			case "Chrome":
				return <Chrome className={iconClass} />;
			case "Firefox":
				return <Firefox className={iconClass} />;
			case "Safari":
				return <Safari className={iconClass} />;
			case "Edge":
				return <Edge className={iconClass} />;
			case "Opera":
				return <Opera className={iconClass} />;
			case "Brave":
				return <BraveBrowser className={iconClass} />;
			default:
				return (
					<Icon name="globe" className="h-full w-full text-text-sub-600" />
				);
		}
	};

	const formatTimeAgo = (date: Date) => {
		const now = new Date();
		const dateObj = new Date(date);
		const diffInHours = Math.floor(
			(now.getTime() - dateObj.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) {
			return "just now";
		}
		if (diffInHours < 24) {
			return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
		}
		const diffInDays = Math.floor(diffInHours / 24);
		return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
	};

	const isCurrentSession = (session: Session) => {
		return session.token === currentSession?.session?.token;
	};

	if (loading) {
		return (
			<div className={cn("space-y-4", className)}>
				<div className="flex items-center justify-between">
					<div>
						<p className="font-medium text-label-md text-text-strong-950">
							Active Sessions
						</p>
						<p className="text-paragraph-sm text-text-sub-600">
							Monitor and manage all your active sessions.
						</p>
					</div>
				</div>

				{/* Skeleton Cards */}
				<div className="space-y-3">
					{Array.from({ length: 2 }).map((_, index) => (
						<div
							key={`skeleton-${index}`}
							className="flex items-center justify-between rounded-xl border border-stroke-soft-200/50 p-4"
						>
							<div className="flex items-center gap-4">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-48" />
								</div>
							</div>
							<Skeleton className="h-8 w-20 rounded-lg" />
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className={cn("", className)}>
			<div className="flex items-center justify-between px-5 pt-5 pb-4 lg:px-6">
				<div>
					<p className="font-medium text-label-md text-text-strong-950">
						Active Sessions
					</p>
					<p className="text-paragraph-sm text-text-sub-600">
						Monitor and manage all your active sessions.
					</p>
				</div>
				{sessions.length > 1 && (
					<Button.Root
						variant="error"
						mode="lighter"
						size="xsmall"
						onClick={handleTerminateAllSessions}
						disabled={terminatingAll}
					>
						{terminatingAll ? (
							<Spinner size={14} color="var(--error-base)" />
						) : (
							<Icon name="logout" className="h-4 w-4" />
						)}
						Revoke All
					</Button.Root>
				)}
			</div>

			<AnimatePresence mode="wait">
				<div>
					{sessions.map((session, index) => {
						const { browser, device, isMobile } = parseUserAgent(
							session.userAgent,
						);
						const isCurrent = isCurrentSession(session);

						return (
							<motion.div
								key={
									session.id ? `session-${session.id}` : `session-idx-${index}`
								}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2, delay: index * 0.05 }}
								className="relative"
							>
								{/* Top border extending to edges */}
								<div className="relative">
									<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
								</div>
								<div
									className={cn(
										"group flex items-center justify-between px-5 py-4 transition-all lg:px-6",
										isCurrent
											? "bg-success-lighter/30"
											: "hover:bg-bg-weak-50/50",
									)}
								>
									{/* Left: Browser icon and session info */}
									<div className="flex items-center gap-4">
										{/* Browser Icon */}
										<div
											className={cn(
												"flex h-10 w-10 items-center justify-center rounded-full p-2",
												isCurrent ? "bg-success-lighter" : "bg-bg-weak-50",
											)}
										>
											{getBrowserIcon(browser)}
										</div>

										{/* Session Details */}
										<div className="space-y-0.5">
											<div className="flex items-center gap-2">
												<span className="font-medium text-sm text-text-strong-950">
													{browser} on {device}
												</span>
												{isCurrent && (
													<span className="flex items-center gap-1 rounded-full bg-success-base px-2 py-0.5 font-medium text-[10px] text-white">
														<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
														Current
													</span>
												)}
											</div>
											<div className="flex items-center gap-3 text-text-sub-600 text-xs">
												<span className="flex items-center gap-1">
													<Icon
														name={isMobile ? "smartphone" : "monitor"}
														className="h-3 w-3"
													/>
													{isMobile ? "Mobile" : "Desktop"}
												</span>
												{session.ipAddress && (
													<>
														<span className="text-stroke-soft-200">•</span>
														<span className="flex items-center gap-1">
															<Icon name="globe" className="h-3 w-3" />
															{session.ipAddress}
														</span>
													</>
												)}
												<span className="text-stroke-soft-200">•</span>
												<span className="flex items-center gap-1">
													<Icon name="clock" className="h-3 w-3" />
													{formatTimeAgo(session.updatedAt)}
												</span>
											</div>
										</div>
									</div>

									{/* Right: Actions */}
									{!isCurrent && (
										<Button.Root
											variant="error"
											mode="lighter"
											size="xsmall"
											onClick={() => handleTerminateSession(session.token)}
											disabled={terminatingSession === session.token}
										>
											{terminatingSession === session.token ? (
												<Spinner size={12} color="var(--error-base)" />
											) : (
												<>
													<Icon name="x" className="h-3.5 w-3.5" />
													Revoke
												</>
											)}
										</Button.Root>
									)}
								</div>
								{/* Bottom border extending to edges (only for last item) */}
								{index === sessions.length - 1 && (
									<div className="relative">
										<div className="absolute top-0 right-[-100vw] left-0 h-px bg-stroke-soft-200/50" />
									</div>
								)}
							</motion.div>
						);
					})}

					{/* Empty State */}
					{sessions.length === 0 && (
						<motion.div
							className="flex flex-col items-center justify-center px-5 py-12 text-center lg:px-6"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
						>
							<Icon name="shield" className="mb-3 h-8 w-8 text-text-sub-600" />
							<p className="font-medium text-text-strong-950">
								No active sessions
							</p>
							<p className="text-sm text-text-sub-600">
								Your session is the only active one.
							</p>
						</motion.div>
					)}
				</div>
			</AnimatePresence>
		</div>
	);
};
