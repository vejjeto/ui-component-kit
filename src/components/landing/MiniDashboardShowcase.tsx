"use client";

import { useGlobalCommandPalette } from "@/components/docs/GlobalCommandPalette";
import {
  Accordion,
  Button,
  Combobox,
  DataTable,
  type DataTableColumn,
  DatePicker,
  DropdownMenu,
  Modal,
  ModalFooter,
  Tabs,
  TextField,
  Tooltip,
  useToast,
} from "@/components/forge";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { DateRange } from "@/lib/date-utils";
import {
  Bell,
  Check,
  Command,
  Download,
  MoreHorizontal,
  Palette,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
} from "lucide-react";
import * as React from "react";

interface DeploymentRow extends Record<string, unknown> {
  id: string;
  service: string;
  environment: string;
  region: string;
  p95Ms: number;
  status: "Healthy" | "Canary";
}

const DEPLOYMENTS: DeploymentRow[] = [
  {
    id: "d-1",
    service: "design-tokens-cdn",
    environment: "production",
    region: "us-east-1",
    p95Ms: 14,
    status: "Healthy",
  },
  {
    id: "d-2",
    service: "forge-docs-edge",
    environment: "production",
    region: "eu-west-1",
    p95Ms: 22,
    status: "Healthy",
  },
  {
    id: "d-3",
    service: "preset-sync-api",
    environment: "staging",
    region: "us-west-2",
    p95Ms: 31,
    status: "Canary",
  },
  {
    id: "d-4",
    service: "a11y-audit-worker",
    environment: "production",
    region: "sa-east-1",
    p95Ms: 19,
    status: "Healthy",
  },
  {
    id: "d-5",
    service: "telemetry-stream",
    environment: "staging",
    region: "eu-central-1",
    p95Ms: 28,
    status: "Healthy",
  },
  {
    id: "d-6",
    service: "registry-mirror",
    environment: "production",
    region: "ap-northeast-1",
    p95Ms: 36,
    status: "Healthy",
  },
];

const DEPLOY_COLUMNS: DataTableColumn<DeploymentRow>[] = [
  { key: "service", header: "Servicio", sortable: true },
  { key: "environment", header: "Entorno", sortable: true },
  { key: "region", header: "Región", sortable: true },
  {
    key: "p95Ms",
    header: "p95",
    sortable: true,
    align: "right",
    render: (row) => <span className="font-mono text-xs">{row.p95Ms} ms</span>,
  },
  {
    key: "status",
    header: "Estado",
    sortable: true,
    render: (row) => (
      <span
        className={
          row.status === "Healthy"
            ? "inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-[var(--success)]"
            : "inline-flex rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-[var(--warning)]"
        }
      >
        {row.status}
      </span>
    ),
  },
];

const ENV_OPTIONS = [
  {
    value: "all",
    label: "Todos los entornos",
    description: "Production + Staging",
  },
  {
    value: "production",
    label: "Production",
    description: "Tráfico real de clientes",
  },
  {
    value: "staging",
    label: "Staging",
    description: "Validación previa a release",
  },
];

