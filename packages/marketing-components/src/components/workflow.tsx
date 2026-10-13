import * as React from "react";
import { cn } from "@landing/ui-core";
import { Section, SectionHeader } from "./section";

export interface WorkflowStep {
  /** Active-verb step title (≤6 words). */
  title: string;
  description?: string;
  /** Icon slot — decorative, hidden from assistive tech. */
  icon?: React.ReactNode;
}

export interface WorkflowProps {
  header?: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
  };
  steps: WorkflowStep[];
  /** horizontal: side-by-side on desktop; vertical: stacked list. */
  layout?: "horizontal" | "vertical";
  background?: "default" | "surface" | "muted";
  className?: string;
}

/**
 * Numbered steps — answers "how does it work?" (CONVERSION.md stage 3).
 * Sequence lives in the ordered list; the number badge is its visual echo.
 */
function Workflow({
  header,
  steps,
  layout = "horizontal",
  background = "default",
  className,
}: WorkflowProps) {
  return (
    <Section background={background} className={className}>
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}

      <ol
        className={cn(
          layout === "horizontal"
            ? "grid gap-8 md:grid-cols-3"
            : "mx-auto flex max-w-2xl flex-col gap-8",
        )}
      >
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={cn(
              layout === "vertical" && "flex items-start gap-5",
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
              {index + 1}
            </span>
            <div
              className={cn(
                "flex flex-col gap-2",
                layout === "horizontal" && "mt-3",
              )}
            >
              <div className="flex items-center gap-2">
                {step.icon && (
                  <span aria-hidden="true" className="text-accent [&_svg]:size-5">
                    {step.icon}
                  </span>
                )}
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
              </div>
              {step.description && (
                <p className="text-sm text-foreground-muted">{step.description}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export { Workflow };
