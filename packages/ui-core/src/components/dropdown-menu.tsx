"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface DropdownMenuItem {
  id: string;
  label: React.ReactNode;
  /** Renders as a crawlable <a> when set (no JS required to navigate). */
  href?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  /** Trigger content — the component renders the <button> itself for correct a11y wiring. */
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  /** Accessible name of the menu (aria-label). */
  label: string;
  align?: "start" | "end";
  className?: string;
}

/**
 * Menu button (WAI-ARIA Menu Button pattern): `aria-haspopup`/`aria-expanded`
 * on the trigger, `role="menu"` + `role="menuitem"` items, Arrow/Home/End
 * navigation, Escape closes and restores focus, outside click dismisses.
 */
function DropdownMenu({
  trigger,
  items,
  label,
  align = "start",
  className,
}: DropdownMenuProps) {
  const menuId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  const focusItem = React.useCallback((index: number) => {
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ) ?? [],
    );
    if (menuItems.length === 0) return;
    const bounded = (index + menuItems.length) % menuItems.length;
    menuItems[bounded]?.focus();
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(event.key === "ArrowDown" ? 0 : -1));
    }
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ) ?? [],
    );
    if (menuItems.length === 0) return;
    const currentIndex = menuItems.findIndex(
      (item) => item === document.activeElement,
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(currentIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(currentIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(-1);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const activate = (item: DropdownMenuItem) => {
    setOpen(false);
    item.onSelect?.();
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={onTriggerKeyDown}
        className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]"
      >
        {trigger}
        <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className={cn(
            "absolute z-dropdown mt-2 min-w-48 rounded-lg border border-border bg-background p-1 shadow-lg",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item) => {
            const classes = cn(
              "my-0.5 flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-foreground",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lmk-focus-ring)]",
              item.disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-muted focus:bg-muted",
            );
            if (item.href) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  role="menuitem"
                  className={classes}
                  onClick={() => activate(item)}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                aria-disabled={item.disabled || undefined}
                disabled={item.disabled}
                onClick={() => activate(item)}
                className={classes}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { DropdownMenu };
