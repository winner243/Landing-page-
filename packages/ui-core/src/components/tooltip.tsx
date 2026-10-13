"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface TooltipProps {
  /** Short helper text — never the only place information lives. */
  content: React.ReactNode;
  /** Single focusable element (Button, link…); receives `aria-describedby`. */
  children: React.ReactElement;
  /** Bubble placement relative to the trigger. */
  placement?: "top" | "bottom";
  className?: string;
}

/**
 * Hover/focus tooltip with a real `role="tooltip"` and description wiring.
 *
 * - Opens on hover *and* keyboard focus (WCAG 1.4.13 in spirit: dismissable
 *   with Escape, hoverable, persistent while focused).
 * - The child element gets `aria-describedby`, so screen readers announce
 *   the tip when the trigger is reached.
 */
function Tooltip({
  content,
  children,
  placement = "top",
  className,
}: TooltipProps) {
  const id = React.useId();
  const [open, setOpen] = React.useState(false);

  const child = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{ "aria-describedby"?: string }>, {
        "aria-describedby": open ? id : undefined,
      })
    : children;

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      {child}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            "absolute left-1/2 z-popover -translate-x-1/2 rounded-md",
            "bg-foreground px-2 py-1 text-xs font-medium text-background shadow-md",
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export { Tooltip };
