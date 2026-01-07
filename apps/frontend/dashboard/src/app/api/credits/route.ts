import { type NextRequest, NextResponse } from "next/server";

const LOGGING_SERVICE_URL =
  process.env.LOGGING_SERVICE_URL || "http://localhost:8020";

// Credit limits
const DAILY_CREDIT_LIMIT = 100;
const MONTHLY_CREDIT_LIMIT = 3000;

interface CreditUsageResponse {
  success: boolean;
  data: {
    daily: {
      used: number;
      limit: number;
      remaining: number;
      percentage: number;
    };
    monthly: {
      used: number;
      limit: number;
      remaining: number;
      percentage: number;
    };
    resetInfo: {
      dailyResetAt: string;
      monthlyResetAt: string;
      daysUntilMonthlyReset: number;
    };
    billingCycle: {
      start: string;
      end: string;
    };
  };
}

/**
 * Get credit usage for an organization
 * Aggregates credits_used from the logging service
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

    // Get current date info
    const now = new Date();

    // Daily range (today UTC)
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const todayEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    // Monthly range (this month UTC)
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    // Calculate reset times
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

    const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
    const daysUntilMonthlyReset = Math.ceil((nextMonthStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Fetch daily usage
    const dailyParams = new URLSearchParams();
    dailyParams.set("organization_id", organizationId);
    dailyParams.set("from", todayStart.toISOString());
    dailyParams.set("to", todayEnd.toISOString());
    dailyParams.set("limit", "1"); // We just need the total count

    // Fetch monthly usage
    const monthlyParams = new URLSearchParams();
    monthlyParams.set("organization_id", organizationId);
    monthlyParams.set("from", monthStart.toISOString());
    monthlyParams.set("to", monthEnd.toISOString());
    monthlyParams.set("limit", "1"); // We just need the total count

    // Parallel fetch for daily and monthly usage
    const [dailyResponse, monthlyResponse] = await Promise.all([
      fetch(`${LOGGING_SERVICE_URL}/api/logging/v1/logs?${dailyParams.toString()}`),
      fetch(`${LOGGING_SERVICE_URL}/api/logging/v1/logs?${monthlyParams.toString()}`),
    ]);

    let dailyUsed = 0;
    let monthlyUsed = 0;

    if (dailyResponse.ok) {
      const dailyData = await dailyResponse.json();
      // The total from pagination represents total logs/credits for the day
      dailyUsed = dailyData.pagination?.total || 0;
    }

    if (monthlyResponse.ok) {
      const monthlyData = await monthlyResponse.json();
      // The total from pagination represents total logs/credits for the month
      monthlyUsed = monthlyData.pagination?.total || 0;
    }

    const response: CreditUsageResponse = {
      success: true,
      data: {
        daily: {
          used: dailyUsed,
          limit: DAILY_CREDIT_LIMIT,
          remaining: Math.max(0, DAILY_CREDIT_LIMIT - dailyUsed),
          percentage: Math.min(100, Math.round((dailyUsed / DAILY_CREDIT_LIMIT) * 100)),
        },
        monthly: {
          used: monthlyUsed,
          limit: MONTHLY_CREDIT_LIMIT,
          remaining: Math.max(0, MONTHLY_CREDIT_LIMIT - monthlyUsed),
          percentage: Math.min(100, Math.round((monthlyUsed / MONTHLY_CREDIT_LIMIT) * 100)),
        },
        resetInfo: {
          dailyResetAt: tomorrowStart.toISOString(),
          monthlyResetAt: nextMonthStart.toISOString(),
          daysUntilMonthlyReset,
        },
        billingCycle: {
          start: monthStart.toISOString(),
          end: monthEnd.toISOString(),
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching credit usage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
