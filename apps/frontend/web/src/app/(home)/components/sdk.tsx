"use client";

import * as Button from "@verifio/ui/button";
import { CodeBlock } from "@verifio/ui/code-block";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { Go, Nodejs, Php, Python } from "./language-svg";

const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error("Failed to copy:", err);
	}
};

type SdkType = {
	id: string;
	name: string;
	icon: ReactNode;
	install: string;
	code: string;
};

const sdks: SdkType[] = [
	{
		id: "node",
		name: "Node.js",
		icon: <Nodejs className="h-5 w-5" />,
		install: "npm install @verifio/sdk",
		code: `import Verifio from '@verifio/sdk';

const verifio = new Verifio({
  url: 'https://api.verifio.email',
  key: 'your-api-key'
});

// Verify a single email
const result = await verifio.verify.email({
  email: 'user@example.com'
});

console.log(result);
// {
//   valid: true,
//   email: 'user@example.com',
//   disposable: false,
//   role: false,
//   score: 95
// }`,
	},
	{
		id: "go",
		name: "Go",
		icon: <Go className="h-4 w-11" />,
		install: "go get github.com/verifio/sdk-go",
		code: `package main

import (
  "fmt"
  "github.com/verifio/sdk-go"
)

func main() {
  client := verifio.NewClient("your-api-key")

  result, err := client.Verify.Email(&verifio.VerifyRequest{
    Email: "user@example.com",
  })

  if err != nil {
    fmt.Println("Error:", err)
    return
  }

  fmt.Printf("Valid: %v\\n", result.Valid)
  fmt.Printf("Score: %d\\n", result.Score)
}`,
	},
	{
		id: "php",
		name: "PHP",
		icon: <Php className="h-5 w-8" />,
		install: "composer require verifio/sdk",
		code: `<?php

require 'vendor/autoload.php';

use Verifio\\Verifio;

$verifio = new Verifio([
  'url' => 'https://api.verifio.email',
  'key' => 'your-api-key'
]);

// Verify an email address
$result = $verifio->verify->email([
  'email' => 'user@example.com'
]);

echo "Valid: " . ($result['valid'] ? 'Yes' : 'No');
echo "Score: " . $result['score'];`,
	},
	{
		id: "python",
		name: "Python",
		icon: <Python className="h-5 w-5" />,
		install: "pip install verifio-sdk",
		code: `from verifio import Verifio

# Initialize the client
verifio = Verifio(
    url='https://api.verifio.email',
    key='your-api-key'
)

# Verify an email address
result = verifio.verify.email(
    email='user@example.com'
)

print(f"Valid: {result['valid']}")
print(f"Disposable: {result['disposable']}")
print(f"Score: {result['score']}")`,
	},
];

