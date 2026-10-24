/**
 * Sitemap and robots.txt generators (Roadmap 4.3).
 *
 * Produces XML for sitemap and plain text for robots.txt from a list of
 * page routes. All routes must be real, published pages — no placeholder
 * or draft URLs.
 */

/** A single sitemap entry. */
export interface SitemapUrl {
  /** Absolute URL (https://…). */
  url: string;
  /** Last modification date (ISO 8601). */
  lastModified?: string;
  /** Change frequency hint. */
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  /** Priority relative to other pages on the site (0.0–1.0). */
  priority?: number;
}

/** Options for generating a sitemap XML. */
export interface SitemapOptions {
  urls: SitemapUrl[];
  /** Base URL of the site (used for validation only). */
  baseUrl?: string;
}

/** Escapes XML special characters. */
function xmlEscape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates sitemap.xml content.
 * Validates that every URL is absolute and under the same base domain.
 */
export function generateSitemap(options: SitemapOptions): string {
  const { urls, baseUrl } = options;

  if (urls.length === 0) {
    throw new Error("Sitemap must contain at least one URL");
  }

  // Validate URLs are absolute
  for (const entry of urls) {
    try {
      const parsed = new URL(entry.url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error(`Invalid URL protocol: ${entry.url}`);
      }
      if (baseUrl) {
        const base = new URL(baseUrl);
        if (parsed.hostname !== base.hostname) {
          throw new Error(
            `URL ${entry.url} is not under base domain ${base.hostname}`,
          );
        }
      }
    } catch {
      throw new Error(`Invalid absolute URL: ${entry.url}`);
    }
  }

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ];

  for (const entry of urls) {
    lines.push("  <url>");
    lines.push(`    <loc>${xmlEscape(entry.url)}</loc>`);
    if (entry.lastModified) {
      lines.push(`    <lastmod>${xmlEscape(entry.lastModified)}</lastmod>`);
    }
    if (entry.changeFrequency) {
      lines.push(
        `    <changefreq>${xmlEscape(entry.changeFrequency)}</changefreq>`,
      );
    }
    if (entry.priority !== undefined) {
      lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
    }
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

/** Options for generating robots.txt content. */
export interface RobotsOptions {
  /** Default crawl policy for all user agents. */
  allowAll?: boolean;
  /** Paths to disallow. */
  disallow?: string[];
  /** Paths to allow (exceptions to disallow rules). */
  allow?: string[];
  /** Sitemap URL(s). */
  sitemap?: string | string[];
  /** Crawl delay in seconds. */
  crawlDelay?: number;
  /** Additional user-agent-specific rules. */
  userAgents?: Array<{
    userAgent: string;
    disallow?: string[];
    allow?: string[];
    crawlDelay?: number;
  }>;
}

/**
 * Generates robots.txt content.
 * Defaults to allowing all crawlers when no rules are specified.
 */
export function generateRobots(options: RobotsOptions = {}): string {
  const lines: string[] = [];
  const userAgents = options.userAgents ?? [];

  const hasSpecificAgents = userAgents.length > 0;

  if (!hasSpecificAgents) {
    lines.push("User-agent: *");
    if (options.allowAll ?? true) {
      lines.push("Allow: /");
    }
    if (options.disallow?.length) {
      for (const path of options.disallow) {
        lines.push(`Disallow: ${xmlEscape(path)}`);
      }
    }
    if (options.allow?.length) {
      for (const path of options.allow) {
        lines.push(`Allow: ${xmlEscape(path)}`);
      }
    }
    if (options.crawlDelay !== undefined) {
      lines.push(`Crawl-delay: ${options.crawlDelay}`);
    }
  } else {
    for (const agent of userAgents) {
      lines.push(`User-agent: ${agent.userAgent}`);
      if (agent.disallow?.length) {
        for (const path of agent.disallow) {
          lines.push(`Disallow: ${xmlEscape(path)}`);
        }
      }
      if (agent.allow?.length) {
        for (const path of agent.allow) {
          lines.push(`Allow: ${xmlEscape(path)}`);
        }
      }
      if (agent.crawlDelay !== undefined) {
        lines.push(`Crawl-delay: ${agent.crawlDelay}`);
      }
      lines.push("");
    }
  }

  if (options.sitemap) {
    const sitemaps = Array.isArray(options.sitemap)
      ? options.sitemap
      : [options.sitemap];
    for (const sitemap of sitemaps) {
      lines.push(`Sitemap: ${sitemap}`);
    }
  }

  return lines.join("\n") + "\n";
}