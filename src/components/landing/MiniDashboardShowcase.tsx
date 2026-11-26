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
import { useLocale } from "@/lib/i18n";
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

export function MiniDashboardShowcase(): React.ReactElement {
  const { presets, activePresetSlug, selectPreset, registerPreset } =
    useTheme();
  const { setOpen: setCommandOpen } = useGlobalCommandPalette();
  const { toast } = useToast();
  const { t } = useLocale();

  const deployColumns = React.useMemo<DataTableColumn<DeploymentRow>[]>(
    () => [
      { key: "service", header: t.showcase.colService, sortable: true },
      { key: "environment", header: t.showcase.colEnvironment, sortable: true },
      { key: "region", header: t.showcase.colRegion, sortable: true },
      {
        key: "p95Ms",
        header: "p95",
        sortable: true,
        align: "right",
        render: (row) => (
          <span className="font-mono text-xs">{row.p95Ms} ms</span>
        ),
      },
      {
        key: "status",
        header: t.showcase.colStatus,
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
    ],
    [t],
  );

  const envOptions = React.useMemo(
    () => [
      {
        value: "all",
        label: t.showcase.envAll,
        description: t.showcase.envAllDesc,
      },
      {
        value: "production",
        label: "Production",
        description: t.showcase.envProdDesc,
      },
      {
        value: "staging",
        label: "Staging",
        description: t.showcase.envStagingDesc,
      },
    ],
    [t],
  );

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
      setNameError(t.showcase.presetNameError);
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
      description: t.showcase.presetCustomDesc,
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
      title: `Preset "${name}" ${t.showcase.presetSavedTitle}`,
      description: t.showcase.presetSavedDesc,
    });
  };

  return (
    <section
      aria-label={t.showcase.ariaLabel}
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
              {t.showcase.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tooltip content={t.showcase.commandTooltip} placement="bottom">
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
                title: t.showcase.toastTitle,
                description: t.showcase.toastDesc,
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
                {t.showcase.options}
              </Button>
            }
            groups={[
              {
                label: t.showcase.tokensGroup,
                items: [
                  {
                    id: "new-preset",
                    label: t.showcase.createPreset,
                    icon: <Palette className="h-4 w-4" />,
                    shortcut: "⌘P",
                    onSelect: () => setModalOpen(true),
                  },
                  {
                    id: "export",
                    label: t.showcase.exportTokens,
                    icon: <Download className="h-4 w-4" />,
                    onSelect: () =>
                      toast({
                        variant: "success",
                        title: t.showcase.tokensExported,
                        description: `${t.showcase.activePresetPrefix} ${activePresetSlug}`,
                      }),
                  },
                ],
              },
              {
                items: [
                  {
                    id: "reset",
                    label: t.showcase.resetPreset,
                    icon: <Trash2 className="h-4 w-4" />,
                    variant: "destructive",
                    onSelect: () => {
                      selectPreset("forge-indigo");
                      toast({
                        variant: "warning",
                        title: t.showcase.resetToast,
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
            {t.showcase.newPreset}
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[var(--text-muted)]">
          {t.showcase.presetsLabel}
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
            label: t.showcase.tabDeployments,
            icon: <Rocket className="h-3.5 w-3.5" />,
            content: (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Combobox
                    label={t.showcase.filterEnv}
                    options={envOptions}
                    value={envFilter}
                    onValueChange={setEnvFilter}
                  />
                  <DatePicker
                    mode="range"
                    label={t.showcase.dateWindow}
                    range={dateRange}
                    onRangeChange={setDateRange}
                  />
                </div>
                <DataTable
                  data={filteredRows}
                  columns={deployColumns}
                  rowKey={(r) => r.id}
                  pageSize={4}
                />
              </div>
            ),
          },
          {
            id: "architecture",
            label: t.showcase.tabArchitecture,
            content: (
              <Accordion
                type="single"
                defaultOpenIds={["fouc"]}
                items={[
                  {
                    id: "fouc",
                    title: t.showcase.foucTitle,
                    subtitle: t.showcase.foucSubtitle,
                    content: t.showcase.foucContent,
                  },
                  {
                    id: "zero-dep",
                    title: t.showcase.zeroDepTitle,
                    subtitle: t.showcase.zeroDepSubtitle,
                    content: t.showcase.zeroDepContent,
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
        title={t.showcase.modalTitle}
        description={t.showcase.modalDesc}
      >
        <div className="space-y-4">
          <TextField
            label={t.showcase.presetNameLabel}
            placeholder={t.showcase.presetNamePlaceholder}
            value={customName}
            error={nameError}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <label className="flex items-center justify-between rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-xs font-medium">
            <span>{t.showcase.accentLabel}</span>
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
            {t.showcase.cancel}
          </Button>
          <Button
            leftIcon={<Check className="h-4 w-4" />}
            onClick={handleSaveCustomPreset}
          >
            {t.showcase.saveAndApply}
          </Button>
        </ModalFooter>
      </Modal>
    </section>
  );
}
