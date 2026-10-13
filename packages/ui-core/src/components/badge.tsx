import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5",
    "text-xs font-medium leading-tight",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground-muted",
        brand: "border-transparent bg-accent/5 text-accent",
        success:
          "border-transparent bg-success-bg text-success-fg",
        warning:
          "border-transparent bg-warning-bg text-warning-fg",
        error: "border-transparent bg-error-bg text-error-fg",
        outline: "border-border-strong text-foreground bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/** Compact status/label pill. Decorative by default (no role attribute). */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
