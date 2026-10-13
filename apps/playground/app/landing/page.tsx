import type { Metadata } from "next";
import { LandingComposer, type LandingSection } from "@landing/patterns";
import { HeroProof } from "@landing/marketing";
import { aurora, themeToStyleTag } from "@landing/themes";

export const metadata: Metadata = {
  title: "Composed landing",
  robots: { index: true, follow: true },
};

const sections: LandingSection[] = [
  {
    type: "navbar",
    props: {
      brand: <span className="font-heading font-bold">Flowmetric</span>,
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
      cta: {
        action: { label: "Start free trial", href: "#pricing", trackId: "landing_nav" },
        location: "header",
      },
      sticky: "always",
    },
  },
  {
    type: "hero",
    props: {
      badge: "New: automated funnel insights",
      headline: "Know which funnel step loses you customers",
      description:
        "Flowmetric maps every drop-off in your signup funnel, so you fix the leaks instead of guessing.",
      ctas: {
        primary: { action: { label: "Start free trial", href: "#pricing", trackId: "landing_hero" } },
        secondary: { action: { label: "See how it works", href: "#features", trackId: "landing_hero_secondary" } },
      },
      proof: <HeroProof count={2000} />,
      variant: "centered",
    },
  },
  {
    type: "logoCloud",
    props: {
      title: "Trusted by product teams at",
      items: [{ name: "Acme" }, { name: "Globex" }, { name: "Initech" }, { name: "Umbrella" }],
      columns: 4,
    },
  },
  {
    type: "features",
    props: {
      header: {
        eyebrow: "WHY FLOWMETRIC",
        title: "Find the leak, fix it, measure the lift",
        description: "From raw events to a ranked list of fixes — in one workflow.",
      },
      columns: 3,
      items: [
        {
          title: "See every drop-off instantly",
          description:
            "Funnel charts update live as users flow through signup, activation and purchase steps.",
        },
        {
          title: "Get a ranked fix list",
          description:
            "Each leak is scored by revenue impact so the team always works on the highest-value fix.",
        },
        {
          title: "Prove the lift after shipping",
          description:
            "Built-in experiments confirm that a change actually recovered the lost conversions.",
        },
      ],
    },
  },
  {
    type: "testimonials",
    props: {
      header: {
        eyebrow: "SOCIAL PROOF",
        title: "Teams recover lost revenue with Flowmetric",
      },
      columns: 3,
      items: [
        {
          quote:
            "We found a broken step in onboarding that cost us 12% of signups. Fixed it in a day.",
          author: { name: "Marie Dupont", role: "Head of Growth", company: "Acme", verified: true },
          rating: 5,
          metric: { value: "+12%", label: "activation rate" },
        },
        {
          quote: "The ranked fix list ended our roadmap arguments. We just work top to bottom.",
          author: { name: "John Rivera", role: "Founder", company: "Northwind", verified: true },
          rating: 5,
        },
        {
          quote: "Setup took 20 minutes. First insight landed the same afternoon.",
          author: { name: "Aisha Khan", role: "Product Manager", company: "Globex" },
          rating: 4,
        },
      ],
    },
  },
  {
    type: "stats",
    props: {
      items: [
        { value: "12%", label: "Average conversion lift" },
        { value: "20 min", label: "Median setup time" },
        { value: "2,000+", label: "Teams onboard" },
        { value: "4.8/5", label: "Customer rating" },
      ],
    },
  },
  {
    type: "pricing",
    props: {
      header: {
        eyebrow: "PRICING",
        title: "Simple pricing that scales with you",
        description: "Every plan includes unlimited funnels and a 14-day free trial.",
      },
      plans: [
        {
          name: "Starter",
          price: { amount: 29, interval: "month" },
          description: "For early-stage products.",
          features: ["3 funnels", "5k events / month", "Email support"],
          cta: { label: "Start free trial", trackId: "landing_starter" },
        },
        {
          name: "Growth",
          price: { amount: 79, interval: "month" },
          description: "For teams optimizing every week.",
          features: ["Unlimited funnels", "100k events / month", "A/B experiments", "Priority support"],
          cta: { label: "Start free trial", trackId: "landing_growth" },
          highlighted: true,
          badge: "Most popular",
        },
        {
          name: "Scale",
          price: { amount: 199, interval: "month" },
          description: "For high-volume products.",
          features: ["Everything in Growth", "1M events / month", "SSO / SAML", "Dedicated CSM"],
          cta: { label: "Contact sales", href: "/contact", trackId: "landing_scale" },
        },
      ],
      finePrint: "Prices in USD, taxes excluded. Cancel anytime from settings.",
    },
  },
  {
    type: "faq",
    props: {
      header: {
        eyebrow: "FAQ",
        title: "Questions, answered",
      },
      items: [
        {
          question: "How long does setup take?",
          answer:
            "Most teams see their first funnel within 20 minutes: install the snippet, name your steps, done.",
          category: "Setup",
        },
        {
          question: "Do you support our stack?",
          answer:
            "Flowmetric works with any platform that can send HTTP events — first-party SDKs cover web, iOS and Android.",
          category: "Engineering",
        },
        {
          question: "What happens after the trial?",
          answer:
            "You pick a plan or stay on the free tier — funnels keep collecting data either way, no blackout.",
          category: "Billing",
        },
      ],
    },
  },
  {
    type: "finalCta",
    props: {
      title: "Stop guessing where users leave",
      description: "Start your 14-day trial — see your first leak today.",
      ctas: {
        primary: { action: { label: "Start free trial", href: "#pricing", trackId: "landing_final" } },
        secondary: { action: { label: "Book a demo", href: "/contact", trackId: "landing_final_demo" } },
      },
      note: "No credit card required.",
    },
  },
  {
    type: "footer",
    props: {
      brand: <span className="font-heading font-bold">Flowmetric</span>,
      tagline: "Funnel analytics for product teams.",
      columns: [
        {
          title: "Product",
          links: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "#" },
            { label: "Contact", href: "/contact" },
          ],
        },
      ],
      legalLinks: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  },
];

export default function LandingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToStyleTag(aurora) }} />
      <main>
        <LandingComposer sections={sections} themeClassName="theme-aurora" />
      </main>
    </>
  );
}
