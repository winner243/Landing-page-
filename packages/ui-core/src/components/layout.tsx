import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const containerVariants = cva("mx-auto w-full px-4 md:px-6 lg:px-8", {
  variants: {
    size: {
      default: "max-w-[var(--lmk-container)]",
      narrow: "max-w-[var(--lmk-container-narrow)]",
      wide: "max-w-[1600px]",
      full: "max-w-none",
    },
  },
  defaultVariants: { size: "default" },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

/** Horizontal page container — consistent gutters at every breakpoint. */
function Container({ className, size, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  align?: "start" | "center" | "end" | "stretch" | "between";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
}

const gapMap = {
  1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4", 5: "gap-5",
  6: "gap-6", 8: "gap-8", 10: "gap-10", 12: "gap-12", 16: "gap-16",
} as const;

const alignMap = {
  start: "items-start", center: "items-center", end: "items-end",
  stretch: "items-stretch", between: "items-between",
} as const;

const justifyMap = {
  start: "justify-start", center: "justify-center", end: "justify-end",
  between: "justify-between",
} as const;

/** Flexbox wrapper with explicit direction/gap/alignment — avoids utility soup. */
function Stack({
  className,
  direction = "vertical",
  gap = 4,
  align,
  justify,
  wrap = false,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        gapMap[gap],
        align && alignMap[align],
        justify && justifyMap[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    />
  );
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: { base: 1 | 2 | 3 | 4; md?: 1 | 2 | 3 | 4; lg?: 1 | 2 | 3 | 4 };
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
}

const colMap = {
  1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4",
} as const;

/**
 * Responsive CSS grid. Mobile-first: `base` required, md/lg optional.
 * Example: <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
 */
function Grid({ className, columns, gap = 6, ...props }: GridProps) {
  const md = columns?.md ? `md:${colMap[columns.md]}` : "";
  const lg = columns?.lg ? `lg:${colMap[columns.lg]}` : "";
  return (
    <div
      className={cn(
        "grid",
        colMap[columns?.base ?? 1],
        md,
        lg,
        gapMap[gap],
        className,
      )}
      {...props}
    />
  );
}

export { Container, Stack, Grid, containerVariants };
