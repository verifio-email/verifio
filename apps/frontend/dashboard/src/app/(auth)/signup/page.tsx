"use client";
import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import * as LinkButton from "@verifio/ui/link-button";
import { LogoName } from "@verifio/ui/logo";
import Spinner from "@verifio/ui/spinner";
import Link from "next/link";
import { useCallback, useState } from "react";
import { SignupForm } from "./signup-form";

// [rendering-hoist-jsx] Static SVG hoisted outside component to avoid recreation on every render
const GoogleIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none">
		<path
			fill="#4280EF"
			d="M14.117 7.661c0-.456-.045-.926-.118-1.368H7.63v2.604h3.648a3.07 3.07 0 0 1-1.353 2.044l2.177 1.692c1.28-1.192 2.015-2.927 2.015-4.972"
		/>
		<path
			fill="#34A353"
			d="M7.63 14.252c1.824 0 3.354-.604 4.472-1.633l-2.177-1.677c-.603.412-1.383.647-2.295.647-1.765 0-3.25-1.191-3.794-2.78L1.6 10.53a6.74 6.74 0 0 0 6.03 3.722"
		/>
		<path
			fill="#F6B704"
			d="M3.836 8.794a4.1 4.1 0 0 1 0-2.588L1.6 4.47a6.76 6.76 0 0 0 0 6.06z"
		/>
		<path
			fill="#E54335"
			d="M7.63 3.426A3.68 3.68 0 0 1 10.22 4.44L12.146 2.5A6.5 6.5 0 0 0 7.63.749a6.74 6.74 0 0 0-6.03 3.72l2.236 1.736c.544-1.603 2.03-2.78 3.794-2.78"
		/>
	</svg>
);

type LoadingState = {
	name: "google" | "github" | "email";
	loading: boolean;
};

const Page = () => {
	const [loading, setLoading] = useState<LoadingState>({
		name: "email",
		loading: false,
	});
	const [error, setError] = useState<string | null>(null);

	// [rerender-memo] Stable callback extracted to avoid recreation on every render
	const handleGoogleSignIn = useCallback(async () => {
		try {
			setLoading({ name: "google", loading: true });
			setError(null);
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/dashboard",
			});
		} catch {
			setLoading({ name: "google", loading: false });
			setError("Failed to signup with Google");
		}
	}, []);

	// [rerender-memo] Stable callback extracted to avoid recreation on every render
	const handleGithubSignIn = useCallback(async () => {
		try {
			setLoading({ name: "github", loading: true });
			setError(null);
			await authClient.signIn.social({
				provider: "github",
				callbackURL: "/",
			});
		} catch {
			setLoading({ name: "github", loading: false });
			setError("Failed to signup with GitHub");
		}
	}, []);

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
						Create your account
					</div>
					<div className="text-paragraph-sm text-text-sub-600">
						By creating an account, you agree to our T&C.
					</div>
				</div>
				<div className="w-full border-stroke-soft-200/50 border-t" />
				<SignupForm />
				<div className="w-full border-stroke-soft-200/50 border-t" />

				{/* Display error message if OAuth fails */}
				{error && (
					<div className="w-full px-4">
						<p className="text-center text-error-base text-sm">{error}</p>
					</div>
				)}

				<div className="grid w-full grid-cols-2 gap-2 px-4">
					<Button.Root
						mode="stroke"
						disabled={loading.loading}
						onClick={handleGoogleSignIn}
						variant="neutral"
						className="w-full rounded-full"
					>
						{loading.name === "google" && loading.loading ? (
							<Spinner color="var(--text-strong-950)" size={16} />
						) : (
							GoogleIcon
						)}
						<span>Continue with Google</span>
					</Button.Root>
					<Button.Root
						disabled={loading.loading}
						mode="stroke"
						className="w-full rounded-full"
						onClick={handleGithubSignIn}
					>
						{loading.name === "github" && loading.loading ? (
							<Spinner color="var(--text-strong-950)" size={16} />
						) : (
							<Icon name="github" className="h-5 w-5" />
						)}
						Continue with GitHub
					</Button.Root>
				</div>
				<div className="w-full border-stroke-soft-200/50 border-t" />
				<div className="flex items-center justify-center gap-1">
					<p className="text-paragraph-sm text-text-sub-600">
						Already have an account?
					</p>
					<Link
						href="/login"
						className={LinkButton.linkButtonVariants({
							variant: "black",
						}).root({ className: "underline" })}
					>
						Login
					</Link>
				</div>
				<div className="w-full border-stroke-soft-200/50 border-t" />
			</div>
		</div>
	);
};

export default Page;
