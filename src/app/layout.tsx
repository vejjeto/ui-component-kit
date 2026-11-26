import type { Metadata } from "next";
import type * as React from "react";
import "./globals.css";
import { GlobalCommandPaletteProvider } from "@/components/docs/GlobalCommandPalette";
import { ToastProvider } from "@/components/forge/Toast";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "ForgeUI — Sistema de Diseño & 12 Componentes Accesibles",
  description:
    "Librería de componentes React 19 + Next.js 15 con tokens semánticos CSS, WAI-ARIA completo, cero FOUC, TanStack Table v8 y Shadcn Registry.",
};

const ZERO_FOUC_SCRIPT = `
(function() {
  try {
    var saved = window.localStorage.getItem("forge-theme");
    var mode = saved === "light" ? "light" : "dark";
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ZERO_FOUC_SCRIPT }} />
      </head>
      <body>
        <Providers>
          <ThemeProvider>
            <ToastProvider>
              <GlobalCommandPaletteProvider>
                {children}
              </GlobalCommandPaletteProvider>
            </ToastProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
