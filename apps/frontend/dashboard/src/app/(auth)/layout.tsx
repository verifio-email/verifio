import { ThemeToggle } from "@fe/dashboard/components/theme-toggle";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			{children}
			<div className="fixed right-5 bottom-5">
				<ThemeToggle />
			</div>
		</div>
	);
};

export default Layout;
