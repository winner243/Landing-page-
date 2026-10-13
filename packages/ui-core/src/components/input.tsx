import * as React from "react";
import { cn } from "../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Invalid state — also set via FormField error prop. */
  invalid?: boolean;
}

/**
 * Text input with focus-visible ring, 44px+ touch target (h-11),
 * and error styling driven by `invalid` (aria-invalid handled by FormField).
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", invalid, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex h-11 w-full rounded-md border border-border bg-surface px-3.5 py-2 text-base text-foreground",
        "placeholder:text-foreground-subtle",
        "transition-colors duration-[150ms]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-error focus-visible:outline-error",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export interface FormFieldProps {
  /** Field label — always rendered (never placeholder-only). */
  label: string;
  /** Generates id wired to input + label. */
  htmlFor: string;
  /** Helper/hint text — linked via aria-describedby. */
  hint?: string;
  /** Error message — linked via aria-describedby, sets aria-invalid on input. */
  error?: string;
  required?: boolean;
  children: React.ReactElement;
  className?: string;
}

/**
 * Accessible field wrapper: label ↔ input association, hint + error
 * description wiring, required indicator. Children receive invalid + ids.
 */
function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  const hintId = `${htmlFor}-hint`;
  const errorId = `${htmlFor}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  const child = React.cloneElement(children, {
    id: htmlFor,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : undefined,
    required: required || undefined,
    invalid: error ? true : undefined,
  } as Partial<unknown>);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {child}
      {hint && !error && (
        <p id={hintId} className="text-xs text-foreground-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-error-fg">
          {error}
        </p>
      )}
    </div>
  );
}

export { Input, FormField };
