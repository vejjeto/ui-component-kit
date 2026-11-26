"use client";

import { cn } from "@/lib/cn";
import * as React from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  className,
}: TabsProps): React.ReactElement {
  const firstEnabled = items.find((i) => !i.disabled)?.id ?? items[0]?.id ?? "";
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? firstEnabled,
  );
  const activeId = value ?? internalValue;

  const baseId = React.useId();
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = React.useState<React.CSSProperties>({});

  const selectTab = React.useCallback(
    (nextId: string) => {
      if (value === undefined) {
        setInternalValue(nextId);
      }
      onValueChange?.(nextId);
    },
    [value, onValueChange],
  );

  React.useLayoutEffect(() => {
    const activeEl = tabRefs.current[activeId];
    if (!activeEl) return;
    setPillStyle({
      width: activeEl.offsetWidth,
      height: activeEl.offsetHeight,
      transform: `translate(${activeEl.offsetLeft}px, ${activeEl.offsetTop}px)`,
    });
  }, [activeId, orientation, items]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIdx: number,
  ) => {
    const isHorizontal = orientation === "horizontal";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

    let step: number | null = null;
    if (event.key === nextKey) step = 1;
    else if (event.key === prevKey) step = -1;
    else if (event.key === "Home") step = 0;
    else if (event.key === "End") step = -2;

    if (step === null) return;
    event.preventDefault();

    const enabled = items.filter((item) => !item.disabled);
    if (enabled.length === 0) return;

    let target: TabItem | undefined;
    if (step === 0) {
      target = enabled[0];
    } else if (step === -2) {
      target = enabled[enabled.length - 1];
    } else {
      const currentItem = items[currentIdx];
      const enabledIdx = enabled.findIndex((i) => i.id === currentItem?.id);
      const nextEnabledIdx =
        (enabledIdx + step + enabled.length) % enabled.length;
      target = enabled[nextEnabledIdx];
    }

    if (!target) return;
    selectTab(target.id);
    tabRefs.current[target.id]?.focus();
  };

  const activeItem = items.find((i) => i.id === activeId) ?? items[0];

  return (
    <div
      className={cn(
        "flex gap-4",
        orientation === "vertical" ? "flex-col sm:flex-row" : "flex-col",
        className,
      )}
    >
      <div
        ref={listRef}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          "relative inline-flex rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-1",
          orientation === "vertical"
            ? "flex-col self-start"
            : "flex-wrap items-center self-start",
        )}
      >
        <span
          aria-hidden="true"
          style={pillStyle}
          className="pointer-events-none absolute left-0 top-0 rounded-[calc(var(--radius-ui)-2px)] bg-[var(--bg-surface)] shadow-sm transition-all duration-200 ease-out"
        />
        {items.map((item, idx) => {
          const isSelected = item.id === activeId;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              id={tabId}
              role="tab"
              type="button"
              disabled={item.disabled}
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !item.disabled && selectTab(item.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                "relative z-10 inline-flex items-center gap-2 rounded-[calc(var(--radius-ui)-2px)] px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                isSelected
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                item.disabled && "cursor-not-allowed opacity-45",
              )}
            >
              {item.icon ? (
                <span className="inline-flex shrink-0">{item.icon}</span>
              ) : null}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {activeItem ? (
        <div
          id={`${baseId}-panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          tabIndex={0}
          className="flex-1 rounded-[var(--radius-ui)] focus:outline-none"
        >
          {activeItem.content}
        </div>
      ) : null}
    </div>
  );
}
