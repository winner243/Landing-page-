import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Landing Marketing Kit — Playground",
    template: "%s — LMK Playground",
  },
  description:
    "Visual playground for the Landing Marketing Kit: design tokens, UI primitives, marketing components and conversion patterns.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background font-body text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
