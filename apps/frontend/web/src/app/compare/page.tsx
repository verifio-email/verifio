import * as Button from "@verifio/ui/button";
import Link from "next/link";

const competitors = [
    {
        name: "ZeroBounce",
        slug: "zerobounce",
    },
    {
        name: "NeverBounce",
        slug: "neverbounce",
    },
    {
        name: "Hunter.io",
        slug: "hunter",
    },
    {
        name: "Kickbox",
        slug: "kickbox",
    },
];

const comparisonData = [
    { feature: "Starting Price", verifio: "$0/mo", others: "$15-50/mo" },
    { feature: "Free Tier", verifio: "1,000/mo", others: "0-100/mo" },
    { feature: "Accuracy", verifio: "99%", others: "95-98%" },
    { feature: "API Latency", verifio: "<100ms", others: "100-500ms" },
    { feature: "Bulk Upload", verifio: "✓", others: "✓" },
    { feature: "Real-time API", verifio: "✓", others: "✓" },
    { feature: "Webhooks", verifio: "✓", others: "Limited" },
    { feature: "Integrations", verifio: "50+", others: "10-30" },
    { feature: "Open Source", verifio: "✓", others: "✗" },
    { feature: "Self-hosting", verifio: "✓", others: "✗" },
    { feature: "GDPR Compliant", verifio: "✓", others: "✓" },
    { feature: "24/7 Support", verifio: "Pro+", others: "Enterprise only" },
];

export default function ComparePage() {
    return (
        <div className="min-h-screen">
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
                        <span className="text-sm text-text-sub-600">[01] COMPARE</span>
                        <span className="text-sm text-text-sub-600">
                            / VERIFIO VS OTHERS
                        </span>
                    </div>
                    <div className="px-10 py-16 text-center">
                        <h1 className="mx-auto max-w-3xl font-semibold text-4xl text-text-strong-950 md:text-5xl">
                            Why choose Verifio?
                        </h1>
                        <p className="mx-auto mt-6 max-w-xl text-lg text-text-sub-600">
                            See how Verifio compares to other email verification services
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="grid gap-0 md:grid-cols-4">
                        {competitors.map((comp, index) => (
                            <Link
                                key={comp.slug}
                                href={`/compare/${comp.slug}`}
                                className={`block border-stroke-soft-100 p-6 text-center transition-colors hover:bg-bg-weak-50 ${index < 3 ? "border-r" : ""}`}
                            >
                                <p className="text-sm text-text-sub-600">Verifio vs</p>
                                <p className="mt-1 font-semibold text-text-strong-950">
                                    {comp.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="border-stroke-soft-100 border-b">
                <div className="mx-auto max-w-7xl border-stroke-soft-100 border-r border-l">
                    <div className="flex items-center justify-between border-stroke-soft-100 border-b px-10 py-4">
                        <span className="text-sm text-text-sub-600">[02] FEATURES</span>
                        <span className="text-sm text-text-sub-600">
                            / SIDE BY SIDE
                        </span>
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
                                            Others
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, index) => (
                                        <tr
                                            key={row.feature}
                                            className={
                                                index < comparisonData.length - 1
                                                    ? "border-stroke-soft-100 border-b"
                                                    : ""
                                            }
                                        >
                                            <td className="px-4 py-4 font-medium text-text-strong-950">
                                                {row.feature}
                                            </td>
                                            <td className="bg-primary-50/50 px-4 py-4 text-center font-medium text-primary-600">
                                                {row.verifio}
                                            </td>
                                            <td className="px-4 py-4 text-center text-text-sub-600">
                                                {row.others}
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
                        <h2 className="font-semibold text-2xl text-text-strong-950">
                            Ready to switch?
                        </h2>
                        <p className="mt-2 text-text-sub-600">
                            Try Verifio free with 1,000 verifications — no credit card required
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
                </div>
            </section>
        </div>
    );
}
