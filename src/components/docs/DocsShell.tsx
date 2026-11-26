"use client";

import { HealthBadge } from "@/components/HealthBadge";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { COMPONENT_CATALOG } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { Menu, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useGlobalCommandPalette } from "./GlobalCommandPalette";

export interface DocsShellProps {
  activeSlug?: string | undefined;
  children: React.ReactNode;
}

function SidebarNav({
  activeSlug,
  onNavigate,
}: {
  activeSlug?: string | undefined;
  onNavigate?: (() => void) | undefined;
}): React.ReactElement {
  const categories = Array.from(
    new Set(COMPONENT_CATALOG.map((c) => c.category)),
  );

  return (
    <nav aria-label="Catálogo de componentes" className="flex flex-col gap-5">
      <div>
        <Link
          href="/docs"
          {...(onNavigate ? { onClick: onNavigate } : {})}
          className={cn(
            "block rounded-[var(--radius-ui)] px-3 py-2 text-sm font-medium transition-colors",
            !activeSlug
              ? "bg-[var(--accent-soft)] text-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
          )}
        >
          Todos los componentes (12)
        </Link>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {category}
          </p>
          <ul className="space-y-0.5">
            {COMPONENT_CATALOG.filter((c) => c.category === category).map(
              (item) => {
                const isActive = item.slug === activeSlug;
                return (
                  <li key={item.slug}>
                    <Link
                      href={`/docs/${item.slug}`}
                      {...(onNavigate ? { onClick: onNavigate } : {})}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-[var(--radius-ui)] px-3 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
                      )}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              },
            )}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsShell({
  activeSlug,
  children,
}: DocsShellProps): React.ReactElement {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { setOpen: setCommandOpen } = useGlobalCommandPalette();
  const { presets, activePresetSlug, selectPreset } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menú de componentes"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
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
              / Documentación Interactiva
            </span>
          </div>

          <div className="flex items-center gap-2">
            <HealthBadge />
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Buscar...</span>
              <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>

            <select
              aria-label="Preset de tema"
              value={activePresetSlug}
              onChange={(e) => selectPreset(e.target.value)}
              className="hidden h-9 rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] sm:block"
            >
              {presets.map((preset) => (
                <option key={preset.slug} value={preset.slug}>
                  {preset.name}
                </option>
              ))}
            </select>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            aria-hidden="true"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative z-10 h-full w-72 overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">Componentes</span>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--bg-elevated)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarNav
              activeSlug={activeSlug}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-22 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            <SidebarNav activeSlug={activeSlug} />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
