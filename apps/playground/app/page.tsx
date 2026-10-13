import Link from "next/link";
import type { Metadata } from "next";
import { Container, Heading, Text, Stack, Badge, Button } from "@landing/ui-core";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

const pages = [
  {
    href: "/showcase",
    title: "Component showcase",
    description: "Every primitive and marketing component, one screen.",
  },
  {
    href: "/landing",
    title: "Composed landing",
    description: "Full conversion page rendered by LandingComposer.",
  },
  {
    href: "/themes",
    title: "Brand themes",
    description: "Built-in theme overrides on the same page structure.",
  },
];

export default function IndexPage() {
  return (
    <main className="py-16">
      <Container>
        <Stack gap={10}>
          <Stack gap={3}>
            <Badge variant="brand">Playground</Badge>
            <Heading level="h1">Landing Marketing Kit</Heading>
            <Text size="lg" tone="muted">
              Visual and accessibility playground for every kit package.
            </Text>
          </Stack>

          <ul className="grid gap-4 sm:grid-cols-3">
            {pages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="block h-full rounded-lg border border-border bg-background-surface p-6 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  <Heading level="h2" className="mb-2">
                    {page.title}
                  </Heading>
                  <Text size="sm" tone="muted">
                    {page.description}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>

          <Stack direction="horizontal" gap={3}>
            <Link href="/showcase">
              <Button variant="primary">Browse components</Button>
            </Link>
            <Link href="/landing">
              <Button variant="outline">View full landing</Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </main>
  );
}
