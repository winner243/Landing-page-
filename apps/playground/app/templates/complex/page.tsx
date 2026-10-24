import type { Metadata } from "next";
import { LandingComposer, buildTemplate } from "@landing/patterns";
import { contentExamples, parseTemplateConfig } from "@landing/copywriting";
import { aurora, themeToStyleTag } from "@landing/themes";

export const metadata: Metadata = {
  title: "Template — complex",
  robots: { index: true, follow: true },
};

const config = parseTemplateConfig({
  type: "complex",
  content: contentExamples.complex,
  headers: {
    features: { title: "Enterprise-grade infrastructure" },
    pricing: { title: "Plans for every stage" },
    faq: { title: "Questions from enterprise buyers" },
  },
});

export default function ComplexTemplatePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToStyleTag(aurora) }} />
      <main>
        <LandingComposer sections={buildTemplate(config)} themeClassName="theme-aurora" />
      </main>
    </>
  );
}