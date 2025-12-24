"use client";

import * as Button from "@verifio/ui/button";
import { useState } from "react";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		company: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsSubmitting(false);
		setIsSubmitted(true);
	};

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
						<span className="text-sm text-text-sub-600">[01] CONTACT</span>
						<span className="text-sm text-text-sub-600">/ GET IN TOUCH</span>
					</div>
					<div className="px-10 py-16 text-center">
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

			{/* Contact Form & Info */}
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
					<div className="grid gap-0 md:grid-cols-3">
						{/* Contact Info */}
						<div className="border-stroke-soft-100 bg-bg-weak-50 p-10 md:border-r">
							<h2 className="font-semibold text-text-strong-950 text-xl">
								Contact Information
							</h2>
							<div className="mt-8 space-y-6">
								<div>
									<p className="font-medium text-sm text-text-sub-600">Email</p>
									<a
										href="mailto:support@verifio.com"
										className="mt-1 text-text-strong-950 hover:text-primary-500"
									>
										support@verifio.com
									</a>
								</div>
								<div>
									<p className="font-medium text-sm text-text-sub-600">Sales</p>
									<a
										href="mailto:sales@verifio.com"
										className="mt-1 text-text-strong-950 hover:text-primary-500"
									>
										sales@verifio.com
									</a>
								</div>
								<div>
									<p className="font-medium text-sm text-text-sub-600">
										Response Time
									</p>
									<p className="mt-1 text-text-strong-950">
										Within 24 hours
									</p>
								</div>
							</div>
						</div>

						{/* Contact Form */}
						<div className="p-10 md:col-span-2">
							{isSubmitted ? (
								<div className="flex h-full flex-col items-center justify-center text-center">
									<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
										<span className="text-2xl text-green-500">✓</span>
									</div>
									<h3 className="font-semibold text-text-strong-950 text-xl">
										Message sent!
									</h3>
									<p className="mt-2 text-text-sub-600">
										We'll get back to you within 24 hours.
									</p>
								</div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid gap-6 md:grid-cols-2">
										<div>
											<label
												htmlFor="name"
												className="block font-medium text-sm text-text-strong-950"
											>
												Name
											</label>
											<input
												id="name"
												type="text"
												required
												value={formData.name}
												onChange={(e) =>
													setFormData({ ...formData, name: e.target.value })
												}
												className="mt-2 w-full rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
											/>
										</div>
										<div>
											<label
												htmlFor="email"
												className="block font-medium text-sm text-text-strong-950"
											>
												Email
											</label>
											<input
												id="email"
												type="email"
												required
												value={formData.email}
												onChange={(e) =>
													setFormData({ ...formData, email: e.target.value })
												}
												className="mt-2 w-full rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
											/>
										</div>
									</div>
									<div className="grid gap-6 md:grid-cols-2">
										<div>
											<label
												htmlFor="company"
												className="block font-medium text-sm text-text-strong-950"
											>
												Company (optional)
											</label>
											<input
												id="company"
												type="text"
												value={formData.company}
												onChange={(e) =>
													setFormData({ ...formData, company: e.target.value })
												}
												className="mt-2 w-full rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
											/>
										</div>
										<div>
											<label
												htmlFor="subject"
												className="block font-medium text-sm text-text-strong-950"
											>
												Subject
											</label>
											<select
												id="subject"
												required
												value={formData.subject}
												onChange={(e) =>
													setFormData({ ...formData, subject: e.target.value })
												}
												className="mt-2 w-full rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
											>
												<option value="">Select a subject</option>
												<option value="sales">Sales Inquiry</option>
												<option value="support">Technical Support</option>
												<option value="billing">Billing Question</option>
												<option value="partnership">Partnership</option>
												<option value="other">Other</option>
											</select>
										</div>
									</div>
									<div>
										<label
											htmlFor="message"
											className="block font-medium text-sm text-text-strong-950"
										>
											Message
										</label>
										<textarea
											id="message"
											required
											rows={5}
											value={formData.message}
											onChange={(e) =>
												setFormData({ ...formData, message: e.target.value })
											}
											className="mt-2 w-full resize-none rounded-lg border border-stroke-soft-100 bg-white px-4 py-3 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
										/>
									</div>
									<button
										type="submit"
										disabled={isSubmitting}
										className={Button.buttonVariants({
											variant: "primary",
											size: "medium",
										}).root({})}
									>
										{isSubmitting ? "Sending..." : "Send Message"}
									</button>
								</form>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
