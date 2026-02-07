"use client";

import { useUserOrganization } from "@fe/dashboard/providers/org-provider";
import { useOrgStore } from "@fe/dashboard/store/use-org-store";
import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import * as FileUpload from "@verifio/ui/file-upload";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import * as Label from "@verifio/ui/label";
import * as Modal from "@verifio/ui/modal";
import Spinner from "@verifio/ui/spinner";
import axios from "axios";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { InviteMember } from "./invite-user";

export const CreateOrganizationModal = () => {
	const { open, setState } = useOrgStore();
	const { refetch } = authClient.useSession();
	const { mutateOrganizations } = useUserOrganization();
	const router = useRouter();
	const [organizationName, setOrganizationName] = useState("");
	const [logoPreview, setLogoPreview] = useState("");
	const [logoUrl, setLogoUrl] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showInviteMember, setShowInviteMember] = useState(false);
	const [createdOrgSlug, setCreatedOrgSlug] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file
		if (file.size > 10 * 1024 * 1024) {
			toast.error("File size must be less than 10MB");
			return;
		}
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		// Show preview immediately
		const reader = new FileReader();
		reader.onloadend = () => {
			setLogoPreview(reader.result as string);
		};
		reader.readAsDataURL(file);

		// Upload to upload service
		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const { data: uploadData } = await axios.post(
				"/api/upload/v1/upload",
				formData,
				{ withCredentials: true },
			);

			const uploadedUrl = uploadData.url;
			setLogoUrl(uploadedUrl);
			toast.success("Logo uploaded successfully");
		} catch (error) {
			console.error("Upload error:", error);
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401 || error.response?.status === 403) {
					setIsUploading(false);
					return;
				}
				const errorMessage =
					error.response?.data?.message ||
					"Failed to upload file. Please try again.";
				toast.error(errorMessage);
			} else if (error instanceof Error) {
				toast.error(error.message || "Failed to upload logo.");
			}
			// Reset preview on error
			setLogoPreview("");
		} finally {
			setIsUploading(false);
		}
	};

	const handleFileUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!organizationName.trim()) return;
		setIsSubmitting(true);
		try {
			const organization = await authClient.organization.create({
				name: organizationName,
				logo: logoUrl || "",
				slug: organizationName.toLowerCase().replace(/ /g, "-"),
			});
			if (organization.error) {
				toast.error(
					organization.error.message || "Failed to create organization",
				);
				setIsSubmitting(false);
				return;
			}
			await authClient.updateUser({
				activeOrganizationId: organization.data.id,
			});
			mutateOrganizations();
			refetch();
			setCreatedOrgSlug(organization.data.slug);
			setIsSubmitting(false);
			setShowInviteMember(true);
		} catch {
			setIsSubmitting(false);
			toast.error("Failed to create organization");
		}
	};

	const handleClose = () => {
		if (createdOrgSlug) {
			console.log("Redirecting to new org:", createdOrgSlug);
			router.push(`/${createdOrgSlug}`);
			setCreatedOrgSlug(null);
		}

		setState(false);
		setShowInviteMember(false);
		// Reset form state
		setOrganizationName("");
		setLogoPreview("");
		setLogoUrl("");
	};

	return (
		<Modal.Root open={open} onOpenChange={handleClose}>
			<Modal.Content className="max-w-[440px]">
				{showInviteMember ? (
					<InviteMember onClose={handleClose} />
				) : (
					<form onSubmit={handleSubmit}>
						<Modal.Body className="flex w-full items-start gap-4">
							<div className="w-full space-y-5">
								<div className="font-medium text-label-md text-text-strong-950">
									Create Organization
								</div>
								<div>
									<Label.Root htmlFor="logo" className="mb-1">
										Logo
									</Label.Root>
									<div className="flex items-center gap-4">
										<input
											ref={fileInputRef}
											type="file"
											accept="image/*"
											onChange={handleLogoChange}
											className="hidden"
										/>
										<FileUpload.Root
											className={cn(
												"flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl",
												logoUrl || logoPreview
													? "border border-stroke-sub-300 border-solid p-0"
													: "border border-stroke-sub-300 p-1",
												isUploading && "cursor-wait opacity-50",
												!isUploading && "cursor-pointer",
											)}
											onClick={isUploading ? undefined : handleFileUploadClick}
										>
											{isUploading ? (
												<Spinner size={20} color="var(--text-strong-950)" />
											) : logoUrl || logoPreview ? (
												<img
													src={logoUrl || logoPreview}
													alt="Logo preview"
													className="h-full w-full rounded-xl object-cover"
												/>
											) : (
												<FileUpload.Icon
													name="image-upload"
													as={Icon}
													className="h-6 w-6"
												/>
											)}
										</FileUpload.Root>
										<div>
											<Button.Root
												mode="stroke"
												size="xxsmall"
												className="px-5"
												type="button"
												onClick={handleFileUploadClick}
												disabled={isUploading}
											>
												{isUploading ? (
													<>
														<Spinner size={14} color="var(--text-strong-950)" />
														Uploading...
													</>
												) : (
													"Upload"
												)}
											</Button.Root>
											<p className="ml-0.5 text-paragraph-sm text-text-sub-600">
												Recommended size 1:1, up to 10MB.
											</p>
										</div>
									</div>
								</div>
								<div>
									<Label.Root htmlFor="name">
										Name
										<Label.Asterisk />
									</Label.Root>
									<Input.Root className="w-full" size="small">
										<Input.Wrapper className="w-full">
											<Input.Input
												id="name"
												type="text"
												placeholder="Placeholder text..."
												value={organizationName}
												onChange={(e) => setOrganizationName(e.target.value)}
											/>
										</Input.Wrapper>
									</Input.Root>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer className="flex justify-end">
							<Modal.Close asChild>
								<Button.Root
									type="button"
									mode="stroke"
									disabled={isSubmitting || isUploading}
								>
									Cancel
								</Button.Root>
							</Modal.Close>
							<Button.Root
								type="submit"
								disabled={
									isSubmitting || isUploading || !organizationName.trim()
								}
							>
								{isSubmitting && <Spinner color="var(--text-strong-950)" />}
								{isSubmitting ? "Creating..." : "Create"}
							</Button.Root>
						</Modal.Footer>
					</form>
				)}
			</Modal.Content>
		</Modal.Root>
	);
};
