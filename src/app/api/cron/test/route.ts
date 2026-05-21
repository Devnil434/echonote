import { NextRequest, NextResponse } from "next/server";

// Only available in development — block in production
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Test route disabled in production" },
      { status: 403 }
    );
  }

  // Proxy to the real cron route with the secret
  const cronUrl = new URL("/api/cron/reminders", request.url).toString();

  const response = await fetch(cronUrl, {
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });

  const data = await response.json();
  return NextResponse.json({ proxied: true, ...data });
}
