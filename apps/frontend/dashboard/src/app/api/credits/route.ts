import { type NextRequest, NextResponse } from "next/server";

const CREDITS_SERVICE_URL =
  process.env.CREDITS_SERVICE_URL || "http://localhost:8030";

interface CreditUsageResponse {
  success: boolean;
  data: {
    monthly: {
      used: number;
      limit: number;
      remaining: number;
      percentage: number;
    };
    resetInfo: {
      periodStart: string;
      periodEnd: string;
      daysUntilReset: number;
    };
  };
}

/**
 * Get credit usage for an organization
 * Calls the new credits microservice
 */
export async function GET(request: NextRequest) {
  try {
    // Forward cookies for authentication
    const cookie = request.headers.get("cookie") || "";

    const response = await fetch(
      `${CREDITS_SERVICE_URL}/api/credits/v1/credits`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 },
        );
      }
      throw new Error(`Credits service returned ${response.status}`);
    }

    const serviceData = await response.json();

    if (!serviceData.success) {
      throw new Error(serviceData.error || "Failed to fetch credits");
    }

    // Calculate days until reset
    const periodEnd = new Date(serviceData.data.periodEnd);
    const now = new Date();
    const daysUntilReset = Math.ceil(
      (periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    const creditResponse: CreditUsageResponse = {
      success: true,
      data: {
        monthly: {
          used: serviceData.data.used,
          limit: serviceData.data.limit,
          remaining: serviceData.data.remaining,
          percentage: serviceData.data.percentUsed,
        },
        resetInfo: {
          periodStart: serviceData.data.periodStart,
          periodEnd: serviceData.data.periodEnd,
          daysUntilReset: Math.max(0, daysUntilReset),
        },
      },
    };

    return NextResponse.json(creditResponse);
  } catch (error) {
    console.error("Error fetching credit usage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
