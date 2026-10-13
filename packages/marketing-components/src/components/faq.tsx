import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
} from "@landing/ui-core";
import { Section, SectionHeader } from "./section";

/**
 * FAQ content — questions come from real user objections (sales calls,
 * support tickets, reviews). Never fabricate; never dodge hard questions
 * (COPYWRITING.md §7, ETHICS.md).
 */
export interface FaqItem {
  question: string;
  answer: React.ReactNode;
  /** Optional grouping badge — source category of the question. */
  category?: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  /** Section framing — optional. */
  header?: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
  };
  /** Only one answer open at a time (default true — less scanning load). */
  single?: boolean;
  /** Render items without the Section wrapper. */
  withSection?: boolean;
}

/**
 * Accessible FAQ accordion (keyboard: Tab + Enter/Space, aria-expanded,
 * aria-controls wired). Deliberately simple — no interaction complexity
 * without real benefit (Phase 2 §13).
 */
function FaqAccordion({
  items,
  header,
  single = true,
  withSection = true,
}: FaqAccordionProps) {
  const idOf = (i: number) => `faq-${i}`;

  const body = (
    <>
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}
      <div className={cn("mx-auto max-w-3xl", !header && "pt-2")}>
        <Accordion type={single ? "single" : "multiple"}>
          {items.map((item, i) => (
            <AccordionItem key={`${item.question}-${i}`} id={idOf(i)}>
              <AccordionTrigger itemId={idOf(i)}>
                {item.category && (
                  <span className="mr-2 rounded bg-muted px-1.5 py-0.5 text-xs font-normal text-foreground-muted">
                    {item.category}
                  </span>
                )}
                <span className="flex-1">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent itemId={idOf(i)}>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );

  if (!withSection) return body;
  return <Section>{body}</Section>;
}

export { FaqAccordion };

export interface PricingFAQProps {
  items: FaqItem[];
  header?: {
    eyebrow?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
  };
}

/**
 * Pricing objections accordion — FaqAccordion with a pricing-framed
 * default header. Questions must come from real objections (§7).
 */
function PricingFAQ({ items, header }: PricingFAQProps) {
  return (
    <FaqAccordion
      items={items}
      header={{
        eyebrow: header?.eyebrow ?? "FAQ",
        title: header?.title ?? "Pricing questions, answered",
        description: header?.description,
      }}
    />
  );
}

export { PricingFAQ };
