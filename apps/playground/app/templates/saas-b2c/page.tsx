import type { Metadata } from "next";
import { LandingComposer, buildTemplate } from "@landing/patterns";
import { contentExamples, parseTemplateConfig } from "@landing/copywriting";
import { aurora, themeToStyleTag } from "@landing/themes";

export const metadata: Metadata = {
  title: "Template — saas-b2c",
  robots: { index: true, follow: true },
};

const config = parseTemplateConfig({
  type: "saas-b2c",
  content: contentExamples.saasB2c,
  headers: {
    features: { title: "Built for your money goals" },
    pricing: { title: "Simple, transparent pricing" },
  },
});

export default function SaasB2cTemplatePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToStyleTag(aurora) }} />
      <main>
        <LandingComposer sections={buildTemplate(config)} themeClassName="theme-aurora" />
      </main>
    </>
  );
}