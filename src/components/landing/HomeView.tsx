"use client";

import { HealthBadge } from "@/components/HealthBadge";
import { Button } from "@/components/forge/Button";
import { MiniDashboardShowcase } from "@/components/landing/MiniDashboardShowcase";
import { LanguageToggle } from "@/components/theme/LanguageToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLocale } from "@/lib/i18n";
import { ArrowRight, Code2, Layers, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import type * as React from "react";

export function HomeView(): React.ReactElement {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-fg)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>ForgeUI</span>
          </div>
          <nav className="flex items-center gap-3">
            <HealthBadge />
            <Link
              href="/demo"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {t.nav.demo}
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {t.nav.docs}
            </Link>
            <LanguageToggle />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" />
            {t.hero.badge}
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            {t.hero.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            {t.hero.subtitlePrefix}{" "}
            <code className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-sm">
              cva
            </code>
            {t.hero.subtitleMid}{" "}
            <code className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-sm">
              asChild
            </code>{" "}
            {t.hero.subtitleSuffix}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              asChild
            >
              <Link href="/docs">{t.hero.primaryCta}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftIcon={<Code2 className="h-4 w-4" />}
              asChild
            >
              <Link href="/demo">{t.hero.secondaryCta}</Link>
            </Button>
          </div>
        </div>

        <MiniDashboardShowcase />

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <Layers className="mb-3 h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-sm font-semibold">{t.features.tokensTitle}</h2>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              {t.features.tokensDesc}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-[var(--success)]" />
            <h2 className="text-sm font-semibold">{t.features.a11yTitle}</h2>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              {t.features.a11yDesc}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <Code2 className="mb-3 h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-sm font-semibold">{t.features.previewTitle}</h2>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              {t.features.previewDesc}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
