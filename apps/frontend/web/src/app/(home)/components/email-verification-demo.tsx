"use client";
import { Icon } from "@verifio/ui/icon";
import { useState } from "react";
import * as Input from "@verifio/ui/input";
import * as Button from "@verifio/ui/button";
import * as SegmentedControl from "@verifio/ui/segmented-control";
import * as FileFormatIcon from "@verifio/ui/file-format-icon";

export function EmailVerificationDemo() {
	const [email, setEmail] = useState("");
	const [activeTab, setActiveTab] = useState("email");

	return (
		<div className="-mt-[49px] mx-auto w-full max-w-lg">
			<SegmentedControl.Root value={activeTab} onValueChange={setActiveTab}>
				<Input.Root className="flex-col rounded-2xl! border-stroke-soft-100/60!">
					<Input.Wrapper className="hover:[&:not(&:has(input:focus))]:bg-bg-white-0!">
						<Input.Icon as={Icon} name="at" className="h-3.5 w-3.5" />
						<Input.Input placeholder="www.alignui.com" className="h-12" />
					</Input.Wrapper>
					<div className="flex h-[52px] items-center justify-between border-stroke-soft-100/60 border-t px-2">
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
						<Button.Root size="xsmall" className="px-4 font-medium">
							Verify Email
							<Button.Icon
								as={Icon}
								name="arrow-left"
								className="h-3 w-3 rotate-180"
							/>
						</Button.Root>
					</div>
				</Input.Root>
			</SegmentedControl.Root>
		</div>
	);
}
