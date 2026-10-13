import * as React from "react";
import { Card, CardContent } from "@landing/ui-core";
import {
  ComparisonTable,
  FaqAccordion,
  FeatureGrid,
  FinalCta,
  FooterSaaS,
  LogoCloud,
  PricingFAQ,
  PricingGrid,
  PricingNote,
  Section,
  SectionHeader,
  StatsBar,
  TestimonialGrid,
  TrustBar,
  CtaWithProof,
  type ComparisonTableProps,
  type CtaWithProofProps,
  type FaqAccordionProps,
  type FeatureGridProps,
  type FinalCtaProps,
  type FooterSaaSProps,
  type LogoCloudProps,
  type PricingFAQProps,
  type PricingGridProps,
  type PricingNoteProps,
  type StatsBarProps,
  type TestimonialGridProps,
  type TrustBarProps,
} from "@landing/marketing";

/**
 * Conversion patterns (ARCHITECTURE §3): a pattern is a named composition
 * of marketing components that answers one conversion job. Patterns define
 * SLOTS — typed content positions — and never layout code: the product
 * fills slots with content, or overrides a slot's rendered node entirely.
 */

/**
 * Typed slot overrides — keys are the pattern's declared slot names,
 * values replace the default rendered node (`null` hides the slot).
 */
export type SlotMap<TNames extends string> = Partial<Record<TNames, React.ReactNode>>;

/**
 * Resolves a slot: the override wins when defined, otherwise the default.
 * `null` is a deliberate override (hides the slot).
 */
export function renderSlot<TNames extends string>(
  slots: SlotMap<TNames> | undefined,
  name: TNames,
  fallback: React.ReactNode,
): React.ReactNode {
  return slots && name in slots ? slots[name] : fallback;
}

type PatternHeader = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
};

/* ------------------------------------------------------------------ */
/* Problem → Solution                                                  */
/* ------------------------------------------------------------------ */

export type ProblemSolutionSlots = "header" | "problems" | "solution" | "actions";

export interface ProblemSolutionPatternProps {
  header?: PatternHeader;
  /** Pain points in the customer's own words (COPYWRITING §7). */
  problems: Array<{ title: string; description?: string }>;
  /** The answer to every problem above — outcome first, not features. */
  solution: { title: React.ReactNode; description?: React.ReactNode; visual?: React.ReactNode };
  /** Optional closing actions (CtaWithProof content). */
  actions?: CtaWithProofProps;
  slots?: SlotMap<ProblemSolutionSlots>;
  className?: string;
}

/**
 * Pain-point → solution narrative (CONVERSION.md: comprehension stage).
 * Problems and solution render side by side so the mapping is scannable.
 */
