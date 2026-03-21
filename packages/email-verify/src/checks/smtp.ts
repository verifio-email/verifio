import * as net from "node:net";
import type { SmtpCheckResult } from "../types";

/**
 * Perform SMTP verification by connecting to the MX server and simulating an email send
 * @param email The email address to verify
 * @param mxRecords Array of MX records for the domain
 * @param timeoutMs Timeout in milliseconds
 * @returns SmtpCheckResult
 */
export async function checkSmtp(
	email: string,
	mxRecords: string[],
	timeoutMs = 10000,
): Promise<SmtpCheckResult> {
	if (!mxRecords || mxRecords.length === 0) {
		return {
			valid: false,
			mailboxExists: false,
			isCatchAll: null,
			error: "No MX records available",
		};
	}

	// Use the highest priority MX record (first in the list)
	const mxHost = mxRecords[0];

	return new Promise((resolve) => {
		const socket = new net.Socket();
		let response = "";
		let step = 0;
		let valid: boolean | null = null;
		let mailboxExists: boolean | null = null;
		let errorStr: string | undefined;

		const timer = setTimeout(() => {
			socket.destroy();
			resolve({
				valid: null,
				mailboxExists: null,
				isCatchAll: null,
				error: "SMTP connection timeout",
				response,
			});
		}, timeoutMs);

		let buffer = "";

		socket.on("data", (data) => {
			const str = data.toString();
			buffer += str;
			response += str;

			// Check if we have received a complete response (ends with CRLF)
			if (!buffer.endsWith("\r\n") && !buffer.endsWith("\n")) {
				return; // Wait for more data
			}

			// Split into lines
			const lines = buffer.split(/\r?\n/).filter(Boolean);
			
			// Get the last line
			const lastLine = lines[lines.length - 1];

			if (!lastLine) {
				return;
			}

			// Multiline responses have a dash after the code (e.g. "250-SIZE")
			// The final line of the response will have a space (e.g. "250 OK")
			if (!lastLine.match(/^\d{3}\s/)) {
				return; // Still receiving multiline response
			}

			// We have a full response for this step
			buffer = ""; // Clear buffer
			const code = parseInt(lastLine.substring(0, 3), 10);

			if (step === 0 && code === 220) {
				step++;
				socket.write(`EHLO verifio.email\r\n`);
			} else if (step === 1 && code === 250) {
				step++;
				socket.write(`MAIL FROM:<verify@verifio.email>\r\n`);
			} else if (step === 2 && code === 250) {
				step++;
				socket.write(`RCPT TO:<${email}>\r\n`);
			} else if (step === 3) {
				if (code === 250) {
					valid = true;
					mailboxExists = true;
				} else if (code >= 500 && code < 600) {
					valid = false;
					mailboxExists = false;
				} else {
					valid = null;
					mailboxExists = null;
					errorStr = `Unexpected response code: ${code}`;
				}
				step++;
				socket.write("QUIT\r\n");
			} else if (step === 4) {
				socket.destroy();
			} else {
				errorStr = `Error at step ${step} with code ${code}`;
				step++;
				socket.destroy();
			}
		});

		socket.on("error", (err) => {
			clearTimeout(timer);
			resolve({
				valid: null,
				mailboxExists: null,
				isCatchAll: null,
				error: err.message,
				response,
			});
		});

		socket.on("close", () => {
			clearTimeout(timer);
			resolve({
				valid,
				mailboxExists,
				isCatchAll: null,
				response,
				error: errorStr,
			});
		});

		socket.connect({ port: 25, host: mxHost });
	});
}
