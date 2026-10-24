export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Templates de landing</h1>
      <p className="text-foreground-muted max-w-2xl">
        Un template est une configuration validée → liste ordonnée de sections.
        Chaque template a un ensemble de blocs requis différent selon le type
        de SaaS.
      </p>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Templates disponibles</h2>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 text-foreground-muted">Template</th>
              <th className="pb-2 text-foreground-muted">Blocs requis</th>
              <th className="pb-2 text-foreground-muted">Usage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="py-3 font-mono text-xs">saas-b2b</td>
              <td className="py-3">hero, features, témoignages, stats, plans, faq, cta, footer</td>
              <td className="py-3">B2B multi-parties prenantes, preuve lourde</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">simple</td>
              <td className="py-3">hero, features, cta, footer</td>
              <td className="py-3">Single value prop, faible friction</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">saas-b2c</td>
              <td className="py-3">hero, features, cta, footer</td>
              <td className="py-3">B2C, benefit-led, inscription rapide</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">ai-saas</td>
              <td className="py-3">hero, features, témoignages, trust, faq, cta, footer</td>
              <td className="py-3">IA, confiance et transparence</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">pro-tool</td>
              <td className="py-3">hero, features, cta, footer</td>
              <td className="py-3">Outil pro, orienté feature</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">marketplace</td>
              <td className="py-3">hero, cta, footer</td>
              <td className="py-3">Deux côtés, signaux de liquidité</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">premium</td>
              <td className="py-3">hero, témoignages, cta, footer</td>
              <td className="py-3">Haut de gamme, exclusivité</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">complex</td>
              <td className="py-3">hero, features, témoignages, trust, faq, plans, cta, footer</td>
              <td className="py-3">Multi-feature, entreprise</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Générateur de landing</h2>
        <p className="text-foreground-muted text-sm">
          Le <code className="font-mono text-xs">LandingComposer</code> rend
          une liste ordonnée de sections. Les templates utilisent
          <code className="font-mono text-xs">buildTemplate()</code> pour
          assembler une configuration validée en sections.
        </p>
      </section>
    </div>
  );
}