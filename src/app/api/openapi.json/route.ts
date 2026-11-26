import { getForgeOpenApiSpec } from "@/lib/openapi";
import { getRequestId } from "@/lib/problem-details";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const requestId = getRequestId(request);
  return NextResponse.json(getForgeOpenApiSpec(), {
    headers: {
      "x-request-id": requestId,
    },
  });
}
