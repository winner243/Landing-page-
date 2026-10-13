import * as React from "react";
import { cn } from "@landing/ui-core";
import { Section, SectionHeader } from "./section";
import { FeatureList, type FeatureItem } from "./feature";

export interface ListHeader {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface BenefitListProps {
  /** Section framing — optional. */
  header?: ListHeader;
  /** Benefits stated as outcomes, not features (CONVERSION.md §7). */
  items: FeatureItem[];
  /**
   * "checkmark" (default) for outcome bullets, "icon" when each benefit
   * carries its own visual.
   */
  variant?: "checkmark" | "icon";
  /** Render items without the Section wrapper. */
  withSection?: boolean;
  className?: string;
}

/**
 * Benefit list — positive-framing outcomes ("what changes for me").
 * Thin composition over FeatureList so checkmark/icon rows stay defined
 * in exactly one place (single source of truth).
 */
function BenefitList({
  header,
  items,
  variant = "checkmark",
  withSection = true,
  className,
}: BenefitListProps) {
  const body = (
    <>
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}
      <FeatureList
        items={items}
        checkmark={variant === "checkmark"}
        className={className}
      />
    </>
  );

  if (!withSection) return body;
  return <Section>{body}</Section>;
}

export interface IconListItem {
  /** Icon node — icon-library agnostic (any ReactNode). */
  icon: React.ReactNode;
  label: string;
  description?: string;
}

export interface IconListProps {
  items: IconListItem[];
  /** horizontal wraps on wide screens; vertical stacks (pain points, steps). */
  layout?: "horizontal" | "vertical";
  /** Render items without the Section wrapper. */
  withSection?: boolean;
  header?: ListHeader;
  className?: string;
}

/**
 * Icon + short label list — landmarks for capabilities or pain points.
 * Semantic <ul>/<li> so screen readers announce the list structure.
 */
function IconList({
  items,
  layout = "horizontal",
  withSection = true,
  header,
  className,
}: IconListProps) {
  const list = (
    <ul
      className={cn(
        layout === "horizontal" ? "flex flex-wrap gap-x-8 gap-y-5" : "flex flex-col gap-4",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center text-accent"
          >
            {item.icon}
          </span>
          <div>
            <span className="text-sm font-semibold text-foreground">{item.label}</span>
            {item.description && (
              <p className="text-sm text-foreground-muted">{item.description}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  if (!withSection && !header) return list;

  const body = (
    <>
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}
      {list}
    </>
  );

  if (!withSection) return body;
  return <Section>{body}</Section>;
}

export { BenefitList, IconList };
