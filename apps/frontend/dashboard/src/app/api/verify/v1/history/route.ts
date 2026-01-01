import { type NextRequest, NextResponse } from "next/server";

/**
 * Proxy route for verification history API
 * Forwards requests to the verify backend service
 */

const VERIFY_SERVICE_URL =
  process.env.VERIFY_SERVICE_URL || "http://localhost:3040";

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const response = await fetch(
      `${VERIFY_SERVICE_URL}/api/verify/v1/history?page=${page}&limit=${limit}`,
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
    console.error("History API proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch verification history",
      },
      { status: 500 },
    );
  }
}
