import * as Button from "@verifio/ui/button";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
                        <span className="text-sm text-text-sub-600">[01] ABOUT</span>
                        <span className="text-sm text-text-sub-600">/ OUR STORY</span>
                    </div>
                    <div className="px-10 py-16 md:py-20">
                        <h1 className="max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
                            Building the future of email verification
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg text-text-sub-600 leading-relaxed">
                            We started Verifio because we believed email verification should
                            be accurate, affordable, and accessible to everyone. Today, we
                            help thousands of businesses deliver emails that reach real
                            inboxes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="grid gap-0 md:grid-cols-2">
                        <div className="border-stroke-soft-100 p-10 md:border-r md:p-16">
                            <span className="font-mono text-primary-500 text-sm">
                                MISSION
                            </span>
                            <h2 className="mt-4 font-semibold text-2xl text-text-strong-950">
                                Making email verification simple
                            </h2>
                            <p className="mt-4 text-text-sub-600">
                                Email deliverability shouldn't be complicated. Our mission is to
                                provide the most accurate, fastest, and most affordable email
                                verification service in the market.
                            </p>
                        </div>
                        <div className="p-10 md:p-16">
                            <span className="font-mono text-primary-500 text-sm">VISION</span>
                            <h2 className="mt-4 font-semibold text-2xl text-text-strong-950">
                                A world without email bounces
                            </h2>
                            <p className="mt-4 text-text-sub-600">
                                We envision a future where every email sent reaches its intended
                                recipient. No more wasted resources, damaged sender reputations,
                                or missed opportunities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="grid gap-0 md:grid-cols-4">
                        {[
                            { value: "10M+", label: "Emails Verified" },
                            { value: "500+", label: "Happy Customers" },
                            { value: "99%", label: "Accuracy Rate" },
                            { value: "24/7", label: "Support" },
                        ].map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`border-stroke-soft-100 p-8 text-center ${index < 3 ? "border-r" : ""}`}
                            >
                                <p className="font-bold text-3xl text-primary-500">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-sm text-text-sub-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
                        <span className="text-sm text-text-sub-600">[02] VALUES</span>
                        <span className="text-sm text-text-sub-600">/ WHAT WE BELIEVE</span>
                    </div>
                    <div className="grid gap-0 md:grid-cols-3">
                        {[
                            {
                                title: "Accuracy First",
                                desc: "We never sacrifice accuracy for speed. Every verification is thorough and reliable.",
                            },
                            {
                                title: "Transparency",
                                desc: "No hidden fees, no surprises. What you see is what you get, always.",
                            },
                            {
                                title: "Customer Focus",
                                desc: "Your success is our success. We're here to help you achieve your email goals.",
                            },
                        ].map((value, index) => (
                            <div
                                key={value.title}
                                className={`border-stroke-soft-100 p-10 ${index < 2 ? "border-r" : ""}`}
                            >
                                <h3 className="font-semibold text-text-strong-950 text-xl">
                                    {value.title}
                                </h3>
                                <p className="mt-3 text-text-sub-600">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="p-10 text-center md:p-16">
                        <h2 className="font-semibold text-2xl text-text-strong-950">
                            Ready to get started?
                        </h2>
                        <p className="mt-2 text-text-sub-600">
                            Join thousands of businesses using Verifio to improve their email
                            deliverability.
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <Link
                                href="/tools/email-checker"
                                className={Button.buttonVariants({
                                    variant: "primary",
                                    size: "medium",
                                }).root({})}
                            >
                                Try Free Tool
                            </Link>
                            <Link
                                href="/contact"
                                className={Button.buttonVariants({
                                    variant: "neutral",
                                    mode: "stroke",
                                    size: "medium",
                                }).root({})}
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
