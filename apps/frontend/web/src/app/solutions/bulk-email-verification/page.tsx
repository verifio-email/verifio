import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";

export default function BulkEmailVerificationPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
                        <span className="text-sm text-text-sub-600">[01] SOLUTION</span>
                        <span className="text-sm text-text-sub-600">
                            / BULK EMAIL VERIFICATION
                        </span>
                    </div>
                    <div className="grid gap-10 px-10 py-16 md:grid-cols-2 md:py-20">
                        <div>
                            <h1 className="font-semibold text-4xl text-text-strong-950 md:text-5xl">
                                Clean your email lists with 99% accuracy
                            </h1>
                            <p className="mt-6 text-lg text-text-sub-600">
                                Upload thousands of emails and get verified results in minutes.
                                Reduce bounces, improve deliverability, and protect your sender
                                reputation.
                            </p>
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href="/signup"
                                    className={Button.buttonVariants({
                                        variant: "primary",
                                        size: "medium",
                                    }).root({})}
                                >
                                    Start Free Trial
                                </Link>
                                <Link
                                    href="/pricing"
                                    className={Button.buttonVariants({
                                        variant: "neutral",
                                        mode: "stroke",
                                        size: "medium",
                                    }).root({})}
                                >
                                    View Pricing
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-md rounded-2xl border-2 border-stroke-soft-100 border-dashed bg-bg-weak-50 p-10 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                                    <Icon name="upload" className="h-8 w-8 text-primary-500" />
                                </div>
                                <p className="font-medium text-text-strong-950">
                                    Drag & drop your CSV file
                                </p>
                                <p className="mt-1 text-sm text-text-sub-600">
                                    or click to browse
                                </p>
                                <p className="mt-4 text-text-sub-600 text-xs">
                                    Supports CSV, TXT, XLS up to 10MB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="grid gap-0 md:grid-cols-4">
                        {[
                            { value: "99%", label: "Accuracy Rate" },
                            { value: "<1s", label: "Per Email" },
                            { value: "10M+", label: "Emails Verified" },
                            { value: "500+", label: "Happy Customers" },
                        ].map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`border-stroke-soft-100 p-8 text-center ${index < 3 ? "border-r" : ""}`}
                            >
                                <p className="font-bold text-3xl text-primary-500">{stat.value}</p>
                                <p className="mt-1 text-sm text-text-sub-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
                        <span className="text-sm text-text-sub-600">[02] PROCESS</span>
                        <span className="text-sm text-text-sub-600">/ HOW IT WORKS</span>
                    </div>
                    <div className="grid gap-0 md:grid-cols-3">
                        {[
                            {
                                step: "01",
                                title: "Upload Your List",
                                desc: "Drag and drop your CSV file or paste emails directly. We accept files up to 10MB.",
                            },
                            {
                                step: "02",
                                title: "We Verify",
                                desc: "Our system runs 7 verification checks including syntax, MX, SMTP, and disposable detection.",
                            },
                            {
                                step: "03",
                                title: "Download Results",
                                desc: "Get a clean, verified list with detailed status for each email. Export as CSV or JSON.",
                            },
                        ].map((item, index) => (
                            <div
                                key={item.step}
                                className={`border-stroke-soft-100 p-10 ${index < 2 ? "border-r" : ""}`}
                            >
                                <span className="font-mono text-5xl text-primary-200">
                                    {item.step}
                                </span>
                                <h3 className="mt-4 font-semibold text-text-strong-950 text-xl">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-text-sub-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
                        <span className="text-sm text-text-sub-600">[03] FEATURES</span>
                        <span className="text-sm text-text-sub-600">
                            / WHAT WE VERIFY
                        </span>
                    </div>
                    <div className="grid gap-0 md:grid-cols-2">
                        {[
                            {
                                title: "Syntax Validation",
                                desc: "Checks email format and structure for RFC compliance",
                            },
                            {
                                title: "Domain/MX Check",
                                desc: "Verifies the domain exists and can receive emails",
                            },
                            {
                                title: "Disposable Detection",
                                desc: "Identifies temporary email services like Mailinator",
                            },
                            {
                                title: "Role Account Detection",
                                desc: "Flags generic addresses like info@ or support@",
                            },
                            {
                                title: "SMTP Verification",
                                desc: "Confirms mailbox exists without sending an email",
                            },
                            {
                                title: "Catch-All Detection",
                                desc: "Identifies domains that accept any email address",
                            },
                            {
                                title: "Duplicate Removal",
                                desc: "Automatically removes duplicate entries from your list",
                            },
                            {
                                title: "Typo Detection",
                                desc: "Suggests corrections for common email typos",
                            },
                        ].map((feature, index) => (
                            <div
                                key={feature.title}
                                className={`border-stroke-soft-100 p-8 ${index % 2 === 0 ? "border-r" : ""} ${index < 6 ? "border-b" : ""}`}
                            >
                                <h3 className="font-medium text-text-strong-950">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-sm text-text-sub-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
                        <span className="text-sm text-text-sub-600">[04] COMPARE</span>
                        <span className="text-sm text-text-sub-600">/ WHY VERIFIO</span>
                    </div>
                    <div className="p-10">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-stroke-soft-100 border-b">
                                        <th className="px-4 py-4 text-left font-medium text-text-sub-600">
                                            Feature
                                        </th>
                                        <th className="bg-primary-50/50 px-4 py-4 text-center font-semibold text-primary-600">
                                            Verifio
                                        </th>
                                        <th className="px-4 py-4 text-center font-medium text-text-sub-600">
                                            ZeroBounce
                                        </th>
                                        <th className="px-4 py-4 text-center font-medium text-text-sub-600">
                                            NeverBounce
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["Accuracy", "99%", "98%", "97%"],
                                        ["Free Tier", "1,000/mo", "100/mo", "None"],
                                        ["API Latency", "<100ms", "<200ms", "<300ms"],
                                        ["Bulk Upload", "✓", "✓", "✓"],
                                        ["Webhooks", "✓", "✓", "Limited"],
                                        ["Open Source", "✓", "✗", "✗"],
                                    ].map(([feature, verifio, zero, never], index) => (
                                        <tr
                                            key={feature}
                                            className={
                                                index < 5 ? "border-stroke-soft-100 border-b" : ""
                                            }
                                        >
                                            <td className="px-4 py-4 font-medium text-text-strong-950">
                                                {feature}
                                            </td>
                                            <td className="bg-primary-50/50 px-4 py-4 text-center font-medium text-primary-600">
                                                {verifio}
                                            </td>
                                            <td className="px-4 py-4 text-center text-text-sub-600">
                                                {zero}
                                            </td>
                                            <td className="px-4 py-4 text-center text-text-sub-600">
                                                {never}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="p-10 text-center md:p-16">
                        <h2 className="font-semibold text-2xl text-text-strong-950 md:text-3xl">
                            Ready to clean your email list?
                        </h2>
                        <p className="mt-2 text-text-sub-600">
                            Start with 1,000 free verifications. No credit card required.
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <Link
                                href="/signup"
                                className={Button.buttonVariants({
                                    variant: "primary",
                                    size: "medium",
                                }).root({})}
                            >
                                Start Free Trial
                            </Link>
                            <Link
                                href="/tools/email-checker"
                                className={Button.buttonVariants({
                                    variant: "neutral",
                                    mode: "stroke",
                                    size: "medium",
                                }).root({})}
                            >
                                Try Single Checker
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
