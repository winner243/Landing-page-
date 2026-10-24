export default function PatternsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Patterns de conversion</h1>
      <p className="text-foreground-muted max-w-2xl">
        Un pattern est une composition nommée de composants marketing qui
        répond à un objectif de conversion. Les patterns définissent des
        <em>slots</em> typés — le produit remplit les slots avec son contenu,
        ou surcharge le rendu d'un slot entièrement.
      </p>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Patterns disponibles</h2>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 text-foreground-muted">Pattern</th>
              <th className="pb-2 text-foreground-muted">Objectif</th>
              <th className="pb-2 text-foreground-muted">Slots</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="py-3 font-mono text-xs">ProblemSolutionPattern</td>
              <td className="py-3">Compréhension : douleur → solution</td>
              <td className="py-3">header, problems, solution, actions</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">SocialProofPattern</td>
              <td className="py-3">Preuve : logos → stats → témoignages</td>
              <td className="py-3">logos, stats, testimonials</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">FeatureValuePattern</td>
              <td className="py-3">Fonction → bénéfice → preuve adjacente</td>
              <td className="py-3">features, proof</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">ObjectionHandlingPattern</td>
              <td className="py-3">Supprimer les dernières objections</td>
              <td className="py-3">reversal, faq, note</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">PricingDecisionPattern</td>
              <td className="py-3">Bloc de décision complet</td>
              <td className="py-3">grid, comparison, faq, note</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-xs">FooterConversionPattern</td>
              <td className="py-3">Fermer la page sur une conversion</td>
              <td className="py-3">finalCta, footer</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Système de slots</h2>
        <p className="text-foreground-muted text-sm">
          Chaque slot peut être surchargé (<code className="font-mono text-xs">null</code> masque le slot).
          L'ordre des sections est une donnée, pas du code.
        </p>
      </section>
    </div>
  );
}