/**
 * SEO helpers — Phase 4 expands to JSON-LD generators + metadata API.
 * Phase 2 ships typed defaults so templates start with correct basics.
 */

export interface PageMeta {
  title: string;
  description: string;
  /** Canonical URL (absolute). */
  canonical?: string;
  /** Absolute URL for social sharing image. */
  ogImage?: string;
  /** Defaults true — landing pages should be indexable. */
  noindex?: boolean;
}

/**
 * Builds standard head metadata from a typed object.
 * Framework-agnostic: returns a plain object consumable by any router.
 */
export function buildPageMeta(meta: PageMeta) {
  return {
    title: meta.title,
    description: meta.description,
    alternates: meta.canonical ? { canonical: meta.canonical } : undefined,
    robots: meta.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      images: meta.ogImage ? [{ url: meta.ogImage }] : undefined,
    },
    twitter: {
      card: meta.ogImage ? "summary_large_image" : "summary",
      title: meta.title,
      description: meta.description,
    },
  } as const;
}
