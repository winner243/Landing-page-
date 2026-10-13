import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-semibold",
    "transition-colors duration-[150ms] ease-[var(--lmk-ease)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover active:bg-accent-active",
        secondary:
          "bg-muted text-foreground border border-border hover:bg-background-surface hover:border-border-strong active:bg-border-subtle",
        outline:
          "border border-border-strong text-foreground bg-transparent hover:bg-muted active:bg-border-subtle",
        ghost:
          "text-foreground bg-transparent hover:bg-muted active:bg-border-subtle",
        destructive:
          "bg-error text-white shadow-sm hover:opacity-90 active:opacity-80",
        success:
          "bg-success-fg text-success-bg shadow-sm hover:opacity-90 active:opacity-80",
        link: "text-accent underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-11 w-11 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows a spinner and blocks interaction while keeping layout stable. */
  loading?: boolean;
  /**
   * Feedback state (knowledge-base state list: default / hover / active /
   * disabled / loading / error / success). Overrides the variant fill while
   * keeping size, focus ring and loading behaviour untouched.
   */
  status?: "error" | "success";
  /** Icon rendered before the label. Hidden from screen readers. */
  iconLeft?: React.ReactNode;
  /** Icon rendered after the label. Hidden from screen readers. */
  iconRight?: React.ReactNode;
}

/**
 * Accessible button — foundation for all CTAs in the kit.
 *
 * States: default, hover, focus-visible, active, disabled, loading, plus the
 * `status` feedback states error and success (7 states per the design-system
 * reference). Loading keeps original width, sets aria-busy, disables interaction.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      status,
      disabled,
      iconLeft,
      iconRight,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const resolvedVariant =
      status === "error"
        ? "destructive"
        : status === "success"
          ? "success"
          : variant;
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          buttonVariants({ variant: resolvedVariant, size, fullWidth }),
          className,
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
        data-status={status}
        {...props}
      >
        {loading && (
          <svg
            className="size-4 shrink-0 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {!loading && iconLeft && (
          <span aria-hidden="true" className="shrink-0">
            {iconLeft}
          </span>
        )}
        {children}
        {!loading && iconRight && (
          <span aria-hidden="true" className="shrink-0">
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
