/**
 * Tools API Client
 * Handles all communication with the tools backend service
 */

// Use relative URL - works through Caddy proxy in both development and production
const TOOLS_API_URL = "/api/tools";

/**
 * Base API client with error handling
 */
async function apiRequest<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<{ success: boolean; data?: T; error?: string }> {
	try {
		const response = await fetch(`${TOOLS_API_URL}${endpoint}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.error || `HTTP ${response.status}: ${response.statusText}`,
			};
		}

		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to connect to tools service",
		};
	}
}

/**
 * Syntax Validation API
 */
export const toolsApi = {
	/**
	 * Validate email syntax
	 */
	validateSyntax: async (email: string) => {
		return apiRequest("/v1/syntax/validate", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	},

	/**
	 * Check if email is disposable
	 */
	checkDisposable: async (email: string) => {
		return apiRequest("/v1/disposable/check", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	},

	/**
	 * Test domain deliverability
	 */
	testDeliverability: async (domain: string) => {
		return apiRequest("/v1/deliverability/test", {
			method: "POST",
			body: JSON.stringify({ domain }),
		});
	},

	/**
	 * Calculate list health
	 */
	calculateListHealth: async (emails: string[]) => {
		return apiRequest("/v1/list-health/calculate", {
			method: "POST",
			body: JSON.stringify({ emails }),
		});
	},

	/**
	 * Detect catch-all domain
	 */
	detectCatchall: async (domain: string) => {
		return apiRequest("/v1/catchall/detect", {
			method: "POST",
			body: JSON.stringify({ domain }),
		});
	},
};
