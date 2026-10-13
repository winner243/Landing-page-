import * as React from "react";
import { MediaFrame, cn } from "@landing/ui-core";
import { Section, SectionHeader } from "./section";

export type ShowcaseCalloutPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface ShowcaseCallout {
  /** ≤6 words — must point at a real element of the screenshot. */
  label: string;
  position?: ShowcaseCalloutPosition;
}

const calloutPositions: Record<ShowcaseCalloutPosition, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
};

export interface ProductShowcaseProps {
  header?: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
  };
  /** Real product screenshot (any node) — never UI that does not exist. */
  visual: React.ReactNode;
  /** Annotation pins anchored over the visual. */
  callouts?: ShowcaseCallout[];
  /** Optional text column beside the visual. */
  aside?: React.ReactNode;
  background?: "default" | "surface" | "muted";
  className?: string;
}

/**
 * Large visual + callouts — the "show, don't tell" comprehension block
 * (CONVERSION.md stage 3). Callouts are overlaid labels, not fake UI.
 */
function ProductShowcase({
  header,
  visual,
  callouts = [],
  aside,
  background = "default",
  className,
}: ProductShowcaseProps) {
  return (
    <Section background={background} className={className}>
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}

      <div className={cn("grid items-center gap-8 lg:gap-12", aside && "lg:grid-cols-2")}>
        <div className="relative">
          <MediaFrame aspect="wide" framed>
            {visual}
          </MediaFrame>
          {callouts.map((callout) => (
            <span
              key={callout.label}
              className={cn(
                "absolute z-10 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground shadow-sm",
                calloutPositions[callout.position ?? "top-right"],
              )}
            >
              {callout.label}
            </span>
          ))}
        </div>
        {aside && <div className="flex flex-col gap-4">{aside}</div>}
      </div>
    </Section>
  );
}

export { ProductShowcase };
