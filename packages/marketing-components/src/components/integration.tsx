import * as React from "react";
import { cn } from "@landing/ui-core";
import { Section, SectionHeader } from "./section";

export interface IntegrationItem {
  /** Real product name — only integrations that exist (ETHICS.md). */
  name: string;
  /** Logo URL (SVG preferred); renders the name as text when omitted. */
  src?: string;
  /** Docs or listing URL for the integration. */
  href?: string;
  /** How the connection works — one line. Grid layout only. */
  description?: string;
}

export interface IntegrationShowcaseProps {
  header?: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
  };
  items: IntegrationItem[];
  /** Connection narrative shown under the grid/marquee. */
  narrative?: React.ReactNode;
  /** Link to the full directory (crawlable). */
  cta?: { label: string; href: string };
  /** grid: logo cards with copy; marquee: scrolling logo row. */
  layout?: "grid" | "marquee";
  columns?: 3 | 4;
  background?: "default" | "surface" | "muted";
  className?: string;
}

/**
 * Integrations block — "fits your existing stack" (CONVERSION.md).
 * In marquee mode the row is a single duplicated track (second copy
 * aria-hidden) and per-item descriptions are not rendered.
 */
function IntegrationShowcase({
  header,
  items,
  narrative,
  cta,
  layout = "grid",
  columns = 4,
  background = "surface",
  className,
}: IntegrationShowcaseProps) {
  const gridCls =
    columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section background={background} className={className}>
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}

      {layout === "marquee" ? (
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex min-w-max animate-[lmk-marquee_30s_linear_infinite] items-center gap-10 motion-reduce:animate-none">
            {[...items, ...items].map((item, index) => (
              <span
                key={`${item.name}-${index}`}
                className="whitespace-nowrap text-sm font-semibold text-foreground-muted"
                aria-hidden={index >= items.length}
              >
                {item.src ? (
                  <img
                    src={item.src}
                    alt={index < items.length ? item.name : ""}
                    loading="lazy"
                    className="h-6 w-auto"
                  />
                ) : (
                  item.name
                )}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <ul className={cn("grid gap-4", gridCls)}>
          {items.map((item) => {
            const logo = item.src ? (
              <img
                src={item.src}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="h-6 w-auto"
              />
            ) : (
              <span className="text-sm font-semibold text-foreground">{item.name}</span>
            );

            return (
              <li
                key={item.name}
                className="flex flex-col gap-2 rounded-lg border border-border bg-background p-4"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    aria-label={`${item.name} integration`}
                    className="w-fit rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
                  >
                    {logo}
                  </a>
                ) : (
                  logo
                )}
                {item.description && (
                  <p className="text-sm text-foreground-muted">{item.description}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {(narrative || cta) && (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          {narrative && (
            <p className="max-w-[60ch] text-sm text-foreground-muted">{narrative}</p>
          )}
          {cta && (
            <a
              href={cta.href}
              className="text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
            >
              {cta.label}
            </a>
          )}
        </div>
      )}
    </Section>
  );
}

export { IntegrationShowcase };
