package verifio

import "encoding/json"

// ============================================================================
// VERIFICATION STATE
// ============================================================================

type VerificationState string

const (
	StateDeliverable   VerificationState = "deliverable"
	StateUndeliverable VerificationState = "undeliverable"
	StateRisky         VerificationState = "risky"
	StateUnknown       VerificationState = "unknown"
)

type RiskLevel string

const (
	RiskLow    RiskLevel = "low"
	RiskMedium RiskLevel = "medium"
	RiskHigh   RiskLevel = "high"
)

type VerificationReason string

func (v VerificationReason) String() string {
	return string(v)
}

// ============================================================================
// CHECK RESULTS
// ============================================================================

type SyntaxCheckResult struct {
	Valid bool   `json:"valid"`
	Error string `json:"error,omitempty"`
}

type DnsCheckResult struct {
	Valid        bool     `json:"valid"`
	DomainExists bool     `json:"domainExists"`
	HasMx        bool     `json:"hasMx"`
	MxRecords    []string `json:"mxRecords"`
	PreferredMx  string   `json:"preferredMx,omitempty"`
	Error        string   `json:"error,omitempty"`
}

type DisposableCheckResult struct {
	IsDisposable bool   `json:"isDisposable"`
	Provider     string `json:"provider,omitempty"`
}

type RoleCheckResult struct {
	IsRole bool   `json:"isRole"`
	Role   string `json:"role,omitempty"`
}

type FreeProviderCheckResult struct {
	IsFree   bool   `json:"isFree"`
	Provider string `json:"provider,omitempty"`
}

type TypoCheckResult struct {
	HasTypo         bool   `json:"hasTypo"`
	Suggestion      string `json:"suggestion,omitempty"`
	OriginalDomain  string `json:"originalDomain,omitempty"`
	SuggestedDomain string `json:"suggestedDomain,omitempty"`
}

type SmtpCheckResult struct {
	Valid         *bool  `json:"valid"`
	MailboxExists *bool  `json:"mailboxExists"`
	IsCatchAll    *bool  `json:"isCatchAll"`
	Response      string `json:"response,omitempty"`
	Error         string `json:"error,omitempty"`
}

type VerificationChecks struct {
	Syntax       SyntaxCheckResult       `json:"syntax"`
	Dns          DnsCheckResult          `json:"dns"`
	Disposable   DisposableCheckResult   `json:"disposable"`
	Role         RoleCheckResult         `json:"role"`
	FreeProvider FreeProviderCheckResult `json:"freeProvider"`
	Typo         TypoCheckResult         `json:"typo"`
	Smtp         SmtpCheckResult         `json:"smtp"`
}

// ============================================================================
// ANALYTICS
// ============================================================================

type VerificationAnalytics struct {
	DidYouMean        *string   `json:"didYouMean"`
	DomainAge         *int      `json:"domainAge"`
	SmtpProvider      *string   `json:"smtpProvider"`
	RiskLevel         RiskLevel `json:"riskLevel"`
	QualityIndicators []string  `json:"qualityIndicators"`
	Warnings          []string  `json:"warnings"`
}

// ============================================================================
// VERIFICATION RESULT
// ============================================================================

type VerificationResult struct {
	ID         *string               `json:"id,omitempty"`
	Email      string                `json:"email"`
	User       string                `json:"user"`
	Domain     string                `json:"domain"`
	Tag        *string               `json:"tag"`
	State      VerificationState     `json:"state"`
	Reason     VerificationReason    `json:"reason"`
	Score      int                   `json:"score"`
	Checks     VerificationChecks    `json:"checks"`
	Analytics  VerificationAnalytics `json:"analytics"`
	Duration   int                   `json:"duration"`
	VerifiedAt string                `json:"verifiedAt"`
}

// ============================================================================
// BULK VERIFICATION
// ============================================================================

type ScoreDistribution struct {
	Excellent int `json:"excellent"`
	Good      int `json:"good"`
	Fair      int `json:"fair"`
	Poor      int `json:"poor"`
}

type VerificationBreakdown struct {
	Disposable    int `json:"disposable"`
	RoleBased     int `json:"roleBased"`
	FreeProvider  int `json:"freeProvider"`
	CatchAll      int `json:"catchAll"`
	SyntaxErrors  int `json:"syntaxErrors"`
	DnsErrors     int `json:"dnsErrors"`
	TyposDetected int `json:"typosDetected"`
}

type BulkVerificationStats struct {
	Total             int                   `json:"total"`
	Processed         int                   `json:"processed"`
	Deliverable       int                   `json:"deliverable"`
	Undeliverable     int                   `json:"undeliverable"`
	Risky             int                   `json:"risky"`
	Unknown           int                   `json:"unknown"`
	Breakdown         VerificationBreakdown `json:"breakdown"`
	AverageScore      float64               `json:"averageScore"`
	ScoreDistribution ScoreDistribution     `json:"scoreDistribution"`
	StartedAt         string                `json:"startedAt"`
	CompletedAt       *string               `json:"completedAt"`
	TotalDuration     int                   `json:"totalDuration"`
	AverageDuration   int                   `json:"averageDuration"`
}

type BulkJobStatus string

const (
	StatusPending    BulkJobStatus = "pending"
	StatusProcessing BulkJobStatus = "processing"
	StatusCompleted  BulkJobStatus = "completed"
	StatusFailed     BulkJobStatus = "failed"
	StatusCancelled  BulkJobStatus = "cancelled"
)

type BulkVerificationJob struct {
	ID              string                 `json:"id"`
	Status          BulkJobStatus          `json:"status"`
	TotalEmails     int                    `json:"totalEmails"`
	ProcessedEmails int                    `json:"processedEmails"`
	Stats           *BulkVerificationStats `json:"stats"`
	CreatedAt       string                 `json:"createdAt"`
	CompletedAt     *string                `json:"completedAt"`
}

// ============================================================================
// OPTIONS
// ============================================================================

type VerifyOptions struct {
	SkipDisposable *bool `json:"skipDisposable,omitempty"`
	SkipRole       *bool `json:"skipRole,omitempty"`
	SkipTypo       *bool `json:"skipTypo,omitempty"`
}

type VerifioConfig struct {
	APIKey  string
	BaseURL string
}

type PaginationOptions struct {
	Page  *int
	Limit *int
}

// ============================================================================
// API RESPONSES
// ============================================================================

type PaginationInfo struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
}

type PaginatedData[T any] struct {
	Items      []T            `json:"items"`
	Pagination PaginationInfo `json:"pagination"`
}

type APIResponse[T any] struct {
	Success bool            `json:"success"`
	Data    *T              `json:"data,omitempty"`
	Error   string          `json:"error,omitempty"`
	RawData json.RawMessage `json:"-"`
}

type GenericAPIResponse struct {
	Success bool            `json:"success"`
	Data    json.RawMessage `json:"data,omitempty"`
	Error   string          `json:"error,omitempty"`
}
