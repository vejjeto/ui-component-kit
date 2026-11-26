"use client";

import { Button, Tabs, useToast } from "@/components/forge";
import { useTheme } from "@/components/theme/ThemeProvider";
import { type PlaygroundPropValue, getComponentSpec } from "@/lib/catalog";
import { usePresetStore } from "@/lib/preset-store";
import {
  ArrowLeft,
  BookmarkPlus,
  Check,
  Code2,
  Copy,
  Eye,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { CodeBlock } from "./CodeBlock";
import { ComponentPreviewDemo } from "./ComponentPreviewDemo";

export function ComponentPlayground({
  slug,
}: { slug: string }): React.ReactElement {
  const spec = getComponentSpec(slug);
  const [state, setState] = React.useState<Record<string, PlaygroundPropValue>>(
    spec?.defaultState ?? {},
  );
  const [copiedCli, setCopiedCli] = React.useState(false);
  const { activePresetSlug } = useTheme();
  const addSnapshot = usePresetStore((s) => s.addSnapshot);
  const { toast } = useToast();

  React.useEffect(() => {
    if (spec) {
      setState(spec.defaultState);
    }
  }, [spec]);

  const code = React.useMemo(
    () => (spec ? spec.buildCode(state) : ""),
    [spec, state],
  );

  if (!spec) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Componente no encontrado.
      </p>
    );
  }

  const cliCommand = `npx shadcn@latest add /r/${spec.slug}.json`;

  const copyCli = async () => {
    try {
      await navigator.clipboard.writeText(
        `npx shadcn@latest add ${window.location.origin}/r/${spec.slug}.json`,
      );
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 1800);
    } catch {
      toast({ variant: "error", title: "No se pudo copiar el comando" });
    }
  };

  const saveSnapshot = () => {
    addSnapshot({
      componentSlug: spec.slug,
      title: `${spec.name} Snapshot`,
      presetSlug: activePresetSlug,
      props: state,
    });
    toast({
      variant: "success",
      title: "Snapshot guardado en localStorage",
      description: `Configuración de ${spec.name} guardada con preset ${activePresetSlug}.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/docs"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al catálogo
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {spec.name}
            </h1>
            <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
              {spec.category}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {spec.summary}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={saveSnapshot}
          leftIcon={<BookmarkPlus className="h-4 w-4" />}
        >
          Guardar snapshot
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Terminal
            className="h-3.5 w-3.5 text-[var(--accent)]"
            aria-hidden="true"
          />
          <span className="font-medium">Shadcn Registry CLI:</span>
          <code className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-primary)]">
            {cliCommand}
          </code>
        </div>
        <button
          type="button"
          onClick={copyCli}
          aria-label="Copiar comando Shadcn CLI"
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 py-1 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
        >
          {copiedCli ? (
            <Check className="h-3.5 w-3.5 text-[var(--success)]" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copiedCli ? "Copiado" : "Copiar"}
        </button>
      </div>

      <section
        aria-label="Interactive Props Playground"
        className="grid gap-6 xl:grid-cols-[1fr_280px]"
      >
        <div className="min-w-0">
          <Tabs
            items={[
              {
                id: "preview",
                label: "Preview",
                icon: <Eye className="h-3.5 w-3.5" />,
                content: (
                  <div className="flex min-h-[240px] items-center justify-center rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
                    <ComponentPreviewDemo slug={spec.slug} state={state} />
                  </div>
                ),
              },
              {
                id: "code",
                label: "Code",
                icon: <Code2 className="h-3.5 w-3.5" />,
                content: (
                  <CodeBlock code={code} filename={`${spec.slug}.tsx`} />
                ),
              },
            ]}
          />
        </div>

        <aside className="rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Props Playground
            </h2>
            <button
              type="button"
              onClick={() => setState(spec.defaultState)}
              className="text-xs font-medium text-[var(--accent)] hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3.5">
            {spec.controls.map((control) => {
              const current = state[control.key];
              if (control.kind === "boolean") {
                return (
                  <label
                    key={control.key}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-xs font-medium"
                  >
                    <span>{control.label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(current)}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          [control.key]: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                  </label>
                );
              }

              if (control.kind === "select") {
                return (
                  <label key={control.key} className="block space-y-1 text-xs">
                    <span className="font-medium text-[var(--text-secondary)]">
                      {control.label}
                    </span>
                    <select
                      value={String(current ?? "")}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          [control.key]: e.target.value,
                        }))
                      }
                      className="h-9 w-full rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    >
                      {control.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              }

              return (
                <label key={control.key} className="block space-y-1 text-xs">
                  <span className="font-medium text-[var(--text-secondary)]">
                    {control.label}
                  </span>
                  <input
                    type="text"
                    value={String(current ?? "")}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        [control.key]: e.target.value,
                      }))
                    }
                    className="h-9 w-full rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  />
                </label>
              );
            })}
          </div>
        </aside>
      </section>

      <section id="api-props" className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">API / Props</h2>
        <div className="overflow-x-auto rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-4 py-2.5 font-semibold">Prop</th>
                <th className="px-4 py-2.5 font-semibold">Tipo</th>
                <th className="px-4 py-2.5 font-semibold">Default</th>
                <th className="px-4 py-2.5 font-semibold">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {spec.props.map((row) => (
                <tr key={row.name}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[var(--accent)]">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">
                    {row.type}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">
                    {row.defaultValue}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
          <h2 className="text-sm font-semibold">
            WAI-ARIA &amp; Accesibilidad por Teclado
          </h2>
        </div>
        <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          {spec.a11y.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
