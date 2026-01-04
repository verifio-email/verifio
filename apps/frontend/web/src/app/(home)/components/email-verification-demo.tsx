"use client";
import { Icon } from "@verifio/ui/icon";
import { useState } from "react";
import * as Input from "@verifio/ui/input";
import * as BUtton from "@verifio/ui/button";
import * as SegmentedControl from "@verifio/ui/segmented-control";
import * as FileFormatIcon from "@verifio/ui/file-format-icon";

export function EmailVerificationDemo() {
	const [email, setEmail] = useState("");
	const [activeTab, setActiveTab] = useState("email");

	return (
		<div className="mx-auto w-full max-w-2xl">
			<SegmentedControl.Root value={activeTab} onValueChange={setActiveTab}>
				<Input.Root className="flex-col">
					<Input.Wrapper>
						<Input.Icon as={Icon} name="at" className="h-3.5 w-3.5" />
						<Input.Input placeholder="www.alignui.com" />
					</Input.Wrapper>
					<div className="flex items-center justify-between border-stroke-soft-100/60 border-t px-3 py-2">
						<div>
							<SegmentedControl.List>
								<SegmentedControl.Trigger
									value="email"
									className="font-medium text-sm"
								>
									<Icon name="mail-single" className="h-3.5 w-3.5" />
									Email
								</SegmentedControl.Trigger>
								<SegmentedControl.Trigger
									value="csv"
									className="font-medium text-sm"
								>
									<FileFormatIcon.Root
										format="CSV"
										color="green"
										className="w-5 h-5"
									/>
									CSV Upload
								</SegmentedControl.Trigger>
							</SegmentedControl.List>
						</div>
						<BUtton.Root size="xsmall" className="px-5">
							<BUtton.Icon as={Icon} name="arrow-left" className="rotate-180" />
						</BUtton.Root>
					</div>
				</Input.Root>
			</SegmentedControl.Root>
		</div>
	);
}
