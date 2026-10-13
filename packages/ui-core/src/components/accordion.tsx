"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (id: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null,
);

function useAccordion() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion components must be used within <Accordion>");
  return ctx;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** "single": only one panel open. "multiple": independent toggles. */
  type?: "single" | "multiple";
  /** Controlled open item ids (uncontrolled state used otherwise). */
  defaultOpenIds?: string[];
}

/**
 * Accessible accordion container (FAQ base).
 * Uses button triggers with aria-expanded + aria-controls (no ARIA abuse).
 */
function Accordion({
  type = "single",
  defaultOpenIds = [],
  className,
  children,
  ...props
}: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(
    () => new Set(defaultOpenIds),
  );

  const toggle = React.useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(type === "single" ? [] : prev);
        if (prev.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [type],
  );

  const value = React.useMemo(
    () => ({ openItems: openIds, toggle, type }),
    [openIds, toggle, type],
  );

  return (
    <AccordionContext.Provider value={value}>
      <div className={cn("divide-y divide-border", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique id — links trigger and panel. */
  id: string;
}

function AccordionItem({ id, className, children, ...props }: AccordionItemProps) {
  return (
    <div className={cn("", className)} data-item-id={id} {...props}>
      {children}
    </div>
  );
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** AccordionItem id this trigger controls. */
  itemId: string;
}

function AccordionTrigger({
  itemId,
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const { openItems, toggle } = useAccordion();
  const open = openItems.has(itemId);
  const panelId = `${itemId}-panel`;
  const triggerId = `${itemId}-trigger`;

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => toggle(itemId)}
      className={cn(
        "flex w-full items-center justify-between gap-4 py-4 text-left",
        "text-base font-medium text-foreground",
        "transition-colors hover:text-accent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]",
        className,
      )}
      {...props}
    >
      {children}
      <svg
        aria-hidden="true"
        className={cn(
          "size-4 shrink-0 text-foreground-muted transition-transform duration-[250ms]",
          open && "rotate-180",
        )}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  itemId: string;
}

function AccordionContent({
  itemId,
  className,
  children,
  ...props
}: AccordionContentProps) {
  const { openItems } = useAccordion();
  const open = openItems.has(itemId);
  const panelId = `${itemId}-panel`;
  const triggerId = `${itemId}-trigger`;

  if (!open) return null;

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      className={cn("pb-4 pr-8 text-sm text-foreground-muted", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
