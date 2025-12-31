/**
 * Checks Module Exports
 */

export { checkDisposable, getDisposableCount } from "./disposable";
export { checkDns, detectSmtpProvider } from "./dns";
export { checkFreeProvider, getFreeProviderCount } from "./free-provider";
export { checkRole, getRoleCount } from "./role";
export { type EmailComponents, parseEmail, validateSyntax } from "./syntax";
export { checkTypo, domainHasTypo } from "./typo";
