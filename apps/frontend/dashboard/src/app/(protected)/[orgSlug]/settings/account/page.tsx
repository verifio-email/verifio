"use client";

import { authClient } from "@verifio/auth/client";
import * as Button from "@verifio/ui/button";
import { cn } from "@verifio/ui/cn";
import * as FileUpload from "@verifio/ui/file-upload";
import { Icon } from "@verifio/ui/icon";
import * as Input from "@verifio/ui/input";
import * as Label from "@verifio/ui/label";
import Spinner from "@verifio/ui/spinner";
import axios from "axios";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const AccountPage = () => {
	const { data: session, refetch } = authClient.useSession();
	const user = session?.user;

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [imagePreview, setImagePreview] = useState(user?.image || "");
	const [imageUrl, setImageUrl] = useState(user?.image || "");
	const [isUploading, setIsUploading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
	const [isLastNameFocused, setIsLastNameFocused] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Parse first and last name from full name
	useEffect(() => {
		if (user?.name) {
			const nameParts = user.name.split(" ");
			setFirstName(nameParts[0] || "");
			setLastName(nameParts.slice(1).join(" ") || "");
		}
		if (user?.image) {
			setImagePreview(user.image);
			setImageUrl(user.image);
		}
	}, [user?.name, user?.image]);

	// Combine first and last name for comparison
	const fullName = `${firstName} ${lastName}`.trim();

	// Check if there are any changes
	const hasChanges =
		fullName !== (user?.name || "") || imageUrl !== (user?.image || "");

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
			setImagePreview(reader.result as string);
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
			setImageUrl(uploadedUrl);

			// Immediately save to database
			const { error } = await authClient.updateUser({
				image: uploadedUrl,
			});

			if (error) {
				toast.error(error.message || "Failed to save profile picture");
				return;
			}

			// Refresh session data
			await refetch();
			toast.success("Profile picture updated successfully");
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
				toast.error(error.message || "Failed to upload profile picture.");
			}
		} finally {
			setIsUploading(false);
		}
	};

	const handleFileUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleSaveChanges = async () => {
		if (!hasChanges) return;

		setIsSaving(true);
		try {
			const { error } = await authClient.updateUser({
				name: fullName,
				image: imageUrl || undefined,
			});

			if (error) {
				toast.error(error.message || "Failed to update profile");
				return;
			}

			// Refresh session data
			await refetch();
			toast.success("Profile updated successfully");
		} catch (error) {
			console.error("Update error:", error);
			toast.error("Failed to update profile");
		} finally {
			setIsSaving(false);
		}
	};

	// Get user initials for avatar fallback
	const getInitials = () => {
		if (firstName || lastName) {
			return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
		}
		return user?.email?.charAt(0).toUpperCase() || "U";
	};

	return (
		<div className="flex h-full flex-col">
			{/* Info Banner */}
			<div className="px-5 py-5 lg:px-6">
				<div className="flex items-center gap-2 rounded-xl bg-bg-weak-50/60 p-2 text-sm text-text-sub-600">
					<Icon name="info-outline" className="h-4 w-4" />
					Changes to your profile will apply to all of your workspaces.
				</div>
			</div>

			{/* Bottom border extending to right edge */}
			<div className="relative">
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Profile Picture Section */}
			<div className="relative">
				<div className="px-5 py-5 lg:px-6">
					<div className="flex items-center gap-4">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
						<FileUpload.Root
							className={cn(
								"flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full",
								imageUrl || imagePreview
									? "border border-stroke-sub-300 border-solid p-0"
									: "border border-stroke-sub-300 bg-primary p-1",
								isUploading && "cursor-wait opacity-50",
								!isUploading && "cursor-pointer",
							)}
							data-has-image={!!(imageUrl || imagePreview)}
							onClick={isUploading ? undefined : handleFileUploadClick}
						>
							{isUploading ? (
								<Spinner size={20} color="var(--text-strong-950)" />
							) : imageUrl || imagePreview ? (
								<img
									src={imageUrl || imagePreview}
									alt="Profile"
									className="h-full w-full rounded-full object-cover"
								/>
							) : (
								<span className="font-medium text-white text-xl">
									{getInitials()}
								</span>
							)}
						</FileUpload.Root>
						<div>
							<Label.Root htmlFor="profileImage">Profile Picture</Label.Root>
							<p className="-mt-0.5 pb-2 text-paragraph-xs text-text-sub-600">
								We only support PNGs, JPEGs and GIFs under 10MB
							</p>
							<Button.Root
								variant="neutral"
								mode="filled"
								size="xxsmall"
								type="button"
								onClick={handleFileUploadClick}
								disabled={isUploading}
							>
								{isUploading ? (
									<>
										<Spinner size={14} color="var(--bg-white-0)" />
										Uploading...
									</>
								) : (
									<>
										<Icon name="camera" className="h-4 w-4" />
										Upload image
									</>
								)}
							</Button.Root>
						</div>
					</div>
				</div>
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Name Section */}
			<div className="relative">
				<div className="px-5 pt-5 pb-4 lg:px-6">
					<h3 className="font-medium text-label-md text-text-strong-950">
						Name
					</h3>
					<p className="text-paragraph-sm text-text-sub-600">
						Update your display name
					</p>
				</div>
				<div className="px-5 pb-5 lg:px-6">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label.Root htmlFor="firstName">First Name</Label.Root>
							<Input.Root className="mt-1 w-full" size="small">
								<Input.Wrapper className="w-full">
									<Input.Input
										id="firstName"
										type="text"
										placeholder="First Name"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										onFocus={() => setIsFirstNameFocused(true)}
										onBlur={() => setIsFirstNameFocused(false)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleSaveChanges();
											}
										}}
									/>
									{isFirstNameFocused && (
										<div className="flex items-center gap-1 rounded-md border border-stroke-sub-300 bg-bg-white-0 px-1 py-[1px] text-[10px] text-text-sub-600 ring-stroke-soft-200 ring-inset">
											<span>⏎</span>
											<span>Enter</span>
										</div>
									)}
								</Input.Wrapper>
							</Input.Root>
						</div>
						<div>
							<Label.Root htmlFor="lastName">Last Name</Label.Root>
							<Input.Root className="mt-1 w-full" size="small">
								<Input.Wrapper className="w-full">
									<Input.Input
										id="lastName"
										type="text"
										placeholder="Last Name"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										onFocus={() => setIsLastNameFocused(true)}
										onBlur={() => setIsLastNameFocused(false)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleSaveChanges();
											}
										}}
									/>
									{isLastNameFocused && (
										<div className="flex items-center gap-1 rounded-md border border-stroke-sub-300 bg-bg-white-0 px-1 py-[1px] text-[10px] text-text-sub-600 ring-stroke-soft-200 ring-inset">
											<span>⏎</span>
											<span>Enter</span>
										</div>
									)}
								</Input.Wrapper>
							</Input.Root>
						</div>
					</div>
				</div>
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Email Section */}
			<div className="relative">
				<div className="px-5 pt-5 pb-4 lg:px-6">
					<h3 className="font-medium text-label-md text-text-strong-950">
						Email Address
					</h3>
					<p className="text-paragraph-sm text-text-sub-600">
						Your email address (read only)
					</p>
				</div>
				<div className="px-5 pb-5 lg:px-6">
					<Input.Root className="w-full" size="small">
						<Input.Wrapper className="w-full">
							<Input.Input
								id="email"
								type="email"
								value={user?.email || ""}
								readOnly
							/>
						</Input.Wrapper>
					</Input.Root>
				</div>
				{/* Bottom border extending to right edge */}
				<div className="absolute right-[-100vw] bottom-0 left-0 h-px bg-stroke-soft-200/50" />
			</div>

			{/* Bottom spacer */}
			<div className="flex-1" />
		</div>
	);
};

export default AccountPage;
