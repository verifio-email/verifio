/**
 * Role-Based Email Detection
 * Check if email is a generic role address (info@, support@, etc.)
 */

import {
	getRoleName,
	isRolePrefix,
	ROLE_PREFIXES,
} from "../data/role-prefixes";
import type { RoleCheckResult } from "../types";

/**
 * Check if email is role-based
 */
export function checkRole(user: string): RoleCheckResult {
	const lowerUser = user.toLowerCase();

	// Direct check
	if (isRolePrefix(lowerUser)) {
		return {
			isRole: true,
			role: getRoleName(lowerUser),
		};
	}

	// Check for common patterns with numbers/suffixes
	// e.g., support1@, admin2@, info_team@
	const baseUser = lowerUser.replace(/[0-9_-]+$/, "");
	if (baseUser !== lowerUser && isRolePrefix(baseUser)) {
		return {
			isRole: true,
			role: getRoleName(baseUser),
		};
	}

	return {
		isRole: false,
	};
}

/**
 * Get total number of role prefixes tracked
 */
export function getRoleCount(): number {
	return ROLE_PREFIXES.size;
}