function ProblemSolutionPattern({
  header,
  problems,
  solution,
  actions,
  slots,
  className,
}: ProblemSolutionPatternProps) {
  return (
    <Section className={className}>
      {renderSlot(slots, "header", header && <SectionHeader {...header} />)}

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        {renderSlot(
          slots,
          "problems",
          <ul className="flex flex-col gap-6">
            {problems.map((problem) => (
              <li key={problem.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-foreground-subtle"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
                    <path d="M5 9h10v2H5z" />
                  </svg>
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {problem.title}
                  </h3>
                  {problem.description && (
                    <p className="text-sm text-foreground-muted">{problem.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>,
        )}

        {renderSlot(
          slots,
          "solution",
          <Card>
            <CardContent className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-foreground">{solution.title}</h3>
              {solution.description && (
                <p className="text-sm leading-relaxed text-foreground-muted">
                  {solution.description}
                </p>
              )}
              {solution.visual && <div className="mt-1">{solution.visual}</div>}
            </CardContent>
          </Card>,
        )}
      </div>

      {actions &&
        renderSlot(
          slots,
          "actions",
          <CtaWithProof {...actions} className="mt-10" />,
        )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Social proof                                                        */
/* ------------------------------------------------------------------ */

export type SocialProofSlots = "logos" | "stats" | "testimonials";

export interface SocialProofPatternProps {
  /** Real customer logos only (ETHICS.md). */
  logos?: LogoCloudProps;
  /** Verifiable metrics only — attribute with `source`. */
  stats?: StatsBarProps;
  /** Real, consented testimonials (ETHICS.md). */
  testimonials?: TestimonialGridProps;
  slots?: SlotMap<SocialProofSlots>;
}

/**
 * Testimonials + logos + stats in the canonical trust order
 * (association → numbers → voices). Provide only the blocks you have
 * truthful content for — an omitted slot simply does not render.
 */
function SocialProofPattern({ logos, stats, testimonials, slots }: SocialProofPatternProps) {
  return (
    <>
      {renderSlot(slots, "logos", logos && <LogoCloud {...logos} />)}
      {renderSlot(slots, "stats", stats && <StatsBar {...stats} />)}
      {renderSlot(
        slots,
        "testimonials",
        testimonials && <TestimonialGrid {...testimonials} />,
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Feature → value                                                     */
/* ------------------------------------------------------------------ */

export type FeatureValueSlots = "features" | "proof";

export interface FeatureValuePatternProps {
  features: FeatureGridProps;
  /** Proof adjacent to the claims — TrustBar / StatsBar / testimonials node. */
  proof?: React.ReactNode;
  slots?: SlotMap<FeatureValueSlots>;
}

/**
 * Feature → benefit → proof (CONVERSION.md: claim then evidence — no
 * feature stands without its adjacent proof slot).
 */
function FeatureValuePattern({ features, proof, slots }: FeatureValuePatternProps) {
  return (
    <>
      {renderSlot(slots, "features", <FeatureGrid {...features} />)}
      {renderSlot(slots, "proof", proof)}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Objection handling                                                  */
/* ------------------------------------------------------------------ */

export type ObjectionHandlingSlots = "reversal" | "faq" | "note";

export interface ObjectionHandlingPatternProps {
  /** Real objections, from sales calls/support tickets (never invented). */
  faq: FaqAccordionProps;
  /** Risk reversal badges — "No credit card", certifications (if true). */
  reversal?: TrustBarProps;
  /** Guarantee / fine print line. */
  note?: PricingNoteProps;
  slots?: SlotMap<ObjectionHandlingSlots>;
}

/**
 * FAQ + risk reversal + guarantee — removes the last objections before
 * the decision block (CONVERSION.md: objections stage).
 */
function ObjectionHandlingPattern({
  faq,
  reversal,
  note,
  slots,
}: ObjectionHandlingPatternProps) {
  return (
    <>
      {renderSlot(slots, "reversal", reversal && <TrustBar {...reversal} />)}
      {renderSlot(slots, "faq", <FaqAccordion {...faq} />)}
      {renderSlot(
        slots,
        "note",
        note && (
          <Section density="compact" background="surface">
            <PricingNote {...note} />
          </Section>
        ),
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing decision                                                    */
/* ------------------------------------------------------------------ */

export type PricingDecisionSlots = "grid" | "comparison" | "faq" | "note";

export interface PricingDecisionPatternProps {
  /** Plans + optional interval toggle + disclosure (PricingGrid). */
  grid: PricingGridProps;
  /** Feature × plan matrix shown under the cards. */
  comparison?: ComparisonTableProps;
  /** Pricing objections. */
  faq?: PricingFAQProps;
  /** Extra guarantee / fine print (beyond grid.guarantee/finePrint). */
  note?: PricingNoteProps;
  slots?: SlotMap<PricingDecisionSlots>;
}

/**
 * Plan comparison + FAQ + CTA — the full decision block in canonical
 * order: cards → matrix → objections → disclosure.
 */
function PricingDecisionPattern({
  grid,
  comparison,
  faq,
  note,
  slots,
}: PricingDecisionPatternProps) {
  return (
    <>
      {renderSlot(slots, "grid", <PricingGrid {...grid} />)}
      {renderSlot(slots, "comparison", comparison && <ComparisonTable {...comparison} />)}
      {renderSlot(slots, "faq", faq && <PricingFAQ {...faq} />)}
      {renderSlot(
        slots,
        "note",
        note && (
          <Section density="compact">
            <PricingNote {...note} />
          </Section>
        ),
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Footer conversion                                                   */
/* ------------------------------------------------------------------ */

export type FooterConversionSlots = "finalCta" | "footer";

export interface FooterConversionPatternProps {
  /** Closing conversion section — one dominant action. */
  finalCta: FinalCtaProps;
  /** Site footer — columns + optional newsletter slot. */
  footer: FooterSaaSProps;
  slots?: SlotMap<FooterConversionSlots>;
}

/**
 * Final CTA + footer — how every page ends (CONVERSION.md rule 4:
 * the page always closes with a conversion opportunity, then the footer).
 */
function FooterConversionPattern({
  finalCta,
  footer,
  slots,
}: FooterConversionPatternProps) {
  return (
    <>
      {renderSlot(slots, "finalCta", <FinalCta {...finalCta} />)}
      {renderSlot(slots, "footer", <FooterSaaS {...footer} />)}
    </>
  );
}

export {
  ProblemSolutionPattern,
  SocialProofPattern,
  FeatureValuePattern,
  ObjectionHandlingPattern,
  PricingDecisionPattern,
  FooterConversionPattern,
};
