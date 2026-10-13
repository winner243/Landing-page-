import * as React from "react";
import {
  FaqAccordion,
  FeatureGrid,
  FinalCta,
  Footer,
  Hero,
  LogoCloud,
  Navbar,
  PricingGrid,
  StatsBar,
  TestimonialGrid,
  TrustBar,
  type FaqAccordionProps,
  type FeatureGridProps,
  type FinalCtaProps,
  type FooterProps,
  type HeroProps,
  type LogoCloudProps,
  type NavbarProps,
  type PricingGridProps,
  type StatsBarProps,
  type TestimonialGridProps,
  type TrustBarProps,
} from "@landing/marketing";
import {
  FeatureValuePattern,
  FooterConversionPattern,
  ObjectionHandlingPattern,
  PricingDecisionPattern,
  ProblemSolutionPattern,
  SocialProofPattern,
  type FeatureValuePatternProps,
  type FooterConversionPatternProps,
  type ObjectionHandlingPatternProps,
  type PricingDecisionPatternProps,
  type ProblemSolutionPatternProps,
  type SocialProofPatternProps,
} from "./patterns";

/**
 * Composition engine — sections as data, order as data (Phase 2 §20).
 *
 * A landing page is an ordered list of section descriptors. The composer
 * renders them in ANY order; the canonical order below is a default,
 * never enforced. Products compose pages by providing content objects —
 * no component code changes (§21 content/presentation separation).
 *
 * Descriptors cover single components AND conversion patterns
 * (`pattern:*` keys) — templates assemble pages from patterns.
 */

export type LandingSection =
  | { type: "navbar"; props: NavbarProps }
  | { type: "hero"; props: HeroProps }
  | { type: "logoCloud"; props: LogoCloudProps }
  | { type: "stats"; props: StatsBarProps }
  | { type: "features"; props: FeatureGridProps }
  | { type: "testimonials"; props: TestimonialGridProps }
  | { type: "pricing"; props: PricingGridProps }
  | { type: "faq"; props: FaqAccordionProps }
  | { type: "trustBar"; props: TrustBarProps }
  | { type: "finalCta"; props: FinalCtaProps }
  | { type: "footer"; props: FooterProps }
  | { type: "pattern:problemSolution"; props: ProblemSolutionPatternProps }
  | { type: "pattern:socialProof"; props: SocialProofPatternProps }
  | { type: "pattern:featureValue"; props: FeatureValuePatternProps }
  | { type: "pattern:objectionHandling"; props: ObjectionHandlingPatternProps }
  | { type: "pattern:pricingDecision"; props: PricingDecisionPatternProps }
  | { type: "pattern:footerConversion"; props: FooterConversionPatternProps }
  /** Escape hatch — any node (custom sections without waiting for kit support). */
  | { type: "custom"; node: React.ReactNode; key?: string };

const SECTION_RENDERERS: Record<
  Exclude<LandingSection, { type: "custom" }>["type"],
  (props: never) => React.ReactElement
> = {
  navbar: ((p: NavbarProps) => <Navbar {...p} />) as never,
  hero: ((p: HeroProps) => <Hero {...p} />) as never,
  logoCloud: ((p: LogoCloudProps) => <LogoCloud {...p} />) as never,
  stats: ((p: StatsBarProps) => <StatsBar {...p} />) as never,
  features: ((p: FeatureGridProps) => <FeatureGrid {...p} />) as never,
  testimonials: ((p: TestimonialGridProps) => <TestimonialGrid {...p} />) as never,
  pricing: ((p: PricingGridProps) => <PricingGrid {...p} />) as never,
  faq: ((p: FaqAccordionProps) => <FaqAccordion {...p} />) as never,
  trustBar: ((p: TrustBarProps) => <TrustBar {...p} />) as never,
  finalCta: ((p: FinalCtaProps) => <FinalCta {...p} />) as never,
  footer: ((p: FooterProps) => <Footer {...p} />) as never,
  "pattern:problemSolution": ((p: ProblemSolutionPatternProps) => (
    <ProblemSolutionPattern {...p} />
  )) as never,
  "pattern:socialProof": ((p: SocialProofPatternProps) => (
    <SocialProofPattern {...p} />
  )) as never,
  "pattern:featureValue": ((p: FeatureValuePatternProps) => (
    <FeatureValuePattern {...p} />
  )) as never,
  "pattern:objectionHandling": ((p: ObjectionHandlingPatternProps) => (
    <ObjectionHandlingPattern {...p} />
  )) as never,
  "pattern:pricingDecision": ((p: PricingDecisionPatternProps) => (
    <PricingDecisionPattern {...p} />
  )) as never,
  "pattern:footerConversion": ((p: FooterConversionPatternProps) => (
    <FooterConversionPattern {...p} />
  )) as never,
};

export interface LandingComposerProps {
  sections: LandingSection[];
  /**
   * Brand theme class (e.g. "theme-aurora") applied to the page root.
   * Inject theme CSS separately via themeToCss()/themeToStyleTag().
   */
  themeClassName?: string;
  /** Page language (default "en") — set for localized content. */
  lang?: string;
}

/**
 * Renders an ordered section list into a full landing page.
 *
 * Usage:
 *   <LandingComposer
 *     sections={[
 *       { type: "navbar", props: {...} },
 *       { type: "hero", props: {...} },
 *       ...
 *     ]}
 *   />
 *
 * Reordering, removing, or inserting sections is a data change only.
 */
function LandingComposer({
  sections,
  themeClassName,
  lang = "en",
}: LandingComposerProps) {
  return (
    <div lang={lang} className={themeClassName}>
      {sections.map((section, index) => {
        if (section.type === "custom") {
          return (
            <React.Fragment key={section.key ?? `custom-${index}`}>
              {section.node}
            </React.Fragment>
          );
        }
        const render = SECTION_RENDERERS[section.type];
        const Element = render(section.props as never);
        return <React.Fragment key={`${section.type}-${index}`}>{Element}</React.Fragment>;
      })}
    </div>
  );
}

/**
 * Canonical conversion order (CONVERSION.md) — a DEFAULT template.
 * Override freely; the composer does not enforce this sequence.
 */
export function defaultLandingOrder(): LandingSection["type"][] {
  return [
    "navbar",
    "hero",
    "logoCloud",
    "features",
    "testimonials",
    "stats",
    "pricing",
    "faq",
    "finalCta",
    "footer",
  ];
}

export { LandingComposer };
