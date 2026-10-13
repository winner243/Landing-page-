"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  /** Initials fallback when no src or image fails to load. */
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-12 text-base" };

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/**
 * User avatar with initials fallback.
 * When used as proof (testimonials), alt text should identify the person.
 */
function Avatar({ className, src, alt, name, size = "md", ...props }: AvatarProps) {
  const [failed, setFailed] = React.useState(false);
  const initials = name ? getInitials(name) : "?";

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-foreground-muted",
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden={alt ? undefined : "true"}>{initials}</span>
      )}
    </span>
  );
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max avatars rendered before "+N" overflow indicator. */
  max?: number;
  children: React.ReactNode;
}

/** Overlapping avatar stack — typically paired with a social-proof count. */
function AvatarGroup({ className, max = 4, children, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  return (
    <div
      className={cn("flex items-center -space-x-2", className)}
      {...props}
    >
      {visible}
      {overflow > 0 && (
        <span
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-foreground-muted",
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup };
