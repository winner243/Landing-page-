import * as React from "react";
import {
  Avatar,
  Card,
  CardContent,
  cn,
} from "@landing/ui-core";
import { Section, SectionHeader } from "./section";

/**
 * Testimonial content â€” see COPYWRITING.md Â§4.
 * Ethics: `verified` must reflect reality; fabricated testimonials are
 * forbidden (ETHICS.md Â§1). The schema makes claims explicit, not fake.
 */
export interface TestimonialItem {
  quote: string;
  author: {
    name: string;
    role?: string;
    company?: string;
    /** Real photo URL â€” or omit to use initials (never fake faces). */
    avatarSrc?: string;
    /** True ONLY if the person really said/approved this. */
    verified?: boolean;
  };
  /** Genuine rating 1â€“5 â€” omit rather than invent. */
  rating?: 1 | 2 | 3 | 4 | 5;
  /** Optional outcome metric, e.g. "3Ã— faster onboarding". */
  metric?: { value: string; label: string };
}

function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div
      className={cn("flex gap-0.5 text-warning", className)}
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L3.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z"
          />
        </svg>
      ))}
    </div>
  );
}

export interface TestimonialCardProps {
  testimonial: TestimonialItem;
  /** Prominent styling for a featured quote. */
  featured?: boolean;
  className?: string;
}

/**
 * Testimonial card â€” quote + real attribution.
 * Verified badge renders only when testimonial.verified === true.
 */
function TestimonialCard({ testimonial, featured, className }: TestimonialCardProps) {
  const { quote, author, rating, metric } = testimonial;

  return (
    <Card
      variant={featured ? "raised" : "default"}
      padding={featured ? "lg" : "md"}
      className={cn("flex h-full flex-col gap-4", className)}
    >
      <CardContent className="flex flex-1 flex-col gap-4">
        {rating !== undefined && <StarRating rating={rating} />}
        {metric && (
          <p className="text-3xl font-bold text-accent">
            {metric.value}
            <span className="ml-2 text-sm font-medium text-foreground-muted">
              {metric.label}
            </span>
          </p>
        )}
        <blockquote className="text-foreground">
          <p className="text-base leading-relaxed md:text-lg">â€œ{quote}â€</p>
          <footer className="mt-4 flex items-center gap-3 pt-2">
          <Avatar
            name={author.name}
            src={author.avatarSrc}
            alt={author.name}
            size="md"
          />
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              {author.name}
              {author.verified && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-success-bg px-1.5 py-0.5 text-[10px] font-medium text-success-fg"
                  title="Verified customer"
                >
                  <svg className="size-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              )}
            </span>
            {(author.role || author.company) && (
              <span className="text-xs text-foreground-muted">
                {[author.role, author.company].filter(Boolean).join(", ")}
              </span>
            )}
          </div>
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  );
}

export interface TestimonialGridProps {
  header?: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
  };
  items: TestimonialItem[];
  columns?: 1 | 2 | 3;
  /** Index of the featured (larger) testimonial â€” first item by default when featuredId set. */
  featuredIndex?: number;
}

/** Responsive testimonial grid with optional featured card. */
function TestimonialGrid({ header, items, columns = 3, featuredIndex }: TestimonialGridProps) {
  const md = columns >= 2 ? 2 : 1;

  return (
    <Section background="muted">
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}
      <div
        className={cn(
          "grid gap-6 grid-cols-1",
          md === 2 && "md:grid-cols-2",
          columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {items.map((t, i) => (
          <TestimonialCard
            key={`${t.author.name}-${i}`}
            testimonial={t}
            featured={featuredIndex === i}
          />
        ))}
      </div>
    </Section>
  );
}

export interface CaseStudyItem {
  company: string;
  industry?: string;
  /** One sentence: the problem before the product. */
  challenge: string;
  /** Verifiable outcomes — numbers must be real (ETHICS.md). */
  results: Array<{ value: string; label: string }>;
  /** Link to the full story — renders a crawlable <a>. */
  href?: string;
  linkLabel?: string;
}

export interface CaseStudyCardProps {
  item: CaseStudyItem;
  className?: string;
}

/**
 * Case study teaser — company, problem and measured outcomes.
 * Results render as a description list so screen readers announce
 * value/label pairs together.
 */
function CaseStudyCard({ item, className }: CaseStudyCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-base font-semibold text-foreground">{item.company}</p>
          {item.industry && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground-muted">
              {item.industry}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-foreground-muted">
          {item.challenge}
        </p>

        <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-border pt-4">
          {item.results.map((result) => (
            <div key={result.label}>
              <dt className="text-xs text-foreground-muted">{result.label}</dt>
              <dd className="text-2xl font-bold text-accent">{result.value}</dd>
            </div>
          ))}
        </dl>

        {item.href && (
          <a
            href={item.href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
          >
            {item.linkLabel ?? "Read the case study"}
            <span aria-hidden="true">→</span>
          </a>
        )}
      </CardContent>
    </Card>
  );
}

export interface ReviewItem {
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  author: { name: string; role?: string };
  /** Where the review was published ("G2", "Product Hunt"). */
  source: string;
}

export interface ReviewCardProps {
  review: ReviewItem;
  className?: string;
}

/**
 * Short published review (aggregator style) — rating, source and author
 * are always shown so the claim is attributable.
 */
function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <StarRating rating={review.rating} />
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            {review.source}
          </span>
        </div>
        <h3 className="text-base font-semibold text-foreground">{review.title}</h3>
        <p className="text-sm leading-relaxed text-foreground-muted">{review.body}</p>
        <p className="mt-auto pt-2 text-sm text-foreground">
          <span className="font-semibold">{review.author.name}</span>
          {review.author.role && (
            <span className="ml-1.5 text-foreground-muted">{review.author.role}</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

export {
  TestimonialCard,
  TestimonialGrid,
  CaseStudyCard,
  ReviewCard,
  StarRating,
};
