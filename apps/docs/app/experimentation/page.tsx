export default function ExperimentationPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">A/B Testing (Expérimentation)</h1>
      <p className="text-foreground-muted max-w-2xl">
        Attribution stable des variantes, compatible SSR, sans flicker
        côté client. L'assignation vient du middleware / cookie / URL et
        traverse via ExperimentClient.
      </p>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">API</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{`import { ExperimentProvider, useVariant, Experiment } from "@landing/experimentation";

<ExperimentProvider assignments={{ "hero_cta": "variant_b" }} visitorId="user_123">
  <HeroCta />
</ExperimentProvider>

// Hook
const variant = useVariant("hero_cta", ["control", "variant_b"], "control");

// Composant conditionnel
<Experiment id="hero_copy" variants={["variant_b"]}>
  <VariantBCopy />
</Experiment>`}</code></pre>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Fonctionnement</h2>
        <ul className="text-sm text-foreground-muted space-y-2 list-disc pl-6">
          <li><code className="font-mono text-xs">resolveVariant()</code> — lit l'assignation explicite</li>
          <li><code className="font-mono text-xs">hashBucket()</code> — bucketing déterministe par visitorId</li>
          <li><code className="font-mono text-xs">assignVariant()</code> — respecte la tranche de trafic</li>
          <li>Exposition tracée via <code className="font-mono text-xs">experiment_exposure</code> (consent-gated)</li>
          <li>Déduplication des événements d'exposition par expérience</li>
        </ul>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Confidentialité</h2>
        <p className="text-foreground-muted text-sm">
          Pas de middlewares, pas de cookies imposés par le kit. L'intégrateur
          gère la persistance des assignations. Aucune donnée personnelle
          n'est collectée par le kit.
        </p>
      </section>
    </div>
  );
}