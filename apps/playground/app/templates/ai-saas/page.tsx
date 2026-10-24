import type { Metadata } from "next";
import { LandingComposer, buildTemplate } from "@landing/patterns";
import { contentExamples, parseTemplateConfig } from "@landing/copywriting";
import { aurora, themeToStyleTag } from "@landing/themes";

export const metadata: Metadata = {
  title: "Template — ai-saas",
  robots: { index: true, follow: true },
};

const config = parseTemplateConfig({
  type: "ai-saas",
  content: contentExamples.aiSaaS,
  headers: {
    features: { title: "AI you can trust" },
    faq: { title: "Questions about AI" },
  },
});

export default function AiSaasTemplatePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToStyleTag(aurora) }} />
      <main>
        <LandingComposer sections={buildTemplate(config)} themeClassName="theme-aurora" />
      </main>
    </>
  );
}