export function MiniDashboardShowcase(): React.ReactElement {
  const { presets, activePresetSlug, selectPreset, registerPreset } =
    useTheme();
  const { setOpen: setCommandOpen } = useGlobalCommandPalette();
  const { toast } = useToast();

  const [envFilter, setEnvFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState<DateRange>({
    start: "2026-11-18",
    end: "2026-11-25",
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  const [customName, setCustomName] = React.useState("");
  const [customColor, setCustomColor] = React.useState("#7c3aed");
  const [nameError, setNameError] = React.useState("");

  const displayedPresets = presets;

  const filteredRows = React.useMemo(() => {
    if (!envFilter || envFilter === "all") return DEPLOYMENTS;
    return DEPLOYMENTS.filter((row) => row.environment === envFilter);
  }, [envFilter]);

  const handleSaveCustomPreset = () => {
    if (customName.trim().length < 2) {
      setNameError("Ingresa un nombre de al menos 2 caracteres.");
      return;
    }
    setNameError("");
    const slug = customName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const name = customName.trim();
    const resolvedSlug = slug || `custom-${Date.now()}`;

    registerPreset({
      id: Date.now(),
      slug: resolvedSlug,
      name,
      description: "Preset personalizado creado desde el Showcase.",
      isDefault: false,
      tokens: {
        accent: customColor,
        accentHover: customColor,
        accentFg: "#ffffff",
        ring: customColor,
        radius: "0.5rem",
        surfaceTint: "#eef2ff",
      },
      createdAt: new Date().toISOString(),
    });

    setModalOpen(false);
    setCustomName("");
    toast({
      variant: "success",
      title: `Preset "${name}" activado`,
      description: "Guardado en localStorage y aplicado al sistema de tokens.",
    });
  };

  return (
    <section
      aria-label="Mini-Dashboard Showcase interactivo"
      className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-xl sm:p-6"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--accent-fg)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">ForgeUI Live Console</p>
            <p className="text-xs text-[var(--text-muted)]">
              Construido 100% con los 12 componentes accesibles
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tooltip content="Abrir CommandPalette (⌘K)" placement="bottom">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Command className="h-3.5 w-3.5" />}
              onClick={() => setCommandOpen(true)}
            >
              ⌘K
            </Button>
          </Tooltip>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Bell className="h-3.5 w-3.5" />}
            onClick={() =>
              toast({
                variant: "info",
                title: "Telemetría en vivo",
                description: "Latencia global estable en 21 ms p95.",
              })
            }
          >
            Toast
          </Button>

          <DropdownMenu
            align="end"
            trigger={
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<MoreHorizontal className="h-4 w-4" />}
              >
                Opciones
              </Button>
            }
            groups={[
              {
                label: "Tokens",
                items: [
                  {
                    id: "new-preset",
                    label: "Crear preset personalizado",
                    icon: <Palette className="h-4 w-4" />,
                    shortcut: "⌘P",
                    onSelect: () => setModalOpen(true),
                  },
                  {
                    id: "export",
                    label: "Exportar CSS Tokens",
                    icon: <Download className="h-4 w-4" />,
                    onSelect: () =>
                      toast({
                        variant: "success",
                        title: "Tokens exportados",
                        description: `Preset activo: ${activePresetSlug}`,
                      }),
                  },
                ],
              },
              {
                items: [
                  {
                    id: "reset",
                    label: "Restablecer Forge Indigo",
                    icon: <Trash2 className="h-4 w-4" />,
                    variant: "destructive",
                    onSelect: () => {
                      selectPreset("forge-indigo");
                      toast({
                        variant: "warning",
                        title: "Preset restaurado a Forge Indigo",
                      });
                    },
                  },
                ],
              },
            ]}
          />

          <Button
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setModalOpen(true)}
          >
            Nuevo Preset
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[var(--text-muted)]">
          Presets (localStorage):
        </span>
        {displayedPresets.map((preset) => {
          const active = preset.slug === activePresetSlug;
          return (
            <button
              key={preset.slug}
              type="button"
              onClick={() => selectPreset(preset.slug)}
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]"
                  : "inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: preset.tokens.accent }}
                aria-hidden="true"
              />
              {preset.name}
            </button>
          );
        })}
      </div>

      <Tabs
        items={[
          {
            id: "operations",
            label: "Despliegues",
            icon: <Rocket className="h-3.5 w-3.5" />,
            content: (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Combobox
                    label="Filtrar por entorno"
                    options={ENV_OPTIONS}
                    value={envFilter}
                    onValueChange={setEnvFilter}
                  />
                  <DatePicker
                    mode="range"
                    label="Ventana de observación"
                    range={dateRange}
                    onRangeChange={setDateRange}
                  />
                </div>
                <DataTable
                  data={filteredRows}
                  columns={DEPLOY_COLUMNS}
                  rowKey={(r) => r.id}
                  pageSize={4}
                />
              </div>
            ),
          },
          {
            id: "architecture",
            label: "Decisiones Técnicas",
            content: (
              <Accordion
                type="single"
                defaultOpenIds={["fouc"]}
                items={[
                  {
                    id: "fouc",
                    title: "Cero FOUC en Dark/Light Mode",
                    subtitle: "Inline script previo a hidratación React",
                    content:
                      "layout.tsx inyecta un script síncrono mínimo que aplica la clase .dark antes del primer frame.",
                  },
                  {
                    id: "zero-dep",
                    title: "DatePicker y Focus Trap sin dependencias pesadas",
                    subtitle: "Control total de teclado y bundle reducido",
                    content:
                      "La matriz mensual 6x7 y el ciclo Tab/Shift+Tab están implementados con utilidades puras y testeadas.",
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Guardar preset de tokens"
        description="Se guardará en localStorage vía Zustand y se aplicará al sistema de tokens."
      >
        <div className="space-y-4">
          <TextField
            label="Nombre del preset"
            placeholder="Ej. Violet Studio"
            value={customName}
            error={nameError}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <label className="flex items-center justify-between rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-xs font-medium">
            <span>Color de acento primario (--accent)</span>
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="h-7 w-12 cursor-pointer rounded border-0 bg-transparent"
            />
          </label>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            leftIcon={<Check className="h-4 w-4" />}
            onClick={handleSaveCustomPreset}
          >
            Guardar y aplicar
          </Button>
        </ModalFooter>
      </Modal>
    </section>
  );
}
