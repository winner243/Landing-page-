"use client";

import * as React from "react";
import { Badge, Card, CardContent, CardHeader, cn } from "@landing/ui-core";
import { Cta } from "./cta";
import {
  PricingToggle,
  PricingNote,
  type BillingInterval,
  type PricingToggleProps,
} from "./pricing-controls";
import { Section, SectionHeader } from "./section";

/**
 * Pricing content — the OFFER representation only (payment logic lives
 * in the product, never in the kit). Totals and billing terms must be
 * disclosed truthfully (ETHICS.md §4).
 */
export interface PricingPlan {
  name: string;
  /** Price in the displayed currency for the active interval. */
  price: { amount: number; currency?: string; interval?: "month" | "year" };
  /** Original price — ONLY for a genuine, verifiable previous price. */
  originalAmount?: number;
  description?: string;
  /** Concrete capabilities (not adjectives). */
  features: string[];
  cta: { label: string; href?: string; trackId: string };
  /** Visual highlight — feature the plan most customers need. */
  highlighted?: boolean;
  /** True badge — e.g. "Most popular" (must reflect real data). */
  badge?: string;
}

export interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
}

/** Single plan card: name → price → features → CTA. */
function PricingCard({ plan, className }: PricingCardProps) {
  const currency = plan.price.currency ?? "$";
  const interval = plan.price.interval ?? "month";

  return (
    <Card
      variant={plan.highlighted ? "raised" : "default"}
      padding={plan.highlighted ? "lg" : "md"}
      className={cn(
        "relative flex h-full flex-col",
        plan.highlighted && "border-accent shadow-lg",
        className,
      )}
    >
      {plan.badge && (
        <Badge variant="brand" className="absolute -top-3 left-1/2 -translate-x-1/2">
          {plan.badge}
        </Badge>
      )}
      <CardHeader className="gap-2">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        {plan.description && (
          <p className="text-sm text-foreground-muted">{plan.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        <div className="flex items-baseline gap-1.5">
          {plan.originalAmount !== undefined && (
            <span className="text-lg text-foreground-subtle line-through">
              {currency}
              {plan.originalAmount}
            </span>
          )}
          <span className="text-4xl font-bold tracking-tight">
            {currency}
            {plan.price.amount}
          </span>
          <span className="text-sm text-foreground-muted">/{interval}</span>
        </div>

        <ul className="flex flex-col gap-2.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <svg
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-success"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-foreground-muted">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <Cta
            action={{ ...plan.cta, label: plan.cta.label }}
            variant={plan.highlighted ? "primary" : "secondary"}
            location="section"
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export interface PricingGridProps {
  header?: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
  };
  plans: PricingPlan[];
  /** Monthly/annual toggle content — see PricingToggle. */
  intervalToggle?: PricingToggleProps;
  /** Fine print — taxes, billing cycle, cancellation terms. */
  finePrint?: React.ReactNode;
  /** Guarantee line — only when a real guarantee exists. */
  guarantee?: React.ReactNode;
}

/**
 * Pricing section: cards + optional interval toggle + disclosure fine print.
 * The kit represents the offer; it never processes payments.
 */
function PricingGrid({
  header,
  plans,
  intervalToggle,
  finePrint,
  guarantee,
}: PricingGridProps) {
  return (
    <Section id="pricing">
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}

      {intervalToggle && (
        <div className="mb-10 flex justify-center">
          <PricingToggle {...intervalToggle} />
        </div>
      )}

      <div
        className={cn(
          "grid gap-6",
          plans.length <= 2
            ? "mx-auto max-w-2xl grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>

      {(guarantee || finePrint) && (
        <PricingNote guarantee={guarantee} finePrint={finePrint} className="mt-8" />
      )}
    </Section>
  );
}

export { PricingCard, PricingGrid };
export type { BillingInterval };
