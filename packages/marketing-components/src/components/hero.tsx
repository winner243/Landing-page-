import * as React from "react";
import { Badge, AvatarGroup, Avatar, MediaFrame, VideoEmbed, cn } from "@landing/ui-core";
import { CtaGroup, type CtaGroupProps } from "./cta";

/** Small announcement pill above the headline. */
function HeroBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Badge variant="brand" className={cn("px-3 py-1 text-xs", className)}>
      {children}
    </Badge>
  );
}

export interface HeroProofProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Real customer/user count — MUST be truthful (see ETHICS.md). */
  count?: number;
  /** Proof sentence, e.g. "Trusted by 2,000+ teams". */
  text?: string;
  /** BCP-47 locale for count formatting — pinned for stable SSR output. */
  locale?: string;
  /** Avatars of real customers (or omit). */
  avatars?: Array<{ src?: string; name: string }>;
  /** Accessible label for the avatar group. */
  avatarsLabel?: string;
}

/**
 * Inline trust signal below hero CTAs (avatars + truthful count).
 * Fabricated counts violate the kit's ethics rules.
 */
function HeroProof({
  count,
  text,
  locale = "en-US",
  avatars,
  avatarsLabel = "Customer avatars",
  className,
  ...props
}: HeroProofProps) {
  const displayText =
    text ?? (count !== undefined ? `Trusted by ${count.toLocaleString(locale)}+ teams` : null);

  if (!displayText && !avatars?.length) return null;

  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      {avatars && avatars.length > 0 && (
        <AvatarGroup max={4} aria-label={avatarsLabel}>
          {avatars.map((a) => (
            <Avatar key={a.name} name={a.name} src={a.src} alt={a.name} size="sm" />
          ))}
        </AvatarGroup>
      )}
      {displayText && (
        <span className="text-sm text-foreground-muted">{displayText}</span>
      )}
    </div>
  );
}

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Layout: "centered" (classic), "split" (content | visual),
   * "minimal" (no visual). Variants share the same content slots.
   */
  variant?: "centered" | "split" | "minimal";
  badge?: React.ReactNode;
  /** Headline — the page's single most important message (≤12 words). */
  headline: React.ReactNode;
  /** Subheadline — expands headline (for whom, how, why now). */
  description?: React.ReactNode;
  ctas?: CtaGroupProps;
  /** Trust signal node — typically <HeroProof …/> (real proof only). */
  proof?: React.ReactNode;
  /**
   * Visual slot — product screenshot, mockup, illustration, video embed…
   * Fully provider-agnostic: pass any node (use MediaFrame/VideoEmbed helpers).
   */
  visual?: React.ReactNode;
  /** Reverses split layout (visual left). */
  visualPosition?: "left" | "right";
}

/**
 * Hero system — first-screen conversion block.
 *
 * Variants: centered | split | minimal. Content slots are identical
 * across variants, so swapping layout never changes copy structure.
 * The visual slot accepts any node — images, videos, live components —
 * keeping Hero vendor-independent (see Phase 1 §9).
 */
function Hero({
  variant = "centered",
  badge,
  headline,
  description,
  ctas,
  proof,
  visual,
  visualPosition = "right",
  className,
  ...props
}: HeroProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-start gap-5",
        variant === "centered" && "items-center text-center",
        variant === "split" ? "lg:items-start lg:text-start" : "",
        variant !== "split" && "mx-auto max-w-3xl",
      )}
    >
      {badge}
      <h1 className="text-4xl font-bold leading-[1.08] text-balance md:text-5xl lg:text-6xl">
        {headline}
      </h1>
      {description && (
        <p className="max-w-[60ch] text-lg text-foreground-muted md:text-xl">
          {description}
        </p>
      )}
      {ctas && <CtaGroup {...ctas} />}
      {proof}
    </div>
  );

  if (variant === "split" && visual) {
    const visualFirst = visualPosition === "left";
    return (
      <section
        className={cn("w-full py-16 md:py-24", className)}
        {...props}
      >
        <div className="mx-auto grid w-full max-w-[var(--lmk-container)] items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          {visualFirst && <div className="order-2 lg:order-1">{visual}</div>}
          <div className={cn(visualFirst ? "order-1 lg:order-2" : "")}>{content}</div>
          {!visualFirst && <div>{visual}</div>}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("w-full py-16 md:py-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[var(--lmk-container)] flex-col items-center gap-12 px-4 md:px-6 lg:px-8">
        {content}
        {variant === "centered" && visual && (
          <div className="w-full max-w-4xl">{visual}</div>
        )}
      </div>
    </section>
  );
}

export interface HeroProductProps extends Omit<HeroProps, "variant" | "visual"> {
  /**
   * Real product screenshot (any node — <ResponsiveImage>, <MediaFrame>…).
   * The variant frames it; it never invents UI that does not exist.
   */
  screenshot: React.ReactNode;
}

/**
 * Hero variant "product" — split layout, screenshot framed like a window.
 * Use for apps whose interface is the main argument.
 */
function HeroProduct({
  screenshot,
  visualPosition = "right",
  ...props
}: HeroProductProps) {
  return (
    <Hero
      variant="split"
      visualPosition={visualPosition}
      visual={<MediaFrame aspect="wide" framed>{screenshot}</MediaFrame>}
      {...props}
    />
  );
}

export interface HeroDashboardProps extends Omit<HeroProps, "variant" | "visual"> {
  /** Dashboard node — real data screens or a clearly-labelled placeholder. */
  dashboard: React.ReactNode;
}

/**
 * Hero variant "dashboard" — centered copy, wide framed visual below.
 * Use when the value is "one place for everything".
 */
function HeroDashboard({ dashboard, ...props }: HeroDashboardProps) {
  return (
    <Hero
      variant="centered"
      visual={<MediaFrame aspect="video" framed>{dashboard}</MediaFrame>}
      {...props}
    />
  );
}

export interface HeroVideoProps extends Omit<HeroProps, "variant" | "visual"> {
  /** Trusted video URL (self-hosted) — embeds pass `embed` instead. */
  src?: string;
  /** Accessible title — required for the player. */
  title: string;
  /** Poster frame shown before playback. */
  poster?: string;
  /** Provider iframe (YouTube/Vimeo…) — replaces `src`. */
  embed?: React.ReactNode;
  /** Muted autoplay — opt-in, muted + playsInline enforced by VideoEmbed. */
  autoplay?: boolean;
}

/**
 * Hero variant "video" — demo/walkthrough beside the copy.
 * Native <video> via `src`; pass `embed` for a provider iframe.
 */
function HeroVideo({
  src,
  title,
  poster,
  embed,
  autoplay = false,
  visualPosition = "right",
  ...props
}: HeroVideoProps) {
  const player = src ? (
    <VideoEmbed src={src} title={title} poster={poster} autoplay={autoplay} />
  ) : (
    embed ?? null
  );

  return (
    <Hero
      variant="split"
      visualPosition={visualPosition}
      visual={<MediaFrame aspect="video" framed>{player}</MediaFrame>}
      {...props}
    />
  );
}

/**
 * Hero variant "minimal" — copy only (no visual). Fastest first screen;
 * use when the headline + CTA already carry the argument.
 */
function HeroMinimal(props: Omit<HeroProps, "variant" | "visual">) {
  return <Hero variant="minimal" {...props} />;
}

export { Hero, HeroBadge, HeroProof, HeroProduct, HeroDashboard, HeroVideo, HeroMinimal };
