using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Verifio.Models
{
    public class VerifyOptions
    {
        [JsonPropertyName("skipDisposable")]
        public bool? SkipDisposable { get; set; }

        [JsonPropertyName("skipRole")]
        public bool? SkipRole { get; set; }

        [JsonPropertyName("skipTypo")]
        public bool? SkipTypo { get; set; }
    }

    public class PaginationOptions
    {
        public int? Page { get; set; }
        public int? Limit { get; set; }
    }

    public class PaginatedData<T>
    {
        [JsonPropertyName("items")]
        public List<T> Items { get; set; } = new();

        [JsonPropertyName("pagination")]
        public PaginationInfo Pagination { get; set; } = new();
    }

    public class PaginationInfo
    {
        [JsonPropertyName("page")]
        public int Page { get; set; }

        [JsonPropertyName("limit")]
        public int Limit { get; set; }

        [JsonPropertyName("total")]
        public int Total { get; set; }

        [JsonPropertyName("totalPages")]
        public int TotalPages { get; set; }
    }

    public class VerificationResult
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [JsonPropertyName("user")]
        public string? User { get; set; }

        [JsonPropertyName("domain")]
        public string? Domain { get; set; }

        [JsonPropertyName("tag")]
        public string? Tag { get; set; }

        [JsonPropertyName("state")]
        public string? State { get; set; }

        [JsonPropertyName("reason")]
        public string? Reason { get; set; }

        [JsonPropertyName("score")]
        public int Score { get; set; }

        [JsonPropertyName("checks")]
        public VerificationChecks? Checks { get; set; }

        [JsonPropertyName("analytics")]
        public VerificationAnalytics? Analytics { get; set; }

        [JsonPropertyName("duration")]
        public int Duration { get; set; }

        [JsonPropertyName("verifiedAt")]
        public string? VerifiedAt { get; set; }
    }

    public class VerificationChecks
    {
        [JsonPropertyName("syntax")]
        public SyntaxCheckResult? Syntax { get; set; }

        [JsonPropertyName("dns")]
        public DnsCheckResult? Dns { get; set; }

        [JsonPropertyName("disposable")]
        public DisposableCheckResult? Disposable { get; set; }

        [JsonPropertyName("role")]
        public RoleCheckResult? Role { get; set; }

        [JsonPropertyName("freeProvider")]
        public FreeProviderCheckResult? FreeProvider { get; set; }

        [JsonPropertyName("typo")]
        public TypoCheckResult? Typo { get; set; }

        [JsonPropertyName("smtp")]
        public SmtpCheckResult? Smtp { get; set; }
    }

    public class SyntaxCheckResult
    {
        [JsonPropertyName("valid")]
        public bool Valid { get; set; }

        [JsonPropertyName("error")]
        public string? Error { get; set; }
    }

    public class DnsCheckResult
    {
        [JsonPropertyName("valid")]
        public bool Valid { get; set; }

        [JsonPropertyName("domainExists")]
        public bool DomainExists { get; set; }

        [JsonPropertyName("hasMx")]
        public bool HasMx { get; set; }

        [JsonPropertyName("mxRecords")]
        public List<string>? MxRecords { get; set; }

        [JsonPropertyName("preferredMx")]
        public string? PreferredMx { get; set; }

        [JsonPropertyName("error")]
        public string? Error { get; set; }
    }

    public class DisposableCheckResult
    {
        [JsonPropertyName("isDisposable")]
        public bool IsDisposable { get; set; }

        [JsonPropertyName("provider")]
        public string? Provider { get; set; }
    }

    public class RoleCheckResult
    {
        [JsonPropertyName("isRole")]
        public bool IsRole { get; set; }

        [JsonPropertyName("role")]
        public string? Role { get; set; }
    }

    public class FreeProviderCheckResult
    {
        [JsonPropertyName("isFree")]
        public bool IsFree { get; set; }

        [JsonPropertyName("provider")]
        public string? Provider { get; set; }
    }

    public class TypoCheckResult
    {
        [JsonPropertyName("hasTypo")]
        public bool HasTypo { get; set; }

        [JsonPropertyName("suggestion")]
        public string? Suggestion { get; set; }

        [JsonPropertyName("originalDomain")]
        public string? OriginalDomain { get; set; }

        [JsonPropertyName("suggestedDomain")]
        public string? SuggestedDomain { get; set; }
    }

    public class SmtpCheckResult
    {
        [JsonPropertyName("valid")]
        public bool? Valid { get; set; }

        [JsonPropertyName("mailboxExists")]
        public bool? MailboxExists { get; set; }

        [JsonPropertyName("isCatchAll")]
        public bool? IsCatchAll { get; set; }

        [JsonPropertyName("response")]
        public string? Response { get; set; }

        [JsonPropertyName("error")]
        public string? Error { get; set; }
    }

    public class VerificationAnalytics
    {
        [JsonPropertyName("didYouMean")]
        public string? DidYouMean { get; set; }

        [JsonPropertyName("domainAge")]
        public int? DomainAge { get; set; }

        [JsonPropertyName("smtpProvider")]
        public string? SmtpProvider { get; set; }

        [JsonPropertyName("riskLevel")]
        public string? RiskLevel { get; set; }

        [JsonPropertyName("qualityIndicators")]
        public List<string>? QualityIndicators { get; set; }

        [JsonPropertyName("warnings")]
        public List<string>? Warnings { get; set; }
    }

    public class BulkVerificationJob
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("status")]
        public string? Status { get; set; }

        [JsonPropertyName("totalEmails")]
        public int TotalEmails { get; set; }

        [JsonPropertyName("processedEmails")]
        public int ProcessedEmails { get; set; }

        [JsonPropertyName("stats")]
        public BulkVerificationStats? Stats { get; set; }

        [JsonPropertyName("createdAt")]
        public string? CreatedAt { get; set; }

        [JsonPropertyName("completedAt")]
        public string? CompletedAt { get; set; }
    }

    public class BulkVerificationStats
    {
        [JsonPropertyName("total")]
        public int Total { get; set; }

        [JsonPropertyName("processed")]
        public int Processed { get; set; }

        [JsonPropertyName("deliverable")]
        public int Deliverable { get; set; }

        [JsonPropertyName("undeliverable")]
        public int Undeliverable { get; set; }

        [JsonPropertyName("risky")]
        public int Risky { get; set; }

        [JsonPropertyName("unknown")]
        public int Unknown { get; set; }

        [JsonPropertyName("breakdown")]
        public VerificationBreakdown? Breakdown { get; set; }

        [JsonPropertyName("averageScore")]
        public double AverageScore { get; set; }

        [JsonPropertyName("scoreDistribution")]
        public ScoreDistribution? ScoreDistribution { get; set; }
    }

    public class VerificationBreakdown
    {
        [JsonPropertyName("disposable")]
        public int Disposable { get; set; }

        [JsonPropertyName("roleBased")]
        public int RoleBased { get; set; }

        [JsonPropertyName("freeProvider")]
        public int FreeProvider { get; set; }

        [JsonPropertyName("catchAll")]
        public int CatchAll { get; set; }

        [JsonPropertyName("syntaxErrors")]
        public int SyntaxErrors { get; set; }

        [JsonPropertyName("dnsErrors")]
        public int DnsErrors { get; set; }

        [JsonPropertyName("typosDetected")]
        public int TyposDetected { get; set; }
    }

    public class ScoreDistribution
    {
        [JsonPropertyName("excellent")]
        public int Excellent { get; set; }

        [JsonPropertyName("good")]
        public int Good { get; set; }

        [JsonPropertyName("fair")]
        public int Fair { get; set; }

        [JsonPropertyName("poor")]
        public int Poor { get; set; }
    }

    public class ApiResponse<T>
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("data")]
        public T? Data { get; set; }

        [JsonPropertyName("error")]
        public string? Error { get; set; }
    }
}
