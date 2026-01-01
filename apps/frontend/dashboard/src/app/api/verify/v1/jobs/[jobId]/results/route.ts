import { type NextRequest, NextResponse } from "next/server";

/**
 * Proxy route for bulk job results API
 * Forwards requests to the verify backend service
 */

const VERIFY_SERVICE_URL =
  process.env.VERIFY_SERVICE_URL || "http://localhost:3040";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params;

    // Get query params for pagination
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "100";

    const response = await fetch(
      `${VERIFY_SERVICE_URL}/api/verify/v1/jobs/${jobId}/results?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Job results API proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to connect to verification service. Is it running on port 3040?",
      },
      { status: 500 },
    );
  }
}
