export default function SeoPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">SEO</h1>
      <p className="text-foreground-muted max-w-2xl">
        Helpers de métadonnées, générateurs JSON-LD validés, sitemap et
        robots.txt. Aucune donnée trompeuse n'est générée.
      </p>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Métadonnées</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{`import { buildPageMeta } from "@landing/seo";

const meta = buildPageMeta({
  title: "Landing Marketing Kit",
  description: "Foundation for SaaS landing pages.",
  canonical: "https://example.com/",
  ogImage: "https://example.com/og.png",
});`}</code></pre>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">JSON-LD (données structurées)</h2>
        <ul className="text-sm text-foreground-muted space-y-2 list-disc pl-6">
          <li><code className="font-mono text-xs">organizationJsonLd()</code> — Organization</li>
          <li><code className="font-mono text-xs">softwareApplicationJsonLd()</code> — SoftwareApplication</li>
          <li><code className="font-mono text-xs">productJsonLd()</code> — Product</li>
          <li><code className="font-mono text-xs">faqPageJsonLd()</code> — FAQPage</li>
          <li><code className="font-mono text-xs">webSiteJsonLd()</code> — WebSite</li>
          <li><code className="font-mono text-xs">breadcrumbListJsonLd()</code> — BreadcrumbList</li>
        </ul>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sitemap et robots.txt</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{`import { generateSitemap, generateRobots } from "@landing/seo";

const sitemap = generateSitemap({
  urls: [{ url: "https://example.com/", lastModified: "2026-10-13" }],
});

const robots = generateRobots({
  allowAll: true,
  sitemap: "https://example.com/sitemap.xml",
});`}</code></pre>
      </section>
    </div>
  );
}