"use client";

import * as Button from "@verifio/ui/button";
import * as Input from "@verifio/ui/input";
import * as Textarea from "@verifio/ui/textarea";
import Spinner from "@verifio/ui/spinner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import type { Resolver } from "react-hook-form";

const contactSchema = v.object({
	email: v.pipe(
		v.string("Email is required"),
		v.minLength(1, "Email is required"),
		v.email("Please enter a valid email address"),
	),
	message: v.pipe(
		v.string("Message is required"),
		v.minLength(10, "Message must be at least 10 characters"),
	),
});

type ContactFormData = v.InferInput<typeof contactSchema>;

export default function ContactPage() {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ContactFormData>({
		resolver: valibotResolver(contactSchema) as Resolver<ContactFormData>,
		mode: "onChange",
	});

	const onSubmit = async (data: ContactFormData) => {
		// TODO: Add actual form submission logic here
		console.log("Submitting:", data);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsSubmitted(true);
	};

	return (
		<div>

			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] CONTACT</span>
						<span className="text-sm text-text-sub-600">/ GET IN TOUCH</span>
					</div>
					<div className="px-10 py-12 text-center">
						<h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
							Get in touch
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
							Have questions about our email verification service? We'd love to
							help.
						</p>
					</div>
				</div>
			</section>
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="grid gap-0 md:grid-cols-2">
						{/* Contact Form */}
						<div className="border-stroke-soft-100 p-8 md:border-r md:p-10">
							{isSubmitted ? (
								<div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
									<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
										<svg
											className="size-8 text-primary-base"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<polyline points="4 12 9 17 20 6" />
										</svg>
									</div>
									<h3 className="font-semibold text-text-strong-950 text-xl">
										Message sent!
									</h3>
									<p className="mt-2 text-text-sub-600">
										We'll get back to you within 24 hours.
									</p>
								</div>
							) : (
								<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
									{/* Email */}
									<div>
										<label
											htmlFor="email"
											className="block font-medium text-sm text-text-strong-950"
										>
											Email Address
										</label>
										<div className="mt-2">
											<Input.Root size="medium" hasError={!!errors.email}>
												<Input.Wrapper>
													<Input.Input
														id="email"
														type="email"
														placeholder="you@example.com"
														{...register("email")}
													/>
												</Input.Wrapper>
											</Input.Root>
										</div>
										{errors.email && (
											<p className="mt-1.5 text-error-base text-xs">
												{errors.email.message}
											</p>
										)}
									</div>

									{/* Message */}
									<div>
										<label
											htmlFor="message"
											className="block font-medium text-sm text-text-strong-950"
										>
											How can we help?
										</label>
										<div className="mt-2">
											<Textarea.Root
												simple
												id="message"
												placeholder="Tell us what we can help you with"
												hasError={!!errors.message}
												{...register("message")}
											/>
										</div>
										{errors.message && (
											<p className="mt-1.5 text-error-base text-xs">
												{errors.message.message}
											</p>
										)}
									</div>

									{/* Submit Button */}
									<Button.Root
										type="submit"
										variant="primary"
										size="medium"
										className="w-full"
										disabled={isSubmitting}
									>
										{isSubmitting ? <Spinner size={16} /> : "Send Message"}
									</Button.Root>
								</form>
							)}
						</div>

						{/* Contact Info - Box Style */}
						<div>
							<h2 className="border-stroke-soft-100 border-b px-6 py-6 font-semibold text-text-strong-950 text-xl">
								Get in touch
							</h2>

							{/* Chat to us */}
							<a
								href="mailto:hello@verifio.com"
								className="flex items-center gap-4 border-stroke-soft-100 border-b p-6 transition-colors hover:bg-bg-weak-50"
							>
								<div className="flex size-10 items-center justify-center rounded-full bg-primary-100">
									<svg
										className="size-5 text-primary-base"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
										<polyline points="22,6 12,13 2,6" />
									</svg>
								</div>
								<div>
									<h3 className="font-medium text-text-strong-950">Chat to us</h3>
									<p className="text-sm text-text-sub-600">
										hello@verifio.com
									</p>
								</div>
							</a>

							{/* Call us */}
							<a
								href="tel:+995555555555"
								className="flex items-center gap-4 border-stroke-soft-100 border-b p-6 transition-colors hover:bg-bg-weak-50"
							>
								<div className="flex size-10 items-center justify-center rounded-full bg-primary-100">
									<svg
										className="size-5 text-primary-base"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
									</svg>
								</div>
								<div>
									<h3 className="font-medium text-text-strong-950">Call us</h3>
									<p className="text-sm text-text-sub-600">
										(+995) 555-55-55-55
									</p>
								</div>
							</a>
						</div>
					</div>
				</div>
			</section>
			<div className="h-10">

			</div>
		</div>
	);
}
