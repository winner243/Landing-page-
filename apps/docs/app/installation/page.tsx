export default function InstallationPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Installation</h1>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">1. Installer les dépendances</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{`pnpm install`}</code></pre>
        <p className="mt-4 text-sm text-foreground-muted">
          Le kit utilise pnpm workspaces. Toutes les packages sont résolues
          via le lockfile à la racine.
        </p>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">2. Construire les packages</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{`pnpm build`}</code></pre>
        <p className="mt-4 text-sm text-foreground-muted">
          Construit tous les packages du workspace (design-tokens, ui-core,
          marketing-components, conversion-patterns, copywriting, analytics,
          experimentation, seo, themes).
        </p>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">3. Exécuter en développement</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{`pnpm dev`}</code></pre>
        <p className="mt-4 text-sm text-foreground-muted">
          Lance le playground Next.js sur http://localhost:3000.
        </p>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">4. Qualité (gates)</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm"><code>{`pnpm check`}</code></pre>
        <p className="mt-4 text-sm text-foreground-muted">
          Exécute typecheck → lint → bundle size → tests.
        </p>
        <ul className="mt-4 text-sm text-foreground-muted space-y-2 list-disc pl-6">
          <li>`pnpm typecheck` — TypeScript strict sur tous les packages</li>
          <li>`pnpm lint` — ESLint 9 (zéro erreur, zéro warning)</li>
          <li>`pnpm size` — Budget bundle ≤ 5 KB gzippé par composant</li>
          <li>`pnpm test` — Vitest (unit + axe + contrast)</li>
        </ul>
      </section>
    </div>
  );
}