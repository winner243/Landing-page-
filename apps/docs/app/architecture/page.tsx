export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Architecture</h1>

      <p className="text-foreground-muted max-w-2xl">
        Le Landing Marketing Kit est conçu comme une fondation indépendante,
        modulaire et réutilisable. Aucune logique métier spécifique à un
        SaaS n'est intégrée — la marque, le copy et le thème sont injectés
        via des design tokens et des schémas de contenu.
      </p>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Couches d'architecture</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{`SaaS / Product
        ↓
Landing Marketing Kit (domain-agnostic)
        ↓
Design System → Marketing Components → Conversion Patterns
        ↓              ↓                      ↓
Content/Copy    Analytics/Experiments   Brand Themes`}</code></pre>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Packages</h2>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 text-foreground-muted">Package</th>
              <th className="pb-2 text-foreground-muted">Responsabilité</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="py-3 font-mono text-xs">@landing/design-tokens</td>
              <td className="py-3">Tokens CSS (oklch), thèmes, contraste WCAG AA</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">@landing/ui-core</td>
              <td className="py-3">Primitives UI (Button, Card, Dialog, Tabs…)</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">@landing/marketing</td>
              <td className="py-3">Composants marketing (Hero, CTA, Pricing, FAQ…)</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">@landing/conversion-patterns</td>
              <td className="py-3">Patterns de conversion et LandingComposer</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">@landing/copywriting</td>
              <td className="py-3">Schémas Zod, validation, exemples de contenu</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">@landing/analytics</td>
              <td className="py-3">Taxonomie d'événements, adaptateurs, consentement</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">@landing/experimentation</td>
              <td className="py-3">A/B testing, attribution stable des variantes</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">@landing/seo</td>
              <td className="py-3">Métadonnées, JSON-LD, sitemap, robots.txt</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">@landing/themes</td>
              <td className="py-3">Thèmes de marque (aurora, emerald, ember)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Dépendance</h2>
        <p className="text-foreground-muted max-w-2xl">
          Le graphe de dépendance est à sens unique :
          <code className="font-mono text-sm">
            design-tokens → ui-core → marketing → patterns
          </code>
          . Aucun cycle. Chaque package est utilisable indépendamment
          (adoption incrémentale).
        </p>
      </section>
    </div>
  );
}