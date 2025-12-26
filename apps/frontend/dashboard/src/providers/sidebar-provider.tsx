"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface SidebarContextType {
	isCollapsed: boolean;
	toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
};

interface SidebarProviderProps {
	children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

	useEffect(() => {
		try {
			const saved = localStorage.getItem("isSidebarCollapsed");
			if (saved !== null) {
				setIsCollapsed(saved === "true");
			}
		} catch {}
	}, []);

	const toggleCollapse = useCallback(() => {
		setIsCollapsed((prev) => {
			const next = !prev;
			try {
				localStorage.setItem("isSidebarCollapsed", String(next));
			} catch {}
			return next;
		});
	}, []);

	return (
		<SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
			{children}
		</SidebarContext.Provider>
	);
};
