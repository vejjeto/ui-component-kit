"use client";

import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n";
import { Globe } from "lucide-react";
import type * as React from "react";

export interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({
  className,
}: LanguageToggleProps): React.ReactElement {
  const { locale, toggleLocale } = useLocale();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label="Cambiar idioma (ES/EN)"
      title={locale === "es" ? "Switch to English" : "Cambiar a Español"}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]",
        className,
      )}
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{locale.toUpperCase()}</span>
    </button>
  );
}
