import { type NextRequest, NextResponse } from "next/server";

/**
 * Proxy route for authenticated bulk job results API
 */

const VERIFY_SERVICE_URL =
  process.env.VERIFY_SERVICE_URL || "http://localhost:3040";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params;
    const cookie = request.headers.get("cookie") || "";
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "50";

    const response = await fetch(
      `${VERIFY_SERVICE_URL}/api/verify/v1/bulk-jobs/${jobId}/results?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Bulk job results API proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch job results",
      },
      { status: 500 },
    );
  }
}
