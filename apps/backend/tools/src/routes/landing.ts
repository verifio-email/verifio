/**
 * Landing Route - Health Check
 */

import { Elysia, t } from "elysia";

export const landing = new Elysia().get("/", () => {
	const health = {
		status: "ok",
		service: "Verifio Tools Service",
		version: "1.0.0",
		timestamp: new Date().toISOString(),
	};

	return health;
});
