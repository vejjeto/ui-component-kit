"use client";

import { usePresetStore } from "@/lib/preset-store";
import {
  CURATED_PRESETS,
  type ThemePresetRecord,
  type ThemeTokens,
  applyPresetTokens,
} from "@/lib/presets";
import * as React from "react";

export type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  presets: ThemePresetRecord[];
  activePresetSlug: string;
  selectPreset: (slug: string) => void;
  registerPreset: (preset: ThemePresetRecord) => void;
}

const DEFAULT_PRESETS: ThemePresetRecord[] = CURATED_PRESETS.map((p, idx) => ({
  ...p,
  id: idx + 1,
  createdAt: "",
}));

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function applyModeClass(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({
  children,
}: { children: React.ReactNode }): React.ReactElement {
  const [mode, setModeState] = React.useState<ThemeMode>("dark");
  const [activePresetSlug, setActivePresetSlug] =
    React.useState<string>("forge-indigo");
  const customPresets = usePresetStore((state) => state.customPresets);
  const addCustomPreset = usePresetStore((state) => state.addCustomPreset);

  const presets = React.useMemo<ThemePresetRecord[]>(() => {
    const merged = [...DEFAULT_PRESETS];
    for (const custom of customPresets) {
      const idx = merged.findIndex((p) => p.slug === custom.slug);
      if (idx >= 0) {
        merged[idx] = custom;
      } else {
        merged.push(custom);
      }
    }
    return merged;
  }, [customPresets]);

  React.useEffect(() => {
    const saved = window.localStorage.getItem("forge-theme");
    const nextMode: ThemeMode = saved === "light" ? "light" : "dark";
    applyModeClass(nextMode);
    setModeState(nextMode);

    const observer = new MutationObserver(() => {
      const hasDark = document.documentElement.classList.contains("dark");
      setModeState(hasDark ? "dark" : "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const savedPreset = window.localStorage.getItem("forge-preset");
    if (savedPreset) {
      setActivePresetSlug(savedPreset);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    const found = presets.find((p) => p.slug === activePresetSlug);
    if (!found) return;
    const tokens: ThemeTokens = found.tokens;
    applyPresetTokens(tokens);
  }, [activePresetSlug, presets]);

  const setMode = React.useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    applyModeClass(nextMode);
    window.localStorage.setItem("forge-theme", nextMode);
  }, []);

  const toggleMode = React.useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark";
      applyModeClass(next);
      window.localStorage.setItem("forge-theme", next);
      return next;
    });
  }, []);

  const selectPreset = React.useCallback((slug: string) => {
    setActivePresetSlug(slug);
    window.localStorage.setItem("forge-preset", slug);
  }, []);

  const registerPreset = React.useCallback(
    (preset: ThemePresetRecord) => {
      addCustomPreset(preset);
      setActivePresetSlug(preset.slug);
      window.localStorage.setItem("forge-preset", preset.slug);
    },
    [addCustomPreset],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode,
      presets,
      activePresetSlug,
      selectPreset,
      registerPreset,
    }),
    [
      mode,
      setMode,
      toggleMode,
      presets,
      activePresetSlug,
      selectPreset,
      registerPreset,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
