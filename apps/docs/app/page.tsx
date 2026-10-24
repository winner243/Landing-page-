import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold leading-tight mb-4">Landing Marketing Kit</h1>
        <p className="text-lg text-foreground-muted max-w-2xl">
          A domain-agnostic, modular and reusable foundation for SaaS and
          digital product landing pages. Combine conversion strategy,
          cognitive psychology, behavioral economics and accessible UI
          components — without coupling to any specific product.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/installation"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-md hover:bg-accent-hover transition-colors"
          >
            Commencer
          </Link>
          <Link
            href="/architecture"
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground hover:bg-muted transition-colors rounded-md"
          >
            Architecture
          </Link>
        </div>
      </div>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Ce que contient le kit</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Design System",
              desc: "Tokens, thèmes et 20 primitives UI accessibles (Button, Card, Dialog, Tabs…).",
            },
            {
              title: "Composants Marketing",
              desc: "Hero, CTA, Tarification, FAQ, Témoignages, Footer, Navbar et bien plus.",
            },
            {
              title: "Patterns de Conversion",
              desc: "Problem→Solution, Social Proof, Objection Handling, Pricing Decision, Footer Conversion.",
            },
            {
              title: "Copywriting Engine",
              desc: "Schémas Zod validés pour tout le contenu (Hero, Tarification, FAQ…).",
            },
            {
              title: "Templates de Landing",
              desc: "saas-b2b, simple, saas-b2c, ai-saas, pro-tool, marketplace, premium, complex.",
            },
            {
              title: "Analytics",
              desc: "Taxonomie d'événements, adaptateurs GA4/Plausible/PostHog/Segment, consentement.",
            },
            {
              title: "A/B Testing",
              desc: "Attribution stable des variantes, compatibilité SSR, mesure des expositions.",
            },
            {
              title: "SEO",
              desc: "Métadonnées, JSON-LD (Organization, Product, FAQPage…), sitemap, robots.txt.",
            },
            {
              title: "Éthique",
              desc: "Pas de fausse preuve, pas de fausse urgence, prix transparents, consentement par défaut.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 border border-border rounded-md bg-background/50"
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-foreground-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Démarrage rapide</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{`# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development (playground)
pnpm dev

# Run quality gates
pnpm check`}</code></pre>
      </section>
    </div>
  );
}