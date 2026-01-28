import type { ToolsModel } from "@verifio/tools/model/tools.model";

export namespace ToolsTypes {
	export type EmailBody = typeof ToolsModel.emailBody.static;
	export type SyntaxResponse = typeof ToolsModel.syntaxResponse.static;
	export type DisposableResponse = typeof ToolsModel.disposableResponse.static;
	export type ErrorResponse = typeof ToolsModel.errorResponse.static;
	export type HealthResponse = typeof ToolsModel.healthResponse.static;
}
