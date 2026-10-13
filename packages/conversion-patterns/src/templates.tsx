import * as React from "react";
import type {
  LandingContent,
  SaasB2bTemplateConfig,
  SimpleTemplateConfig,
  TemplateConfig,
  TemplateHeaders,
} from "@landing/copywriting";
import { BenefitList, HeroProof } from "@landing/marketing";
import type { LandingSection } from "./composer";

/**
 * Starter templates (ARCHITECTURE §4 — Composition layer): a template is
 * a validated config → ordered section list. Content comes from the
 * copywriting schemas; structure comes from the patterns — templates add
 * NO layout code, only assembly rules per SaaS type.
 *
 * Configs are validated first (`parseTemplateConfig` in @landing/copywriting),
 * so a template page can only render content that passed the schemas.
 */

/** Content guaranteed to carry a closing CTA + footer (both template types). */
type CtaFooterContent = LandingContent & {
  cta: NonNullable<LandingContent["cta"]>;
  footer: NonNullable<LandingContent["footer"]>;
};

function socialProofSection(
  content: LandingContent,
  headers?: TemplateHeaders,
): LandingSection | null {
  const { logoCloud, stats, testimonials } = content;
  if (!logoCloud && !stats && !testimonials) return null;

  return {
    type: "pattern:socialProof",
    props: {
      logos: logoCloud ? { items: logoCloud.logos, title: logoCloud.title } : undefined,
      stats: stats ? { items: stats } : undefined,
      testimonials: testimonials
        ? { items: testimonials, header: headers?.testimonials }
        : undefined,
    },
  };
}

/**
 * Shared opening: navbar → hero → proof → features → benefits.
 * Every template starts the same way; they diverge on the decision block.
 */
function openingSections(
  content: LandingContent,
  headers?: TemplateHeaders,
): LandingSection[] {
  const sections: LandingSection[] = [];

  if (content.nav) {
    sections.push({
      type: "navbar",
      props: {
        brand: content.nav.brandName,
        links: content.nav.links,
        ...(content.nav.cta ? { cta: { action: content.nav.cta } } : {}),
      },
    });
  }

  const { hero } = content;
  sections.push({
    type: "hero",
    props: {
      badge: hero.badge,
      headline: hero.headline,
      description: hero.description,
      ctas: {
        primary: { action: hero.primaryCta },
        ...(hero.secondaryCta ? { secondary: { action: hero.secondaryCta } } : {}),
      },
      proof:
        hero.proofText !== undefined || hero.proofCount !== undefined ? (
          <HeroProof text={hero.proofText} count={hero.proofCount} />
        ) : undefined,
    },
  });

  const proof = socialProofSection(content, headers);
  if (proof) sections.push(proof);

  sections.push({
    type: "features",
    props: { header: headers?.features, items: content.features },
  });

  if (content.benefits) {
    sections.push({
      type: "custom",
      key: "benefits",
      node: <BenefitList items={content.benefits} />,
    });
  }

  return sections;
}

/** Closing conversion block — restates the value prop (CONVERSION.md rule 4). */
function closingSections(content: CtaFooterContent): LandingSection {
  return {
    type: "pattern:footerConversion",
    props: {
      finalCta: {
        title: content.hero.headline,
        description: content.hero.description,
        ctas: { primary: { action: content.cta } },
        note: content.hero.proofText,
      },
      footer: {
        brand: content.footer.brandName,
        tagline: content.footer.tagline,
        columns: content.footer.columns,
        legalLinks: content.footer.legalLinks,
        copyright: content.footer.copyright,
      },
    },
  };
}

/** Long-form, proof-heavy: proof first, pricing decision, closing CTA. */
function saasB2bSections(config: SaasB2bTemplateConfig): LandingSection[] {
  const { content, headers } = config;
  const sections = openingSections(content, headers);

  if (content.trust) {
    sections.push({ type: "trustBar", props: { items: content.trust.items } });
  }

  sections.push({
    type: "pattern:pricingDecision",
    props: {
      grid: { header: headers?.pricing, plans: content.plans },
      faq: { items: content.faq, header: headers?.faq },
    },
  });

  sections.push(closingSections(content));
  return sections;
}

/** Single value prop: minimal middle, objections only if content has them. */
function simpleSections(config: SimpleTemplateConfig): LandingSection[] {
  const { content, headers } = config;
  const sections = openingSections(content, headers);

  let faqConsumed = false;
  if (content.plans) {
    sections.push({
      type: "pattern:pricingDecision",
      props: {
        grid: { header: headers?.pricing, plans: content.plans },
        ...(content.faq ? { faq: { items: content.faq, header: headers?.faq } } : {}),
      },
    });
    faqConsumed = content.faq !== undefined;
  }

  let trustConsumed = false;
  if (content.faq && !faqConsumed) {
    sections.push({
      type: "pattern:objectionHandling",
      props: {
        faq: { items: content.faq, header: headers?.faq },
        ...(content.trust ? { reversal: { items: content.trust.items } } : {}),
      },
    });
    trustConsumed = content.trust !== undefined;
  }

  if (content.trust && !trustConsumed) {
    sections.push({ type: "trustBar", props: { items: content.trust.items } });
  }

  sections.push(closingSections(content));
  return sections;
}

/**
 * Assembles a validated template config into sections for LandingComposer.
 * Exhaustive over the template union — adding a type here is a type error
 * until its assembly rule exists.
 */
export function buildTemplate(config: TemplateConfig): LandingSection[] {
  switch (config.type) {
    case "saas-b2b":
      return saasB2bSections(config);
    case "simple":
      return simpleSections(config);
  }
}
