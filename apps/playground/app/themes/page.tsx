import type { Metadata } from "next";
import { Container, Heading, Stack, Button, Badge, Text, Card, CardContent } from "@landing/ui-core";
import { builtInThemes, themeToStyleTag, type BrandTheme } from "@landing/themes";

export const metadata: Metadata = { title: "Brand themes" };

function ThemePreview({ theme }: { theme: BrandTheme }) {
  return (
    <Card>
      <CardContent>
        <Stack gap={5}>
          <Stack direction="horizontal" gap={2}>
            <Badge variant="brand">{theme.name}</Badge>
            <Text size="sm" tone="muted">
              {theme.label}
            </Text>
          </Stack>
          <Heading level="h3">This page in your brand</Heading>
          <Text size="sm" tone="muted">
            Same components, new semantic tokens. Interactive elements follow the brand color
            automatically.
          </Text>
          <Stack direction="horizontal" gap={3}>
            <Button variant="primary">Primary action</Button>
            <Button variant="outline">Secondary</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ThemesPage() {
  return (
    <main className="py-16">
      <Container>
        <Stack gap={8}>
          <Stack gap={3}>
            <Badge variant="brand">Themes</Badge>
            <Heading level="h1">Built-in brand themes</Heading>
            <Text size="lg" tone="muted">
              Each theme overrides only semantic CSS variables — components stay untouched.
            </Text>
          </Stack>

          <div className="grid gap-6 lg:grid-cols-3">
            {builtInThemes.map((theme) => (
              <div key={theme.name} className={`theme-${theme.name}`}>
                <style dangerouslySetInnerHTML={{ __html: themeToStyleTag(theme) }} />
                <ThemePreview theme={theme} />
              </div>
            ))}
          </div>
        </Stack>
      </Container>
    </main>
  );
}
