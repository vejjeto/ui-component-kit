"use client";

import { evaluateWcagContrast } from "@/core/wcag";
import { ShieldCheck } from "lucide-react";
import * as React from "react";

export function WcagContrastPanel(): React.ReactElement {
  const [foreground, setForeground] = React.useState("#ffffff");
  const [background, setBackground] = React.useState("#4f46e5");

  const result = React.useMemo(
    () => evaluateWcagContrast(foreground, background),
    [foreground, background],
  );

  return (
    <section
      aria-label="WCAG 2.1 Contrast Checker"
      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="h-4 w-4 text-[var(--accent)]"
            aria-hidden="true"
          />
          <h2 className="text-sm font-semibold">
            Tokens &amp; WCAG 2.1 Contrast Checker
          </h2>
        </div>
        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-0.5 font-mono text-xs font-semibold">
          {result.ratio > 0
            ? `${result.ratio}:1 (${result.grade})`
            : "Hex inválido"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
          <span>Foreground (--accent-fg)</span>
          <div className="flex items-center gap-2 rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 py-1.5">
            <input
              type="color"
              aria-label="Selector color foreground"
              value={
                /^#[0-9a-fA-F]{6}$/.test(foreground) ? foreground : "#ffffff"
              }
              onChange={(e) => setForeground(e.target.value)}
              className="h-6 w-8 cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              aria-label="Hex foreground"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-full bg-transparent font-mono text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
          <span>Background (--accent)</span>
          <div className="flex items-center gap-2 rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 py-1.5">
            <input
              type="color"
              aria-label="Selector color background"
              value={
                /^#[0-9a-fA-F]{6}$/.test(background) ? background : "#4f46e5"
              }
              onChange={(e) => setBackground(e.target.value)}
              className="h-6 w-8 cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              aria-label="Hex background"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-full bg-transparent font-mono text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </label>

        <div
          className="flex flex-col justify-center rounded-[var(--radius-ui)] border border-[var(--border-subtle)] px-4 py-3 text-center"
          style={{ color: foreground, backgroundColor: background }}
        >
          <p className="text-sm font-semibold">Texto normal (14px)</p>
          <p className="text-lg font-bold">Texto grande (18px+)</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {[
          { label: "AA Normal (≥4.5)", pass: result.aaNormal },
          { label: "AA Large (≥3.0)", pass: result.aaLarge },
          { label: "AAA Normal (≥7.0)", pass: result.aaaNormal },
          { label: "AAA Large (≥4.5)", pass: result.aaaLarge },
        ].map((item) => (
          <span
            key={item.label}
            className={
              item.pass
                ? "rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-medium text-[var(--success)]"
                : "rounded-full bg-rose-500/15 px-2.5 py-0.5 font-medium text-[var(--danger)]"
            }
          >
            {item.pass ? "PASS" : "FAIL"} · {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}
