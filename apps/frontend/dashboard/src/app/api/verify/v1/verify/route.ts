import { type NextRequest, NextResponse } from "next/server";

/**
 * Proxy route for authenticated email verification API
 * Forwards requests to the verify backend service
 * This endpoint stores results in the database
 */

const VERIFY_SERVICE_URL =
  process.env.VERIFY_SERVICE_URL || "http://localhost:3040";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookie = request.headers.get("cookie") || "";

    // Forward request to authenticated verify endpoint
    const response = await fetch(`${VERIFY_SERVICE_URL}/api/verify/v1/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie, // Pass cookie for auth
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Verify API proxy error:", error);

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
