import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Landing Marketing Kit — Documentation",
  description: "Domain-agnostic foundation for SaaS and digital product landing pages.",
};

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/installation", label: "Installation" },
  { href: "/architecture", label: "Architecture" },
  { href: "/components", label: "Composants" },
  { href: "/patterns", label: "Patterns" },
  { href: "/templates", label: "Templates" },
  { href: "/analytics", label: "Analytics" },
  { href: "/experimentation", label: "A/B Testing" },
  { href: "/seo", label: "SEO" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-background text-foreground antialiased">
        <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-accent">
                LMK Docs
              </Link>
              <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-foreground-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-border bg-muted py-8 mt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-foreground-subtle text-center">
              Landing Marketing Kit — Internal use only. Proprietary foundation for SaaS products.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}