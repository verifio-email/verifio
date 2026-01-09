/**
 * Shared types for logs components
 */

export type ActivityLog = {
  id: string;
  user_id: string | null;
  organization_id: string;
  api_key_id: string | null;
  service: string;
  endpoint: string;
  method: string;
  resource_type: string | null;
  resource_id: string | null;
  status: string;
  result: string | null;
  error_message: string | null;
  credits_used: number | null;
  duration_ms: number | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

// Type for verification history item (simplified)
export type VerificationHistoryItem = {
  id: string;
  email: string;
  state: string;
  score: number;
  reason: string;
  result?: {
    analytics?: {
      riskLevel: string;
    };
  };
  createdAt: string;
};

// Type for enrichment data passed to UserLogRow
export type VerificationEnrichment = {
  score: number;
  state: string;
  riskLevel: string | null;
};
