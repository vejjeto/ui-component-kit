"use client";

import {
  Accordion,
  Button,
  Combobox,
  CommandPalette,
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
import type { PlaygroundPropValue } from "@/lib/catalog";
import type { DateRange } from "@/lib/date-utils";
import {
  Bell,
  Check,
  Command,
  Globe,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import * as React from "react";

interface DemoUser extends Record<string, unknown> {
  id: string;
  name: string;
  role: string;
  latencyMs: number;
  status: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    id: "u-1",
    name: "Elena Navarro",
    role: "Design Systems",
    latencyMs: 18,
    status: "Activo",
  },
  {
    id: "u-2",
    name: "Mateo Silva",
    role: "Platform Core",
    latencyMs: 24,
    status: "Activo",
  },
  {
    id: "u-3",
    name: "Sofía Méndez",
    role: "Accessibility QA",
    latencyMs: 14,
    status: "Activo",
  },
  {
    id: "u-4",
    name: "Lucas Herrera",
    role: "Frontend Infra",
    latencyMs: 37,
    status: "Revisión",
  },
  {
    id: "u-5",
    name: "Valeria Cruz",
    role: "Developer Experience",
    latencyMs: 21,
    status: "Activo",
  },
];

const DEMO_COLUMNS: DataTableColumn<DemoUser>[] = [
  { key: "name", header: "Miembro", sortable: true },
  { key: "role", header: "Equipo", sortable: true },
  {
    key: "latencyMs",
    header: "Latencia",
    sortable: true,
    align: "right",
    render: (row) => (
      <span className="font-mono text-xs">{row.latencyMs} ms</span>
    ),
  },
  {
    key: "status",
    header: "Estado",
    sortable: true,
    render: (row) => (
      <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
        {row.status}
      </span>
    ),
  },
];

const DEMO_COMBOBOX_OPTIONS = [
  {
    value: "nextjs",
    label: "Next.js 15 App Router",
    description: "Server Components + RSC",
  },
  { value: "vite", label: "Vite + React 19", description: "SPA ultrarrápida" },
  {
    value: "remix",
    label: "Remix / React Router v7",
    description: "Loaders y acciones nativas",
  },
  {
    value: "astro",
    label: "Astro Islands",
    description: "Hidratación parcial",
  },
];

function ButtonDemo({
  state,
}: { state: Record<string, PlaygroundPropValue> }): React.ReactElement {
  const variant = String(state.variant ?? "primary") as
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";
  const size = String(state.size ?? "md") as "sm" | "md" | "lg" | "icon";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant={variant}
        size={size}
        loading={Boolean(state.loading)}
        disabled={Boolean(state.disabled)}
        leftIcon={size === "icon" ? undefined : <Plus className="h-4 w-4" />}
      >
        {size === "icon" ? (
          <Plus className="h-4 w-4" />
        ) : (
          String(state.label ?? "Guardar")
        )}
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href="#api-props">Composición asChild</a>
      </Button>
    </div>
  );
}

function InputDemo({
  state,
}: { state: Record<string, PlaygroundPropValue> }): React.ReactElement {
  const [val, setVal] = React.useState("");
  return (
    <div className="w-full max-w-sm">
      <TextField
        label={String(state.label ?? "Dominio")}
        placeholder={String(state.placeholder ?? "api.forgeui.dev")}
        helperText={String(state.helperText ?? "")}
        {...(state.hasError ? { error: "Formato de dominio inválido" } : {})}
        disabled={Boolean(state.disabled)}
        prefix={<Globe className="h-4 w-4" />}
        suffix={<span className="font-mono text-[11px]">TLS</span>}
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
    </div>
  );
}

function ModalDemo({
  state,
}: { state: Record<string, PlaygroundPropValue> }): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const size = String(state.size ?? "md") as "sm" | "md" | "lg";

  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir Modal ({size})</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size={size}
        closeOnBackdrop={Boolean(state.closeOnBackdrop)}
        title={String(state.title ?? "Confirmar acción")}
        description="Prueba navegar con Tab y Shift+Tab, o pulsa Escape para restaurar el foco."
      >
        <p className="text-sm text-[var(--text-secondary)]">
          Este modal se renderiza mediante React Portal y captura el foco dentro
          de sus elementos interactivos sin dependencias externas.
        </p>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => setOpen(false)}
            leftIcon={<Check className="h-4 w-4" />}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

