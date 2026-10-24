import type { Metadata } from "next";
import { LandingComposer, buildTemplate } from "@landing/patterns";
import { contentExamples, parseTemplateConfig } from "@landing/copywriting";
import { aurora, themeToStyleTag } from "@landing/themes";

export const metadata: Metadata = {
  title: "Template — pro-tool",
  robots: { index: true, follow: true },
};

const config = parseTemplateConfig({
  type: "pro-tool",
  content: contentExamples.proTool,
  headers: {
    features: { title: "Everything your team needs" },
    pricing: { title: "Simple, transparent pricing" },
  },
});

export default function ProToolTemplatePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToStyleTag(aurora) }} />
      <main>
        <LandingComposer sections={buildTemplate(config)} themeClassName="theme-aurora" />
      </main>
    </>
  );
}