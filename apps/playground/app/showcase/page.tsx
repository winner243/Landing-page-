import type { Metadata } from "next";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Separator,
  Heading,
  Text,
  Stack,
  Input,
  FormField,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@landing/ui-core";
import {
  Section,
  SectionHeader,
  Hero,
  HeroBadge,
  HeroProof,
  FeatureGrid,
  FeatureList,
  LogoCloud,
  StatsBar,
  TrustBar,
  TestimonialGrid,
  FaqAccordion,
  BenefitList,
  IconList,
  Navbar,
  Footer,
  FinalCta,
} from "@landing/marketing";
import { PricingDemo } from "./pricing-demo";

export const metadata: Metadata = { title: "Component showcase" };

const featureIcon = (d: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const features = [
  {
    title: "Launch in hours, not weeks",
    description:
      "Pre-built conversion sections assemble into a complete landing page without design or engineering bottlenecks.",
    icon: featureIcon("M13 2 3 14h9l-1 8 10-12h-9l1-8z"),
  },
  {
    title: "Proven conversion patterns",
    description:
      "Section order, copy frameworks and CTAs follow documented psychology principles — no guesswork, no dark patterns.",
    icon: featureIcon("M3 3v18h18M7 15l4-4 4 4 5-6"),
  },
  {
    title: "Accessible by default",
    description:
      "Keyboard navigation, focus management, semantic markup and axe checks are built into every component.",
    icon: featureIcon("M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4z"),
  },
];

const testimonials = [
  {
    quote:
      "We replaced three weeks of design back-and-forth with a single afternoon of assembling sections.",
    author: { name: "Marie Dupont", role: "Head of Growth", company: "Acme", verified: true },
    rating: 5 as const,
    metric: { value: "3×", label: "faster launch" },
  },
  {
    quote:
      "The copy framework alone improved our trial conversion. The components were a bonus.",
    author: { name: "John Rivera", role: "Founder", company: "Northwind", verified: true },
    rating: 5 as const,
  },
  {
    quote:
      "Accessibility passed our audit on the first try. That has never happened before.",
    author: { name: "Aisha Khan", role: "Engineering Manager", company: "Globex" },
    rating: 4 as const,
  },
];

const faqItems = [
  {
    question: "Can I use this kit with my own brand?",
    answer:
      "Yes. Themes override semantic tokens only — swap colors, fonts and radii without touching component code.",
    category: "Setup",
  },
  {
    question: "Is it accessible?",
    answer:
      "Every component ships with semantic markup, keyboard support and automated axe checks in the test suite.",
    category: "Accessibility",
  },
  {
    question: "Does it work without JavaScript?",
    answer:
      "Content, links and CTAs render on the server. Only interactive islands (menu, accordion, toggle) hydrate.",
    category: "Engineering",
  },
];

export default function ShowcasePage() {
  return (
    <>
      <Navbar
        brand={<span className="font-heading font-bold">LMK Kit</span>}
        links={[
          { label: "Showcase", href: "/showcase" },
          { label: "Landing", href: "/landing" },
          { label: "Themes", href: "/themes" },
        ]}
        cta={{ action: { label: "Get started", href: "/landing", trackId: "nav_cta" }, location: "header" }}
        sticky="static"
      />

      <main>
        <Section background="muted">
          <SectionHeader
            eyebrow="PRIMITIVES"
            title="UI primitives"
            description="Buttons, badges, form fields and cards shared by every marketing section."
          />
          <Stack gap={8}>
            <Stack gap={4}>
              <Heading level="h4">Buttons</Heading>
              <Stack direction="horizontal" gap={3} wrap>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="primary" loading>
                  Loading
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </Stack>
              <Stack direction="horizontal" gap={3} wrap>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </Stack>
            </Stack>

            <Separator />

            <Stack gap={4}>
              <Heading level="h4">Badges</Heading>
              <Stack direction="horizontal" gap={2} wrap>
                <Badge>Default</Badge>
                <Badge variant="brand">Brand</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="outline">Outline</Badge>
              </Stack>
            </Stack>

            <Separator />

            <Stack gap={4}>
              <Heading level="h4">Form fields</Heading>
              <Stack direction="horizontal" gap={6} wrap>
                <FormField label="Work email" htmlFor="email" hint="We never share it.">
                  <Input type="email" placeholder="you@company.com" />
                </FormField>
                <FormField label="Company size" htmlFor="size" error="Select an option.">
                  <Input id="size" placeholder="11–50" />
                </FormField>
              </Stack>
            </Stack>

            <Separator />

            <Stack gap={4}>
              <Heading level="h4">Card</Heading>
              <Card className="max-w-sm">
                <CardHeader>
                  <CardTitle>Card title</CardTitle>
                  <CardDescription>Supporting description text.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text size="sm" tone="muted">
                    Card content goes here — metrics, lists, or nested components.
                  </Text>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    Action
                  </Button>
                </CardFooter>
              </Card>
            </Stack>
          </Stack>
        </Section>

        <Section>
          <SectionHeader
            eyebrow="HERO"
            title="Hero variants"
            description="Centered, split and minimal layouts share the same content slots."
          />
          <Stack gap={10}>
            <Hero
              variant="centered"
              badge={<HeroBadge>New: conversion analytics built in</HeroBadge>}
              headline="Ship your landing page this afternoon"
              description="Assemble hero, proof, pricing and FAQ from a tested component library."
              ctas={{
                primary: { action: { label: "Start free trial", href: "/landing", trackId: "hero_primary" } },
                secondary: { action: { label: "See the live example", href: "/landing", trackId: "hero_secondary" } },
              }}
              proof={<HeroProof count={2000} />}
            />
            <Separator />
            <Hero
              variant="split"
              headline="Split hero for product-led stories"
              description="Put the product visual next to the value proposition on desktop, stacked on mobile."
              ctas={{
                primary: { action: { label: "Try it free", href: "/landing", trackId: "split_primary" } },
              }}
              visual={
                <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-border bg-background-muted text-sm text-foreground-muted">
                  Product screenshot
                </div>
              }
            />
          </Stack>
        </Section>

        <Section background="surface">
          <SectionHeader
            eyebrow="FEATURES"
            title="Feature sections"
            description="Benefit-led titles with concrete outcomes, not feature names."
          />
          <FeatureGrid items={features} columns={3} withSection={false} />
          <Separator className="my-10" />
          <FeatureList items={features} checkmark />
          <Separator className="my-10" />
          <BenefitList
            header={{ eyebrow: "BENEFITS", title: "What changes for your team" }}
            items={[
              { title: "Launch pages without the design queue" },
              {
                title: "Copy grounded in tested frameworks",
                description: "Every block ships with length limits and objection coverage.",
              },
              {
                title: "Accessibility verified on every change",
                description: "Automated axe checks run in the test suite, not at audit time.",
              },
            ]}
            withSection={false}
          />
          <Separator className="my-10" />
          <IconList
            header={{ eyebrow: "IN THE BOX", title: "Included from day one" }}
            layout="vertical"
            items={[
              { icon: featureIcon("M13 2 3 14h9l-1 8 10-12h-9l1-8z"), label: "Design tokens" },
              { icon: featureIcon("M4 6h16M4 12h16M4 18h10"), label: "Section composition" },
              { icon: featureIcon("M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4z"), label: "WCAG 2.1 AA checks" },
            ]}
            withSection={false}
          />
        </Section>

        <Section>
          <LogoCloud
            title="Trusted by teams at"
            items={[{ name: "Acme" }, { name: "Globex" }, { name: "Initech" }, { name: "Umbrella" }]}
            columns={4}
          />
          <StatsBar
            items={[
              { value: "94%", label: "Faster page launches" },
              { value: "2,000+", label: "Teams shipping with the kit" },
              { value: "4.8/5", label: "Average developer rating" },
              { value: "56", label: "Automated accessibility tests" },
            ]}
            withSection={false}
          />
          <TrustBar
            title="Compliance & guarantees"
            items={[
              { label: "GDPR ready" },
              { label: "SOC 2 in progress" },
              { label: "30-day money-back guarantee" },
            ]}
          />
        </Section>

        <Section background="muted">
          <TestimonialGrid
            header={{
              eyebrow: "SOCIAL PROOF",
              title: "Teams that switched",
              description: "Real quotes from real customers — verified badges appear only with approval.",
            }}
            items={testimonials}
            columns={3}
            featuredIndex={0}
          />
        </Section>

        <Section>
          <PricingDemo />
        </Section>

        <Section background="surface">
          <FaqAccordion
            header={{
              eyebrow: "FAQ",
              title: "Questions, answered",
              description: "Single-open accordion keeps scanning load low.",
            }}
            items={faqItems}
          />
        </Section>

        <Section>
          <SectionHeader
            eyebrow="INTERACTIONS"
            title="Accordion primitive"
            description="Underlying accessible accordion used by FAQ sections."
          />
          <Accordion type="single" defaultOpenIds={["acc-1"]}>
            <AccordionItem id="acc-1">
              <AccordionTrigger itemId="acc-1">How does billing work?</AccordionTrigger>
              <AccordionContent itemId="acc-1">
                Monthly plans renew on the signup date. Annual plans bill once per year with two
                months free.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem id="acc-2">
              <AccordionTrigger itemId="acc-2">Can I cancel anytime?</AccordionTrigger>
              <AccordionContent itemId="acc-2">
                Yes — cancel from the billing page, no email required. Access continues until the
                end of the paid period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        <FinalCta
          title="Ready to launch your landing page?"
          description="Start from a proven section order and make it yours."
          ctas={{
            primary: { action: { label: "Start free trial", href: "/landing", trackId: "final_primary" } },
            secondary: { action: { label: "Browse the landing", href: "/landing", trackId: "final_secondary" } },
          }}
          note="No credit card required."
        />
      </main>

      <Footer
        brand={<span className="font-heading font-bold">LMK Kit</span>}
        tagline="Domain-agnostic landing pages for SaaS teams."
        columns={[
          {
            title: "Product",
            links: [
              { label: "Showcase", href: "/showcase" },
              { label: "Landing", href: "/landing" },
              { label: "Themes", href: "/themes" },
            ],
          },
          {
            title: "Resources",
            links: [
              { label: "Docs", href: "/" },
              { label: "Roadmap", href: "/" },
            ],
          },
        ]}
        legalLinks={[
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ]}
      />
    </>
  );
}
