import { type NextRequest, NextResponse } from "next/server";

const LOGGING_SERVICE_URL =
  process.env.LOGGING_SERVICE_URL || "http://localhost:8020";

/**
 * Proxy route for logging service
 * Note: This route is protected by the (protected) layout which requires auth
 * The organization_id is passed from the frontend which has it from org-provider
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Organization ID is required - passed from frontend
    const organizationId = searchParams.get("organization_id");
    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 },
      );
    }

    // Build params for logging service
    const params = new URLSearchParams();
    params.set("organization_id", organizationId);

    // Forward optional filters
    const apiKeyId = searchParams.get("api_key_id");
    const service = searchParams.get("service");
    const endpoint = searchParams.get("endpoint");
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    if (apiKeyId) params.set("api_key_id", apiKeyId);
    if (service) params.set("service", service);
    if (endpoint) params.set("endpoint", endpoint);
    if (status) params.set("status", status);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (search) params.set("search", search);
    if (page) params.set("page", page);
    if (limit) params.set("limit", limit);

    // Fetch logs from logging service
    const response = await fetch(
      `${LOGGING_SERVICE_URL}/api/logging/v1/logs?${params.toString()}`,
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: error || "Failed to fetch logs" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
