"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import * as Input from "@verifio/ui/input";
import * as Label from "@verifio/ui/label";
import Spinner from "@verifio/ui/spinner";
import { useLoading } from "@verifio/ui/use-loading";
import { useCallback, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";

const forgotPasswordSchema = v.object({
	email: v.pipe(
		v.string("Email is required"),
		v.minLength(1, "Email is required"),
		v.email("Please enter a valid email address"),
	),
});

type ForgotPasswordFormData = v.InferInput<typeof forgotPasswordSchema>;

// Static SVG hoisted outside component
const SuccessCheckIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-8 w-8 text-success-600"
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M5 13l4 4L19 7"
		/>
	</svg>
);

export const ForgotPasswordForm = () => {
	const [emailSent, setEmailSent] = useState(false);
	const { changeStatus, status } = useLoading();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<ForgotPasswordFormData>({
		resolver: valibotResolver(
			forgotPasswordSchema,
		) as Resolver<ForgotPasswordFormData>,
		mode: "onChange",
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		try {
			changeStatus("loading");
			const result = await authClient.requestPasswordReset({
				email: data.email,
				redirectTo: `${window.location.origin}/reset-password`,
			});

			if (result.error) {
				changeStatus("idle");
				toast.error(result.error.message || "Failed to send reset email");
				return;
			}

			setEmailSent(true);
		} catch {
			changeStatus("idle");
			toast.error("An unexpected error occurred. Please try again.");
		}
	};

	const handleSendAnother = useCallback(() => {
		setEmailSent(false);
		changeStatus("idle");
	}, [changeStatus]);

	if (emailSent) {
		return (
			<div className="flex w-full flex-col gap-4 px-4 text-center">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
					{SuccessCheckIcon}
				</div>
				<div className="space-y-2">
					<h3 className="font-medium text-text-strong-950 text-title-h6">
						Check your email
					</h3>
					<p className="text-paragraph-sm text-text-sub-600">
						We've sent a password reset link to your email address. Please check
						your inbox and follow the instructions.
					</p>
				</div>
				<Button.Root
					onClick={handleSendAnother}
					mode="stroke"
					className="w-full rounded-full"
				>
					Send another email
				</Button.Root>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full flex-col gap-3 px-4"
		>
			<div className="flex flex-col gap-1">
				<Label.Root htmlFor="email">Email</Label.Root>
				<Input.Root hasError={!!errors.email} size="small">
					<Input.Wrapper>
						<Input.Input
							id="email"
							type="email"
							placeholder="hello@verifio.email"
							{...register("email")}
						/>
					</Input.Wrapper>
				</Input.Root>
				{errors.email && (
					<p className="text-error-base text-sm">{errors.email.message}</p>
				)}
			</div>

			<Button.Root
				type="submit"
				disabled={status === "loading" || !isValid}
				className="w-full rounded-full"
			>
				{status === "loading" && <Spinner color="var(--text-strong-950)" />}
				{status === "loading" ? "Sending..." : "Send Reset Link"}
			</Button.Root>
		</form>
	);
};
