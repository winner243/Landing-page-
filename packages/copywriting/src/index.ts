import type { z } from "zod";
import { landingContentSchema } from "./schemas.ts";
import type { LandingContent } from "./schemas.ts";

export * from "./schemas.ts";
export * from "./guidance.ts";
export * from "./examples.ts";
export * from "./templates.ts";

/**
 * Validates a content bundle; throws with precise paths on failure.
 * Call at build time (template assembly) — never trust raw CMS output.
 */
export function parseLandingContent(input: unknown): LandingContent {
  return landingContentSchema.parse(input);
}

/** Non-throwing variant for form/CMS validation. */
export function safeParseLandingContent(input: unknown) {
  return landingContentSchema.safeParse(input);
}

/** `["hero.headline: Must be ≤ 12 words", …]` — for logs and error UIs. */
export function formatZodIssues(error: z.ZodError): string[] {
  return error.issues.map(
    (issue) =>
      `${issue.path.length > 0 ? issue.path.join(".") : "(root)"}: ${issue.message}`,
  );
}

/** Generic boundary validator for any schema in this package. */
export function parseOrThrow<T>(
  schema: z.ZodType<T>,
  input: unknown,
  label = "content",
): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `Invalid ${label}:\n${formatZodIssues(result.error).join("\n")}`,
    );
  }
  return result.data;
}

/** Result-shaped validation for build pipelines and CMS previews. */
export type ValidationResult =
  | { ok: true; data: LandingContent }
  | { ok: false; errors: string[] };

export function validateContent(input: unknown): ValidationResult {
  const result = landingContentSchema.safeParse(input);
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: formatZodIssues(result.error) };
}
