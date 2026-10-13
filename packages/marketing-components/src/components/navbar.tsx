"use client";

import * as React from "react";
import { Button, cn, Container, VisuallyHidden } from "@landing/ui-core";
import { Cta, type CtaProps } from "./cta";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand slot — logo + name (any node). */
  brand: React.ReactNode;
  links?: NavLink[];
  /** Primary action — crawlable <a> when href set. */
  cta?: CtaProps;
  /** Sticky behavior: always | on-scroll (shadows after scroll) | static. */
  sticky?: "always" | "on-scroll" | "static";
}

/**
 * Marketing navbar — server component, zero JS in the default (static)
 * mode. Mobile menu is opt-in via `MobileNav` below (hydration island).
 */
function Navbar({
  brand,
  links,
  cta,
  sticky = "always",
  className,
  ...props
}: NavbarProps) {
  return (
    <header
      className={cn(
        "z-sticky w-full border-b border-border-subtle bg-background/90 backdrop-blur",
        sticky !== "static" && "sticky top-0",
        className,
      )}
      {...props}
    >
      <Container>
        <nav
          aria-label="Main"
          className="flex h-16 items-center justify-between gap-6"
        >
          <a
            href="/"
            className="flex items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
          >
            {brand}
          </a>

          {links && links.length > 0 && (
            <ul className="hidden items-center gap-7 lg:flex">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded text-sm font-medium text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="hidden items-center gap-3 lg:flex">
            {cta && <Cta {...cta} size="sm" location="header" />}
          </div>

          <MobileNavToggle links={links} cta={cta} />
        </nav>
      </Container>
    </header>
  );
}

/** Mobile menu — client island with focus management. */
function MobileNavToggle({ links, cta }: Pick<NavbarProps, "links" | "cta">) {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current
      ?.querySelector<HTMLElement>("a, button")
      ?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!links?.length) return null;

  return (
    <div className="lg:hidden">
      <Button
        ref={toggleRef}
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <VisuallyHidden>{open ? "Close menu" : "Open menu"}</VisuallyHidden>
        <svg aria-hidden="true" className="size-5" viewBox="0 0 20 20" fill="currentColor">
          {open ? (
            <path d="M5.3 5.3a1 1 0 011.4 0L10 8.6l3.3-3.3a1 1 0 111.4 1.4L11.4 10l3.3 3.3a1 1 0 01-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 01-1.4-1.4L8.6 10 5.3 6.7a1 1 0 010-1.4z" />
          ) : (
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          )}
        </svg>
      </Button>

      {open && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          className="absolute inset-x-0 top-16 border-b border-border bg-background p-4 shadow-lg"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {cta && (
            <div className="mt-3 border-t border-border-subtle pt-3">
              <Cta {...cta} location="header" className="w-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { Navbar };
