import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const headingVariants = cva("font-heading font-bold text-foreground text-balance", {
  variants: {
    level: {
      display: "text-5xl leading-tight md:text-7xl md:leading-[1.05]",
      h1: "text-4xl md:text-6xl leading-[1.1]",
      h2: "text-3xl md:text-5xl leading-[1.15]",
      h3: "text-2xl md:text-4xl leading-[1.2]",
      h4: "text-xl md:text-2xl leading-[1.3]",
      h5: "text-lg md:text-xl leading-[1.4]",
      h6: "text-base md:text-lg leading-snug",
    },
    muted: {
      true: "text-foreground-muted",
      false: "",
    },
  },
  defaultVariants: { level: "h2", muted: false },
});

type HeadingLevel = NonNullable<VariantProps<typeof headingVariants>["level"]>;

/** Maps visual size to the default semantic HTML tag. */
const LEVEL_TO_TAG: Record<HeadingLevel, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
};

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color">,
    VariantProps<typeof headingVariants> {
  /**
   * Semantic tag. Defaults to the visual level; override only when the
   * visual size differs from document hierarchy (accessibility-aware).
   */
  as?: React.ElementType;
}

/**
 * Typographic heading with display→h6 scale (see DESIGN-SYSTEM.md).
 * Visual level and semantic level are decoupled to protect the document outline.
 */
function Heading({
  className,
  level,
  muted,
  as,
  ...props
}: HeadingProps) {
  const Tag = as ?? LEVEL_TO_TAG[level ?? "h2"];
  return (
    <Tag
      className={cn(headingVariants({ level, muted }), className)}
      {...props}
    />
  );
}

const textVariants = cva("text-foreground", {
  variants: {
    size: {
      lg: "text-lg",
      base: "text-base",
      sm: "text-sm",
      xs: "text-xs",
    },
    tone: {
      default: "text-foreground",
      muted: "text-foreground-muted",
      subtle: "text-foreground-subtle",
      accent: "text-accent",
      success: "text-success-fg",
      warning: "text-warning-fg",
      error: "text-error-fg",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    /** Limits line length for readability (65-75 chars). */
    measure: {
      prose: "max-w-[65ch]",
      none: "",
    },
  },
  defaultVariants: {
    size: "base",
    tone: "default",
    weight: "regular",
    measure: "none",
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof textVariants> {
  /** Render as span/div instead of p (for inline usage). */
  as?: "p" | "span" | "div";
}

/** Body/caption text with readability defaults and measure control. */
function Text({ className, size, tone, weight, measure, as = "p", ...props }: TextProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={cn(textVariants({ size, tone, weight, measure }), className)}
      {...props}
    />
  );
}

export { Heading, Text, headingVariants, textVariants };
