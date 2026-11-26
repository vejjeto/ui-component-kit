import { HealthBadge } from "@/components/HealthBadge";
import { Button } from "@/components/forge/Button";
import { MiniDashboardShowcase } from "@/components/landing/MiniDashboardShowcase";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ArrowRight, Code2, Layers, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
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
              Demo
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Documentación
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" />
            12 Primitivos WAI-ARIA • Zero-FOUC Tokens • Shadcn Registry
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Sistema de Diseño React sin dependencias pesadas.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Construye interfaces consistentes con 12 componentes accesibles por
            teclado, variantes{" "}
            <code className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-sm">
              cva
            </code>
            , composición{" "}
            <code className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-sm">
              asChild
            </code>{" "}
            y playground interactivo en vivo.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              asChild
            >
              <Link href="/docs">Explorar los 12 Componentes</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftIcon={<Code2 className="h-4 w-4" />}
              asChild
            >
              <Link href="/docs/button">Abrir Playground</Link>
            </Button>
          </div>
        </div>

        <MiniDashboardShowcase />

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <Layers className="mb-3 h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-sm font-semibold">Tokens Semánticos CSS</h2>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              Cambia instantáneamente entre 6 presets curados o guarda tus
              propios tokens en localStorage.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-[var(--success)]" />
            <h2 className="text-sm font-semibold">Accesibilidad Completa</h2>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              Focus trap nativo en Modal, roving focus en Menus/Tabs y
              navegación por rejilla en DatePicker.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <Code2 className="mb-3 h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-sm font-semibold">Preview vs Code en Vivo</h2>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              Cada componente incluye editor de props, tabla API tipada,
              resaltado léxico y copia en 1 clic.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
