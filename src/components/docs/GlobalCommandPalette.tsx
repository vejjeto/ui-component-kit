"use client";

import {
  type CommandItem,
  CommandPalette,
} from "@/components/forge/CommandPalette";
import { useTheme } from "@/components/theme/ThemeProvider";
import { COMPONENT_CATALOG } from "@/lib/catalog";
import {
  Box,
  Home,
  Layers,
  LayoutDashboard,
  Moon,
  Palette,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPaletteContext =
  React.createContext<CommandPaletteContextValue | null>(null);

export function GlobalCommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { mode, toggleMode, presets, selectPreset } = useTheme();

  const commands = React.useMemo<CommandItem[]>(() => {
    const navCommands: CommandItem[] = [
      {
        id: "nav-home",
        label: "Ir al Inicio & Showcase",
        group: "Navegación",
        keywords: "landing home showcase",
        icon: <Home className="h-4 w-4" />,
        onSelect: () => router.push("/"),
      },
      {
        id: "nav-demo",
        label: "Abrir Mini-Dashboard Demo (/demo)",
        group: "Navegación",
        keywords: "demo dashboard interactive showcase",
        icon: <LayoutDashboard className="h-4 w-4" />,
        onSelect: () => router.push("/demo"),
      },
      {
        id: "nav-docs",
        label: "Explorar catálogo completo (/docs)",
        group: "Navegación",
        keywords: "docs components catalog wcag",
        icon: <Layers className="h-4 w-4" />,
        onSelect: () => router.push("/docs"),
      },
      ...COMPONENT_CATALOG.map((spec) => ({
        id: `comp-${spec.slug}`,
        label: `${spec.name} — ${spec.category}`,
        group: "Componentes (12)",
        keywords: `${spec.slug} ${spec.summary}`,
        icon: <Box className="h-4 w-4" />,
        onSelect: () => router.push(`/docs/${spec.slug}`),
      })),
    ];

    const themeCommands: CommandItem[] = [
      {
        id: "toggle-mode",
        label:
          mode === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro",
        group: "Tema y Tokens",
        keywords: "dark light theme mode",
        shortcut: "⌘J",
        icon:
          mode === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          ),
        onSelect: toggleMode,
      },
      ...presets.map((preset) => ({
        id: `preset-${preset.slug}`,
        label: `Aplicar preset: ${preset.name}`,
        group: "Tema y Tokens",
        keywords: `${preset.slug} color tokens`,
        icon: <Palette className="h-4 w-4" />,
        onSelect: () => selectPreset(preset.slug),
      })),
    ];

    return [...navCommands, ...themeCommands];
  }, [router, mode, toggleMode, presets, selectPreset]);

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandPalette
        commands={commands}
        open={open}
        onOpenChange={setOpen}
        enableGlobalShortcut={true}
      />
    </CommandPaletteContext.Provider>
  );
}

export function useGlobalCommandPalette(): CommandPaletteContextValue {
  const ctx = React.useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error(
      "useGlobalCommandPalette must be used within GlobalCommandPaletteProvider",
    );
  }
  return ctx;
}
