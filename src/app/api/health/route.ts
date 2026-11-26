import { createRequestLogger } from "@/lib/logger";
import { getRequestId } from "@/lib/problem-details";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STARTED_AT = Date.now();

export async function GET(request: Request): Promise<NextResponse> {
  const requestId = getRequestId(request);
  const log = createRequestLogger(requestId, { route: "/api/health" });
  const uptimeSeconds = Math.floor((Date.now() - STARTED_AT) / 1000);

  log.debug({ uptimeSeconds }, "Health check completed");

  return NextResponse.json(
    {
      status: "ok",
      service: "ui-component-kit",
      dbLatencyMs: 0,
      uptimeSeconds,
      version: "2.0.0",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "x-request-id": requestId,
        "Cache-Control": "no-store",
      },
    },
  );
}
