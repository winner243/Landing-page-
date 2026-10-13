import * as React from "react";
import { cn } from "@landing/ui-core";
import { Section, SectionHeader } from "./section";

export interface LogoItem {
  /** Real customer/partner name — fabricated logos are forbidden (ETHICS.md). */
  name: string;
  /** Logo image URL (SVG preferred). When omitted, the name renders as text. */
  src?: string;
  /** Detail page or customer story URL. */
  href?: string;
}

export interface LogoCloudProps {
  items: LogoItem[];
  /** Section title — e.g. "Trusted by teams at". */
  title?: React.ReactNode;
  /** Marquee scroll (disable for reduced-motion users automatically). */
  marquee?: boolean;
  /** Logos per row on desktop. */
  columns?: 3 | 4 | 5 | 6;
  /** Heading level for `title` (default 2 — the canonical spot is right after the hero). */
  level?: 1 | 2 | 3;
}

/**
 * Customer logo cloud — social proof via real brand association.
 * Logos render monochrome and lift color on hover; text fallback keeps
 * content readable when images are unavailable.
 */
function LogoCloud({
  items,
  title,
  marquee = false,
  columns = 5,
  level = 2,
}: LogoCloudProps) {
  const gridCls =
    columns === 6
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      : columns === 5
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        : columns === 4
          ? "grid-cols-2 lg:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-3";

  const logos = (
    <ul className={cn("grid items-center gap-x-8 gap-y-6", gridCls)}>
      {items.map((logo) => {
        const inner = logo.src ? (
          <img
            src={logo.src}
            alt={logo.name}
            loading="lazy"
            decoding="async"
            className="h-7 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
          />
        ) : (
          <span className="text-sm font-semibold text-foreground-muted">{logo.name}</span>
        );
        return (
          <li key={logo.name} className="flex items-center justify-center">
            {logo.href ? (
              <a
                href={logo.href}
                aria-label={`${logo.name} (customer story)`}
                className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
              >
                {inner}
              </a>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </ul>
  );

  if (marquee) {
    return (
      <Section density="compact" background="default">
        {title && <SectionHeader title={title} level={level} maxWidth="32rem" />}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex min-w-max animate-[lmk-marquee_30s_linear_infinite] gap-12 motion-reduce:animate-none">
            {[...items, ...items].map((logo, i) => (
              <span
                key={`${logo.name}-${i}`}
                className="whitespace-nowrap text-sm font-semibold text-foreground-muted"
                aria-hidden={i >= items.length}
              >
                {logo.src ? (
                  <img
                    src={logo.src}
                    alt={i < items.length ? logo.name : ""}
                    loading="lazy"
                    className="h-7 w-auto opacity-60 grayscale"
                  />
                ) : (
                  logo.name
                )}
              </span>
            ))}
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section density="compact">
      {title && <SectionHeader title={title} level={level} maxWidth="32rem" />}
      {logos}
    </Section>
  );
}

export interface StatsItem {
  /** Verifiable number — e.g. "94%", "2,000+", "4.8/5". */
  value: string;
  /** What it measures (≤6 words). */
  label: string;
  /** Optional source attribution (link or text). */
  source?: string;
}

export interface StatsBarProps {
  items: StatsItem[];
  /** Renders the surrounding section (disable to embed). */
  withSection?: boolean;
  background?: "default" | "muted" | "surface" | "brand";
}

/**
 * Key metrics row. All values MUST be true and current (ETHICS.md §1);
 * use `source` to attribute claims that need verification.
 */
function StatsBar({ items, withSection = true, background = "muted" }: StatsBarProps) {
  const body = (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
      {items.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center text-center gap-1">
          <dt className="order-2 text-sm text-foreground-muted">{stat.label}</dt>
          <dd className="order-1 text-3xl font-bold text-foreground md:text-4xl">
            {stat.value}
            {stat.source && (
              <span className="mt-1 block text-xs font-normal text-foreground-subtle">
                {stat.source}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );

  if (!withSection) return body;
  return <Section background={background}>{body}</Section>;
}

export interface TrustBadgeItem {
  label: string;
  /** Badge icon (SVG or icon-library node). */
  icon?: React.ReactNode;
  /** Link to verification/certificate — required for real certifications. */
  href?: string;
}

export interface TrustBarProps {
  items: TrustBadgeItem[];
  /** Short lead-in text. */
  title?: React.ReactNode;
}

/** Compact row of trust signals (security, compliance, guarantees). */
function TrustBar({ items, title }: TrustBarProps) {
  return (
    <Section density="compact" background="surface">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
        {title && (
          <span className="text-sm font-medium text-foreground-muted">{title}</span>
        )}
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {items.map((badge) => {
            const content = (
              <span className="flex items-center gap-2 text-sm font-medium text-foreground-muted">
                {badge.icon && (
                  <span aria-hidden="true" className="text-success-fg">
                    {badge.icon}
                  </span>
                )}
                {badge.label}
              </span>
            );
            return (
              <li key={badge.label}>
                {badge.href ? (
                  <a
                    href={badge.href}
                    className="rounded transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

export { LogoCloud, StatsBar, TrustBar };
