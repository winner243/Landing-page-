import type { Metadata } from "next";
import { LandingComposer, buildTemplate } from "@landing/patterns";
import { contentExamples, parseTemplateConfig } from "@landing/copywriting";
import { aurora, themeToStyleTag } from "@landing/themes";

export const metadata: Metadata = {
  title: "Template — marketplace",
  robots: { index: true, follow: true },
};

const config = parseTemplateConfig({
  type: "marketplace",
  content: contentExamples.marketplace,
  headers: {
    features: { title: "Built for buyers and sellers" },
  },
});

export default function MarketplaceTemplatePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToStyleTag(aurora) }} />
      <main>
        <LandingComposer sections={buildTemplate(config)} themeClassName="theme-aurora" />
      </main>
    </>
  );
}