import { t } from "elysia";

export namespace ToolsModel {
	export const emailBody = t.Object({
		email: t.String({
			minLength: 3,
			maxLength: 320,
			description: "Email address to validate",
		}),
	});

	export type EmailBody = typeof emailBody.static;

	export const syntaxResponse = t.Object({
		success: t.Boolean(),
		data: t.Optional(
			t.Object({
				valid: t.Boolean(),
				normalized: t.Optional(t.String()),
				parsed: t.Optional(
					t.Object({
						email: t.String(),
						user: t.Optional(t.String()),
						domain: t.Optional(t.String()),
						tag: t.Optional(t.String()),
					}),
				),
				typo: t.Optional(
					t.Object({
						hasTypo: t.Boolean(),
						suggestion: t.Optional(t.String()),
						originalDomain: t.Optional(t.String()),
						suggestedDomain: t.Optional(t.String()),
						correctedEmail: t.Optional(t.String()),
					}),
				),
				provider: t.Union([t.String(), t.Null()]),
				rfcCompliant: t.Boolean(),
				errors: t.Array(t.String()),
				warnings: t.Array(t.String()),
			}),
		),
		error: t.Optional(t.String()),
	});

	export type SyntaxResponse = typeof syntaxResponse.static;

	export const disposableResponse = t.Object({
		success: t.Boolean(),
		data: t.Optional(
			t.Object({
				email: t.String(),
				isDisposable: t.Boolean(),
				domain: t.String(),
				provider: t.Union([t.String(), t.Null()]),
				databaseSize: t.Number(),
				lastUpdated: t.String(),
			}),
		),
		error: t.Optional(t.String()),
	});

	export type DisposableResponse = typeof disposableResponse.static;

	export const errorResponse = t.Object({
		message: t.String({ description: "Error message" }),
		errorCode: t.Optional(t.String({ description: "Error code" })),
	});

	export type ErrorResponse = typeof errorResponse.static;
}
