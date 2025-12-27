import { inngest } from "@be/workflow/inngest";
import { logger } from "@verifio/logger";

export const helloWorldFunction = inngest.createFunction(
	{ id: "hello-world", name: "Hello World" },
	{ event: "test.hello" },
	async ({ event, step }) => {
		logger.info({ event }, "Hello World function triggered");

		await step.run("log-message", async () => {
			logger.info("Hello from Inngest workflow!");
			return { message: "Hello World!" };
		});

		return {
			success: true,
			message: "Hello World function completed",
		};
	},
);
