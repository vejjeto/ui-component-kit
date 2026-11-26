import { NextResponse } from "next/server";

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  requestId: string;
  errors?: Record<string, string[]>;
}

export function getRequestId(request?: Request): string {
  const incoming = request?.headers.get("x-request-id")?.trim();
  if (incoming) return incoming;
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createProblemResponse(
  input: Omit<ProblemDetails, "requestId" | "type"> & {
    type?: string;
    requestId?: string;
    request?: Request;
  },
): NextResponse<ProblemDetails> {
  const requestId = input.requestId ?? getRequestId(input.request);
  const body: ProblemDetails = {
    type: input.type ?? `https://httpstatuses.com/${input.status}`,
    title: input.title,
    status: input.status,
    requestId,
    ...(input.detail !== undefined ? { detail: input.detail } : {}),
    ...(input.instance !== undefined ? { instance: input.instance } : {}),
    ...(input.errors !== undefined ? { errors: input.errors } : {}),
  };

  return NextResponse.json(body, {
    status: input.status,
    headers: {
      "Content-Type": "application/problem+json; charset=utf-8",
      "x-request-id": requestId,
    },
  });
}
