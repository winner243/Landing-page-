import {
  benefitSchema,
  ctaActionSchema,
  faqItemSchema,
  featureSchema,
  footerColumnSchema,
  footerSchema,
  heroContentSchema,
  landingContentSchema,
  logoCloudSchema,
  navbarSchema,
  navLinkSchema,
  pricingPlanSchema,
  sectionHeaderSchema,
  statsItemSchema,
  testimonialSchema,
  trustBarSchema,
} from "./schemas.ts";
import type { z } from "zod";

/**
 * Content guidance derived *from* the Zod schemas (Roadmap 3.1):
 * lengths, required flags and allowed values are read out of the schema
 * definitions at runtime, so docs/CONTENT-GUIDANCE.md can never drift
 * from the code — it is regenerated with `pnpm guidance` and checked by
 * tests/copywriting-guidance.test.ts.
 */

/* ------------------------------------------------------------------ */
/* Minimal structural view of Zod v3 internals (no `any`)              */
/* ------------------------------------------------------------------ */

interface ZodCheck {
  /** Zod 3 uses `kind` for string/number checks (some paths use `code`). */
  kind?: string;
  code?: string;
  value?: number;
}

interface ZodDef {
  typeName?: string;
  description?: string;
  value?: string | number;
  checks?: ZodCheck[];
  schema?: ZodNode;
  innerType?: ZodNode;
  type?: ZodNode;
  shape?: () => Record<string, ZodNode>;
  options?: ZodNode[];
  values?: string[];
  minLength?: { value: number } | null;
  maxLength?: { value: number } | null;
}

interface ZodNode {
  _def: ZodDef;
}

function typeName(node: ZodNode): string {
  return node._def.typeName ?? "unknown";
}

/* ------------------------------------------------------------------ */
/* Public shape                                                        */
/* ------------------------------------------------------------------ */

export interface FieldGuidance {
  /** Dotted path, e.g. `primaryCta.label` or `author.name` (arrays use `[]`). */
  path: string;
  type: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  minWords?: number;
  maxWords?: number;
  minItems?: number;
  maxItems?: number;
  values?: string[];
  note?: string;
}

export interface SchemaGuidance {
  schema: string;
  fields: FieldGuidance[];
}

/** Top-level schemas documented, with the depth used when flattening. */
const DOCUMENTED: Array<{ name: string; schema: z.ZodTypeAny; maxDepth: number }> = [
  { name: "heroContentSchema", schema: heroContentSchema, maxDepth: 3 },
  { name: "testimonialSchema", schema: testimonialSchema, maxDepth: 3 },
  { name: "featureSchema", schema: featureSchema, maxDepth: 3 },
  { name: "pricingPlanSchema", schema: pricingPlanSchema, maxDepth: 3 },
  { name: "faqItemSchema", schema: faqItemSchema, maxDepth: 3 },
  { name: "statsItemSchema", schema: statsItemSchema, maxDepth: 3 },
  { name: "sectionHeaderSchema", schema: sectionHeaderSchema, maxDepth: 3 },
  { name: "ctaActionSchema", schema: ctaActionSchema, maxDepth: 3 },
  { name: "navLinkSchema", schema: navLinkSchema, maxDepth: 3 },
  { name: "navbarSchema", schema: navbarSchema, maxDepth: 3 },
  { name: "logoCloudSchema", schema: logoCloudSchema, maxDepth: 3 },
  { name: "trustBarSchema", schema: trustBarSchema, maxDepth: 3 },
  { name: "benefitSchema", schema: benefitSchema, maxDepth: 3 },
  { name: "footerColumnSchema", schema: footerColumnSchema, maxDepth: 3 },
  { name: "footerSchema", schema: footerSchema, maxDepth: 3 },
  // Page bundle: one level only — each section schema is documented above.
  { name: "landingContentSchema", schema: landingContentSchema, maxDepth: 1 },
];

/* ------------------------------------------------------------------ */
/* Flattening                                                          */
/* ------------------------------------------------------------------ */

interface Unwrapped {
  node: ZodNode;
  required: boolean;
  maxWords?: number;
  note?: string;
}

function checkKind(check: ZodCheck): string | undefined {
  return check.kind ?? check.code;
}

function unwrap(node: ZodNode, required: boolean): Unwrapped {
  let current = node;
  let req = required;
  const notes: string[] = [];

  for (;;) {
    const t = typeName(current);
    const description = current._def.description;
    if (description && !notes.includes(description)) notes.push(description);

    if (t === "ZodOptional" || t === "ZodNullable" || t === "ZodDefault") {
      req = false;
      current = current._def.innerType ?? current;
      continue;
    }
    if (t === "ZodEffects") {
      current = current._def.schema ?? current;
      continue;
    }
    break;
  }

  // `.describe("≤ N words")` on a MaxWords() schema → numeric limit.
  let note: string | undefined = notes.join("; ") || undefined;
  let maxWords: number | undefined;
  const words = note?.match(/≤ (\d+) words/);
  if (words?.[1]) {
    maxWords = Number(words[1]);
    const rest = note
      ?.replace(/≤ \d+ words;? ?/g, "")
      .replace(/;\s*$/, "")
      .trim();
    note = rest === "" ? undefined : rest;
  }

  return { node: current, required: req, maxWords, note };
}

