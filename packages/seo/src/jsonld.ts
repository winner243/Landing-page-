/**
 * JSON-LD generators for structured data (Roadmap 4.3).
 *
 * Generators produce schema.org-compliant JSON-LD objects for the most
 * common landing-page entity types. All data comes from the page's real
 * content — nothing is fabricated, no fake ratings or prices.
 *
 * Each generator returns a plain object suitable for embedding in a
 * `<script type="application/ld+json">` tag. Consumers are responsible
 * for serializing and placing the tag in the document head.
 */



/* ------------------------------------------------------------------ */
/* Shared value objects                                               */
/* ------------------------------------------------------------------ */

/** A real, verifiable postal address. */
export interface PostalAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode: string;
  addressCountry: string; // ISO 3166-1 alpha-2, e.g. "FR", "US"
}

/** Contact point (phone, email…). */
export interface ContactPoint {
  telephone?: string;
  email?: string;
  contactType?: "customer support" | "sales" | "billing";
}

/** An offer (price + availability). */
export interface Offer {
  price: number;
  priceCurrency: string; // ISO 4217, e.g. "EUR", "USD"
  priceValidUntil?: string; // ISO date
  availability:
    | "InStock"
    | "OutOfStock"
    | "LimitedAvailability"
    | "Discontinued";
  url?: string;
}

/** Aggregate rating from real reviews. */
export interface AggregateRating {
  ratingValue: number; // 1-5
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

/* ------------------------------------------------------------------ */
/* Organization                                                       */
/* ------------------------------------------------------------------ */

/**
 * Organization JSON-LD (schema.org/Organization).
 * Required: @context, @type, name. Recommended: url, logo, address.
 */
export function organizationJsonLd(input: {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  address?: PostalAddress;
  telephone?: string;
  email?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    ...(input.url && { url: input.url }),
    ...(input.logo && { logo: input.logo }),
    ...(input.description && { description: input.description }),
    ...(input.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: input.address.streetAddress,
        addressLocality: input.address.addressLocality,
        ...(input.address.addressRegion && {
          addressRegion: input.address.addressRegion,
        }),
        postalCode: input.address.postalCode,
        addressCountry: input.address.addressCountry,
      },
    }),
    ...(input.telephone && { telephone: input.telephone }),
    ...(input.email && { email: input.email }),
    ...(input.sameAs && { sameAs: input.sameAs }),
  } as const;
}

/* ------------------------------------------------------------------ */
/* SoftwareApplication                                                */
/* ------------------------------------------------------------------ */

/**
 * SoftwareApplication JSON-LD (schema.org/SoftwareApplication).
 * For SaaS products distributed as software.
 */
export function softwareApplicationJsonLd(input: {
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  url: string;
  description?: string;
  author?: { name: string; url?: string };
  offers?: Offer[];
  aggregateRating?: AggregateRating;
  screenshot?: string[];
  datePublished?: string; // ISO date
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    applicationCategory: input.applicationCategory,
    operatingSystem: input.operatingSystem,
    url: input.url,
    ...(input.description && { description: input.description }),
    ...(input.author && {
      author: {
        "@type": "Organization",
        name: input.author.name,
        ...(input.author.url && { url: input.author.url }),
      },
    }),
    ...(input.offers && {
      offers: input.offers.map((offer) => ({
        "@type": "Offer",
        price: offer.price,
        priceCurrency: offer.priceCurrency,
        ...(offer.priceValidUntil && { priceValidUntil: offer.priceValidUntil }),
        ...(offer.availability && { availability: offer.availability }),
        ...(offer.url && { url: offer.url }),
      })),
    }),
    ...(input.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: input.aggregateRating.ratingValue,
        reviewCount: input.aggregateRating.reviewCount,
        ...(input.aggregateRating.bestRating && {
          bestRating: input.aggregateRating.bestRating,
        }),
        ...(input.aggregateRating.worstRating && {
          worstRating: input.aggregateRating.worstRating,
        }),
      },
    }),
    ...(input.screenshot && { screenshot: input.screenshot }),
    ...(input.datePublished && { datePublished: input.datePublished }),
  } as const;
}

/* ------------------------------------------------------------------ */
/* Product                                                            */
/* ------------------------------------------------------------------ */

/**
 * Product JSON-LD (schema.org/Product).
 * For pricing pages and individual plan offers.
 */
export function productJsonLd(input: {
  name: string;
  description?: string;
  url: string;
  brand?: { name: string };
  offers: Offer[];
  aggregateRating?: AggregateRating;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    ...(input.description && { description: input.description }),
    url: input.url,
    ...(input.brand && {
      brand: { "@type": "Organization", name: input.brand.name },
    }),
    offers: input.offers.map((offer) => ({
      "@type": "Offer",
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      ...(offer.priceValidUntil && { priceValidUntil: offer.priceValidUntil }),
      ...(offer.availability && { availability: offer.availability }),
      ...(offer.url && { url: offer.url }),
    })),
    ...(input.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: input.aggregateRating.ratingValue,
        reviewCount: input.aggregateRating.reviewCount,
        ...(input.aggregateRating.bestRating && {
          bestRating: input.aggregateRating.bestRating,
        }),
        ...(input.aggregateRating.worstRating && {
          worstRating: input.aggregateRating.worstRating,
        }),
      },
    }),
  } as const;
}

/* ------------------------------------------------------------------ */
/* FAQPage                                                            */
/* ------------------------------------------------------------------ */

/**
 * FAQPage JSON-LD (schema.org/FAQPage).
 * For FAQ sections with real questions and answers.
 */
export function faqPageJsonLd(input: {
  mainEntity: Array<{
    question: string;
    answer: string;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: input.mainEntity.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } as const;
}

/* ------------------------------------------------------------------ */
/* WebSite                                                            */
/* ------------------------------------------------------------------ */

/**
 * WebSite JSON-LD (schema.org/WebSite).
 * For site-wide search action and site name.
 */
export function webSiteJsonLd(input: {
  name: string;
  url: string;
  potentialAction?: {
    target: string; // URL template, e.g. "https://example.com/search?q={search_term}"
    queryInput: string; // e.g. "required name=search_term"
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    ...(input.potentialAction && {
      potentialAction: {
        "@type": "SearchAction",
        target: input.potentialAction.target,
        "query-input": input.potentialAction.queryInput,
      },
    }),
  } as const;
}

/* ------------------------------------------------------------------ */
/* Breadcrumbs                                                        */
/* ------------------------------------------------------------------ */

/**
 * BreadcrumbList JSON-LD (schema.org/BreadcrumbList).
 */
export function breadcrumbListJsonLd(input: {
  items: Array<{
    name: string;
    url: string;
    position: number;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: input.items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      item: item.url,
    })),
  } as const;
}