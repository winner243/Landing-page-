export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <p className="text-foreground-muted max-w-2xl">
        Système d'événements provider-agnostique. Rien n'est bundlé —
        l'intégrateur branche ses propres adaptateurs (GA4, Plausible,
        PostHog, Segment).
      </p>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">API publique</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{`import { createAnalytics, createGa4Adapter } from "@landing/analytics";

const analytics = createAnalytics({
  adapters: [createGa4Adapter()],
});

// Consentement requis (privacy-first)
analytics.setConsent({ analytics: "granted" });

analytics.track({
  type: "cta_click",
  trackId: "hero_primary",
  label: "Start free trial",
  location: "hero",
});`}</code></pre>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Événements de la taxonomie</h2>
        <ul className="text-sm text-foreground-muted space-y-2 list-disc pl-6">
          <li><code className="font-mono text-xs">page_view</code> — path, title</li>
          <li><code className="font-mono text-xs">section_view</code> — section, variant</li>
          <li><code className="font-mono text-xs">scroll_depth</code> — depth (25/50/75/100)</li>
          <li><code className="font-mono text-xs">cta_click</code> — trackId, label, location</li>
          <li><code className="font-mono text-xs">form_start / form_submit</code> — form, success</li>
          <li><code className="font-mono text-xs">signup_start / signup_complete</code> — plan, source</li>
          <li><code className="font-mono text-xs">pricing_view</code> — plan, interval</li>
          <li><code className="font-mono text-xs">experiment_exposure</code> — experimentId, variant</li>
        </ul>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Consentement</h2>
        <p className="text-foreground-muted text-sm">
          Le tracking est <strong>désactivé par défaut</strong>. Aucun
          événement n'est émis tant que le consentement explicite
          (<code className="font-mono text-xs">analytics: "granted"</code>)
          n'a été obtenu. Le retrait du consentement stoppe immédiatement
          la livraison.
        </p>
        <p className="text-xs text-foreground-muted mt-2">
          Le kit fournit le mécanisme, pas la conformité légale. L'intégrateur
          reste responsable du recueil du consentement selon sa juridiction.
        </p>
      </section>
    </div>
  );
}