export const Sdk = () => {
	const [selectedSdk, setSelectedSdk] = useState<SdkType>(sdks[0] as SdkType);
	const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
	const [mounted, setMounted] = useState(false);
	const tabsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const activeIndex = sdks.findIndex((sdk) => sdk.id === selectedSdk.id);
		const activeTab = tabsRef.current[activeIndex];

		if (activeTab) {
			const { offsetWidth: width, offsetLeft: left } = activeTab;
			setIndicatorStyle({ width, left });
			setMounted(true);
		}
	}, [selectedSdk]);

	const getLanguage = (id: string) => {
		switch (id) {
			case "node":
				return "javascript";
			case "go":
				return "go";
			case "php":
				return "php";
			case "python":
				return "python";
			default:
				return "javascript";
		}
	};

	return (
		<div className="border-stroke-soft-100 border-t border-b">
			<div className="mx-auto max-w-5xl border-stroke-soft-100 border-r border-l">
				<div className="sticky top-[66px] z-20 flex items-center justify-between border-stroke-soft-100 border-b bg-bg-white-0 px-4 py-4 md:px-10">
					<span className="text-text-sub-600 text-xs">[02] SDK</span>
					<span className="text-text-sub-600 text-xs">/ DEVELOPER TOOLS</span>
				</div>
				<div className="flex flex-col border-stroke-soft-100">
					{/* Header Section */}
					<div className="flex flex-col items-center justify-center border-stroke-soft-100 border-b px-4 py-8 text-center md:p-10">
						<h2 className="max-w-3xl font-semibold text-2xl text-text-sub-600 md:text-3xl">
							<span>Email Verification</span>{" "}
							<span className="text-text-strong-950">for Developers</span>
						</h2>
						<p className="mt-2 max-w-lg px-2 text-sm text-text-sub-600 leading-7 md:max-w-xl md:px-0 md:text-base md:leading-8">
							Integrate email verification into your apps with our simple API
							and official SDKs. Ship faster with typed responses and
							comprehensive documentation.
						</p>
					</div>

					{/* SDK Selection and Code Display */}
					<div className="flex flex-col border-stroke-soft-100 border-t">
						{/* SDK Section Header */}
						<div className="flex items-center justify-center border-stroke-soft-100 border-b bg-bg-soft-200/30 px-4 py-4">
							<span className="font-medium text-sm text-text-sub-600">
								Official SDKs — integrate in minutes with just a few lines of
								code
							</span>
						</div>

						{/* Tabs */}
						<div className="overflow-x-auto border-stroke-soft-100 border-b">
							<div className="relative flex w-fit min-w-full items-stretch border-stroke-soft-100 bg-bg-white-0 md:border-r">
								{/* Animated floating background */}
								<div
									className={`absolute inset-y-3 rounded-full border border-stroke-soft-100 bg-bg-white-100 transition-all duration-300 ${
										mounted ? "opacity-100" : "opacity-0"
									}`}
									style={{
										left: `${indicatorStyle.left}px`,
										width: `${indicatorStyle.width}px`,
										transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
									}}
									aria-hidden="true"
								/>
								{sdks.map((sdk, index) => (
									<Fragment key={sdk.id}>
										<div
											ref={(el) => {
												tabsRef.current[index] = el;
											}}
											className="relative z-10 mx-3 flex flex-col justify-center py-3"
										>
											<button
												type="button"
												onClick={() => setSelectedSdk(sdk)}
												className="flex cursor-pointer items-center gap-2 rounded-full border border-transparent px-4 py-3 transition-colors"
											>
												<span className="text-lg">{sdk.icon}</span>
												<span
													className={`font-semibold text-sm ${
														selectedSdk.id === sdk.id
															? "text-text-strong-950"
															: "text-text-sub-600"
													}`}
												>
													{sdk.name}
												</span>
											</button>
										</div>
										{index < sdks.length - 1 && (
											<div className="w-px bg-stroke-soft-100" />
										)}
									</Fragment>
								))}
							</div>
						</div>

						{/* Code Display */}
						<div className="max-h-[400px] overflow-auto text-sm md:max-h-[500px] md:text-base">
							<CodeBlock
								code={selectedSdk.code}
								lang={getLanguage(selectedSdk.id)}
							/>
						</div>

						{/* Actions Footer */}
						<div className="flex items-center justify-end border-stroke-soft-100 border-t">
							<div className="flex items-center gap-2 border-stroke-soft-100 px-4 py-3 md:border-l">
								<Button.Root
									mode="stroke"
									size="small"
									variant="neutral"
									onClick={() => copyToClipboard(selectedSdk.code)}
									className="rounded-full"
								>
									<Icon
										name="copy"
										className="h-3.5 w-3.5 stroke-1 text-text-sub-600"
									/>
									Copy
								</Button.Root>
								<Link href="/docs/sdks">
									<Button.Root
										mode="stroke"
										size="small"
										variant="neutral"
										className="rounded-full"
									>
										View Docs
										<Icon
											name="chevron-right"
											className="h-3.5 w-3.5 stroke-1 text-text-sub-600"
										/>
									</Button.Root>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sdk;
