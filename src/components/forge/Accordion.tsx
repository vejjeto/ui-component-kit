"use client";

import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";
import * as React from "react";

export interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  defaultOpenIds?: string[];
  className?: string;
}

export function Accordion({
  items,
  type = "single",
  defaultOpenIds = [],
  className,
}: AccordionProps): React.ReactElement {
  const [openIds, setOpenIds] = React.useState<string[]>(() =>
    type === "single" ? defaultOpenIds.slice(0, 1) : defaultOpenIds,
  );
  const baseId = React.useId();

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (type === "single") {
        return isOpen ? [] : [id];
      }
      return isOpen ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  return (
    <div
      className={cn(
        "divide-y divide-[var(--border-subtle)] rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]",
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id}>
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[var(--bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring)]"
            >
              <div>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {item.title}
                </span>
                {item.subtitle ? (
                  <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                    {item.subtitle}
                  </span>
                ) : null}
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200",
                  isOpen && "rotate-180 text-[var(--accent)]",
                )}
                aria-hidden="true"
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              data-open={isOpen ? "true" : "false"}
              className="forge-accordion-content"
            >
              <div className="forge-accordion-inner">
                <div className="px-4 pb-4 pt-1 text-sm text-[var(--text-secondary)]">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
