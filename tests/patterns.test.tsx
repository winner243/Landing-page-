import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import {
  ProblemSolutionPattern,
  SocialProofPattern,
  FeatureValuePattern,
  ObjectionHandlingPattern,
  PricingDecisionPattern,
  FooterConversionPattern,
  renderSlot,
} from "@landing/patterns";

describe("Pattern slot system (Roadmap 3.3)", () => {
  it("renderSlot prefers the override, keeps the fallback otherwise", () => {
    expect(renderSlot(undefined, "header", "default")).toBe("default");
    expect(renderSlot({ header: "override" }, "header", "default")).toBe("override");
    expect(renderSlot({ header: null }, "header", "default")).toBeNull();
  });
});

describe("ProblemSolutionPattern (Roadmap 3.3)", () => {
  it("renders header, problems, solution and actions", () => {
    render(
      <ProblemSolutionPattern
        header={{ eyebrow: "PROBLEM", title: "Reporting eats the week" }}
        problems={[
          { title: "Five tools, five numbers", description: "Nobody trusts the dashboard." },
          { title: "Manual exports every Monday" },
        ]}
        solution={{
          title: "One live source of truth",
          description: "Connect once; every metric updates itself.",
        }}
        actions={{
          ctas: {
            primary: {
              action: { label: "Start free trial", href: "/signup", trackId: "ps_primary" },
            },
          },
        }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Reporting eats the week" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Five tools, five numbers")).toBeInTheDocument();
    expect(screen.getByText("Nobody trusts the dashboard.")).toBeInTheDocument();
    expect(screen.getByText("Manual exports every Monday")).toBeInTheDocument();
    expect(screen.getByText("One live source of truth")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start free trial" })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("slot overrides replace the rendered node and can hide it", () => {
    render(
      <ProblemSolutionPattern
        problems={[{ title: "Problem A" }]}
        solution={{ title: "Solution A" }}
        slots={{ problems: <p>Custom problems</p>, solution: null }}
      />,
    );
    expect(screen.getByText("Custom problems")).toBeInTheDocument();
    expect(screen.queryByText("Problem A")).toBeNull();
    expect(screen.queryByText("Solution A")).toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ProblemSolutionPattern
        header={{ title: "Reporting eats the week" }}
        problems={[{ title: "Five tools, five numbers" }]}
        solution={{ title: "One live source of truth" }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});

describe("SocialProofPattern (Roadmap 3.3)", () => {
  it("renders only the proof blocks that are provided", () => {
    render(
      <SocialProofPattern
        logos={{ items: [{ name: "Acme" }] }}
        stats={{ items: [{ value: "2,000+", label: "teams" }] }}
      />,
    );
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("2,000+")).toBeInTheDocument();
    expect(screen.queryByText(/Shipped in a week/)).toBeNull();
  });

  it("renders testimonials when provided", () => {
    render(
      <SocialProofPattern
        testimonials={{
          items: [{ quote: "Shipped in a week.", author: { name: "Ana Ruiz" } }],
        }}
      />,
    );
    expect(screen.getByText(/Shipped in a week/)).toBeInTheDocument();
    expect(screen.getByText("Ana Ruiz")).toBeInTheDocument();
  });
});

describe("FeatureValuePattern (Roadmap 3.3)", () => {
  it("pairs features with the adjacent proof slot", () => {
    render(
      <FeatureValuePattern
        features={{
          header: { title: "Everything in one place" },
          items: [{ title: "Live sync", description: "No nightly jobs." }],
        }}
        proof={<div data-testid="proof">Trusted by 2,000+ teams</div>}
      />,
    );
    expect(screen.getByRole("heading", { name: "Everything in one place" })).toBeInTheDocument();
    expect(screen.getByText("Live sync")).toBeInTheDocument();
    expect(screen.getByTestId("proof")).toBeInTheDocument();
  });

  it("omits the proof slot when not provided", () => {
    render(
      <FeatureValuePattern
        features={{ items: [{ title: "Live sync" }] }}
      />,
    );
    expect(screen.getByText("Live sync")).toBeInTheDocument();
    expect(screen.queryByTestId("proof")).toBeNull();
  });
});

describe("ObjectionHandlingPattern (Roadmap 3.3)", () => {
  it("renders FAQ, risk reversal and guarantee note", async () => {
    render(
      <ObjectionHandlingPattern
        faq={{
          header: { title: "Before you decide" },
          items: [{ question: "Can I cancel?", answer: "Anytime from billing settings." }],
        }}
        reversal={{ items: [{ label: "No credit card required" }] }}
        note={{ guarantee: "30-day money-back", finePrint: "Billed monthly." }}
      />,
    );
    expect(screen.getByText("Can I cancel?")).toBeInTheDocument();
    expect(screen.getByText("No credit card required")).toBeInTheDocument();
    expect(screen.getByText("30-day money-back")).toBeInTheDocument();
    expect(screen.getByText("Billed monthly.")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Can I cancel?"));
    expect(screen.getByText("Anytime from billing settings.")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ObjectionHandlingPattern
        faq={{ items: [{ question: "Can I cancel?", answer: "Anytime." }] }}
        reversal={{ items: [{ label: "No credit card required" }] }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});

describe("PricingDecisionPattern (Roadmap 3.3)", () => {
  const plan = {
    name: "Starter",
    price: { amount: 19 },
    features: ["1 project"],
    cta: { label: "Choose Starter", href: "/signup?plan=starter", trackId: "pd_starter" },
  };

  it("renders cards, comparison matrix, FAQ and disclosure in order", () => {
    const { container } = render(
      <PricingDecisionPattern
        grid={{ header: { title: "Simple pricing" }, plans: [plan] }}
        comparison={{
          header: { title: "Compare plans" },
          columns: [{ name: "Starter" }, { name: "Pro", highlighted: true }],
          rows: [{ label: "Projects", values: ["1", "Unlimited"] }],
        }}
        faq={{
          items: [{ question: "Do you offer annual billing?", answer: "Yes — 2 months free." }],
        }}
        note={{ finePrint: "Prices exclude VAT." }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Simple pricing" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Choose Starter" })).toHaveAttribute(
      "href",
      "/signup?plan=starter",
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Do you offer annual billing?")).toBeInTheDocument();
    expect(screen.getByText("Prices exclude VAT.")).toBeInTheDocument();

    const headings = Array.from(container.querySelectorAll("h2")).map((h) =>
      h.textContent,
    );
    expect(headings[0]).toBe("Simple pricing");
    expect(headings[1]).toBe("Compare plans");
  });
});

describe("FooterConversionPattern (Roadmap 3.3)", () => {
  it("closes with the final CTA then the footer", () => {
    const { container } = render(
      <FooterConversionPattern
        finalCta={{
          title: "Ready to start?",
          ctas: {
            primary: {
              action: { label: "Get started", href: "/signup", trackId: "fc_primary" },
            },
          },
        }}
        footer={{
          brand: "Kit Co",
          columns: [
            { title: "Product", links: [{ label: "Features", href: "/features" }] },
          ],
        }}
      />,
    );

    expect(screen.getByText("Ready to start?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get started" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Product" })).toBeInTheDocument();

    const headings = Array.from(container.querySelectorAll("h2")).map((h) =>
      h.textContent,
    );
    expect(headings[headings.length - 1]).toBe("Ready to start?");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FooterConversionPattern
        finalCta={{
          title: "Ready to start?",
          ctas: {
            primary: { action: { label: "Get started", href: "/signup", trackId: "fc" } },
          },
        }}
        footer={{ brand: "Kit Co" }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});
