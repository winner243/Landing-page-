import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Container, cn } from "@landing/ui-core";

const sectionVariants = cva(
  // content-visibility: skip layout/paint of offscreen sections until they
  // approach the viewport (lower main-thread load on long pages). The
  // intrinsic-size estimate keeps the scrollbar stable to avoid CLS.
  "relative w-full [content-visibility:auto] [contain-intrinsic-size:auto_800px]",
  {
    variants: {
      background: {
        default: "bg-background",
        surface: "bg-surface",
        muted: "bg-muted",
        brand: "bg-accent text-accent-foreground",
        none: "",
      },
      density: {
        compact: "py-10 md:py-12",
        default: "py-16 md:py-20",
        relaxed: "py-20 md:py-28",
        hero: "pt-16 pb-16 md:pt-24 md:pb-20",
      },
    },
    defaultVariants: { background: "default", density: "default" },
  },
);

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  /** Semantic tag — section by default; use div for non-landmark regions. */
  as?: "section" | "div" | "article";
  /** Container width inside the section. */
  container?: "default" | "narrow" | "wide" | "full";
  /** Anchor id — enables jump-link navigation on long pages. */
  id?: string;
}

/**
 * Generic section wrapper — controls container, spacing, background and
 * density consistently. Every page block should be a Section (or a
 * component that renders one) so rhythm stays uniform.
 */
function Section({
  className,
  background,
  density,
  as = "section",
  container = "default",
  children,
  ...props
}: SectionProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={cn(sectionVariants({ background, density }), className)} {...props}>
      <Container size={container}>{children}</Container>
    </Tag>
  );
}

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Small label above the title (e.g. "PRICING") — max 5 words. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Visual alignment — center is common for marketing sections. */
  align?: "start" | "center";
  /** Max width of the header block (prevents overly wide lines). */
  maxWidth?: string;
  /** Heading semantic level (document outline). */
  level?: 1 | 2 | 3;
}

/**
 * Reusable header block for sections: eyebrow + title + description.
 * enforces readable measure and consistent vertical rhythm.
 */
function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  maxWidth = "48rem",
  level = 2,
  className,
  ...props
}: SectionHeaderProps) {
  const alignCls = align === "center" ? "items-center text-center mx-auto" : "items-start text-start";
  const Heading = `h${level}` as React.ElementType;

  return (
    <div
      className={cn("mb-10 flex flex-col gap-3 md:mb-12", alignCls, className)}
      style={{ maxWidth }}
      {...props}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </span>
      )}
      <Heading className="text-3xl font-bold leading-tight text-balance md:text-4xl">
        {title}
      </Heading>
      {description && (
        <p className="max-w-[60ch] text-base text-foreground-muted md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export { Section, SectionHeader, sectionVariants };
