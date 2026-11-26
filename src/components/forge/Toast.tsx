"use client";

import { cn } from "@/lib/cn";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import * as React from "react";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastEntry
  extends Required<Pick<ToastOptions, "title" | "variant" | "durationMs">> {
  id: string;
  description?: string | undefined;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: React.ReactNode; barClass: string; badgeClass: string }
> = {
  info: {
    icon: <Info className="h-4 w-4 text-[var(--accent)]" />,
    barClass: "bg-[var(--accent)]",
    badgeClass: "border-[var(--border-subtle)]",
  },
  success: {
    icon: <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />,
    barClass: "bg-[var(--success)]",
    badgeClass: "border-emerald-500/30",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-[var(--warning)]" />,
    barClass: "bg-[var(--warning)]",
    badgeClass: "border-amber-500/30",
  },
  error: {
    icon: <AlertCircle className="h-4 w-4 text-[var(--danger)]" />,
    barClass: "bg-[var(--danger)]",
    badgeClass: "border-red-500/30",
  },
};

export function ToastProvider({
  children,
}: { children: React.ReactNode }): React.ReactElement {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const timersRef = React.useRef<Map<string, number>>(new Map());

  const dismiss = React.useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = React.useCallback(
    (options: ToastOptions): string => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const durationMs = options.durationMs ?? 4000;
      const entry: ToastEntry = {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? "info",
        durationMs,
      };

      setToasts((prev) => [...prev.slice(-4), entry]);

      if (durationMs > 0) {
        const timer = window.setTimeout(() => dismiss(id), durationMs);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  React.useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0"
      >
        {toasts.map((item) => {
          const style = VARIANT_STYLES[item.variant];
          return (
            <div
              key={item.id}
              role="status"
              className={cn(
                "pointer-events-auto relative overflow-hidden rounded-[var(--radius-ui)] border bg-[var(--bg-surface)] p-3.5 shadow-xl",
                style.badgeClass,
              )}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0" aria-hidden="true">
                  {style.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </p>
                  {item.description ? (
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label="Cerrar notificación"
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {item.durationMs > 0 ? (
                <div
                  className={cn(
                    "forge-toast-progress absolute bottom-0 left-0 h-0.5 w-full",
                    style.barClass,
                  )}
                  style={{ animationDuration: `${item.durationMs}ms` }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
}
