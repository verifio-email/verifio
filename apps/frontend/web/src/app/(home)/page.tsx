import Company from "./components/company";
import CTA from "./components/cta";
import Faq from "./components/faq";
import Hero from "./components/hero";
import { Scale } from "./components/scale";
import Sdk from "./components/sdk";
import Security from "./components/security";
import UseCase from "./components/use-case";
import WhatWeStandFor from "./components/what-we-stand-for";
export default function Home() {
	return (
		<div>
			<Hero />
			<div className="h-10" />
			<Sdk />
			<div className="h-10" />
			<WhatWeStandFor />
			<div className="h-10" />
			<UseCase />
			<div className="h-10" />
			<Scale />
			<div className="h-10" />
			<Security />
			<div className="h-10" />
			<Company />
			<div className="h-10" />
			<CTA />
			<div className="h-10" />
			<Faq />
			<div className="h-10" />
		</div>
	);
}
