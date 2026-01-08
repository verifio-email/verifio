"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import * as v from "valibot";

// Valibot schema for email validation
const emailVerifySchema = v.object({
	email: v.pipe(
		v.string("Email is required"),
		v.minLength(1, "Email address is required"),
		v.custom<string>((value) => {
			if (typeof value !== "string") return false;
			const normalizedEmail = value.trim().toLowerCase();

			// Check for @ symbol
			if (!normalizedEmail.includes("@")) return false;

			// Split into local and domain parts
			const atIndex = normalizedEmail.lastIndexOf("@");
			const localPart = normalizedEmail.substring(0, atIndex);
			const domainPart = normalizedEmail.substring(atIndex + 1);

			// Validate local part
			if (localPart.length === 0) return false;

			// Validate domain part
			if (domainPart.length === 0) return false;

			// Check domain has at least one dot (TLD)
			if (!domainPart.includes(".")) return false;

			// Check for leading/trailing dots or hyphens in domain
			if (
				domainPart.startsWith(".") ||
				domainPart.endsWith(".") ||
				domainPart.startsWith("-") ||
				domainPart.endsWith("-")
			) {
				return false;
			}

			// Check TLD length (min 2 characters)
			const tld = domainPart.split(".").pop() || "";
			if (tld.length < 2) return false;

			// Check for consecutive dots
			if (normalizedEmail.includes("..")) return false;

			return true;
		}, "Please enter a valid email address"),
	),
});

type EmailVerifyFormData = v.InferInput<typeof emailVerifySchema>;

interface EmailVerifyInputProps {
	onVerify: (email: string) => void | Promise<void>;
}

export const EmailVerifyInput = ({ onVerify }: EmailVerifyInputProps) => {
	const [isVerifying, setIsVerifying] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EmailVerifyFormData>({
		resolver: valibotResolver(
			emailVerifySchema,
		) as Resolver<EmailVerifyFormData>,
		mode: "onChange",
	});

	const onSubmit = async (data: EmailVerifyFormData) => {
		setIsVerifying(true);
		try {
			await onVerify(data.email.trim());
		} finally {
			setIsVerifying(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{/* Single Email Input */}
			<div className="p-3">
				<Input.Root
					className="h-12 rounded-xl! text-lg"
					hasError={!!errors.email}
				>
					<Input.Wrapper>
						<Input.Icon as={Icon} name="mail-single" />
						<Input.Input
							placeholder="email@example.com"
							{...register("email")}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleSubmit(onSubmit)();
								}
							}}
						/>
						<button
							type="submit"
							disabled={isVerifying}
							className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-base text-static-white transition-all duration-200 hover:bg-primary-darker active:scale-[0.95] disabled:opacity-50"
							aria-label="Verify email"
						>
							{isVerifying ? (
								<Icon name="loader" className="h-4 w-4 animate-spin" />
							) : (
								<Icon name="arrow-left" className="h-4 w-4 rotate-180" />
							)}
						</button>
					</Input.Wrapper>
				</Input.Root>
			</div>

			{/* Validation Error Display - like Firecrawl */}
			{errors.email && (
				<div className="flex items-center gap-2 border-stroke-soft-200/50 px-3">
					<Icon
						name="alert-triangle"
						className="h-4 w-4 shrink-0 text-error-base"
					/>
					<span className="text-error-base text-sm">
						{errors.email.message}
					</span>
				</div>
			)}
		</form>
	);
};
