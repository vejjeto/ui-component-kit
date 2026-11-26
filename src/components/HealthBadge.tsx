"use client";

import { useQuery } from "@tanstack/react-query";
import type * as React from "react";

interface HealthPayload {
  status: "ok" | "degraded";
  service: string;
  uptimeSeconds: number;
}

async function fetchHealth(): Promise<HealthPayload> {
  const res = await fetch("/api/health", { cache: "no-store" });
  if (!res.ok) throw new Error("Health check failed");
  return (await res.json()) as HealthPayload;
}

export function HealthBadge(): React.ReactElement {
  const { data, isError } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    refetchInterval: 30_000,
    retry: 1,
  });

  const healthy = !isError && data?.status !== "degraded";

  return (
    <span
      title={
        data
          ? `${data.service} • uptime ${data.uptimeSeconds}s`
          : "Edge Runtime"
      }
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)]"
    >
      <span
        className={
          healthy
            ? "h-2 w-2 rounded-full bg-[var(--success)]"
            : "h-2 w-2 rounded-full bg-[var(--danger)]"
        }
        aria-hidden="true"
      />
      <span>{healthy ? "Edge OK" : "Degraded"}</span>
    </span>
  );
}
