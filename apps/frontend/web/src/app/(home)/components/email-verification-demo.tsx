"use client";
import * as Button from "@verifio/ui/button";
import * as FileFormatIcon from "@verifio/ui/file-format-icon";
import * as FileUpload from "@verifio/ui/file-upload";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import * as SegmentedControl from "@verifio/ui/segmented-control";
import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, useState } from "react";
import { useVerification } from "./verification-context";

export function EmailVerificationDemo() {
	const [email, setEmail] = useState("");
	const [activeTab, setActiveTab] = useState("email");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { verifyEmail, isLoading, error, rateLimitInfo } = useVerification();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!email.trim() || isLoading) return;
		await verifyEmail(email.trim());
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const isRateLimited = rateLimitInfo?.exceeded;

	return (
		<div className="-mt-[49px] mx-auto w-full max-w-lg px-4 md:px-0">
			<SegmentedControl.Root value={activeTab} onValueChange={setActiveTab}>
				<form onSubmit={handleSubmit}>
					<Input.Root
						variant="neutral"
						className="flex-col rounded-2xl! border-stroke-soft-100/60 dark:border-stroke-soft-100/40!"
					>
						<motion.div
							animate={{ height: activeTab === "email" ? 48 : 196 }}
							transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
						>
							<AnimatePresence mode="wait" initial={false}>
								{activeTab === "email" ? (
									<motion.div
										key="email"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<Input.Wrapper className="hover:[&:not(&:has(input:focus))]:bg-bg-white-0!">
											<Input.Icon
												as={Icon}
												name="mail-single"
												className="h-4 w-4"
											/>
											<Input.Input
												placeholder="tim@apple.com"
												className="h-12!"
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												disabled={isLoading}
											/>
											{/* Arrow submit button inside input */}
											<Button.Root
												type="submit"
												variant="neutral"
												disabled={isLoading || !email.trim() || isRateLimited}
												className="h-8 w-8 shrink-0 rounded-full p-0!"
											>
												{isLoading ? (
													<Icon
														name="loading"
														className="h-4 w-4 animate-spin"
													/>
												) : (
													<Icon
														name="arrow-left"
														className="h-4 w-4 rotate-180"
													/>
												)}
											</Button.Root>
										</Input.Wrapper>
									</motion.div>
								) : (
									<motion.div
										key="csv"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<FileUpload.Root className="rounded-none border-0 px-4 pt-5">
											<input
												type="file"
												accept=".csv"
												tabIndex={-1}
												onChange={handleFileChange}
												className="hidden"
											/>
											<FileUpload.Icon
												as={FileFormatIcon.Root}
												format="CSV"
												color="green"
												className="h-7 w-7"
											/>
											<div className="space-y-1.5">
												<div className="text-label-sm text-text-strong-950">
													{selectedFile
														? selectedFile.name
														: "Choose a file or drag & drop it here."}
												</div>
												<div className="text-paragraph-xs text-text-sub-600">
													CSV format only, up to 10 MB.
												</div>
											</div>
											<FileUpload.Button>Browse File</FileUpload.Button>
										</FileUpload.Root>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
						<div className="flex h-[58px] items-center justify-between border-stroke-soft-100/60 border-t px-2 dark:border-stroke-soft-100/40">
							<div>
								<SegmentedControl.List>
									<SegmentedControl.Trigger
										value="email"
										className="font-medium text-sm"
									>
										<Icon name="mail-single" className="h-4 w-4" />
										Email
									</SegmentedControl.Trigger>
									<SegmentedControl.Trigger
										value="csv"
										className="px-3 font-medium text-sm"
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
							<AnimatePresence mode="wait">
								{activeTab === "csv" && (
									<motion.div
										initial={{ opacity: 0, x: 10 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 10 }}
										transition={{ duration: 0.2 }}
										className="px-3"
									>
										<a
											href="/sample-emails.csv"
											download
											className="flex items-center gap-1.5 text-paragraph-xs text-text-strong-950 transition-colors hover:text-text-strong-950"
										>
											<Icon name="file-download" className="h-3.5 w-3.5" />
											Sample CSV
										</a>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
						{error && (
							<div className="border-stroke-soft-100/60 border-t px-4 py-2 text-red-500 text-sm dark:border-stroke-soft-100/40">
								{error}
							</div>
						)}
					</Input.Root>
				</form>
			</SegmentedControl.Root>
		</div>
	);
}
