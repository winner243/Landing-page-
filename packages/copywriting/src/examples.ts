import type { LandingContent } from "./schemas.ts";

/**
 * Example content sets (Roadmap 3.1.4) — one per SaaS positioning:
 * B2B, B2C, AI and Premium. Every set is typed as `LandingContent` and
 * re-validated at runtime by tests/copywriting-guidance.test.ts, so they
 * double as living documentation of the schema limits.
 *
 * All brands, quotes and numbers below are fictional samples: replace
 * them with real, verifiable proof before publishing (docs/ETHICS.md).
 */

/* ------------------------------------------------------------------ */
/* B2B — long-form, proof-heavy (Northwind, data platform)             */
/* ------------------------------------------------------------------ */
export const b2bExample: LandingContent = {
  nav: {
    brandName: "Northwind",
    links: [
      { label: "Product", href: "/product" },
      { label: "Pricing", href: "/pricing" },
      { label: "Customers", href: "/customers" },
      { label: "Docs", href: "/docs" },
      { label: "Sign in", href: "/login" },
    ],
    cta: { label: "Book a demo", href: "/demo", trackId: "nav_primary" },
  },
  hero: {
    badge: "SOC 2 Type II certified",
    headline: "Turn scattered data into decisions your team trusts",
    description:
      "Northwind unifies your warehouse, BI and spreadsheets in one governed workspace, so every metric has one source of truth.",
    primaryCta: { label: "Start free trial", href: "/signup", trackId: "hero_primary" },
    secondaryCta: { label: "Book a demo", href: "/demo", trackId: "hero_secondary" },
    proofText: "Trusted by 400+ data teams",
    proofCount: 400,
  },
  logoCloud: {
    title: "Powering data teams at",
    logos: [
      { name: "Halden Foods" },
      { name: "Orbit Bank" },
      { name: "Vela Health" },
      { name: "Kite Logistics" },
      { name: "Marrow Media" },
    ],
  },
  features: [
    {
      title: "One governed metrics layer",
      description:
        "Define every metric once and reuse it across dashboards, models and reports — no more conflicting numbers.",
    },
    {
      title: "Warehouse-native connectors",
      description:
        "Connect Snowflake, BigQuery and Postgres in minutes, with queries pushed down to your warehouse.",
    },
    {
      title: "Board-ready reports in minutes",
      description:
        "Turn approved metrics into a formatted board pack your leadership can read without asking for a rebuild.",
    },
    {
      title: "Row-level access controls",
      description:
        "Give every team the data they need and nothing else, with audit logs on every query.",
    },
  ],
  benefits: [
    {
      title: "Ship metrics, not spreadsheets",
      description: "Replace manual exports with governed numbers everyone trusts.",
    },
    {
      title: "Focus on analysis, not wrangling",
      description: "Let the platform handle joins, freshness and documentation.",
    },
    {
      title: "Prove compliance without extra work",
      description: "Access controls and audit trails are part of every workspace.",
    },
  ],
  testimonials: [
    {
      quote:
        "We stopped arguing about whose number was right. The metrics layer gave every team one answer, and our reviews got shorter.",
      author: { name: "Priya Raman", role: "Head of Data", company: "Orbit Bank", verified: true },
      rating: 5,
      metric: { value: "48 hours", label: "saved per reporting cycle" },
    },
  ],
  plans: [
    {
      name: "Starter",
      price: { amount: 49, currency: "$", interval: "month" },
      description: "For a first team getting metrics under control.",
      features: ["Up to 5 editors", "Warehouse connectors", "Community support"],
      cta: { label: "Start free trial", href: "/signup?plan=starter", trackId: "pricing_starter" },
    },
    {
      name: "Growth",
      price: { amount: 199, currency: "$", interval: "month" },
      description: "For companies standardising reporting across teams.",
      features: [
        "Unlimited editors",
        "Row-level access controls",
        "Audit logs",
        "Priority support",
      ],
      cta: { label: "Start free trial", href: "/signup?plan=growth", trackId: "pricing_growth" },
      highlighted: true,
      badge: "Most popular",
    },
    {
      name: "Enterprise",
      price: { amount: 799, currency: "$", interval: "month" },
      description: "SSO, dedicated onboarding and security review support.",
      features: ["SAML SSO", "Dedicated onboarding", "Custom data retention"],
      cta: { label: "Talk to sales", href: "/contact", trackId: "pricing_enterprise" },
    },
  ],
  faq: [
    {
      question: "Does Northwind store a copy of our data?",
      answer:
        "No. Queries run inside your warehouse, so the data never leaves your cloud account. We store only metadata and usage events.",
      category: "Security",
    },
    {
      question: "How long does implementation take?",
      answer:
        "Most teams connect a warehouse and publish their first governed metric within a week, using our guided onboarding checklist.",
      category: "Onboarding",
    },
    {
      question: "Can we try it before buying?",
      answer:
        "Yes. The free trial includes the full feature set for 14 days, with no credit card required and no automatic conversion.",
      category: "Pricing",
    },
  ],
  stats: [
    { value: "1 layer", label: "for every business metric", source: "Sample data — replace with a verified metric" },
    { value: "15 min", label: "average setup for a first dashboard", source: "Sample data — replace with a verified metric" },
  ],
  cta: { label: "Start your free trial", href: "/signup", trackId: "band_primary" },
  footer: {
    brandName: "Northwind",
    tagline: "One governed metrics layer for every team in your company.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Overview", href: "/product" },
          { label: "Pricing", href: "/pricing" },
          { label: "Changelog", href: "/changelog" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Careers", href: "/careers" },
        ],
      },
    ],
    legalLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    copyright: "© 2026 Northwind Inc. All rights reserved.",
  },
};

