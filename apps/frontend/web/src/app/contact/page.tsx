import { Icon } from "@verifio/ui/icon";
import { ContactForm } from "./contact-form";

export default function ContactPage() {
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
							<ContactForm />
						</div>

						{/* Contact Info - Box Style */}
						<div>
							<h2 className="border-stroke-soft-100 border-b px-6 py-6 font-semibold text-text-strong-950 text-xl">
								Contact Information
							</h2>

							{/* Chat to us */}
							<a
								href="mailto:hello@verifio.com"
								className="flex items-center gap-4 border-stroke-soft-100 border-b p-6 transition-colors hover:bg-bg-weak-50"
							>
								<div className="flex size-10 items-center justify-center rounded-full bg-primary-100">
									<Icon name="mail-single" className="size-5 text-primary-base" />
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
									<Icon name="smartphone" className="size-5 text-primary-base" />
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
