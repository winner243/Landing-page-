"use client";

import * as React from "react";
import { Stack, cn } from "@landing/ui-core";

export type BillingInterval = "monthly" | "annual";

export interface PricingToggleProps {
  value: BillingInterval;
  onChange: (value: BillingInterval) => void;
  monthlyLabel?: string;
  annualLabel?: string;
  /** e.g. "Save 20%" — computed from real prices only. */
  savingsLabel?: string;
}

/**
 * Monthly/annual segmented control (aria-pressed pair). Savings must be
 * mathematically accurate against the displayed prices (ETHICS.md §4).
 */
function PricingToggle({
  value,
  onChange,
  monthlyLabel = "Monthly",
  annualLabel = "Annual",
  savingsLabel,
}: PricingToggleProps) {
  return (
    <div
      role="group"
      aria-label="Billing interval"
      className="inline-flex rounded-full border border-border bg-muted p-1"
    >
      <button
        type="button"
        aria-pressed={value === "monthly"}
        onClick={() => onChange("monthly")}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]",
          value === "monthly"
            ? "bg-surface text-foreground shadow-sm"
            : "text-foreground-muted hover:text-foreground",
        )}
      >
        {monthlyLabel}
      </button>
      <button
        type="button"
        aria-pressed={value === "annual"}
        onClick={() => onChange("annual")}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]",
          value === "annual"
            ? "bg-surface text-foreground shadow-sm"
            : "text-foreground-muted hover:text-foreground",
        )}
      >
        {annualLabel}
        {savingsLabel && (
          <span className="ml-1.5 text-xs font-semibold text-accent">{savingsLabel}</span>
        )}
      </button>
    </div>
  );
}

export interface PricingNoteProps {
  /** Guarantee line — only when a real guarantee exists. */
  guarantee?: React.ReactNode;
  /** Fine print — taxes, billing cycle, cancellation terms. */
  finePrint?: React.ReactNode;
  className?: string;
}

/**
 * Disclosure line under pricing — guarantee + fine print (ETHICS.md §4:
 * terms visible before the click, never in a tooltip).
 */
function PricingNote({ guarantee, finePrint, className }: PricingNoteProps) {
  if (!guarantee && !finePrint) return null;

  return (
    <Stack gap={2} align="center" className={cn("text-center", className)}>
      {guarantee && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground-muted">
          <svg
            aria-hidden="true"
            className="size-4 text-success"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {guarantee}
        </p>
      )}
      {finePrint && (
        <p className="max-w-[65ch] text-xs text-foreground-subtle">{finePrint}</p>
      )}
    </Stack>
  );
}

export { PricingToggle, PricingNote };
