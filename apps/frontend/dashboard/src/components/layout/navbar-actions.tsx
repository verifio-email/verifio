"use client";

import * as Button from "@verifio/ui/button";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { FeedbackPopover } from "../feedback-popover";

export const NavbarActions = () => {
	return (
		<div className="flex items-center gap-1">
			<Button.Root
				mode="ghost"
				variant="neutral"
				size="xxsmall"
				className="gap-1.5 text-text-sub-600"
			>
				<Icon name="help-circle" className="h-4 w-4" />
				Help
			</Button.Root>

			<Link
				href="https://docs.verifio.dev"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Button.Root
					mode="ghost"
					variant="neutral"
					size="xxsmall"
					className="gap-1.5 text-text-sub-600"
				>
					<Icon name="book-closed" className="h-4 w-4" />
					Docs
				</Button.Root>
			</Link>

			<FeedbackPopover />
		</div>
	);
};
