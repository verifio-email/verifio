import { Icon } from "@verifio/ui/icon";
import { ContactForm } from "./contact-form";

export default function ContactPage() {
	return (
		<div>
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-4 max-w-7xl border-stroke-soft-100 border-r border-l md:mx-auto">
					<div className="flex items-center justify-between border-stroke-soft-100 border-b px-4 py-2 md:px-10 md:py-4">
						<span className="text-text-sub-600 text-xs md:text-sm">
							[01] CONTACT
						</span>
						<span className="text-text-sub-600 text-xs md:text-sm">
							/ GET IN TOUCH
						</span>
					</div>
					<div className="px-4 py-8 text-center md:px-10 md:py-12">
						<h1 className="mx-auto max-w-3xl font-semibold text-3xl text-text-strong-950 md:text-5xl">
							Get in touch
						</h1>
						<p className="mx-auto mt-4 max-w-xl text-base text-text-sub-600 md:mt-6 md:text-lg">
							Have questions about our email verification service? We'd love to
							help.
						</p>
					</div>
				</div>
			</section>
			<section className="border-stroke-soft-100 border-b">
				<div className="mx-4 max-w-7xl border-stroke-soft-100 border-r border-l md:mx-auto">
					<div className="grid gap-0 md:grid-cols-2">
						{/* Contact Info - Box Style (shown first on mobile) */}
						<div className="order-first md:order-last">
							<h2 className="border-stroke-soft-100 border-b px-4 py-4 font-semibold text-text-strong-950 text-lg md:px-6 md:py-6 md:text-xl">
								Contact Information
							</h2>

							{/* Chat to us */}
							<a
								href="mailto:hello@verifio.email"
								className="flex items-center gap-4 border-stroke-soft-100 border-b px-4 py-4 transition-colors hover:bg-bg-weak-50 md:p-6"
							>
								<div className="flex size-10 items-center justify-center rounded-full bg-primary-100">
									<Icon
										name="mail-single"
										className="size-5 text-primary-base"
									/>
								</div>
								<div>
									<h3 className="font-medium text-text-sub-600">Chat to us</h3>
									<p className="text-sm text-text-strong-950">
										hello@verifio.email
									</p>
								</div>
							</a>

							{/* Call us */}
							<a
								href="tel:+995555555555"
								className="flex items-center gap-4 border-stroke-soft-100 border-b px-4 py-4 transition-colors hover:bg-bg-weak-50 md:p-6"
							>
								<div className="flex size-10 items-center justify-center rounded-full bg-primary-100">
									<Icon
										name="smartphone"
										className="size-5 text-primary-base"
									/>
								</div>
								<div>
									<h3 className="font-medium text-text-sub-600">Call us</h3>
									<p className="text-sm text-text-strong-950">
										(+91) 7411367725
									</p>
								</div>
							</a>
						</div>

						{/* Contact Form */}
						<div className="order-last border-stroke-soft-100 p-6 md:order-first md:border-r md:p-10">
							<ContactForm />
						</div>
					</div>
				</div>
			</section>
			<div className="h-10" />
		</div>
	);
}
