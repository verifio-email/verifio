"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import * as Label from "@verifio/ui/label";
import Spinner from "@verifio/ui/spinner";
import { useLoading } from "@verifio/ui/use-loading";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";

const signupSchema = v.object({
	name: v.pipe(
		v.string("Name is required"),
		v.minLength(1, "Name is required"),
	),
	email: v.pipe(
		v.string("Email is required"),
		v.minLength(1, "Email is required"),
		v.email("Please enter a valid email address"),
	),
	password: v.pipe(
		v.string("Password is required"),
		v.minLength(1, "Password is required"),
		v.minLength(8, "Password must be at least 8 characters"),
		v.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one lowercase letter, one uppercase letter, and one number",
		),
	),
	confirmPassword: v.pipe(
		v.string("Please confirm your password"),
		v.minLength(1, "Please confirm your password"),
	),
});

type SignupFormData = v.InferInput<typeof signupSchema>;

export const SignupForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { changeStatus, status } = useLoading();

	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = useForm<SignupFormData>({
		resolver: valibotResolver(signupSchema) as Resolver<SignupFormData>,
		mode: "onChange",
	});

	const onSubmit = async (data: SignupFormData) => {
		if (data.password !== data.confirmPassword) {
			setError("confirmPassword", {
				type: "manual",
				message: "Passwords don't match",
			});
			return;
		}

		try {
			changeStatus("loading");
			const mode = "dev";
			const { email, password, name } = data;
			const auth = await authClient.signUp.email({
				email,
				password,
				name,
				mode,
			});
			if (auth.error) {
				changeStatus("idle");
				if (auth.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
					setError("email", {
						type: "manual",
						message: auth.error.message,
					});
				} else {
					toast.error(auth.error.message);
				}
				return;
			}
			router.push("/");
		} catch (e) {
			changeStatus("idle");
			if (e instanceof Error && e.message) {
				toast.error(e.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full flex-col gap-3 px-4"
		>
			<div className="flex flex-col gap-1">
				<Label.Root htmlFor="name">Name</Label.Root>
				<Input.Root hasError={!!errors.name} size="small">
					<Input.Wrapper>
						<Input.Input
							id="name"
							type="text"
							placeholder="John Doe"
							{...register("name")}
						/>
					</Input.Wrapper>
				</Input.Root>
				{errors.name && (
					<p className="text-error-base text-sm">{errors.name.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1">
				<Label.Root htmlFor="email">Email</Label.Root>
				<Input.Root hasError={!!errors.email} size="small">
					<Input.Wrapper>
						<Input.Input
							id="email"
							type="email"
							placeholder="hello@verifio.com"
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
							{...register("password")}
						/>
						<button
							type="button"
							onClick={() => setShowPassword((s) => !s)}
							className="flex items-center justify-center"
						>
							{showPassword ? (
								<Icon
									name="eye-outline"
									className="size-5 fill-none text-text-soft-400 group-has-[disabled]:text-text-disabled-300"
								/>
							) : (
								<Icon
									name="eye-slash-outline"
									className="size-5 fill-none text-text-soft-400 group-has-[disabled]:text-text-disabled-300"
								/>
							)}
						</button>
					</Input.Wrapper>
				</Input.Root>
				{errors.password && (
					<p className="text-error-base text-sm">{errors.password.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1">
				<Label.Root htmlFor="confirmPassword">Confirm Password</Label.Root>
				<Input.Root hasError={!!errors.confirmPassword} size="small">
					<Input.Wrapper>
						<Input.Input
							id="confirmPassword"
							type="password"
							placeholder="••••••••••"
							{...register("confirmPassword")}
						/>
					</Input.Wrapper>
				</Input.Root>
				{errors.confirmPassword && (
					<p className="text-error-base text-sm">
						{errors.confirmPassword.message}
					</p>
				)}
			</div>
			<Button.Root
				type="submit"
				disabled={status === "loading" || !isValid}
				className="mt-4 w-full rounded-full"
			>
				{status === "loading" && <Spinner color="var(--text-strong-950)" />}
				{status === "loading" ? "Creating account..." : "Sign up"}
			</Button.Root>
		</form>
	);
};
