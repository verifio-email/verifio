import { type NextRequest, NextResponse } from "next/server";

/**
 * Proxy route for email verification API
 * Forwards requests to the verify backend service
 */

// Get the verify service URL from env or default to localhost
const VERIFY_SERVICE_URL =
  process.env.VERIFY_SERVICE_URL || "http://localhost:3040";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to verify service
    const response = await fetch(`${VERIFY_SERVICE_URL}/api/verify/v1/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
