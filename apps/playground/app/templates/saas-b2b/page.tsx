import type { Metadata } from "next";
import { LandingComposer, buildTemplate } from "@landing/patterns";
import { contentExamples, parseTemplateConfig } from "@landing/copywriting";
import { aurora, themeToStyleTag } from "@landing/themes";

export const metadata: Metadata = {
  title: "Template — saas-b2b",
  robots: { index: true, follow: true },
};

/**
 * `saas-b2b` starter template (Roadmap 3.4): long-form, proof-heavy.
 * Content is validated by the template config schema at build time —
 * swap `contentExamples` for real content and the page is production-ready.
 */
const config = parseTemplateConfig({
  type: "saas-b2b",
  content: contentExamples.b2b,
  headers: {
    features: {
      eyebrow: "WHY TEAMS SWITCH",
      title: "Everything your stack should have done",
      description: "From raw events to a report the whole company trusts.",
    },
    testimonials: { eyebrow: "PROOF", title: "Teams decide with evidence" },
    pricing: {
      eyebrow: "PRICING",
      title: "Plans that scale with the rollout",
      description: "Every plan includes onboarding help and a 14-day trial.",
    },
    faq: { eyebrow: "FAQ", title: "Questions from the buying committee" },
  },
});

export default function SaasB2bTemplatePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToStyleTag(aurora) }} />
      <main>
        <LandingComposer sections={buildTemplate(config)} themeClassName="theme-aurora" />
      </main>
    </>
  );
}
