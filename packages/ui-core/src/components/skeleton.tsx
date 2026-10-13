import * as React from "react";
import { cn } from "../lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Loading placeholder — decorative only: always `aria-hidden`, the real
 * content must announce its own loading state (e.g. `aria-busy` on the
 * container, as Button does).
 *
 * Server-safe (no JS): shape comes from CSS (`animate-pulse` + `bg-muted`).
 */
function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
