import { HTTPClient, type VerifioConfig } from "./client.js";
import { AudienceService } from "./services/audience.js";
import { DomainService } from "./services/domain.js";
import { MailService } from "./services/mail.js";
import { WebhookService } from "./services/webhook.js";

/**
 * Verifio SDK Client
 *
 * @example
 * ```typescript
 * import Verifio from 'verifio-email';
 *
 * const verifio = new Verifio({
 *   url: 'https://api.verifio.email',
 *   key: 'your-api-key'
 * });
 *
 * // Send an email
 * const result = await verifio.mail.send({
 *   from: 'sender@example.com',
 *   to: 'recipient@example.com',
 *   subject: 'Hello',
 *   text: 'Hello World!'
 * });
 * ```
 */
export class Verifio {
	public readonly mail: MailService;
	public readonly domain: DomainService;
	public readonly webhook: WebhookService;
	public readonly audience: AudienceService;

	/**
	 * Create a new Verifio SDK client
	 * @param config Configuration object with url and key
	 */
	constructor(config: VerifioConfig) {
		const client = new HTTPClient(config);

		this.mail = new MailService(client);
		this.domain = new DomainService(client);
		this.webhook = new WebhookService(client);
		this.audience = new AudienceService(client);
	}
}

export default Verifio;

export type { VerifioConfig } from "./client.js";
export * from "./errors.js";
// Export types
export * from "./types.js";
