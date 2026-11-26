"use client";

import { cn } from "@/lib/cn";
import * as React from "react";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delayMs?: number;
  children: React.ReactNode;
  className?: string;
}

const PLACEMENT_CLASSES: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({
  content,
  placement = "top",
  delayMs = 200,
  children,
  className,
}: TooltipProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);
  const tooltipId = React.useId();

  const clearTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = React.useCallback(() => {
    clearTimer();
    if (delayMs <= 0) {
      setOpen(true);
      return;
    }
    timerRef.current = window.setTimeout(() => setOpen(true), delayMs);
  }, [clearTimer, delayMs]);

  const hide = React.useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  React.useEffect(() => clearTimer, [clearTimer]);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === "Escape") hide();
      }}
      aria-describedby={open ? tooltipId : undefined}
    >
      {children}
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-[var(--border-subtle)] bg-[var(--text-primary)] px-2.5 py-1 text-xs font-medium text-[var(--bg-canvas)] shadow-lg",
            PLACEMENT_CLASSES[placement],
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
