import { describe, it, expect } from "vitest";
import {
  buildPageMeta,
  organizationJsonLd,
  softwareApplicationJsonLd,
  productJsonLd,
  faqPageJsonLd,
  webSiteJsonLd,
  breadcrumbListJsonLd,
  generateSitemap,
  generateRobots,
} from "@landing/seo";

describe("buildPageMeta", () => {
  it("builds standard metadata", () => {
    const meta = buildPageMeta({
      title: "Test page",
      description: "A test page.",
      canonical: "https://example.com/",
      ogImage: "https://example.com/og.png",
    });
    expect(meta.title).toBe("Test page");
    expect(meta.description).toBe("A test page.");
    expect(meta.robots).toEqual({ index: true, follow: true });
    expect(meta.openGraph.title).toBe("Test page");
    expect(meta.openGraph.url).toBe("https://example.com/");
    expect(meta.twitter.card).toBe("summary_large_image");
  });

  it("respects noindex", () => {
    const meta = buildPageMeta({
      title: "Hidden",
      description: "Hidden page.",
      noindex: true,
    });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("omits optional fields when absent", () => {
    const meta = buildPageMeta({
      title: "Minimal",
      description: "Minimal page.",
    });
    expect(meta.alternates).toBeUndefined();
    expect(meta.openGraph.images).toBeUndefined();
    expect(meta.twitter.card).toBe("summary");
  });
});

describe("organizationJsonLd", () => {
  it("generates valid Organization JSON-LD", () => {
    const json = organizationJsonLd({
      name: "Acme Corp",
      url: "https://acme.com/",
      description: "A test company.",
    });
    expect(json["@context"]).toBe("https://schema.org");
    expect(json["@type"]).toBe("Organization");
    expect(json.name).toBe("Acme Corp");
    expect(json.url).toBe("https://acme.com/");
    expect(json.description).toBe("A test company.");
  });

  it("includes address when provided", () => {
    const json = organizationJsonLd({
      name: "Acme Corp",
      address: {
        streetAddress: "123 Main St",
        addressLocality: "Paris",
        postalCode: "75001",
        addressCountry: "FR",
      },
    }) as { address: { "@type": string; addressLocality: string } };
    expect(json.address["@type"]).toBe("PostalAddress");
    expect(json.address.addressLocality).toBe("Paris");
  });
});

describe("softwareApplicationJsonLd", () => {
  it("generates valid SoftwareApplication JSON-LD", () => {
    const json = softwareApplicationJsonLd({
      name: "My SaaS",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://saas.example.com/",
    });
    expect(json["@type"]).toBe("SoftwareApplication");
    expect(json.name).toBe("My SaaS");
    expect(json.applicationCategory).toBe("BusinessApplication");
  });
});

describe("productJsonLd", () => {
  it("generates valid Product JSON-LD", () => {
    const json = productJsonLd({
      name: "Pro Plan",
      url: "https://example.com/pricing",
      offers: [{ price: 29, priceCurrency: "EUR", availability: "InStock" }],
    });
    expect(json["@type"]).toBe("Product");
    expect(json.name).toBe("Pro Plan");
    expect(json.offers[0]!.price).toBe(29);
    expect(json.offers[0]!.priceCurrency).toBe("EUR");
  });
});

describe("faqPageJsonLd", () => {
  it("generates valid FAQPage JSON-LD", () => {
    const json = faqPageJsonLd({
      mainEntity: [
        {
          question: "Can I cancel?",
          answer: "Yes, anytime.",
        },
      ],
    });
    expect(json["@type"]).toBe("FAQPage");
    expect(json.mainEntity[0]!["@type"]).toBe("Question");
    expect(json.mainEntity[0]!.name).toBe("Can I cancel?");
  });
});

describe("webSiteJsonLd", () => {
  it("generates valid WebSite JSON-LD", () => {
    const json = webSiteJsonLd({
      name: "My Site",
      url: "https://example.com/",
    });
    expect(json["@type"]).toBe("WebSite");
    expect(json.name).toBe("My Site");
    expect(json.url).toBe("https://example.com/");
  });
});

describe("breadcrumbListJsonLd", () => {
  it("generates valid BreadcrumbList JSON-LD", () => {
    const json = breadcrumbListJsonLd({
      items: [
        { name: "Home", url: "https://example.com/", position: 1 },
        { name: "Pricing", url: "https://example.com/pricing", position: 2 },
      ],
    });
    expect(json["@type"]).toBe("BreadcrumbList");
    expect(json.itemListElement[0]!.position).toBe(1);
    expect(json.itemListElement[1]!.name).toBe("Pricing");
  });
});

describe("generateSitemap", () => {
  it("generates valid sitemap XML", () => {
    const xml = generateSitemap({
      urls: [
        { url: "https://example.com/", lastModified: "2026-10-13" },
        { url: "https://example.com/pricing", priority: 0.8 },
      ],
    });
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("https://example.com/");
    expect(xml).toContain("https://example.com/pricing");
    expect(xml).toContain("2026-10-13");
    expect(xml).toContain("0.8");
  });

  it("rejects empty URLs", () => {
    expect(() => generateSitemap({ urls: [] })).toThrow();
  });

  it("rejects relative URLs", () => {
    expect(() =>
      generateSitemap({ urls: [{ url: "/relative" }] }),
    ).toThrow();
  });
});

describe("generateRobots", () => {
  it("allows all crawlers by default", () => {
    const robots = generateRobots({});
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
  });

  it("disallows specific paths", () => {
    const robots = generateRobots({
      disallow: ["/admin", "/private"],
    });
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain("Disallow: /private");
  });

  it("includes sitemap", () => {
    const robots = generateRobots({
      sitemap: "https://example.com/sitemap.xml",
    });
    expect(robots).toContain("Sitemap: https://example.com/sitemap.xml");
  });

  it("supports per-user-agent rules", () => {
    const robots = generateRobots({
      userAgents: [
        { userAgent: "Googlebot", disallow: ["/no-google"] },
        { userAgent: "*" },
      ],
    });
    expect(robots).toContain("User-agent: Googlebot");
    expect(robots).toContain("Disallow: /no-google");
    expect(robots).toContain("User-agent: *");
  });
});