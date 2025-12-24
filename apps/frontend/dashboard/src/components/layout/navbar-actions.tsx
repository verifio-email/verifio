"use client";

import * as Button from "@verifio/ui/button";
import * as Drawer from "@verifio/ui/drawer";
import { Icon } from "@verifio/ui/icon";
import Link from "next/link";
import { ApiKeyDisplay } from "../api-key-display";
import { FeedbackPopover } from "../feedback-popover";

export const NavbarActions = () => {
	return (
		<div className="flex items-center gap-1">
			<Drawer.Root>
				<Drawer.Trigger asChild>
					<Button.Root
						mode="ghost"
						variant="neutral"
						size="xxsmall"
						className="gap-1.5 text-text-sub-600"
					>
						<Icon name="key" className="h-4 w-4" />
						API
					</Button.Root>
				</Drawer.Trigger>
				<Drawer.Content>
					<Drawer.Header>
						<Drawer.Title>API Key</Drawer.Title>
					</Drawer.Header>
					<Drawer.Body className="p-5">
						<ApiKeyDisplay />
					</Drawer.Body>
				</Drawer.Content>
			</Drawer.Root>

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
