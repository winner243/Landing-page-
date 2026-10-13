import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { setAnalyticsHandler, track, type LandingEvent } from "@landing/analytics";
import {
  Hero,
  HeroBadge,
  HeroProof,
  HeroProduct,
  HeroDashboard,
  HeroVideo,
  HeroMinimal,
  Section,
  SectionHeader,
  Cta,
  CtaBanner,
  CtaWithProof,
  TestimonialCard,
  CaseStudyCard,
  ReviewCard,
  UseCaseCard,
  ProductShowcase,
  Workflow,
  IntegrationShowcase,
  ComparisonTable,
  PricingToggle,
  PricingNote,
  PricingFAQ,
  FooterSaaS,
  NewsletterForm,
  SignupForm,
  PricingGrid,
  LogoCloud,
  StatsBar,
  FaqAccordion,
  Navbar,
  Footer,
  FinalCta,
  FeatureGrid,
  FeatureList,
  BenefitList,
  IconList,
} from "@landing/marketing";

beforeEach(() => {
  cleanup();
  setAnalyticsHandler(null);
});

describe("Section system", () => {
  it("renders as <section> by default with container", () => {
    const { container } = render(
      <Section>
        <p>Content</p>
      </Section>,
    );
    expect(container.querySelector("section")).not.toBeNull();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("supports custom tag and background variant", () => {
    const { container } = render(
      <Section as="div" background="muted">
        <p>X</p>
      </Section>,
    );
    expect(container.querySelector("div.bg-muted")).not.toBeNull();
  });

  it("SectionHeader renders eyebrow + title + description with heading level", () => {
    render(
      <SectionHeader
        eyebrow="PRICING"
        title="Simple pricing"
        description="No hidden fees"
        level={2}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Simple pricing" })).toBeInTheDocument();
    expect(screen.getByText("PRICING")).toBeInTheDocument();
    expect(screen.getByText("No hidden fees")).toBeInTheDocument();
  });
});

describe("Hero system", () => {
  const baseProps = {
    headline: "Ship your landing page in hours",
    description: "A reusable marketing kit for SaaS teams.",
    ctas: {
      primary: { action: { label: "Start free trial", href: "/signup", trackId: "hero_primary" } },
    },
  };

  it("renders headline as h1", () => {
    render(<Hero {...baseProps} />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Ship your landing/ }),
    ).toBeInTheDocument();
  });

  it("renders primary CTA as a real link (crawlable)", () => {
    render(<Hero {...baseProps} />);
    const link = screen.getByRole("link", { name: "Start free trial" });
    expect(link).toHaveAttribute("href", "/signup");
  });

  it("renders badge and proof slots", () => {
    render(
      <Hero
        {...baseProps}
        badge={<HeroBadge>New: AI insights</HeroBadge>}
        proof={<HeroProof count={2000} />}
      />,
    );
    expect(screen.getByText("New: AI insights")).toBeInTheDocument();
    expect(screen.getByText("Trusted by 2,000+ teams")).toBeInTheDocument();
  });

  it("renders split variant with visual slot", () => {
    render(<Hero {...baseProps} variant="split" visual={<div data-testid="visual">shot</div>} />);
    expect(screen.getByTestId("visual")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Hero {...baseProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CTA tracking (provider-agnostic)", () => {
  beforeEach(() => {
    setAnalyticsHandler(null);
  });

  it("emits cta_click with trackId and location", async () => {
    const user = userEvent.setup();
    const events: LandingEvent[] = [];
    setAnalyticsHandler((e) => events.push(e));

    render(
      <Cta
        action={{ label: "Book demo", href: "/demo", trackId: "hero_demo" }}
        location="hero"
        variantName="control"
      />,
    );
    await user.click(screen.getByRole("link", { name: /Book demo/ }));

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      type: "cta_click",
      trackId: "hero_demo",
      location: "hero",
      variant: "control",
    });
  });

  it("does not throw when no handler registered", async () => {
    const user = userEvent.setup();
    render(<Cta action={{ label: "Go", trackId: "x" }} />);
    await user.click(screen.getByRole("button", { name: "Go" }));
  });

  it("track() ignores handler exceptions", () => {
    setAnalyticsHandler(() => {
      throw new Error("provider down");
    });
    expect(() =>
      track({ type: "scroll_depth", depth: 50 }),
    ).not.toThrow();
  });
});

describe("TestimonialCard", () => {
  const testimonial = {
    quote: "We cut onboarding time from three weeks to four days.",
    author: { name: "Marie Dupont", role: "CTO", company: "Acme", verified: true },
    rating: 5 as const,
    metric: { value: "3×", label: "faster onboarding" },
  };

  it("renders quote, attribution and verified badge", () => {
    render(<TestimonialCard testimonial={testimonial} />);
    expect(screen.getByText(/Marie Dupont/)).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Rated 5/ })).toBeInTheDocument();
  });

  it("omits verified badge when not verified", () => {
    render(
      <TestimonialCard
        testimonial={{ ...testimonial, author: { ...testimonial.author, verified: false } }}
      />,
    );
    expect(screen.queryByText("Verified")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<TestimonialCard testimonial={testimonial} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("PricingGrid", () => {
  const plans = [
    {
      name: "Starter",
      price: { amount: 19 },
      features: ["1 project", "Email support"],
      cta: { label: "Start free", trackId: "pricing_starter" },
    },
    {
      name: "Pro",
      price: { amount: 49 },
      features: ["Unlimited projects", "Priority support"],
      cta: { label: "Start free", trackId: "pricing_pro" },
      highlighted: true,
      badge: "Most popular",
    },
  ];

  it("renders all plans with prices and CTAs", () => {
    render(<PricingGrid plans={plans} />);
    expect(screen.getByRole("heading", { name: "Starter" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pro" })).toBeInTheDocument();
    expect(screen.getByText("$19")).toBeInTheDocument();
    expect(screen.getByText("$49")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Start free/ })).toHaveLength(2);
  });

  it("interval toggle exposes pressed state", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <PricingGrid
        plans={plans}
        intervalToggle={{ value: "monthly", onChange, savingsLabel: "Save 20%" }}
      />,
    );
    const annual = screen.getByRole("button", { name: /Annual/ });
    expect(annual).toHaveAttribute("aria-pressed", "false");
    await user.click(annual);
    expect(onChange).toHaveBeenCalledWith("annual");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <PricingGrid plans={plans} finePrint="Billed monthly. Cancel anytime." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Proof components", () => {
  it("LogoCloud renders real logo names as text fallback without src", () => {
    render(<LogoCloud items={[{ name: "Acme" }, { name: "Globex" }]} title="Trusted by" />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Globex")).toBeInTheDocument();
  });

  it("StatsBar renders dl semantics", () => {
    render(
      <StatsBar
        items={[
          { value: "94%", label: "Faster delivery" },
          { value: "2,000+", label: "Teams" },
        ]}
      />,
    );
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("Faster delivery")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <LogoCloud items={[{ name: "Acme" }]} title="Trusted by" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("FaqAccordion", () => {
  const items = [
    { question: "Can I cancel anytime?", answer: "Yes, from the billing page.", category: "Billing" },
    { question: "Do you offer a trial?", answer: "14 days, no card required." },
  ];

  it("renders questions as buttons with aria-expanded wired", () => {
    render(<FaqAccordion items={items} header={{ title: "Questions" }} />);
    const trigger = screen.getByRole("button", { name: /Can I cancel anytime/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Billing")).toBeInTheDocument();
  });

  it("opens the answer on click", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    await user.click(screen.getByRole("button", { name: /Can I cancel anytime/ }));
    expect(screen.getByText("Yes, from the billing page.")).toBeInTheDocument();
  });

  it("single mode closes the previously open item", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    const first = screen.getByRole("button", { name: /Can I cancel anytime/ });
    const second = screen.getByRole("button", { name: /Do you offer a trial/ });
    await user.click(first);
    await user.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText("Yes, from the billing page.")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FaqAccordion items={items} header={{ eyebrow: "FAQ", title: "Questions, answered" }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Navbar", () => {
  const links = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ];
  const cta = { action: { label: "Get started", href: "/signup", trackId: "nav_cta" } };

  it("renders a labelled main navigation landmark", () => {
    render(<Navbar brand={<span>Acme</span>} links={links} />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

  it("renders links as crawlable anchors with href", () => {
    render(<Navbar brand={<span>Acme</span>} links={links} />);
    const link = screen.getByRole("link", { name: "Pricing" });
    expect(link).toHaveAttribute("href", "/pricing");
  });

  it("mobile toggle exposes aria-expanded/aria-controls and opens the panel", async () => {
    const user = userEvent.setup();
    render(<Navbar brand={<span>Acme</span>} links={links} cta={cta} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "mobile-nav-panel");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const panelEl = document.getElementById("mobile-nav-panel");
    expect(panelEl).not.toBeNull();
    const panel = within(panelEl as HTMLElement);
    expect(panel.getByRole("link", { name: "Features" })).toBeInTheDocument();
    expect(panel.getByRole("link", { name: "Get started" })).toBeInTheDocument();
  });

  it("Escape closes the mobile panel and restores focus to the toggle", async () => {
    const user = userEvent.setup();
    render(<Navbar brand={<span>Acme</span>} links={links} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Navbar brand={<span>Acme</span>} links={links} cta={cta} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Footer + FinalCta", () => {
  const columns = [
    { title: "Product", links: [{ label: "Pricing", href: "/pricing" }] },
    { title: "Resources", links: [{ label: "Docs", href: "/docs" }] },
  ];
  const legalLinks = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ];

  it("renders footer landmark, labelled column navigation and legal links", () => {
    render(
      <Footer brand={<span>Acme</span>} tagline="Ship faster" columns={columns} legalLinks={legalLinks} />,
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Product" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it("renders the closing conversion section as a heading + real CTA link", () => {
    render(
      <FinalCta
        title="Ready to launch?"
        ctas={{ primary: { action: { label: "Start free", href: "/signup", trackId: "final" } } }}
        note="No credit card required."
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Ready to launch?" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Start free/ })).toHaveAttribute("href", "/signup");
    expect(screen.getByText("No credit card required.")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <FinalCta
          title="Ready to launch?"
          ctas={{ primary: { action: { label: "Start free", href: "/signup", trackId: "final" } } }}
        />
        <Footer brand={<span>Acme</span>} columns={columns} legalLinks={legalLinks} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Feature sections", () => {
  const items = [
    {
      title: "Launch in hours",
      description: "Assemble sections without design bottlenecks.",
      icon: <svg aria-hidden="true" viewBox="0 0 24 24" />,
    },
    {
      title: "Proven patterns",
      description: "Section order follows documented psychology.",
    },
  ];

  it("FeatureGrid renders every feature as a card heading", () => {
    render(<FeatureGrid items={items} header={{ title: "Why teams switch" }} />);
    expect(screen.getByRole("heading", { name: "Launch in hours" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Proven patterns" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Why teams switch" })).toBeInTheDocument();
  });

  it("FeatureList renders titles and descriptions as text rows", () => {
    render(<FeatureList items={items} checkmark />);
    expect(screen.getByText("Launch in hours")).toBeInTheDocument();
    expect(screen.getByText(/design bottlenecks/)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<FeatureGrid items={items} header={{ title: "Features" }} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("BenefitList + IconList", () => {
  it("BenefitList renders benefit titles, with description when provided", () => {
    render(
      <BenefitList
        header={{ title: "What changes for you" }}
        items={[
          { title: "Ship in hours" },
          { title: "Cut review cycles", description: "One source of truth for design and copy." },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: "What changes for you" })).toBeInTheDocument();
    expect(screen.getByText("Ship in hours")).toBeInTheDocument();
    expect(screen.getByText(/One source of truth/)).toBeInTheDocument();
  });

  it("IconList renders a semantic list of icon labels", () => {
    render(
      <IconList
        layout="vertical"
        items={[
          { icon: <svg aria-hidden="true" viewBox="0 0 24 24" />, label: "Works offline" },
          { icon: <svg aria-hidden="true" viewBox="0 0 24 24" />, label: "No lock-in" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Works offline")).toBeInTheDocument();
    expect(screen.getByText("No lock-in")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <BenefitList items={[{ title: "Faster launches" }]} />
        <IconList items={[{ icon: <svg aria-hidden="true" />, label: "Support included" }]} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CTA bands (Roadmap 3.2)", () => {
  const ctas = {
    primary: {
      action: { label: "Start free trial", href: "/signup", trackId: "band_primary" },
    },
    secondary: {
      action: { label: "See pricing", href: "/pricing", trackId: "band_pricing" },
    },
  };

  it("CtaBanner renders headline, crawlable actions and proof line", () => {
    render(
      <CtaBanner
        title="Ready when you are"
        description="Set up in minutes."
        ctas={ctas}
        proof="No credit card required"
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Ready when you are" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start free trial" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.getByRole("link", { name: "See pricing" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(screen.getByText("No credit card required")).toBeInTheDocument();
  });

  it("CtaWithProof renders the rating and check-list items", () => {
    render(
      <CtaWithProof
        ctas={{ primary: { action: { label: "Book a demo", trackId: "demo" } } }}
        rating={{ value: 5, label: "4.9 on G2" }}
        items={["Cancel anytime", "Support included"]}
      />,
    );
    expect(screen.getByRole("img", { name: "Rated 5 out of 5" })).toBeInTheDocument();
    expect(screen.getByText("4.9 on G2")).toBeInTheDocument();
    expect(screen.getByText("Cancel anytime")).toBeInTheDocument();
    expect(screen.getByText("Support included")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Book a demo" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <CtaBanner title="Ready when you are" ctas={ctas} />
        <CtaWithProof
          ctas={{ primary: { action: { label: "Book a demo", trackId: "demo" } } }}
          items={["Cancel anytime"]}
        />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CaseStudyCard + ReviewCard (Roadmap 3.2)", () => {
  it("CaseStudyCard renders challenge, results and a crawlable link", () => {
    render(
      <CaseStudyCard
        item={{
          company: "Orbit Bank",
          industry: "Fintech",
          challenge: "Reporting took a full week every quarter.",
          results: [
            { value: "2 days", label: "to close the books" },
            { value: "1 layer", label: "for every metric" },
          ],
          href: "/customers/orbit",
        }}
      />,
    );
    expect(screen.getByText("Orbit Bank")).toBeInTheDocument();
    expect(screen.getByText("Fintech")).toBeInTheDocument();
    expect(screen.getByText("Reporting took a full week every quarter.")).toBeInTheDocument();
    expect(screen.getByText("2 days")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Read the case study/ });
    expect(link).toHaveAttribute("href", "/customers/orbit");
  });

  it("CaseStudyCard omits the link when no href is provided", () => {
    render(
      <CaseStudyCard
        item={{
          company: "Vela Health",
          challenge: "Teams rebuilt the same dashboard weekly.",
          results: [{ value: "1 report", label: "shared by all teams" }],
        }}
      />,
    );
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("ReviewCard renders rating, source and attribution", () => {
    render(
      <ReviewCard
        review={{
          rating: 4,
          title: "Finally one source of truth",
          body: "Onboarding was smooth and support answered the same day.",
          author: { name: "Priya Raman", role: "Head of Data" },
          source: "G2",
        }}
      />,
    );
    expect(screen.getByRole("img", { name: "Rated 4 out of 5" })).toBeInTheDocument();
    expect(screen.getByText("G2")).toBeInTheDocument();
    expect(screen.getByText("Finally one source of truth")).toBeInTheDocument();
    expect(screen.getByText("Priya Raman")).toBeInTheDocument();
    expect(screen.getByText("Head of Data")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <CaseStudyCard
          item={{
            company: "Kite Logistics",
            challenge: "Fragmented tooling.",
            results: [{ value: "3 tools", label: "replaced" }],
            href: "/customers/kite",
          }}
        />
        <ReviewCard
          review={{
            rating: 5,
            title: "Worth it",
            body: "Clear pricing and fast setup.",
            author: { name: "Diego Alvarez" },
            source: "Product Hunt",
          }}
        />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("UseCaseCard (Roadmap 3.2)", () => {
  it("renders title, description and optional link", () => {
    render(
      <UseCaseCard
        title="For agencies"
        description="Run the same playbook across every client site."
        href="/agencies"
        linkLabel="See agency setup"
      />,
    );
    expect(screen.getByRole("heading", { name: "For agencies" })).toBeInTheDocument();
    expect(
      screen.getByText("Run the same playbook across every client site."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See agency setup" })).toHaveAttribute(
      "href",
      "/agencies",
    );
  });

  it("has no axe violations with an icon slot", async () => {
    const { container } = render(
      <UseCaseCard
        title="For support teams"
        description="Answer from one shared knowledge base."
        icon={<svg viewBox="0 0 20 20" />}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Hero variants (Roadmap 3.2)", () => {
  const copy = {
    headline: "One dashboard for every metric",
    description: "Connect your sources and ship the report.",
    ctas: {
      primary: {
        action: { label: "Start free trial", href: "/signup", trackId: "hero_primary" },
      },
    },
  };

  it("HeroProduct frames the screenshot and keeps the H1", () => {
    render(
      <HeroProduct
        {...copy}
        screenshot={<img src="/shot.png" alt="Pipeline board in dark mode" />}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "One dashboard for every metric" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Pipeline board in dark mode" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start free trial" })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("HeroDashboard renders the dashboard node", () => {
    render(<HeroDashboard {...copy} dashboard={<div>Weekly revenue chart</div>} />);
    expect(screen.getByText("Weekly revenue chart")).toBeInTheDocument();
  });

  it("HeroVideo renders an accessible native player", () => {
    render(
      <HeroVideo {...copy} src="https://cdn.example.com/demo.mp4" title="Product demo" />,
    );
    expect(screen.getByLabelText("Product demo")).toBeInTheDocument();
  });

  it("HeroVideo accepts a provider embed instead of a source", () => {
    render(
      <HeroVideo
        {...copy}
        title="Product demo"
        embed={<iframe title="Product demo" src="https://example.com/embed" />}
      />,
    );
    expect(screen.getByTitle("Product demo")).toBeInTheDocument();
  });

  it("HeroMinimal renders copy only, no visual", () => {
    const { container } = render(<HeroMinimal {...copy} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "One dashboard for every metric" }),
    ).toBeInTheDocument();
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <HeroProduct {...copy} screenshot={<img src="/shot.png" alt="" />} />
        <HeroDashboard {...copy} dashboard={<div aria-label="Dashboard preview" role="img" />} />
        <HeroVideo {...copy} src="https://cdn.example.com/demo.mp4" title="Product demo" />
        <HeroMinimal {...copy} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});

describe("ProductShowcase + Workflow (Roadmap 3.2)", () => {
  it("ProductShowcase renders visual, callout pins and aside copy", () => {
    render(
      <ProductShowcase
        header={{ title: "See the pipeline" }}
        visual={<img src="/pipeline.png" alt="Pipeline board" />}
        callouts={[{ label: "Live sync", position: "top-left" }]}
        aside={<p>Every stage in one view.</p>}
      />,
    );
    expect(screen.getByRole("heading", { name: "See the pipeline" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Pipeline board" })).toBeInTheDocument();
    expect(screen.getByText("Live sync")).toBeInTheDocument();
    expect(screen.getByText("Every stage in one view.")).toBeInTheDocument();
  });

  it("Workflow renders numbered steps in an ordered list", () => {
    render(
      <Workflow
        header={{ title: "How it works" }}
        steps={[
          { title: "Connect a source", description: "Pick a connector." },
          { title: "Map your metrics" },
          { title: "Share the report" },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: "How it works" })).toBeInTheDocument();
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Connect a source")).toBeInTheDocument();
    expect(screen.getByText("Pick a connector.")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("Workflow supports the vertical layout", () => {
    render(
      <Workflow
        layout="vertical"
        steps={[{ title: "Import" }, { title: "Review" }, { title: "Publish" }]}
      />,
    );
    expect(screen.getByText("Import")).toBeInTheDocument();
    expect(screen.getByText("Publish")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <ProductShowcase
          header={{ title: "See the pipeline" }}
          visual={<img src="/pipeline.png" alt="" />}
          callouts={[{ label: "Live sync" }]}
        />
        <Workflow
          header={{ title: "How it works" }}
          steps={[{ title: "Connect a source" }, { title: "Map your metrics" }]}
        />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});

describe("PricingToggle, PricingNote, PricingFAQ (Roadmap 3.2)", () => {
  it("PricingToggle reflects state and emits changes", async () => {
    const onChange = vi.fn();
    render(<PricingToggle value="monthly" onChange={onChange} savingsLabel="Save 20%" />);

    const monthly = screen.getByRole("button", { name: "Monthly" });
    const annual = screen.getByRole("button", { name: /Annual/ });
    expect(monthly).toHaveAttribute("aria-pressed", "true");
    expect(annual).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Save 20%")).toBeInTheDocument();

    await userEvent.click(annual);
    expect(onChange).toHaveBeenCalledWith("annual");
  });

  it("PricingNote renders guarantee + fine print, nothing when empty", () => {
    const { rerender } = render(
      <PricingNote
        guarantee="30-day money-back"
        finePrint="Billed monthly. Cancel anytime."
      />,
    );
    expect(screen.getByText("30-day money-back")).toBeInTheDocument();
    expect(screen.getByText("Billed monthly. Cancel anytime.")).toBeInTheDocument();

    rerender(<PricingNote />);
    expect(screen.queryByText("30-day money-back")).toBeNull();
  });

  it("PricingFAQ falls back to the pricing-framed header", () => {
    render(
      <PricingFAQ
        items={[{ question: "Can I switch plans?", answer: "Yes, from billing settings." }]}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Pricing questions, answered" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Can I switch plans?")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <PricingToggle value="annual" onChange={() => {}} savingsLabel="Save 20%" />
        <PricingNote guarantee="30-day money-back" finePrint="Billed monthly." />
        <PricingFAQ
          items={[{ question: "Is there a trial?", answer: "14 days, no card." }]}
        />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});

describe("IntegrationShowcase + ComparisonTable (Roadmap 3.2)", () => {
  it("IntegrationShowcase grid renders copy, links and directory CTA", () => {
    render(
      <IntegrationShowcase
        header={{ title: "Works with your stack" }}
        items={[
          { name: "Slack", description: "Post alerts to channels." },
          { name: "HubSpot", href: "/integrations/hubspot" },
        ]}
        narrative="Connect in a few clicks."
        cta={{ label: "All integrations", href: "/integrations" }}
      />,
    );
    expect(screen.getByText("Slack")).toBeInTheDocument();
    expect(screen.getByText("Post alerts to channels.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "HubSpot integration" })).toHaveAttribute(
      "href",
      "/integrations/hubspot",
    );
    expect(screen.getByText("Connect in a few clicks.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All integrations" })).toHaveAttribute(
      "href",
      "/integrations",
    );
  });

  it("IntegrationShowcase marquee hides the duplicate track from AT", () => {
    const { container } = render(
      <IntegrationShowcase
        layout="marquee"
        items={[{ name: "Slack" }, { name: "Figma" }]}
      />,
    );
    expect(screen.getAllByText("Slack")).toHaveLength(2);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it("ComparisonTable renders groups, inclusion labels and column CTAs", () => {
    render(
      <ComparisonTable
        header={{ title: "Compare plans" }}
        caption="Feature comparison"
        columns={[
          { name: "Starter" },
          {
            name: "Pro",
            highlighted: true,
            cta: { label: "Start Pro", href: "/signup", trackId: "cmp_pro" },
          },
        ]}
        rows={[
          { group: "Core", label: "Unlimited projects", values: [false, true] },
          { label: "Audit log", values: [false, true] },
          { label: "Retention", values: ["30 days", "1 year"] },
        ]}
        footnote="Values checked monthly."
      />,
    );
    expect(screen.getByRole("table", { name: "Feature comparison" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Pro" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Unlimited projects" })).toBeInTheDocument();
    expect(screen.getAllByText("Included")).toHaveLength(2);
    expect(screen.getAllByText("Not included")).toHaveLength(2);
    expect(screen.getByText("1 year")).toBeInTheDocument();
    expect(screen.getByText("Core")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start Pro" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.getByText("Values checked monthly.")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <IntegrationShowcase
          header={{ title: "Works with your stack" }}
          items={[{ name: "Slack" }, { name: "Figma", href: "/integrations/figma" }]}
          narrative="Connect in a few clicks."
        />
        <ComparisonTable
          header={{ title: "Compare plans" }}
          columns={[{ name: "Starter" }, { name: "Pro", highlighted: true }]}
          rows={[{ label: "Projects", values: [true, true] }]}
        />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});

describe("FooterSaaS + forms (Roadmap 3.2)", () => {
  const columns = [
    { title: "Product", links: [{ label: "Features", href: "/features" }] },
    { title: "Company", links: [{ label: "About", href: "/about" }] },
    { title: "Resources", links: [{ label: "Docs", href: "/docs" }] },
    { title: "Legal", links: [{ label: "Terms", href: "/terms" }] },
  ];

  it("FooterSaaS renders columns and the newsletter slot", () => {
    render(
      <FooterSaaS
        brand={<span>Acme</span>}
        columns={columns}
        legalLinks={[{ label: "Privacy", href: "/privacy" }]}
        newsletter={<p>Product news, monthly.</p>}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Product" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Legal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByText("Product news, monthly.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  it("NewsletterForm sends the email to a Server Action", async () => {
    const action = vi.fn();
    render(<NewsletterForm action={action} consentNote="Unsubscribe any time." />);

    await userEvent.type(
      screen.getByRole("textbox", { name: "Email address" }),
      "a@b.com",
    );
    await userEvent.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(action).toHaveBeenCalledTimes(1);
    const formData = (action.mock.calls[0] as unknown as [FormData])[0];
    expect(formData.get("email")).toBe("a@b.com");
    expect(screen.getByText("Unsubscribe any time.")).toBeInTheDocument();
  });

  it("SignupForm renders labelled fields and submits to a Server Action", async () => {
    const action = vi.fn();
    render(
      <SignupForm
        action={action}
        fields={[
          {
            name: "email",
            label: "Work email",
            type: "email",
            required: true,
            autoComplete: "email",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            required: true,
            hint: "At least 12 characters.",
          },
        ]}
        termsNote="By continuing you agree to the Terms."
        footerNote="Already have an account? Log in"
        errorMessage="That email is already registered."
      />,
    );

    expect(screen.getByLabelText(/Work email/)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/Password/)).toHaveAttribute("type", "password");
    expect(screen.getByText("At least 12 characters.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "That email is already registered.",
    );
    expect(screen.getByText("Already have an account? Log in")).toBeInTheDocument();
    expect(
      screen.getByText("By continuing you agree to the Terms."),
    ).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/Work email/), "a@b.com");
    await userEvent.type(screen.getByLabelText(/Password/), "correct horse battery");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(action).toHaveBeenCalledTimes(1);
    const formData = (action.mock.calls[0] as unknown as [FormData])[0];
    expect(formData.get("email")).toBe("a@b.com");
    expect(formData.get("password")).toBe("correct horse battery");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <FooterSaaS
          brand={<span>Acme</span>}
          columns={columns}
          newsletter={<NewsletterForm />}
        />
        <SignupForm
          fields={[
            { name: "email", label: "Work email", type: "email", required: true },
          ]}
        />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});
