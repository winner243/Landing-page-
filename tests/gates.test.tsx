import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntegrationShowcase, LogoCloud } from "@landing/marketing";
import { LandingComposer, buildTemplate, type LandingSection } from "@landing/patterns";
import {
  contentExamples,
  parseTemplateConfig,
  templateConfigSchema,
} from "@landing/copywriting";

const b2bSections: LandingSection[] = buildTemplate(
  parseTemplateConfig({ type: "saas-b2b", content: contentExamples.b2b }),
);
const simpleSections: LandingSection[] = buildTemplate(
  parseTemplateConfig({ type: "simple", content: contentExamples.b2c }),
);

describe("3.5 — all content through schema validation", () => {
  it.each([
    ["b2b", "saas-b2b"],
    ["b2c", "simple"],
    ["ai", "saas-b2b"],
    ["premium", "saas-b2b"],
  ] as const)("contentExamples.%s validates as a %s template config", (example, type) => {
    const result = templateConfigSchema.safeParse({
      type,
      content: contentExamples[example],
    });
    expect(result.success).toBe(true);
  });

  it("template validation still rejects structurally invalid content", () => {
    const result = templateConfigSchema.safeParse({
      type: "simple",
      content: { ...contentExamples.b2c, hero: undefined, features: undefined },
    });
    expect(result.success).toBe(false);
  });
});

describe("3.5 — E2E smoke (jsdom): template renders + key CTAs interactive", () => {
  const user = userEvent.setup();

  it("saas-b2b: renders hero and the primary CTA is focusable and clickable", async () => {
    render(<LandingComposer sections={b2bSections} themeClassName="theme-aurora" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      contentExamples.b2b.hero.headline,
    );

    const cta = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === contentExamples.b2b.hero.primaryCta.href);
    expect(cta).toBeDefined();

    cta!.focus();
    expect(document.activeElement).toBe(cta);
    await user.click(cta!);
  });

  it("saas-b2b: mobile menu opens, exposes links and closes on Escape", async () => {
    render(<LandingComposer sections={b2bSections} themeClassName="theme-aurora" />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-nav-panel")).not.toBeNull();
    const firstLabel = contentExamples.b2b.nav!.links[0]!.label;
    expect(screen.getAllByRole("link", { name: firstLabel }).length).toBeGreaterThan(1);

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-nav-panel")).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });

  it("simple: closing CTA from the content is rendered as a clickable link", async () => {
    render(<LandingComposer sections={simpleSections} themeClassName="theme-aurora" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      contentExamples.b2c.hero.headline,
    );

    const cta = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === contentExamples.b2c.cta!.href);
    expect(cta).toBeDefined();

    await user.click(cta!);
  });
});

describe("3.5 — reduced-motion", () => {
  it("LogoCloud marquee track disables its animation under prefers-reduced-motion", () => {
    const { container } = render(
      <LogoCloud items={[{ name: "Acme" }]} title="Trusted by" marquee />,
    );
    expect(container.querySelector('[class*="motion-reduce:animate-none"]')).not.toBeNull();
  });

  it("IntegrationShowcase marquee track disables its animation under prefers-reduced-motion", () => {
    const { container } = render(
      <IntegrationShowcase
        items={[{ name: "Slack", href: "#slack" }]}
        layout="marquee"
      />,
    );
    expect(container.querySelector('[class*="motion-reduce:animate-none"]')).not.toBeNull();
  });

  it("design tokens ship a global prefers-reduced-motion kill switch", () => {
    const css = readFileSync(
      resolve(process.cwd(), "packages/design-tokens/src/tokens.css"),
      "utf8",
    );
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(css).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    expect(css).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
  });
});
