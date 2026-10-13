import * as React from "react";
import { cn } from "../lib/utils";

export interface MediaFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio — matches common media shapes. */
  aspect?: "video" | "wide" | "square" | "portrait" | "auto";
  /** Renders rounded corners + border (product screenshot treatment). */
  framed?: boolean;
  children: React.ReactNode;
}

const aspectMap = {
  video: "aspect-video",
  wide: "aspect-[16/10]",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  auto: "",
} as const;

/**
 * Responsive media container — locks aspect ratio to prevent layout shift
 * (CLS) and standardizes framing for screenshots/videos/illustrations.
 */
function MediaFrame({
  className,
  aspect = "video",
  framed = false,
  children,
  ...props
}: MediaFrameProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        aspectMap[aspect],
        framed && "rounded-lg border border-border shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ResponsiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Required for content images (decorative: pass alt=""). */
  alt: string;
}

/**
 * Image with performance defaults: lazy, async decode, explicit sizing.
 * Provide width/height (or use inside MediaFrame) to avoid CLS.
 */
function ResponsiveImage({
  className,
  loading = "lazy",
  decoding = "async",
  alt,
  ...props
}: ResponsiveImageProps) {
  return (
    <img
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  );
}

export interface VideoEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Trusted video URL (self-hosted or embed provider). */
  src: string;
  /** Accessible title — required for embedded content. */
  title: string;
  /** Poster image URL shown before playback. */
  poster?: string;
  /** Provider-owned autoplay is opt-in; muted + playsInline enforced. */
  autoplay?: boolean;
}

/**
 * Provider-agnostic video: accepts any URL. Uses native <video> for
 * direct sources; consumers embedding YouTube/Vimeo pass their iframe
 * as children instead (the component stays vendor-neutral).
 */
function VideoEmbed({
  className,
  src,
  title,
  poster,
  autoplay = false,
  ...props
}: VideoEmbedProps) {
  return (
    <div className={cn("relative h-full w-full", className)} {...props}>
      <video
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        controls
        muted={autoplay}
        playsInline
        preload="metadata"
        aria-label={title}
        {...(autoplay ? { autoPlay: true } : {})}
      />
    </div>
  );
}

export { MediaFrame, ResponsiveImage, VideoEmbed };
