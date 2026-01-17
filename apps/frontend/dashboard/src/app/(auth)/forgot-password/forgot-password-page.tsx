"use client";

import * as LinkButton from "@verifio/ui/link-button";
import { LogoName } from "@verifio/ui/logo";
import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export const ForgotPasswordPage = () => {
	return (
		<div className="flex h-dvh flex-col items-center">
			<div className="flex h-full w-full max-w-md flex-col items-center justify-center gap-6 border border-stroke-soft-200/50">
				<div className="relative h-px w-full">
					<div className="-translate-x-1/2 absolute left-1/2 h-px w-screen bg-stroke-soft-200/50" />
				</div>
				<div className="flex w-full items-center justify-center gap-2">
					<LogoName className="h-7" />
				</div>
				<div className="relative h-px w-full">
					<div className="-translate-x-1/2 absolute left-1/2 h-px w-screen bg-stroke-soft-200/50" />
				</div>
				<div className="space-y-1 text-center">
					<div className="font-medium text-text-strong-950 text-title-h5">
						Forgot your password?
					</div>
					<div className="text-paragraph-sm text-text-sub-600">
						No worries, we'll send you reset instructions.
					</div>
				</div>
				<div className="w-full border-stroke-soft-200/50 border-t" />
				<ForgotPasswordForm />
				<div className="w-full border-stroke-soft-200/50 border-t" />
				<div className="flex items-center justify-center gap-1">
					<p className="text-paragraph-sm text-text-sub-600">
						Remember your password?
					</p>
					<Link
						href="/login"
						className={LinkButton.linkButtonVariants({
							variant: "black",
						}).root({ className: "underline" })}
					>
						Sign in
					</Link>
				</div>
				<div className="w-full border-stroke-soft-200/50 border-t" />
			</div>
		</div>
	);
};
