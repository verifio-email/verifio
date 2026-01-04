"use client";
import * as Button from "@verifio/ui/button";
import * as FileFormatIcon from "@verifio/ui/file-format-icon";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import * as SegmentedControl from "@verifio/ui/segmented-control";
import { type FormEvent, useState } from "react";
import { useVerification } from "./verification-context";

export function EmailVerificationDemo() {
	const [email, setEmail] = useState("");
	const [activeTab, setActiveTab] = useState("email");
	const { verifyEmail, isLoading, error, rateLimitInfo } = useVerification();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!email.trim() || isLoading) return;
		await verifyEmail(email.trim());
	};

	const isRateLimited = rateLimitInfo?.exceeded;

	return (
		<div className="-mt-[49px] mx-auto w-full max-w-lg">
			<SegmentedControl.Root value={activeTab} onValueChange={setActiveTab}>
				<form onSubmit={handleSubmit}>
					<Input.Root className="flex-col rounded-2xl! border-stroke-soft-200/50!">
						<Input.Wrapper className="hover:[&:not(&:has(input:focus))]:bg-bg-white-0!">
							<Input.Icon as={Icon} name="at" className="h-3.5 w-3.5" />
							<Input.Input
								placeholder="Enter email to verify..."
								className="h-12"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isLoading}
							/>
						</Input.Wrapper>
						<div className="flex h-[52px] items-center justify-between border-stroke-soft-200/50 border-t px-2">
							<div>
								<SegmentedControl.List>
									<SegmentedControl.Trigger
										value="email"
										className="font-medium text-sm"
									>
										<Icon name="mail-single" className="h-3.5 w-3.5" />
										Single Email
									</SegmentedControl.Trigger>
									<SegmentedControl.Trigger
										value="csv"
										className="font-medium text-sm"
									>
										<FileFormatIcon.Root
											format="CSV"
											color="green"
											className="h-5 w-5"
										/>
										CSV Upload
									</SegmentedControl.Trigger>
								</SegmentedControl.List>
							</div>
							<Button.Root
								size="xsmall"
								className="px-4 font-medium"
								type="submit"
								disabled={isLoading || !email.trim() || isRateLimited}
							>
								{isLoading ? (
									<>
										<Icon name="loading" className="h-3 w-3 animate-spin" />
										Verifying...
									</>
								) : isRateLimited ? (
									<>Rate Limited</>
								) : (
									<>
										Verify Email
										<Button.Icon
											as={Icon}
											name="arrow-left"
											className="h-3 w-3 rotate-180"
										/>
									</>
								)}
							</Button.Root>
						</div>
						{error && (
							<div className="border-stroke-soft-200/50 border-t px-4 py-2 text-red-500 text-sm">
								{error}
							</div>
						)}
					</Input.Root>
				</form>
			</SegmentedControl.Root>
		</div>
	);
}
