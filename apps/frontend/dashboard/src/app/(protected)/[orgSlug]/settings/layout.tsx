"use client";
import { SettingsTabs } from "./components/tabs";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="mx-auto max-w-3xl px-6 pt-16">
			<div className="pb-6">
				<p className="font-medium text-2xl">Settings</p>
				<p className="text-paragraph-sm text-text-sub-600">
					Change the settings for your current workspace
				</p>
			</div>
			<SettingsTabs />
			<div className="w-full flex-1 pb-10">{children}</div>
		</div>
	);
};

export default Layout;
