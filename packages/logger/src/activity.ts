import { logger } from "./logger.js";
import type {
	LogActivityOptions,
	LogActivityParams,
	Service,
} from "./types.js";

const DEFAULT_LOGGING_SERVICE_URL = "https://local.verifio.email";

export class ActivityLogger {
	private readonly url: string;

	constructor(options?: { url?: string }) {
		this.url =
			options?.url ||
			process.env.LOGGING_SERVICE_URL ||
			DEFAULT_LOGGING_SERVICE_URL;
	}

	async log(
		params: LogActivityParams,
		options?: LogActivityOptions,
	): Promise<void> {
		try {
			const url = `${this.url}/api/logs/v1/add`;

			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};

			if (options?.cookie) {
				headers.Cookie = options.cookie;
			}

			const response = await fetch(url, {
				method: "POST",
				headers,
				body: JSON.stringify(params),
			});
			if (!response.ok) {
				logger.warn({ status: response.status, url }, "Failed to log activity");
			}
		} catch (error) {
			logger.warn(
				{ error: error instanceof Error ? error.message : "Unknown error" },
				"Failed to send activity log",
			);
		}
	}

	createTracker(service: Service) {
		const activityLogger = this;

		return {
			async log(
				params: Omit<LogActivityParams, "service">,
				options?: LogActivityOptions,
			): Promise<void> {
				return activityLogger.log(
					{
						...params,
						service,
					},
					options,
				);
			},

			async success(
				params: Omit<LogActivityParams, "service" | "status">,
				options?: LogActivityOptions,
			): Promise<void> {
				return activityLogger.log(
					{
						...params,
						service,
						status: "success",
					},
					options,
				);
			},

			async failed(
				params: Omit<LogActivityParams, "service" | "status">,
				options?: LogActivityOptions,
			): Promise<void> {
				return activityLogger.log(
					{
						...params,
						service,
						status: "failed",
					},
					options,
				);
			},

			async error(
				params: Omit<LogActivityParams, "service" | "status"> & {
					error_message: string;
				},
				options?: LogActivityOptions,
			): Promise<void> {
				return activityLogger.log(
					{
						...params,
						service,
						status: "error",
					},
					options,
				);
			},
		};
	}
}

let globalActivityLogger = new ActivityLogger();

export function setLoggingServiceUrl(url: string): void {
	globalActivityLogger = new ActivityLogger({ url });
}

export function getLoggingServiceUrl(): string {
	return globalActivityLogger["url"];
}

export async function logActivity(
	params: LogActivityParams,
	options?: LogActivityOptions,
): Promise<void> {
	return globalActivityLogger.log(params, options);
}

export function createTracker(service: Service, customUrl?: string) {
	if (customUrl) {
		return new ActivityLogger({ url: customUrl }).createTracker(service);
	}
	return globalActivityLogger.createTracker(service);
}
