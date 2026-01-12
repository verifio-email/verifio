import { ComparisonPricing } from "./components/comparison-pricing";
import { EmailQualityProblem } from "./components/email-quality-problem";
import Faq from "./components/faq";
import { FinalCTA } from "./components/final-cta";
import Hero from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { OpenSourceDifference } from "./components/open-source-difference";
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
			<HowItWorks />
			<div className="h-10" />
			<UseCases />
			<div className="h-10" />
			<ComparisonPricing />
			<div className="h-10" />
			<FinalCTA />
			<div className="h-10" />
			<Faq />
			<div className="h-10" />
		</div>
	);
}