function DropdownDemo({
  state,
}: { state: Record<string, PlaygroundPropValue> }): React.ReactElement {
  const { toast } = useToast();
  const align = String(state.align ?? "start") as "start" | "end";

  const groups = [
    {
      label: "Configuración",
      items: [
        {
          id: "prefs",
          label: "Preferencias de tokens",
          icon: <Settings className="h-4 w-4" />,
          shortcut: "⌘,",
          onSelect: () =>
            toast({ title: "Preferencias abiertas", variant: "info" }),
        },
        {
          id: "notify",
          label: "Probar notificación",
          icon: <Bell className="h-4 w-4" />,
          shortcut: "⌘N",
          onSelect: () =>
            toast({ title: "Notificación disparada", variant: "success" }),
        },
      ],
    },
    ...(state.showDestructive
      ? [
          {
            items: [
              {
                id: "delete",
                label: "Revocar snapshot",
                icon: <Trash2 className="h-4 w-4" />,
                variant: "destructive" as const,
                onSelect: () =>
                  toast({
                    title: "Acción destructiva confirmada",
                    variant: "warning",
                  }),
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <DropdownMenu
      align={align}
      trigger={<Button variant="outline">Abrir menú contextual</Button>}
      groups={groups}
    />
  );
}

function ToastDemo({
  state,
}: { state: Record<string, PlaygroundPropValue> }): React.ReactElement {
  const { toast } = useToast();
  const variant = String(state.variant ?? "success") as
    | "info"
    | "success"
    | "warning"
    | "error";

  return (
    <Button
      onClick={() =>
        toast({
          variant,
          title: String(state.title ?? "Preset guardado"),
          description: String(state.description ?? ""),
        })
      }
    >
      Lanzar Toast ({variant})
    </Button>
  );
}

function DatePickerDemo({
  state,
}: { state: Record<string, PlaygroundPropValue> }): React.ReactElement {
  const mode = String(state.mode ?? "range") as "single" | "range";
  const [single, setSingle] = React.useState<string | null>("2026-11-25");
  const [range, setRange] = React.useState<DateRange>({
    start: "2026-11-18",
    end: "2026-11-25",
  });

  return (
    <div className="w-full max-w-xs">
      <DatePicker
        mode={mode}
        value={single}
        onValueChange={setSingle}
        range={range}
        onRangeChange={setRange}
        label={mode === "single" ? "Fecha de release" : "Ventana de métricas"}
      />
    </div>
  );
}

function CommandDemo({
  state,
}: { state: Record<string, PlaygroundPropValue> }): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant="outline"
        leftIcon={<Command className="h-4 w-4" />}
        onClick={() => setOpen(true)}
      >
        Abrir CommandPalette demo
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        enableGlobalShortcut={false}
        placeholder={String(state.placeholder ?? "Buscar comando...")}
        commands={[
          {
            id: "c1",
            label: "Publicar librería de tokens",
            group: "Despliegue",
            shortcut: "⌘P",
            onSelect: () =>
              toast({ title: "Tokens publicados", variant: "success" }),
          },
          {
            id: "c2",
            label: "Auditar contraste WCAG AA",
            group: "Calidad",
            shortcut: "⌘A",
            onSelect: () =>
              toast({ title: "Auditoría 100% superada", variant: "info" }),
          },
          {
            id: "c3",
            label: "Exportar snapshot JSON",
            group: "Datos",
            onSelect: () =>
              toast({ title: "JSON exportado", variant: "success" }),
          },
        ]}
      />
    </div>
  );
}

export function ComponentPreviewDemo({
  slug,
  state,
}: {
  slug: string;
  state: Record<string, PlaygroundPropValue>;
}): React.ReactElement {
  const [comboVal, setComboVal] = React.useState("nextjs");

  switch (slug) {
    case "button":
      return <ButtonDemo state={state} />;
    case "input":
      return <InputDemo state={state} />;
    case "modal":
      return <ModalDemo state={state} />;
    case "dropdown-menu":
      return <DropdownDemo state={state} />;
    case "tabs":
      return (
        <div className="w-full max-w-lg">
          <Tabs
            orientation={
              String(state.orientation ?? "horizontal") as
                | "horizontal"
                | "vertical"
            }
            items={[
              {
                id: "tokens",
                label: "Tokens",
                content: (
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-xs text-[var(--text-secondary)]">
                    Variables semánticas CSS sincronizadas sin FOUC.
                  </div>
                ),
              },
              {
                id: "aria",
                label: "WAI-ARIA",
                content: (
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-xs text-[var(--text-secondary)]">
                    Navegación completa por flechas, Home y End.
                  </div>
                ),
              },
              {
                id: "perf",
                label: "Zero Bloat",
                content: (
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-xs text-[var(--text-secondary)]">
                    Cero dependencias pesadas para calendario o portal.
                  </div>
                ),
              },
            ]}
          />
        </div>
      );
    case "toast":
      return <ToastDemo state={state} />;
    case "tooltip":
      return (
        <Tooltip
          placement={
            String(state.placement ?? "top") as
              | "top"
              | "bottom"
              | "left"
              | "right"
          }
          delayMs={Number(state.delayMs ?? 200)}
          content={String(state.content ?? "Atajo global ⌘K")}
        >
          <Button variant="outline">Pasa el cursor o enfoca</Button>
        </Tooltip>
      );
    case "accordion":
      return (
        <div className="w-full max-w-lg">
          <Accordion
            type={String(state.type ?? "single") as "single" | "multiple"}
            defaultOpenIds={["a1"]}
            items={[
              {
                id: "a1",
                title: "Arquitectura sin FOUC",
                subtitle: "Tema instantáneo antes de hidratación",
                content:
                  "Un script inline en layout.tsx lee localStorage y prefers-color-scheme antes del primer pintado.",
              },
              {
                id: "a2",
                title: "Focus Trap nativo",
                subtitle: "Sin librerías externas",
                content:
                  "Modal gestiona Tab, Shift+Tab, Escape y restauración de foco en ~110 líneas tipadas.",
              },
            ]}
          />
        </div>
      );
    case "combobox":
      return (
        <div className="w-full max-w-xs">
          <Combobox
            options={DEMO_COMBOBOX_OPTIONS}
            value={comboVal}
            onValueChange={setComboVal}
            clearable={Boolean(state.clearable)}
            placeholder={String(state.placeholder ?? "Elegir framework...")}
          />
        </div>
      );
    case "datepicker":
      return <DatePickerDemo state={state} />;
    case "datatable":
      return (
        <div className="w-full">
          <DataTable
            data={DEMO_USERS}
            columns={DEMO_COLUMNS}
            rowKey={(r) => r.id}
            searchable={Boolean(state.searchable)}
            loading={Boolean(state.loading)}
            pageSize={Number(state.pageSize ?? 3)}
          />
        </div>
      );
    case "command-palette":
      return <CommandDemo state={state} />;
    default:
      return (
        <p className="text-sm text-[var(--text-muted)]">
          Componente no encontrado.
        </p>
      );
  }
}
