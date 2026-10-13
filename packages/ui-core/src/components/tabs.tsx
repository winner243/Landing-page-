"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  /** Uncontrolled initial selection (defaults to the first enabled item). */
  defaultValue?: string;
  /** Controlled selection. */
  value?: string;
  onValueChange?(id: string): void;
}

/**
 * Accessible tabs (WAI-ARIA Tabs pattern):
 * roving tabindex, Arrow/Home/End navigation, `aria-controls`/`aria-labelledby`
 * wiring, selection follows focus. Data-driven to match the kit's
 * composition style.
 */
function Tabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  "aria-label": ariaLabel,
  ...props
}: TabsProps) {
  const baseId = React.useId();
  const firstEnabled = items.find((item) => !item.disabled)?.id ?? "";
  const [internal, setInternal] = React.useState<string>(
    () => defaultValue ?? firstEnabled,
  );
  const active = value ?? internal;

  const select = React.useCallback(
    (id: string) => {
      if (value === undefined) setInternal(id);
      onValueChange?.(id);
    },
    [value, onValueChange],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])',
      ),
    );
    const currentIndex = tabs.findIndex(
      (tab) => tab.dataset.tabId === active,
    );
    if (tabs.length === 0 || currentIndex < 0) return;

    let nextIndex: number;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    const target = tabs[nextIndex];
    if (!target) return;
    select(target.dataset.tabId ?? "");
    target.focus();
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className="inline-flex w-full flex-wrap items-center gap-1 rounded-lg border border-border bg-background-muted p-1"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              data-tab-id={item.id}
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.id)}
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selected
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items
        .filter((item) => item.id === active)
        .map((item) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`${baseId}-panel-${item.id}`}
            aria-labelledby={`${baseId}-tab-${item.id}`}
            tabIndex={0}
            className="mt-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
          >
            {item.content}
          </div>
        ))}
    </div>
  );
}

export { Tabs };
