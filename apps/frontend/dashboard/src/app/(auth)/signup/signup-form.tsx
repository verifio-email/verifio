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
		try {
			changeStatus("loading");
			const mode = "dev";
			const { email, password } = data;
			const auth = await authClient.signUp.email({
				email,
				password,
				name: email.split("@")[0] || "",
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

			// Create organization using email username
			const username = email.split("@")[0] || "workspace";
			const orgName = username.charAt(0).toUpperCase() + username.slice(1);
			const randomSuffix = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
			const slug = `org-${randomSuffix}`;

			try {
				const org = await authClient.organization.create({
					name: orgName,
					slug: slug,
				});

				if (org.data) {
					await authClient.organization.setActive({
						organizationId: org.data.id,
					});
					await authClient.updateUser({
						activeOrganizationId: org.data.id,
					});
					router.push(`/${org.data.slug}`);
				} else {
					router.push("/");
				}
			} catch {
				console.log("hello");
			}
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
				{errors.password ? (
					<p className="text-error-base text-sm">{errors.password.message}</p>
				) : (
					<p className="text-paragraph-sm text-text-sub-600">
						Min. 8 characters with mixed case and a number
					</p>
				)}
			</div>
			<Button.Root
				type="submit"
				disabled={status === "loading" || !isValid}
				className="w-full rounded-full"
			>
				{status === "loading" && <Spinner color="var(--text-strong-950)" />}
				{status === "loading" ? "Creating account..." : "Create Account"}
			</Button.Root>
		</form>
	);
};
