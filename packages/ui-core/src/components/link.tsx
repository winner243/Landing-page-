import * as React from "react";
import { cn } from "../lib/utils";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Adds external-link semantics: target=_blank + rel + visible indicator. */
  external?: boolean;
}

/**
 * Anchor with kit-wide focus ring and styling.
 * External links get rel="noopener noreferrer" and an accessibility hint.
 */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, external, children, href, target, rel, ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      target={external ? target ?? "_blank" : target}
      rel={
        external
          ? (rel ?? "noopener noreferrer")
          : rel
      }
      className={cn(
        "text-accent underline-offset-4 transition-colors hover:underline",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]",
        className,
      )}
      {...props}
    >
      {children}
      {external && (
        <span className="ml-1 inline-block" aria-hidden="true">
          ↗
        </span>
      )}
      {external && <span className="sr-only"> (opens in new tab)</span>}
    </a>
  ),
);
Link.displayName = "Link";

export { Link };
