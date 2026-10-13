import * as React from "react";
import {
  Card,

  CardDescription,
  CardHeader,
  CardTitle,
  Grid,
  Stack,
  cn,
} from "@landing/ui-core";
import { Section, SectionHeader } from "./section";

/**
 * Content shape for a feature — presentation is independent
 * (content/presentation separation, Phase 1 §21).
 */
export interface FeatureItem {
  /** Benefit-oriented title (≤8 words), not the raw feature name. */
  title: string;
  /** What it does + why it matters (≤30 words). */
  description?: string;
  /** Icon node (icon-library agnostic — pass any ReactNode). */
  icon?: React.ReactNode;
  /** Optional visual for feature-split layouts. */
  visual?: React.ReactNode;
  /** Optional "Learn more" destination. */
  link?: { label: string; href: string };
}

/** Single feature card: icon → title → description. */
function FeatureCard({
  item,
  className,
}: {
  item: FeatureItem;
  className?: string;
}) {
  return (
    <Card variant="flat" padding="md" className={cn("h-full", className)}>
      {item.icon && (
        <div
          aria-hidden="true"
          className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent"
        >
          {item.icon}
        </div>
      )}
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        {item.description && (
          <CardDescription className="text-sm leading-relaxed">
            {item.description}
          </CardDescription>
        )}
      </CardHeader>
      {item.link && (
        <a
          href={item.link.href}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          {item.link.label}
          <span aria-hidden="true">→</span>
        </a>
      )}
    </Card>
  );
}

export interface FeatureGridProps {
  /** Section framing (eyebrow/title/description) — optional. */
  header?: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
  };
  items: FeatureItem[];
  /** Card columns per breakpoint (mobile-first). */
  columns?: 1 | 2 | 3 | 4;
  /** Renders section wrapper with spacing (disable to embed elsewhere). */
  withSection?: boolean;
}

/**
 * Feature grid: content array → responsive card grid.
 * Columns collapse automatically: base=1, md=2 when columns ≥ 2, lg=columns.
 */
function FeatureGrid({
  header,
  items,
  columns = 3,
  withSection = true,
}: FeatureGridProps) {
  const md = columns >= 2 ? 2 : 1;
  const lg = columns;

  const body = (
    <>
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}
      <Grid columns={{ base: 1, md: md as 1 | 2 | 3 | 4, lg: lg as 1 | 2 | 3 | 4 }} gap={6}>
        {items.map((item) => (
          <FeatureCard key={item.title} item={item} />
        ))}
      </Grid>
    </>
  );

  if (!withSection) return body;
  return <Section>{body}</Section>;
}

export interface FeatureListProps {
  items: FeatureItem[];
  /** Checkmark style instead of icon boxes (benefit lists). */
  checkmark?: boolean;
  className?: string;
}

/** Compact vertical feature/benefit list — icon + title + description rows. */
function FeatureList({ items, checkmark = false, className }: FeatureListProps) {
  return (
    <Stack gap={5} className={className}>
      {items.map((item) => (
        <div key={item.title} className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full",
              checkmark
                ? "bg-success-bg text-success-fg"
                : "bg-accent/10 text-accent",
            )}
          >
            {checkmark ? (
              <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              item.icon
            )}
          </span>
          <div>
            <p className="font-semibold text-foreground">{item.title}</p>
            {item.description && (
              <p className="text-sm text-foreground-muted">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </Stack>
  );
}

export interface FeatureSplitProps {
  header?: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
  };
  items: FeatureItem[];
  /** Alternate visual side (true: first visual on right). */
  alternate?: boolean;
}

/**
 * Split feature rows — text/visual pairs for storytelling sections.
 * Visual slot per feature enables screenshots, diagrams, or live components.
 */
function FeatureSplit({ header, items, alternate = true }: FeatureSplitProps) {
  return (
    <Section>
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}
      <Stack gap={16}>
        {items.map((item, i) => {
          const visualLeft = alternate ? i % 2 === 1 : false;
          return (
            <div
              key={item.title}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <div className={cn(visualLeft && "lg:order-2")}>
                <div className="flex flex-col gap-4">
                  {item.icon && (
                    <span
                      aria-hidden="true"
                      className="inline-flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent"
                    >
                      {item.icon}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-balance">{item.title}</h3>
                  {item.description && (
                    <p className="max-w-[55ch] text-foreground-muted">{item.description}</p>
                  )}
                  {item.link && (
                    <a
                      href={item.link.href}
                      className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                    >
                      {item.link.label}
                      <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </div>
              <div className={cn(visualLeft && "lg:order-1")}>
                {item.visual}
              </div>
            </div>
          );
        })}
      </Stack>
    </Section>
  );
}

export { FeatureCard, FeatureGrid, FeatureList, FeatureSplit };
