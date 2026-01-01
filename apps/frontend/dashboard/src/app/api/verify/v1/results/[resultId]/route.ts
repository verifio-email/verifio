import { type NextRequest, NextResponse } from "next/server";

/**
 * Proxy route for fetching single verification result
 */

const VERIFY_SERVICE_URL =
  process.env.VERIFY_SERVICE_URL || "http://localhost:3040";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resultId: string }> },
) {
  try {
    const { resultId } = await params;
    const cookie = request.headers.get("cookie") || "";

    const response = await fetch(
      `${VERIFY_SERVICE_URL}/api/verify/v1/results/${resultId}`,
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
    console.error("Verification result fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch verification result",
      },
      { status: 500 },
    );
  }
}
