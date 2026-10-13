"use client";

import * as React from "react";
import {
  Button,
  buttonVariants,
  cn,
  type ButtonProps,
} from "@landing/ui-core";
import { track } from "@landing/analytics";
import { Section } from "./section";
import { StarRating } from "./testimonial";

export interface CtaAction {
  /** Visible label — verb + outcome ("Start free trial"). */
  label: string;
  /** Destination — renders the CTA as a crawlable <a>. Omit for JS actions. */
  href?: string;
  /** Stable tracking id (e.g. "hero_primary") — provider-agnostic. */
  trackId: string;
}

export interface CtaProps {
  action: CtaAction;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  /** Location group for analytics. */
  location?: "header" | "hero" | "section" | "footer" | "sticky" | "inline";
  /** Experiment variant in force (if any). */
  variantName?: string;
  iconRight?: React.ReactNode;
  className?: string;
}

/**
 * Conversion CTA built on ui-core Button.
 *
 * - Emits a provider-agnostic `cta_click` event (label + trackId + location).
 * - Renders as <a> when action.href exists (crawlable, works without JS);
 *   otherwise a <button>. Both share identical styles via buttonVariants.
 */
function Cta({
  action,
  variant = "primary",
  size = "md",
  location = "inline",
  variantName,
  iconRight,
  className,
}: CtaProps) {
  const emit = React.useCallback(() => {
    track({
      type: "cta_click",
      trackId: action.trackId,
      label: action.label,
      href: action.href,
      location,
      variant: variantName,
    });
  }, [action.trackId, action.label, action.href, location, variantName]);

  if (action.href) {
    return (
      <a
        href={action.href}
        onClick={emit}
        className={cn(buttonVariants({ variant, size }), className)}
      >
        {action.label}
        {iconRight && (
          <span aria-hidden="true" className="shrink-0">
            {iconRight}
          </span>
        )}
      </a>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={emit}
      iconRight={iconRight}
      className={className}
    >
      {action.label}
    </Button>
  );
}

export interface CtaGroupProps {
  primary: CtaProps;
  /** Subordinate alternative (e.g. "See pricing"). Visually secondary. */
  secondary?: CtaProps;
  /** Stacks vertically on mobile (default true). */
  stackOnMobile?: boolean;
  className?: string;
}

/**
 * Primary + optional secondary CTA pair — the standard hero/section pattern.
 * One dominant action; the secondary is visually subordinate by default
 * (Hick's law: two clear choices, no competing emphasis).
 */
function CtaGroup({
  primary,
  secondary,
  stackOnMobile = true,
  className,
}: CtaGroupProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        stackOnMobile && "w-full sm:w-auto sm:flex-row sm:items-center",
        className,
      )}
    >
      <Cta {...primary} className={cn(!stackOnMobile && "w-full", primary.className)} />
      {secondary && (
        <Cta
          {...secondary}
          variant={secondary.variant ?? "secondary"}
          className={cn(!stackOnMobile && "w-full", secondary.className)}
        />
      )}
    </div>
  );
}

export interface CtaBannerProps {
  /** Compact band headline — restate the value prop, not a new claim. */
  title: React.ReactNode;
  description?: React.ReactNode;
  ctas: CtaGroupProps;
  /** Proof micro-copy under the actions — only true claims (ETHICS.md). */
  proof?: React.ReactNode;
  background?: "brand" | "muted" | "surface" | "default";
  className?: string;
}

/**
 * Horizontal conversion band (headline left, actions right). Lighter than
 * FinalCta — use mid-page, before/after a proof block.
 */
function CtaBanner({
  title,
  description,
  ctas,
  proof,
  background = "muted",
  className,
}: CtaBannerProps) {
  const dimmed =
    background === "brand" ? "text-accent-foreground" : "text-foreground-muted";

  return (
    <Section background={background} density="compact" className={className}>
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex max-w-xl flex-col gap-2 text-center md:text-left">
          <h2 className="text-2xl font-bold leading-snug text-balance md:text-3xl">
            {title}
          </h2>
          {description && <p className={cn("text-sm", dimmed)}>{description}</p>}
        </div>
        <div className="flex flex-col items-center gap-3">
          <CtaGroup {...ctas} />
          {proof && <p className={cn("text-xs", dimmed)}>{proof}</p>}
        </div>
      </div>
    </Section>
  );
}

export interface CtaWithProofProps {
  ctas: CtaGroupProps;
  /** Check-list reassurances ("No credit card required" — if true). */
  items?: string[];
  /** Star rating with its source label ("4.9 on G2"). */
  rating?: { value: 1 | 2 | 3 | 4 | 5; label: string };
  className?: string;
}

/**
 * Action pair + proof row — reduces last-step anxiety (PSYCHOLOGY.md:
 * risk reversal) without adding a second competing CTA.
 */
function CtaWithProof({ ctas, items = [], rating, className }: CtaWithProofProps) {
  const hasProof = items.length > 0 || rating !== undefined;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <CtaGroup {...ctas} />
      {hasProof && (
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-foreground-muted">
          {rating && (
            <span className="flex items-center gap-2">
              <StarRating rating={rating.value} />
              <span>{rating.label}</span>
            </span>
          )}
          {items.map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 20 20"
                className="size-4 text-success"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export { Cta, CtaGroup, CtaBanner, CtaWithProof };
