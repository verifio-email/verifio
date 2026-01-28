/**
 * Session type represents the authenticated user session data
 * This type can be used across all packages that need to work with session data
 */
export type Session = {
	session: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
		userId: string;
		expiresAt: Date;
		token: string;
		ipAddress?: string | null | undefined;
		userAgent?: string | null | undefined;
		impersonatedBy?: string | null | undefined;
		activeOrganizationId: string | null | undefined;
		activeTeamId?: string | null | undefined;
	};
	user: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
		email: string;
		emailVerified: boolean;
		name: string;
		image?: string | null | undefined;
		mode?: string | null | undefined;
		activeOrganizationId: string | null | undefined;
		banned?: boolean | null | undefined;
		role?: string | null | undefined;
		banReason?: string | null | undefined;
		banExpires?: Date | null | undefined;
	};
};

/**
 * User type extracted from Session for convenience
 */
export type User = Session["user"];

/**
 * SessionData type extracted from Session for convenience
 */
export type SessionData = Session["session"];
