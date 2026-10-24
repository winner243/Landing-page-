export default function ComponentsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Composants</h1>
      <p className="text-foreground-muted max-w-2xl">
        Tous les composants sont accessibles (WCAG 2.1 AA), responsives et
        émettent des événements analytics typés.
      </p>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">UI Core (@landing/ui-core)</h2>
        <ul className="text-sm text-foreground-muted space-y-2 list-disc pl-6">
          <li>Button — 7 états, variantes, feedback success/error</li>
          <li>Card, Badge, Separator, Avatar (+AvatarGroup)</li>
          <li>Input, FormField (label/hint/error a11y)</li>
          <li>Accordion (base pour FAQ)</li>
          <li>Tooltip, Dialog, DropdownMenu, Tabs, Skeleton</li>
          <li>VisuallyHidden, Link, MediaFrame</li>
        </ul>
      </section>

      <section className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Marketing (@landing/marketing)</h2>
        <ul className="text-sm text-foreground-muted space-y-2 list-disc pl-6">
          <li>Section, SectionHeader</li>
          <li>Hero (centered, split, minimal + Product/Dashboard/Video variants)</li>
          <li>Cta, CtaGroup, CtaBanner, CtaWithProof, FinalCta</li>
          <li>FeatureCard, FeatureGrid, FeatureList, FeatureSplit</li>
          <li>BenefitList, IconList</li>
          <li>TestimonialCard, TestimonialGrid, CaseStudyCard, ReviewCard</li>
          <li>UseCaseCard</li>
          <li>LogoCloud, StatsBar, TrustBar</li>
          <li>PricingCard, PricingGrid, PricingToggle, PricingNote, PricingFAQ</li>
          <li>FaqAccordion</li>
          <li>Navbar (+MobileNav)</li>
          <li>Footer, FooterSaaS, FinalCta</li>
          <li>NewsletterForm, SignupForm</li>
          <li>ProductShowcase, Workflow, IntegrationShowcase, ComparisonTable</li>
        </ul>
      </section>
    </div>
  );
}