/* ------------------------------------------------------------------ */
/* B2C — single value prop, benefit-led (Fernwell, personal finance)   */
/* ------------------------------------------------------------------ */
export const b2cExample: LandingContent = {
  nav: {
    brandName: "Fernwell",
    links: [
      { label: "How it works", href: "/how" },
      { label: "Pricing", href: "/pricing" },
      { label: "Help", href: "/help" },
    ],
    cta: { label: "Get the app", href: "/download", trackId: "nav_primary" },
  },
  hero: {
    badge: "Free for 30 days",
    headline: "Money habits that stick without the spreadsheet",
    description:
      "Fernwell turns your accounts into a simple weekly plan, so saving happens automatically.",
    primaryCta: { label: "Create free account", href: "/signup", trackId: "hero_primary" },
    proofText: "No card required",
  },
  features: [
    {
      title: "Automatic weekly plan",
      description: "See what is safe to spend this week, updated every morning.",
    },
    {
      title: "Goals that save for you",
      description: "Set a goal and Fernwell moves small amounts until it is funded.",
    },
    {
      title: "Gentle reminders",
      description: "One nudge before a bill is due, never a wall of notifications.",
    },
  ],
  benefits: [
    { title: "Know what you can spend", description: "One number, refreshed daily." },
    { title: "Save without thinking", description: "Small transfers add up quietly." },
    { title: "Cancel in two taps", description: "Your data leaves with you." },
  ],
  trust: {
    items: [
      { label: "Bank-level encryption" },
      { label: "Read-only account access" },
      { label: "GDPR compliant" },
    ],
  },
  plans: [
    {
      name: "Free",
      price: { amount: 0, currency: "$", interval: "month" },
      description: "Core planning and one savings goal.",
      features: ["Weekly plan", "One savings goal"],
      cta: { label: "Start free", href: "/signup", trackId: "pricing_free" },
    },
    {
      name: "Plus",
      price: { amount: 6, currency: "$", interval: "month" },
      description: "Unlimited goals and shared household budgets.",
      features: ["Unlimited goals", "Shared budgets", "Bill calendar"],
      cta: { label: "Try Plus free", href: "/signup?plan=plus", trackId: "pricing_plus" },
      highlighted: true,
      badge: "Best value",
    },
  ],
  faq: [
    {
      question: "Is Fernwell safe to connect to my bank?",
      answer:
        "We use read-only connections through regulated providers, so Fernwell can never move money out of your accounts.",
      category: "Security",
    },
    {
      question: "What happens after the free trial?",
      answer:
        "You keep the free plan. We only charge if you choose Plus, and we email you before any trial ends.",
      category: "Pricing",
    },
  ],
  stats: [
    { value: "2 min", label: "to set up your first weekly plan", source: "Sample data — replace with a verified metric" },
    { value: "0 ads", label: "we never sell your data", source: "Product commitment" },
  ],
  cta: { label: "Start your free trial", href: "/signup", trackId: "band_primary" },
  footer: {
    brandName: "Fernwell",
    tagline: "A calmer way to handle money, one week at a time.",
    columns: [
      {
        title: "Support",
        links: [
          { label: "Help centre", href: "/help" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
    legalLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    copyright: "© 2026 Fernwell Ltd.",
  },
};

/* ------------------------------------------------------------------ */
/* AI — trust-first positioning (Lumen, AI features for product teams) */
/* ------------------------------------------------------------------ */
export const aiExample: LandingContent = {
  nav: {
    brandName: "Lumen",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Docs", href: "/docs" },
      { label: "Pricing", href: "/pricing" },
      { label: "Sign in", href: "/login" },
    ],
    cta: { label: "Get API key", href: "/signup", trackId: "nav_primary" },
  },
  hero: {
    badge: "SOC 2 Type II certified",
    headline: "Ship AI features your users can actually trust",
    description:
      "Lumen gives your product evaluation, tracing and guardrails, so AI answers stay accurate and auditable.",
    primaryCta: { label: "Get API key", href: "/signup", trackId: "hero_primary" },
    secondaryCta: { label: "Read the docs", href: "/docs", trackId: "hero_secondary" },
    proofText: "Used in production by 120+ product teams",
    proofCount: 120,
  },
  logoCloud: {
    logos: [
      { name: "Pocket Ledger" },
      { name: "Sable HR" },
      { name: "Tern Travel" },
      { name: "Quarry Labs" },
    ],
  },
  features: [
    {
      title: "Evaluation on every release",
      description: "Run your golden dataset on each deploy and block regressions.",
    },
    {
      title: "Traces you can read",
      description: "Follow every prompt, tool call and token in one timeline.",
    },
    {
      title: "Guardrails as code",
      description: "Define refusal rules and schema checks in version control.",
    },
    {
      title: "Model routing",
      description: "Send easy tasks to small models and keep spend predictable.",
    },
  ],
  benefits: [
    { title: "Catch drift before users do", description: "Scores run on every deploy." },
    { title: "Explain every answer", description: "Full traces, retained on your terms." },
    { title: "Control spend", description: "Budgets and routing per feature." },
  ],
  testimonials: [
    {
      quote:
        "Evaluation runs became part of our pipeline. We now ship model changes with the same confidence as code changes.",
      author: { name: "Diego Alvarez", role: "Staff Engineer", company: "Quarry Labs", verified: true },
      rating: 5,
    },
  ],
  plans: [
    {
      name: "Builder",
      price: { amount: 0, currency: "$", interval: "month" },
      description: "For prototypes and side projects.",
      features: ["1,000 traced calls", "One evaluation dataset"],
      cta: { label: "Get API key", href: "/signup", trackId: "pricing_builder" },
    },
    {
      name: "Team",
      price: { amount: 89, currency: "$", interval: "month" },
      description: "For products shipping AI to real users.",
      features: ["Unlimited traces", "CI evaluations", "Guardrails as code", "SSO"],
      cta: { label: "Start free trial", href: "/signup?plan=team", trackId: "pricing_team" },
      highlighted: true,
      badge: "Most popular",
    },
  ],
  faq: [
    {
      question: "Do you train models on our data?",
      answer:
        "No. Traces and datasets stay in your workspace and are never used for training, by us or any model provider.",
      category: "Privacy",
    },
    {
      question: "Which model providers are supported?",
      answer:
        "Lumen works with the major hosted providers and any OpenAI-compatible endpoint you host yourself.",
      category: "Integrations",
    },
    {
      question: "Can we self-host Lumen?",
      answer:
        "Yes. The Enterprise plan ships as a container in your own cloud, with the same API as our managed version.",
      category: "Deployment",
    },
  ],
  stats: [
    { value: "1 pipeline", label: "for evals, traces and guardrails", source: "Sample data — replace with a verified metric" },
    { value: "24 h", label: "retention default for raw traces", source: "Documentation default" },
  ],
  cta: { label: "Create free account", href: "/signup", trackId: "band_primary" },
  footer: {
    brandName: "Lumen",
    tagline: "Evaluation, tracing and guardrails for AI product teams.",
    columns: [
      {
        title: "Developers",
        links: [
          { label: "Documentation", href: "/docs" },
          { label: "API reference", href: "/docs/api" },
          { label: "Status", href: "/status" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "Security", href: "/security" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
    legalLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "DPA", href: "/dpa" },
    ],
    copyright: "© 2026 Lumen Systems Inc.",
  },
};

/* ------------------------------------------------------------------ */
/* Premium — high-ticket, concierge positioning (Atelier Cloud)        */
/* ------------------------------------------------------------------ */
export const premiumExample: LandingContent = {
  nav: {
    brandName: "Atelier Cloud",
    links: [
      { label: "Services", href: "/services" },
      { label: "Clients", href: "/clients" },
      { label: "Journal", href: "/journal" },
    ],
    cta: { label: "Request access", href: "/apply", trackId: "nav_primary" },
  },
  hero: {
    badge: "By invitation and application",
    headline: "Private cloud infrastructure with a concierge team",
    description:
      "Atelier runs your platform end to end, with a named engineer who knows your stack by heart.",
    primaryCta: { label: "Request access", href: "/apply", trackId: "hero_primary" },
    secondaryCta: { label: "See engagements", href: "/services", trackId: "hero_secondary" },
    proofText: "Limited to 24 clients each year",
    proofCount: 24,
  },
  features: [
    {
      title: "A named platform engineer",
      description: "One person who owns your account, reachable without a ticket queue.",
    },
    {
      title: "Architecture reviews each quarter",
      description: "We document trade-offs and next steps in writing, every quarter.",
    },
    {
      title: "Incident response included",
      description: "Severity-one response with a written post-incident review.",
    },
  ],
  benefits: [
    { title: "Predictable annual budget", description: "One contract covers the team." },
    { title: "No tool sprawl", description: "We standardise the stack we operate." },
    { title: "Exit built in", description: "Everything documented in your repo." },
  ],
  testimonials: [
    {
      quote:
        "Atelier feels like an extension of our team. The difference is that someone is always watching the platform while we sleep.",
      author: { name: "Helene Marchand", role: "CTO", company: "Vela Health", verified: true },
      rating: 5,
      metric: { value: "24 clients", label: "maximum per year" },
    },
  ],
  plans: [
    {
      name: "Resident",
      price: { amount: 9500, currency: "$", interval: "month" },
      description: "Full-time platform engineer and quarterly reviews.",
      features: ["Named engineer", "Quarterly architecture review", "Incident response"],
      cta: { label: "Request access", href: "/apply?plan=resident", trackId: "pricing_resident" },
      highlighted: true,
      badge: "Limited availability",
    },
    {
      name: "Advisory",
      price: { amount: 2400, currency: "$", interval: "month" },
      description: "Monthly reviews and guidance for an in-house team.",
      features: ["Monthly review", "Architecture guidance", "Escalation hotline"],
      cta: { label: "Request access", href: "/apply?plan=advisory", trackId: "pricing_advisory" },
    },
  ],
  trust: {
    items: [{ label: "Contractual uptime commitments" }, { label: "Annual security audit" }],
  },
  faq: [
    {
      question: "Why do you limit the number of clients?",
      answer:
        "Each engagement reserves a named engineer. We decline work rather than dilute the attention clients pay for.",
      category: "Engagement",
    },
    {
      question: "Do you replace our internal team?",
      answer:
        "No. We work alongside your engineers, taking the platform load while they stay focused on product.",
      category: "Engagement",
    },
  ],
  stats: [
    { value: "24 clients", label: "maximum accepted each year", source: "Published capacity policy" },
    { value: "1 engineer", label: "named and accountable per account", source: "Engagement model" },
  ],
  cta: { label: "Request an invitation", href: "/apply", trackId: "band_primary" },
  footer: {
    brandName: "Atelier Cloud",
    tagline: "A platform team you can hire for a year, not a quarter.",
    columns: [
      {
        title: "Studio",
        links: [
          { label: "Services", href: "/services" },
          { label: "Journal", href: "/journal" },
        ],
      },
      {
        title: "Contact",
        links: [{ label: "Request access", href: "/apply" }],
      },
    ],
    legalLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    copyright: "© 2026 Atelier Cloud SAS",
  },
};

/** All example sets, keyed by positioning (used by tests + playground). */
export const contentExamples = {
  b2b: b2bExample,
  b2c: b2cExample,
  ai: aiExample,
  premium: premiumExample,
} as const;

export type ContentExampleKey = keyof typeof contentExamples;
