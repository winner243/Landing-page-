import type { Metadata } from "next";
import { LandingComposer, buildTemplate } from "@landing/patterns";
import { contentExamples, parseTemplateConfig } from "@landing/copywriting";
import { aurora, themeToStyleTag } from "@landing/themes";

export const metadata: Metadata = {
  title: "Template — premium",
  robots: { index: true, follow: true },
};

const config = parseTemplateConfig({
  type: "premium",
  content: contentExamples.premium,
  headers: {
    features: { title: "Curated for your infrastructure" },
    testimonials: { title: "What our clients say" },
  },
});

export default function PremiumTemplatePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToStyleTag(aurora) }} />
      <main>
        <LandingComposer sections={buildTemplate(config)} themeClassName="theme-aurora" />
      </main>
    </>
  );
}