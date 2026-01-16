

export const ROLES = {
	OWNER: "owner",
	ADMIN: "admin",
	MEMBER: "member",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
