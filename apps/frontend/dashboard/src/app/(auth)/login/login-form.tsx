"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import * as Label from "@verifio/ui/label";
import * as LinkButton from "@verifio/ui/link-button";
import Spinner from "@verifio/ui/spinner";
import { useLoading } from "@verifio/ui/use-loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";

const loginSchema = v.object({
	email: v.pipe(
		v.string("Email is required"),
		v.minLength(1, "Email is required"),
		v.email("Please enter a valid email address"),
	),
	password: v.pipe(
		v.string("Password is required"),
		v.minLength(1, "Password is required"),
	),
});

type LoginFormData = v.InferInput<typeof loginSchema>;

// Shared icon styles
const EYE_ICON_CLASSES =
	"size-5 fill-none text-text-soft-400 group-has-[disabled]:text-text-disabled-300";

export const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { changeStatus, status } = useLoading();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = useForm<LoginFormData>({
		resolver: valibotResolver(loginSchema) as Resolver<LoginFormData>,
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			changeStatus("loading");
			const auth = await authClient.signIn.email({
				email: data.email,
				password: data.password,
			});

			if (auth.error) {
				changeStatus("idle");
				if (auth.error.code === "INVALID_EMAIL_OR_PASSWORD") {
					setError("email", {
						type: "manual",
						message: "Invalid email or password",
					});
				} else {
					toast.error(auth.error.message);
				}
				return;
			}

			router.push("/");
		} catch {
			changeStatus("idle");
			toast.error("An unexpected error occurred. Please try again.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full flex-col gap-3 px-4"
		>
			<div className="flex w-full flex-col gap-1">
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

			<div className="flex flex-col gap-1">
				<Label.Root htmlFor="password">Password</Label.Root>
				<Input.Root hasError={!!errors.password} size="small">
					<Input.Wrapper>
						<Input.Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="••••••••••"
							className="font-medium"
							{...register("password")}
						/>
						<button
							type="button"
							onClick={() => setShowPassword((s) => !s)}
							className="flex items-center justify-center"
						>
							<Icon
								name={showPassword ? "eye-outline" : "eye-slash-outline"}
								className={EYE_ICON_CLASSES}
							/>
						</button>
					</Input.Wrapper>
				</Input.Root>
				{errors.password && (
					<p className="text-error-base text-sm">{errors.password.message}</p>
				)}
				<Link href="/forgot-password" className="flex items-center gap-1">
					<p className="text-paragraph-sm text-text-sub-600">
						Forgot password?
					</p>
					<LinkButton.Root type="button" variant="black">
						Reset it
					</LinkButton.Root>
				</Link>
			</div>

			<Button.Root
				type="submit"
				disabled={status === "loading" || !isValid}
				className="rounded-full"
			>
				{status === "loading" && <Spinner color="var(--text-strong-950)" />}
				{status === "loading" ? "Logging in..." : "Login"}
			</Button.Root>
		</form>
	);
};