function baseType(node: ZodNode): string {
  switch (typeName(node)) {
    case "ZodString":
      return "string";
    case "ZodNumber":
      return "number";
    case "ZodBoolean":
      return "boolean";
    case "ZodDate":
      return "date";
    case "ZodEnum":
      return "enum";
    case "ZodLiteral":
      return "literal";
    case "ZodUnknown":
    case "ZodAny":
      return "unknown";
    default:
      return typeName(node).replace(/^Zod/, "").toLowerCase();
  }
}

function collect(
  node: ZodNode,
  prefix: string,
  depth: number,
  maxDepth: number,
  required: boolean,
  out: FieldGuidance[],
): void {
  const { node: inner, required: req, maxWords, note } = unwrap(node, required);
  const t = typeName(inner);

  // Containers ------------------------------------------------------
  if (t === "ZodObject") {
    if (depth >= maxDepth) {
      out.push({ path: prefix, type: "object", required: req, note });
      return;
    }
    const shape = inner._def.shape?.() ?? {};
    for (const [key, child] of Object.entries(shape)) {
      collect(
        child,
        prefix ? `${prefix}.${key}` : key,
        depth + 1,
        maxDepth,
        true,
        out,
      );
    }
    return;
  }

  if (t === "ZodArray") {
    const element = inner._def.type;
    const field: FieldGuidance = {
      path: prefix,
      type: `array<${element ? baseType(element) : "unknown"}>`,
      required: req,
      minItems: inner._def.minLength?.value,
      maxItems: inner._def.maxLength?.value,
      note,
    };
    out.push(field);
    if (element && depth < maxDepth) {
      collect(element, `${prefix}[]`, depth + 1, maxDepth, true, out);
    }
    return;
  }

  // Leaves ----------------------------------------------------------
  const noteParts: string[] = note ? [note] : [];
  const field: FieldGuidance = {
    path: prefix,
    type: baseType(inner),
    required: req,
  };

  if (maxWords !== undefined) field.maxWords = maxWords;

  if (t === "ZodEnum") {
    field.values = inner._def.values;
  } else if (t === "ZodUnion") {
    const literals = (inner._def.options ?? [])
      .filter((option) => typeName(option) === "ZodLiteral")
      .map((option) => String(option._def.value));
    if (literals.length > 0) field.values = literals;
  }

  if (t === "ZodString") {
    for (const check of inner._def.checks ?? []) {
      const kind = checkKind(check);
      if (kind === "min" && check.value !== undefined) {
        field.minLength = check.value;
      }
      if (kind === "max" && check.value !== undefined) {
        field.maxLength = check.value;
      }
    }
  }

  if (t === "ZodNumber") {
    for (const check of inner._def.checks ?? []) {
      const kind = checkKind(check);
      if (kind === "min" && check.value !== undefined) {
        noteParts.push(`≥ ${check.value}`);
      }
      if (kind === "max" && check.value !== undefined) {
        noteParts.push(`≤ ${check.value}`);
      }
    }
  }

  if (noteParts.length > 0) field.note = noteParts.join("; ");

  out.push(field);
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Reads every documented schema and returns flattened field guidance. */
export function getContentGuidance(): SchemaGuidance[] {
  return DOCUMENTED.map(({ name, schema, maxDepth }) => {
    const fields: FieldGuidance[] = [];
    collect(schema as unknown as ZodNode, "", 0, maxDepth, true, fields);
    return { schema: name, fields };
  });
}

function limits(field: FieldGuidance): string {
  const parts: string[] = [];
  if (field.minWords !== undefined) parts.push(`≥ ${field.minWords} words`);
  if (field.maxWords !== undefined) parts.push(`≤ ${field.maxWords} words`);
  if (field.minLength !== undefined) parts.push(`≥ ${field.minLength} chars`);
  if (field.maxLength !== undefined) parts.push(`≤ ${field.maxLength} chars`);
  if (field.minItems !== undefined) parts.push(`≥ ${field.minItems} items`);
  if (field.maxItems !== undefined) parts.push(`≤ ${field.maxItems} items`);
  if (field.values && field.values.length > 0) parts.push(field.values.join(" | "));
  return parts.length > 0 ? parts.join(", ") : "—";
}

/** Renders the guidance as Markdown (docs/CONTENT-GUIDANCE.md). */
export function renderGuidanceMarkdown(
  guidance: SchemaGuidance[] = getContentGuidance(),
): string {
  const lines: string[] = [
    "# Content Guidance",
    "",
    "<!-- AUTO-GENERATED by `pnpm guidance` from packages/copywriting/src — do not edit by hand. -->",
    "",
    "Length limits, required flags and allowed values below are read directly",
    "from the Zod schemas. Invalid content is rejected at the boundary",
    "(`parseLandingContent`), so copy that violates these rules never renders.",
    "",
  ];

  for (const entry of guidance) {
    lines.push(`## \`${entry.schema}\``, "");
    lines.push("| Field | Type | Required | Limits | Notes |");
    lines.push("|-------|------|----------|--------|-------|");
    for (const field of entry.fields) {
      lines.push(
        `| \`${field.path}\` | ${field.type} | ${field.required ? "yes" : "no"} | ${limits(field)} | ${field.note ?? "—"} |`,
      );
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}
