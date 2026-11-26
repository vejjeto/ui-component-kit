"use client";

import * as React from "react";

export type Locale = "es" | "en";

const STORAGE_KEY = "forge-lang";
const CHANGE_EVENT = "forge-lang-change";

export const TRANSLATIONS = {
  es: {
    nav: {
      home: "Inicio",
      components: "Componentes",
      docs: "Documentación",
      demo: "Demo",
      openApi: "OpenAPI",
    },
    hero: {
      badge: "12 Primitivos WAI-ARIA • Zero-FOUC Tokens • Shadcn Registry",
      title: "Sistema de Diseño React sin dependencias pesadas.",
      subtitlePrefix:
        "Construye interfaces consistentes con 12 componentes accesibles por teclado, variantes",
      subtitleMid: ", composición",
      subtitleSuffix: "y playground interactivo en vivo.",
      primaryCta: "Explorar los 12 Componentes",
      secondaryCta: "Abrir Demo",
    },
    features: {
      tokensTitle: "Tokens Semánticos CSS",
      tokensDesc:
        "Cambia instantáneamente entre 6 presets curados o guarda tus propios tokens en localStorage.",
      a11yTitle: "Accesibilidad Completa",
      a11yDesc:
        "Focus trap nativo en Modal, roving focus en Menus/Tabs y navegación por rejilla en DatePicker.",
      previewTitle: "Preview vs Code en Vivo",
      previewDesc:
        "Cada componente incluye editor de props, tabla API tipada, resaltado léxico y copia en 1 clic.",
    },
    demo: {
      breadcrumb: "/ Demo Interactiva",
      title: "Live Console Demo",
      subtitle:
        "Showcase interactivo con los 12 primitivos WAI-ARIA, TanStack Table v8 y presets en localStorage.",
    },
    docs: {
      breadcrumb: "/ Documentación Interactiva",
      search: "Buscar...",
      presetLabel: "Preset de tema",
      allComponents: "Todos los componentes (12)",
      components: "Componentes",
      catalogAria: "Catálogo de componentes",
      openMenuAria: "Abrir menú de componentes",
      closeMenuAria: "Cerrar menú",
    },
    showcase: {
      ariaLabel: "Mini-Dashboard Showcase interactivo",
      subtitle: "Construido 100% con los 12 componentes accesibles",
      commandTooltip: "Abrir CommandPalette (⌘K)",
      toastTitle: "Telemetría en vivo",
      toastDesc: "Latencia global estable en 21 ms p95.",
      options: "Opciones",
      tokensGroup: "Tokens",
      createPreset: "Crear preset personalizado",
      exportTokens: "Exportar CSS Tokens",
      tokensExported: "Tokens exportados",
      activePresetPrefix: "Preset activo:",
      resetPreset: "Restablecer Forge Indigo",
      resetToast: "Preset restaurado a Forge Indigo",
      newPreset: "Nuevo Preset",
      presetsLabel: "Presets (localStorage):",
      tabDeployments: "Despliegues",
      tabArchitecture: "Decisiones Técnicas",
      filterEnv: "Filtrar por entorno",
      dateWindow: "Ventana de observación",
      colService: "Servicio",
      colEnvironment: "Entorno",
      colRegion: "Región",
      colStatus: "Estado",
      envAll: "Todos los entornos",
      envAllDesc: "Production + Staging",
      envProdDesc: "Tráfico real de clientes",
      envStagingDesc: "Validación previa a release",
      foucTitle: "Cero FOUC en Dark/Light Mode",
      foucSubtitle: "Inline script previo a hidratación React",
      foucContent:
        "layout.tsx inyecta un script síncrono mínimo que aplica la clase .dark antes del primer frame.",
      zeroDepTitle: "DatePicker y Focus Trap sin dependencias pesadas",
      zeroDepSubtitle: "Control total de teclado y bundle reducido",
      zeroDepContent:
        "La matriz mensual 6x7 y el ciclo Tab/Shift+Tab están implementados con utilidades puras y testeadas.",
      modalTitle: "Guardar preset de tokens",
      modalDesc:
        "Se guardará en localStorage vía Zustand y se aplicará al sistema de tokens.",
      presetNameLabel: "Nombre del preset",
      presetNamePlaceholder: "Ej. Violet Studio",
      presetNameError: "Ingresa un nombre de al menos 2 caracteres.",
      presetCustomDesc: "Preset personalizado creado desde el Showcase.",
      presetSavedTitle: "activado",
      presetSavedDesc:
        "Guardado en localStorage y aplicado al sistema de tokens.",
      accentLabel: "Color de acento primario (--accent)",
      cancel: "Cancelar",
      saveAndApply: "Guardar y aplicar",
    },
  },
  en: {
    nav: {
      home: "Home",
      components: "Components",
      docs: "Docs",
      demo: "Demo",
      openApi: "OpenAPI",
    },
    hero: {
      badge: "12 WAI-ARIA Primitives • Zero-FOUC Tokens • Shadcn Registry",
      title: "React Design System without heavy dependencies.",
      subtitlePrefix:
        "Build consistent interfaces with 12 keyboard-accessible components,",
      subtitleMid: "variants,",
      subtitleSuffix: "composition, and a live interactive playground.",
      primaryCta: "Explore the 12 Components",
      secondaryCta: "Open Demo",
    },
    features: {
      tokensTitle: "Semantic CSS Tokens",
      tokensDesc:
        "Switch instantly between 6 curated presets or save your own tokens in localStorage.",
      a11yTitle: "Full Accessibility",
      a11yDesc:
        "Native focus trap in Modal, roving focus in Menus/Tabs, and grid navigation in DatePicker.",
      previewTitle: "Live Preview vs Code",
      previewDesc:
        "Each component includes a props editor, typed API table, syntax highlighting, and 1-click copy.",
    },
    demo: {
      breadcrumb: "/ Interactive Demo",
      title: "Live Console Demo",
      subtitle:
        "Interactive showcase with the 12 WAI-ARIA primitives, TanStack Table v8, and localStorage presets.",
    },
    docs: {
      breadcrumb: "/ Interactive Docs",
      search: "Search...",
      presetLabel: "Theme preset",
      allComponents: "All components (12)",
      components: "Components",
      catalogAria: "Component catalog",
      openMenuAria: "Open components menu",
      closeMenuAria: "Close menu",
    },
    showcase: {
      ariaLabel: "Interactive Mini-Dashboard Showcase",
      subtitle: "Built 100% with the 12 accessible components",
      commandTooltip: "Open CommandPalette (⌘K)",
      toastTitle: "Live telemetry",
      toastDesc: "Global latency steady at 21 ms p95.",
      options: "Options",
      tokensGroup: "Tokens",
      createPreset: "Create custom preset",
      exportTokens: "Export CSS Tokens",
      tokensExported: "Tokens exported",
      activePresetPrefix: "Active preset:",
      resetPreset: "Reset Forge Indigo",
      resetToast: "Preset restored to Forge Indigo",
      newPreset: "New Preset",
      presetsLabel: "Presets (localStorage):",
      tabDeployments: "Deployments",
      tabArchitecture: "Technical Decisions",
      filterEnv: "Filter by environment",
      dateWindow: "Observation window",
      colService: "Service",
      colEnvironment: "Environment",
      colRegion: "Region",
      colStatus: "Status",
      envAll: "All environments",
      envAllDesc: "Production + Staging",
      envProdDesc: "Live customer traffic",
      envStagingDesc: "Pre-release validation",
      foucTitle: "Zero FOUC in Dark/Light Mode",
      foucSubtitle: "Inline script before React hydration",
      foucContent:
        "layout.tsx injects a minimal synchronous script that applies the .dark class before the first frame.",
      zeroDepTitle: "DatePicker & Focus Trap without heavy dependencies",
      zeroDepSubtitle: "Full keyboard control and small bundle",
      zeroDepContent:
        "The 6x7 monthly grid and Tab/Shift+Tab cycle are implemented with pure, tested utilities.",
      modalTitle: "Save token preset",
      modalDesc:
        "Saved to localStorage via Zustand and applied to the token system.",
      presetNameLabel: "Preset name",
      presetNamePlaceholder: "e.g. Violet Studio",
      presetNameError: "Enter a name of at least 2 characters.",
      presetCustomDesc: "Custom preset created from the Showcase.",
      presetSavedTitle: "activated",
      presetSavedDesc: "Saved to localStorage and applied to the token system.",
      accentLabel: "Primary accent color (--accent)",
      cancel: "Cancel",
      saveAndApply: "Save and apply",
    },
  },
} as const;

export type TranslationDictionary = (typeof TRANSLATIONS)["es"];

function isLocale(value: string | null): value is Locale {
  return value === "es" || value === "en";
}

export function useLocale() {
  const [locale, setLocaleState] = React.useState<Locale>("es");

  React.useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial: Locale = isLocale(saved) ? saved : "es";
    setLocaleState(initial);
    document.documentElement.lang = initial;

    const onLocaleChange = (event: Event) => {
      const next = (event as CustomEvent<Locale>).detail;
      if (isLocale(next)) {
        setLocaleState(next);
        document.documentElement.lang = next;
      }
    };

    window.addEventListener(CHANGE_EVENT, onLocaleChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onLocaleChange);
    };
  }, []);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
    window.dispatchEvent(
      new CustomEvent<Locale>(CHANGE_EVENT, { detail: next }),
    );
  }, []);

  const toggleLocale = React.useCallback(() => {
    setLocale(locale === "es" ? "en" : "es");
  }, [locale, setLocale]);

  return {
    locale,
    setLocale,
    toggleLocale,
    t: TRANSLATIONS[locale],
  };
}
