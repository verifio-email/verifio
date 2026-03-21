use serde::{Deserialize, Serialize};

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerifyOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub skip_disposable: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub skip_role: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub skip_typo: Option<bool>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PaginationOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerificationResult {
    pub id: Option<String>,
    pub email: String,
    pub user: String,
    pub domain: String,
    pub tag: Option<String>,
    pub state: String,
    pub reason: String,
    pub score: i32,
    pub checks: VerificationChecks,
    pub analytics: VerificationAnalytics,
    pub duration: i32,
    pub verified_at: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerificationChecks {
    pub syntax: SyntaxCheckResult,
    pub dns: DnsCheckResult,
    pub disposable: DisposableCheckResult,
    pub role: RoleCheckResult,
    pub free_provider: FreeProviderCheckResult,
    pub typo: TypoCheckResult,
    pub smtp: SmtpCheckResult,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SyntaxCheckResult {
    pub valid: bool,
    pub error: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DnsCheckResult {
    pub valid: bool,
    pub domain_exists: bool,
    pub has_mx: bool,
    pub mx_records: Option<Vec<String>>,
    pub preferred_mx: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DisposableCheckResult {
    pub is_disposable: bool,
    pub provider: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoleCheckResult {
    pub is_role: bool,
    pub role: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FreeProviderCheckResult {
    pub is_free: bool,
    pub provider: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TypoCheckResult {
    pub has_typo: bool,
    pub suggestion: Option<String>,
    pub original_domain: Option<String>,
    pub suggested_domain: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SmtpCheckResult {
    pub valid: Option<bool>,
    pub mailbox_exists: Option<bool>,
    pub is_catch_all: Option<bool>,
    pub response: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerificationAnalytics {
    pub did_you_mean: Option<String>,
    pub domain_age: Option<i32>,
    pub smtp_provider: Option<String>,
    pub risk_level: String,
    pub quality_indicators: Vec<String>,
    pub warnings: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BulkVerificationJob {
    pub id: String,
    pub status: String,
    pub total_emails: i32,
    pub processed_emails: i32,
    pub stats: Option<BulkVerificationStats>,
    pub created_at: String,
    pub completed_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BulkVerificationStats {
    pub total: i32,
    pub processed: i32,
    pub deliverable: i32,
    pub undeliverable: i32,
    pub risky: i32,
    pub unknown: i32,
    pub breakdown: VerificationBreakdown,
    pub average_score: f64,
    pub score_distribution: ScoreDistribution,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerificationBreakdown {
    pub disposable: i32,
    pub role_based: i32,
    pub free_provider: i32,
    pub catch_all: i32,
    pub syntax_errors: i32,
    pub dns_errors: i32,
    pub typos_detected: i32,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScoreDistribution {
    pub excellent: i32,
    pub good: i32,
    pub fair: i32,
    pub poor: i32,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PaginatedData<T> {
    pub items: Vec<T>,
    pub pagination: PaginationInfo,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PaginationInfo {
    pub page: u32,
    pub limit: u32,
    pub total: u32,
    pub total_pages: u32,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}
