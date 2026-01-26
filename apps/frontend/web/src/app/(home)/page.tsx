import { ComparisonTable } from "./components/comparison-table";
import { EmailQualityProblem } from "./components/email-quality-problem";
import Faq from "./components/faq";
import { FinalCTA } from "./components/final-cta";
import Hero from "./components/hero";
import { OpenSourceDifference } from "./components/open-source-difference";
import { PricingSection } from "@verifio/web/components/pricing-section";
import Sdk from "./components/sdk";
import { UseCases } from "./components/use-cases";

export default function Home() {
	return (
		<div>
			<Hero />
			<div className="h-10" />
			<EmailQualityProblem />
			<div className="h-10" />
			<Sdk />
			<div className="h-10" />
			<OpenSourceDifference />
			<div className="h-10" />
			<UseCases />
			<div className="h-10" />
			<ComparisonTable />
			<div className="h-10" />
			<PricingSection />
			<div className="h-10" />
			<FinalCTA />
			<div className="h-10" />
			<Faq />
			<div className="h-10" />
		</div>
	);
}
