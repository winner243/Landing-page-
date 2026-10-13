import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Visually hides content while keeping it available to screen readers.
 * Use for screen-reader-only labels, hints, and skip-link targets.
 */
function VisuallyHidden({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "absolute size-px overflow-hidden whitespace-nowrap border-0 p-0",
        "[clip:rect(0,0,0,0)] [clip-path:inset(50%)]",
        className,
      )}
      {...props}
    />
  );
}

export { VisuallyHidden };
