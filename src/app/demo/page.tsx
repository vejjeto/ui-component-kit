"use client";

import { HealthBadge } from "@/components/HealthBadge";
import { Button } from "@/components/forge/Button";
import { MiniDashboardShowcase } from "@/components/landing/MiniDashboardShowcase";
import { LanguageToggle } from "@/components/theme/LanguageToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLocale } from "@/lib/i18n";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-fg)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <span>ForgeUI</span>
            </Link>
            <span className="hidden text-xs text-[var(--text-muted)] sm:inline">
              {t.demo.breadcrumb}
            </span>
          </div>
          <nav className="flex items-center gap-2.5">
            <HealthBadge />
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
              asChild
            >
              <Link href="/">{t.nav.home}</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<BookOpen className="h-3.5 w-3.5" />}
              asChild
            >
              <Link href="/docs">{t.nav.docs}</Link>
            </Button>
            <LanguageToggle />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t.demo.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {t.demo.subtitle}
          </p>
        </div>
        <MiniDashboardShowcase />
      </main>
    </div>
  );
}
