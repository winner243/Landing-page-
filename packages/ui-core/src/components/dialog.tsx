"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/utils";

export interface DialogProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  /** Required — rendered as the dialog heading (aria-labelledby). */
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Action row (buttons) pinned at the bottom. */
  footer?: React.ReactNode;
  /** Close when the backdrop is clicked (default true). */
  closeOnBackdrop?: boolean;
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal dialog (WAI-ARIA Dialog pattern): focus moves in on open, Tab is
 * trapped inside, Escape closes, focus returns to the trigger, background
 * scroll is locked. Rendered through a portal so it escapes any overflow
 * container.
 */
function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  closeOnBackdrop = true,
  className,
}: DialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const onOpenChangeRef = React.useRef(onOpenChange);
  React.useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  React.useEffect(() => {
    if (!open) return undefined;

    returnFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialog)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChangeRef.current(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = Array.from(
        dialog?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      );
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside =
        active instanceof Node && dialog !== null && dialog.contains(active);

      if (event.shiftKey && (active === firstEl || !inside)) {
        event.preventDefault();
        lastEl?.focus();
      } else if (!event.shiftKey && active === lastEl) {
        event.preventDefault();
        firstEl?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-xl",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => onOpenChange(false)}
            className="rounded p-1 text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>

        {description && (
          <p id={descriptionId} className="mt-2 text-sm text-foreground-muted">
            {description}
          </p>
        )}

        {children && <div className="mt-4">{children}</div>}

        {footer && (
          <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export { Dialog };
