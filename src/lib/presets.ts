import { z } from "zod";

export const themeTokensSchema = z.object({
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a 6-digit hex color"),
  accentHover: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a 6-digit hex color"),
  accentFg: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a 6-digit hex color"),
  ring: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a 6-digit hex color"),
  radius: z.enum(["0.375rem", "0.5rem", "0.75rem", "1rem"]),
  surfaceTint: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a 6-digit hex color"),
});

export type ThemeTokens = z.infer<typeof themeTokensSchema>;

export const createPresetSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("preset"),
    slug: z
      .string()
      .min(2)
      .max(64)
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must contain lowercase letters, numbers, or hyphens",
      ),
    name: z.string().min(2).max(80),
    description: z.string().min(4).max(200),
    tokens: themeTokensSchema,
  }),
  z.object({
    kind: z.literal("snapshot"),
    componentSlug: z.string().min(2).max(64),
    title: z.string().min(2).max(80),
    presetSlug: z.string().min(2).max(64),
    props: z.record(z.union([z.string(), z.number(), z.boolean()])),
  }),
]);

export type CreatePresetPayload = z.infer<typeof createPresetSchema>;

export interface ThemePresetRecord {
  id: number;
  slug: string;
  name: string;
  description: string;
  tokens: ThemeTokens;
  isDefault: boolean;
  createdAt: string;
}

export interface PlaygroundSnapshotRecord {
  id: number;
  componentSlug: string;
  title: string;
  presetSlug: string;
  props: Record<string, string | number | boolean>;
  createdAt: string;
}

export const CURATED_PRESETS: Array<
  Omit<ThemePresetRecord, "id" | "createdAt">
> = [
  {
    slug: "forge-indigo",
    name: "Forge Indigo",
    description:
      "Precisión técnica con acento índigo profundo y contraste equilibrado.",
    isDefault: true,
    tokens: {
      accent: "#4f46e5",
      accentHover: "#4338ca",
      accentFg: "#ffffff",
      ring: "#6366f1",
      radius: "0.5rem",
      surfaceTint: "#eef2ff",
    },
  },
  {
    slug: "emerald-slate",
    name: "Emerald Slate",
    description:
      "Verde esmeralda limpio pensado para paneles operativos y telemetría.",
    isDefault: false,
    tokens: {
      accent: "#059669",
      accentHover: "#047857",
      accentFg: "#ffffff",
      ring: "#10b981",
      radius: "0.5rem",
      surfaceTint: "#ecfdf5",
    },
  },
  {
    slug: "amber-mono",
    name: "Amber Mono",
    description:
      "Ámbar industrial con radios compactos de alta densidad informativa.",
    isDefault: false,
    tokens: {
      accent: "#d97706",
      accentHover: "#b45309",
      accentFg: "#ffffff",
      ring: "#f59e0b",
      radius: "0.375rem",
      surfaceTint: "#fffbeb",
    },
  },
  {
    slug: "rose-editorial",
    name: "Rose Editorial",
    description:
      "Carmín editorial con bordes suaves y aire tipográfico refinado.",
    isDefault: false,
    tokens: {
      accent: "#e11d48",
      accentHover: "#be123c",
      accentFg: "#ffffff",
      ring: "#f43f5e",
      radius: "0.75rem",
      surfaceTint: "#fff1f2",
    },
  },
  {
    slug: "cyan-terminal",
    name: "Cyan Terminal",
    description:
      "Cian eléctrico inspirado en consolas de desarrollador y CLIs.",
    isDefault: false,
    tokens: {
      accent: "#0891b2",
      accentHover: "#0e7490",
      accentFg: "#ffffff",
      ring: "#06b6d4",
      radius: "0.375rem",
      surfaceTint: "#ecfeff",
    },
  },
  {
    slug: "obsidian-high-contrast",
    name: "Obsidian High-Contrast",
    description:
      "Contraste máximo monocromo con enfoque nítido para accesibilidad AAA.",
    isDefault: false,
    tokens: {
      accent: "#18181b",
      accentHover: "#27272a",
      accentFg: "#fafafa",
      ring: "#71717a",
      radius: "0.5rem",
      surfaceTint: "#f4f4f5",
    },
  },
];

/** Apply a preset's semantic tokens onto the document root element. */
export function applyPresetTokens(
  tokens: ThemeTokens,
  root?: HTMLElement,
): void {
  const target =
    root ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (!target) return;

  target.style.setProperty("--accent", tokens.accent);
  target.style.setProperty("--accent-hover", tokens.accentHover);
  target.style.setProperty("--accent-fg", tokens.accentFg);
  target.style.setProperty("--ring", tokens.ring);
  target.style.setProperty("--radius-ui", tokens.radius);
  target.style.setProperty("--accent-soft", tokens.surfaceTint);
}
