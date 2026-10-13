import * as React from "react";
import { Card, CardContent, cn } from "@landing/ui-core";

export interface UseCaseCardProps {
  /** Who this is for — "For agencies", "For support teams"… */
  title: string;
  description: string;
  /** Decorative icon slot (hidden from assistive tech). */
  icon?: React.ReactNode;
  /** Optional destination — renders a crawlable <a>. */
  href?: string;
  linkLabel?: string;
  className?: string;
}

/**
 * Use-case card — "what kind of team gets value here". Keeps the audience
 * framing concrete (CONVERSION.md: segment by situation, not by persona).
 */
function UseCaseCard({
  title,
  description,
  icon,
  href,
  linkLabel = "Learn more",
  className,
}: UseCaseCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col gap-3">
        {icon && (
          <span
            aria-hidden="true"
            className="inline-flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent [&_svg]:size-5"
          >
            {icon}
          </span>
        )}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-foreground-muted">{description}</p>
        {href && (
          <a
            href={href}
            className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
          >
            {linkLabel}
            <span aria-hidden="true">→</span>
          </a>
        )}
      </CardContent>
    </Card>
  );
}

export { UseCaseCard };
