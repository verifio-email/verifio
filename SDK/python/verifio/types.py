import sys
from typing import Dict, List, Optional, TypeVar, Generic, Any

if sys.version_info >= (3, 8):
    from typing import TypedDict, Literal
else:
    from typing_extensions import TypedDict, Literal

VerificationState = Literal["deliverable", "undeliverable", "risky", "unknown"]
RiskLevel = Literal["low", "medium", "high"]

VerificationReason = Literal[
    "valid_mailbox", "accepted_email", "invalid_syntax", "invalid_domain",
    "no_mx_records", "mailbox_not_found", "mailbox_full", "disposable_email",
    "role_based_email", "catch_all_domain", "free_email_provider", "timeout",
    "connection_error", "unknown_error",
]

class SyntaxCheckResult(TypedDict):
    valid: bool
    error: Optional[str]

class DnsCheckResult(TypedDict):
    valid: bool
    domainExists: bool
    hasMx: bool
    mxRecords: List[str]
    preferredMx: Optional[str]
    error: Optional[str]

class DisposableCheckResult(TypedDict):
    isDisposable: bool
    provider: Optional[str]

class RoleCheckResult(TypedDict):
    isRole: bool
    role: Optional[str]

class FreeProviderCheckResult(TypedDict):
    isFree: bool
    provider: Optional[str]

class TypoCheckResult(TypedDict):
    hasTypo: bool
    suggestion: Optional[str]
    originalDomain: Optional[str]
    suggestedDomain: Optional[str]

class SmtpCheckResult(TypedDict):
    valid: Optional[bool]
    mailboxExists: Optional[bool]
    isCatchAll: Optional[bool]
    response: Optional[str]
    error: Optional[str]

class VerificationChecks(TypedDict):
    syntax: SyntaxCheckResult
    dns: DnsCheckResult
    disposable: DisposableCheckResult
    role: RoleCheckResult
    freeProvider: FreeProviderCheckResult
    typo: TypoCheckResult
    smtp: SmtpCheckResult

class VerificationAnalytics(TypedDict):
    didYouMean: Optional[str]
    domainAge: Optional[int]
    smtpProvider: Optional[str]
    riskLevel: RiskLevel
    qualityIndicators: List[str]
    warnings: List[str]

class VerificationResult(TypedDict):
    id: Optional[str]
    email: str
    user: str
    domain: str
    tag: Optional[str]
    state: VerificationState
    reason: VerificationReason
    score: int
    checks: VerificationChecks
    analytics: VerificationAnalytics
    duration: int
    verifiedAt: str

class ScoreDistribution(TypedDict):
    excellent: int
    good: int
    fair: int
    poor: int

class VerificationBreakdown(TypedDict):
    disposable: int
    roleBased: int
    freeProvider: int
    catchAll: int
    syntaxErrors: int
    dnsErrors: int
    typosDetected: int

class BulkVerificationStats(TypedDict):
    total: int
    processed: int
    deliverable: int
    undeliverable: int
    risky: int
    unknown: int
    breakdown: VerificationBreakdown
    averageScore: float
    scoreDistribution: ScoreDistribution
    startedAt: str
    completedAt: Optional[str]
    totalDuration: int
    averageDuration: int

BulkJobStatus = Literal["pending", "processing", "completed", "failed", "cancelled"]

class BulkVerificationJob(TypedDict):
    id: str
    status: BulkJobStatus
    totalEmails: int
    processedEmails: int
    stats: Optional[BulkVerificationStats]
    createdAt: str
    completedAt: Optional[str]

class VerifyOptions(TypedDict, total=False):
    skipDisposable: Optional[bool]
    skipRole: Optional[bool]
    skipTypo: Optional[bool]

class VerifioConfig(TypedDict, total=False):
    apiKey: str
    baseUrl: Optional[str]

class PaginationOptions(TypedDict, total=False):
    page: Optional[int]
    limit: Optional[int]

T = TypeVar("T")

class PaginationInfo(TypedDict):
    page: int
    limit: int
    total: int
    totalPages: int

class PaginatedData(TypedDict, Generic[T]):
    items: List[T]
    pagination: PaginationInfo

class ApiResponse(TypedDict, Generic[T], total=False):
    success: bool
    data: Optional[T]
    error: Optional[str]

class PaginatedResponse(TypedDict, Generic[T], total=False):
    success: bool
    data: Optional[PaginatedData[T]]
    error: Optional[str]
