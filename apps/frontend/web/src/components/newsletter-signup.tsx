"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import * as Button from "@verifio/ui/button";
import * as Input from "@verifio/ui/input";
import Spinner from "@verifio/ui/spinner";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import * as v from "valibot";

const newsletterSchema = v.object({
	email: v.pipe(
		v.string("Email is required"),
		v.minLength(1, "Email is required"),
		v.email("Please enter a valid email address"),
	),
});

type NewsletterFormData = v.InferInput<typeof newsletterSchema>;

export const NewsletterSignup = () => {
	const [isSubscribed, setIsSubscribed] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<NewsletterFormData>({
		resolver: valibotResolver(newsletterSchema) as Resolver<NewsletterFormData>,
		mode: "onChange",
	});

	const onSubmit = async (data: NewsletterFormData) => {
		// TODO: Add actual subscription logic here
		console.log("Subscribing:", data.email);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		setIsSubscribed(true);
	};

	return (
		<div className="border-stroke-soft-100 border-t px-3 py-4 md:border-t-0 md:border-b md:px-4">
			{isSubscribed ? (
				<motion.div
					className="flex flex-col items-center justify-center py-4 text-center"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
				>
					<motion.div
						className="flex items-center justify-center rounded-full bg-primary-100"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							delay: 0.1,
							type: "spring",
							stiffness: 200,
							damping: 15,
						}}
					>
						<svg
							className="size-6 text-primary-base"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<motion.polyline
								points="4 12 9 17 20 6"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
							/>
						</svg>
					</motion.div>
					<motion.p
						className="mt-1 font-semibold text-text-strong-950"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.55, duration: 0.3 }}
					>
						You&apos;re in!
					</motion.p>
					<motion.p
						className="mt-1 text-sm text-text-sub-600"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.65, duration: 0.3 }}
					>
						Thanks for subscribing. We&apos;ll keep you updated.
					</motion.p>
				</motion.div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)}>
					<p className="font-medium text-sm text-text-strong-950">
						Stay updated
					</p>
					<p className="mt-1 text-text-sub-600 text-xs">
						Get email deliverability tips & product updates
					</p>
					<div className="mt-4 flex gap-2">
						<div className="min-w-0 flex-1">
							<Input.Root size="small" hasError={!!errors.email}>
								<Input.Wrapper>
									<Input.Input
										type="email"
										placeholder="Enter your email"
										{...register("email")}
									/>
								</Input.Wrapper>
							</Input.Root>
						</div>
						<Button.Root
							type="submit"
							variant="neutral"
							size="small"
							className="min-w-[90px] shrink-0"
							disabled={isSubmitting}
						>
							{isSubmitting ? <Spinner size={16} /> : "Subscribe"}
						</Button.Root>
					</div>
					{errors.email && (
						<p className="mt-1.5 text-error-base text-xs">
							{errors.email.message}
						</p>
					)}
				</form>
			)}
		</div>
	);
};
