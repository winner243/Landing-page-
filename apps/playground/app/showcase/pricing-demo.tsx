"use client";

import { useState } from "react";
import { PricingGrid, type BillingInterval, type PricingPlan } from "@landing/marketing";

const monthlyPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: { amount: 19, interval: "month" },
    description: "For solo founders validating an idea.",
    features: ["1 project", "10k page views", "Email support"],
    cta: { label: "Start free trial", trackId: "showcase_starter" },
  },
  {
    name: "Pro",
    price: { amount: 49, interval: "month" },
    description: "For teams shipping multiple landings.",
    features: ["Unlimited projects", "100k page views", "A/B testing", "Priority support"],
    cta: { label: "Start free trial", trackId: "showcase_pro" },
    highlighted: true,
    badge: "Most popular",
  },
  {
    name: "Business",
    price: { amount: 99, interval: "month" },
    description: "For scaling marketing orgs.",
    features: ["Everything in Pro", "SSO / SAML", "Dedicated success manager"],
    cta: { label: "Contact sales", href: "/contact", trackId: "showcase_business" },
  },
];

const annualPlans: PricingPlan[] = monthlyPlans.map((plan) => ({
  ...plan,
  price: { amount: plan.price.amount * 10, interval: "year" },
}));

export function PricingDemo() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  return (
    <PricingGrid
      header={{
        eyebrow: "PRICING",
        title: "Simple, honest pricing",
        description: "No hidden fees. Annual billing gives you 2 months free.",
      }}
      plans={interval === "monthly" ? monthlyPlans : annualPlans}
      intervalToggle={{
        value: interval,
        onChange: setInterval,
        savingsLabel: "2 months free",
      }}
      finePrint="Prices in USD, taxes excluded. Cancel anytime."
    />
  );
}
