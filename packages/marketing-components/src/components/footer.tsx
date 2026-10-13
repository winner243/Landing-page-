import * as React from "react";
import { cn, Container, Separator } from "@landing/ui-core";
import { CtaGroup, type CtaGroupProps } from "./cta";

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FinalCtaProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Closing headline — restate the value prop. */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Primary + optional secondary action. */
  ctas: CtaGroupProps;
  /** Optional proof micro-copy ("No credit card required" — if true). */
  note?: React.ReactNode;
  background?: "brand" | "surface" | "muted";
}

/**
 * Final conversion section — always closes the page (CONVERSION.md rule 4).
 * One dominant action; note only when the claim is true (ETHICS.md).
 */
function FinalCta({
  title,
  description,
  ctas,
  note,
  background = "brand",
  className,
  ...props
}: FinalCtaProps) {
  return (
    <section
      className={cn(
        "w-full py-16 md:py-24",
        background === "brand" && "bg-accent text-accent-foreground",
        background === "surface" && "bg-surface",
        background === "muted" && "bg-muted",
        className,
      )}
      {...props}
    >
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold leading-tight text-balance md:text-4xl">
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "max-w-[60ch] text-base md:text-lg",
                background === "brand"
                  ? "text-accent-foreground"
                  : "text-foreground-muted",
              )}
            >
              {description}
            </p>
          )}
          <CtaGroup
            {...ctas}
            primary={{
              ...ctas.primary,
              variant:
                background === "brand"
                  ? "secondary"
                  : (ctas.primary.variant ?? "primary"),
            }}
            className="justify-center"
          />
          {note && (
            <p
              className={cn(
                "text-sm",
                background === "brand"
                  ? "text-accent-foreground"
                  : "text-foreground-subtle",
              )}
            >
              {note}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand slot (logo + name). */
  brand: React.ReactNode;
  /** Optional description under brand. */
  tagline?: React.ReactNode;
  columns?: FooterColumn[];
  /** Legal links — privacy/terms required for consent flows. */
  legalLinks?: Array<{ label: string; href: string }>;
  /** Copyright line — defaults to dynamic year. */
  copyright?: React.ReactNode;
  variant?: "classic" | "saas";
}

/**
 * Site footer — link columns + legal. Variant "saas" renders column
 * grid; "classic" is a single compact row (Phase 1 taxonomy).
 */
function Footer({
  brand,
  tagline,
  columns,
  legalLinks,
  copyright,
  variant = "saas",
  className,
  ...props
}: FooterProps) {
  const year = new Date().getFullYear();
  const copyrightLine = copyright ?? `© ${year} — All rights reserved.`;

  return (
    <footer
      className={cn("w-full border-t border-border bg-background", className)}
      {...props}
    >
      <Container>
        <div className="py-12 md:py-16">
          <div
            className={cn(
              variant === "saas" && columns?.length
                ? "grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]"
                : "flex flex-col gap-8",
            )}
          >
            <div className="flex max-w-xs flex-col gap-3">
              <div className="text-base font-semibold">{brand}</div>
              {tagline && (
                <p className="text-sm text-foreground-muted">{tagline}</p>
              )}
            </div>

            {columns?.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground-subtle">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="text-xs text-foreground-subtle">{copyrightLine}</p>
            {legalLinks && legalLinks.length > 0 && (
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-xs text-foreground-subtle transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}

export interface FooterSaaSProps extends Omit<FooterProps, "variant"> {
  /** Newsletter block in the brand column (e.g. <NewsletterForm />). */
  newsletter?: React.ReactNode;
}

/**
 * SaaS footer — Product / Company / Resources / Legal columns with an
 * optional newsletter slot under the brand (Phase 1 taxonomy).
 */
function FooterSaaS({ brand, newsletter, ...props }: FooterSaaSProps) {
  return (
    <Footer
      {...props}
      variant="saas"
      brand={
        newsletter ? (
          <div className="flex flex-col gap-4 font-normal">
            <div>{brand}</div>
            {newsletter}
          </div>
        ) : (
          brand
        )
      }
    />
  );
}

export { Footer, FinalCta, FooterSaaS };
