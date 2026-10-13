import type { Metadata } from "next";
import { LandingComposer, buildTemplate } from "@landing/patterns";
import { contentExamples, parseTemplateConfig } from "@landing/copywriting";
import { aurora, themeToStyleTag } from "@landing/themes";

export const metadata: Metadata = {
  title: "Template — simple",
  robots: { index: true, follow: true },
};

/**
 * `simple` starter template (Roadmap 3.4): single value prop, low
 * friction. Only hero, features, closing CTA and footer are required —
 * every other block renders only if the content provides it.
 */
const config = parseTemplateConfig({
  type: "simple",
  content: contentExamples.b2c,
  headers: {
    features: { eyebrow: "BENEFITS", title: "Why people love it" },
    pricing: { eyebrow: "PRICING", title: "Free to start" },
    faq: { eyebrow: "FAQ", title: "Good to know" },
  },
});

export default function SimpleTemplatePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToStyleTag(aurora) }} />
      <main>
        <LandingComposer sections={buildTemplate(config)} themeClassName="theme-aurora" />
      </main>
    </>
  );
}
