import { DocsShell } from "@/components/docs/DocsShell";
import { WcagContrastPanel } from "@/components/docs/WcagContrastPanel";
import { COMPONENT_CATALOG } from "@/lib/catalog";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocsIndexPage() {
  return (
    <DocsShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Catálogo de 12 Componentes
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Selecciona cualquier componente para probar sus props en tiempo
            real, inspeccionar su código TSX generado y revisar su contrato
            WAI-ARIA. Pulsa{" "}
            <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono text-xs">
              ⌘K
            </kbd>{" "}
            para saltar rápidamente.
          </p>
        </div>

        <WcagContrastPanel />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {COMPONENT_CATALOG.map((item) => (
            <Link
              key={item.slug}
              href={`/docs/${item.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-all hover:border-[var(--accent)] hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                    {item.name}
                  </span>
                  <span className="rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-muted)]">
                    {item.category}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {item.summary}
                </p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
                Abrir playground
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DocsShell>
  );
}
