import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { LandingComposer, defaultLandingOrder, type LandingSection } from "@landing/patterns";

const sections: LandingSection[] = [
  {
    type: "hero",
    props: {
      headline: "Composable landings",
      ctas: { primary: { action: { label: "Try now", href: "/app", trackId: "hero_cta" } } },
    },
  },
  { type: "logoCloud", props: { items: [{ name: "Acme" }] } },
  {
    type: "finalCta",
    props: {
      title: "Ready to start?",
      ctas: { primary: { action: { label: "Get started", href: "/signup", trackId: "final_cta" } } },
    },
  },
  {
    type: "footer",
    props: { brand: "Kit Co", legalLinks: [{ label: "Privacy", href: "/privacy" }] },
  },
];

describe("LandingComposer", () => {
  it("renders sections in provided order (data-driven)", () => {
    const { container } = render(<LandingComposer sections={sections} />);
    const headings = container.querySelectorAll("h1, h2");
    expect(headings[0]).toHaveTextContent(/Composable landings/);
    expect(screen.getByText("Ready to start?")).toBeInTheDocument();
    expect(screen.getByText("Kit Co")).toBeInTheDocument();
  });

  it("supports arbitrary reordering without code changes", () => {
    const reordered = [sections[2]!, sections[0]!, sections[3]!, sections[1]!];
    const { container } = render(<LandingComposer sections={reordered} />);
    const firstH2 = container.querySelector("h1, h2");
    expect(firstH2).toHaveTextContent("Ready to start?");
  });

  it("renders custom escape-hatch sections", () => {
    render(
      <LandingComposer
        sections={[
          { type: "custom", node: <div data-testid="custom">Custom block</div>, key: "x" },
        ]}
      />,
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("applies theme class to page root", () => {
    const { container } = render(
      <LandingComposer sections={sections} themeClassName="theme-aurora" />,
    );
    expect(container.querySelector(".theme-aurora")).not.toBeNull();
  });

  it("defaultLandingOrder returns canonical conversion order", () => {
    const order = defaultLandingOrder();
    expect(order[0]).toBe("navbar");
    expect(order[order.length - 1]).toBe("footer");
    expect(order).toContain("faq");
    expect(order).toContain("finalCta");
  });

  it("composed page has no axe violations", async () => {
    const { container } = render(<LandingComposer sections={sections} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
