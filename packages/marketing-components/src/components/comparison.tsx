import * as React from "react";
import { cn } from "@landing/ui-core";
import { Cta } from "./cta";
import { Section, SectionHeader } from "./section";

export interface ComparisonColumn {
  /** Column heading — plan, product or alternative. */
  name: string;
  /** Emphasise your own column (subtle tint + stronger CTA). */
  highlighted?: boolean;
  /** Optional action rendered in the table footer. */
  cta?: { label: string; href?: string; trackId: string };
}

export interface ComparisonRow {
  /** Opens a group heading when it differs from the previous row. */
  group?: string;
  /** Row label — rendered as the row header (scope="row"). */
  label: string;
  /** One cell per column: text, true (included) or false (not). */
  values: Array<string | boolean>;
}

export interface ComparisonTableProps {
  header?: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
  };
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  /** Accessible table caption — defaults to the header title. */
  caption?: React.ReactNode;
  /** Sources, limits or plan footnotes — shown under the table. */
  footnote?: React.ReactNode;
  className?: string;
}

function comparisonCell(value: string | boolean) {
  if (value === true) {
    return (
      <span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="mx-auto size-4 text-success"
        >
          <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span>
        <span aria-hidden="true" className="text-foreground-subtle">
          –
        </span>
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  return <span className="text-foreground-muted">{value}</span>;
}

/**
 * Feature × column matrix — plan or alternative comparison
 * (CONVERSION.md: solution comparison + objection handling).
 * Icons always carry sr-only text, and differences must be truthful
 * (ETHICS.md §4): never mark a capability as included when it is not.
 */
function ComparisonTable({
  header,
  columns,
  rows,
  caption,
  footnote,
  className,
}: ComparisonTableProps) {
  const hasCtas = columns.some((column) => column.cta !== undefined);

  return (
    <Section className={className}>
      {header && (
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <caption className="sr-only">{caption ?? header?.title}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="w-1/3 px-4 py-3 text-left">
                <span className="sr-only">Feature</span>
              </th>
              {columns.map((column) => (
                <th
                  key={column.name}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-center text-base font-semibold text-foreground",
                    column.highlighted && "bg-accent/5",
                  )}
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const opensGroup =
                row.group !== undefined && row.group !== rows[index - 1]?.group;

              return (
                <React.Fragment key={`${row.label}-${index}`}>
                  {opensGroup && (
                    <tr>
                      <th
                        scope="colgroup"
                        colSpan={columns.length + 1}
                        className="bg-muted px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-foreground-muted"
                      >
                        {row.group}
                      </th>
                    </tr>
                  )}
                  <tr className="border-b border-border">
                    <th
                      scope="row"
                      className="px-4 py-3 text-left font-medium text-foreground"
                    >
                      {row.label}
                    </th>
                    {columns.map((column, columnIndex) => (
                      <td
                        key={column.name}
                        className={cn(
                          "px-4 py-3 text-center",
                          column.highlighted && "bg-accent/5",
                        )}
                      >
                        {row.values[columnIndex] !== undefined
                          ? comparisonCell(row.values[columnIndex])
                          : null}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>

          {hasCtas && (
            <tfoot>
              <tr>
                <td />
                {columns.map((column) => (
                  <td key={column.name} className="px-4 py-4 text-center">
                    {column.cta && (
                      <Cta
                        action={column.cta}
                        variant={column.highlighted ? "primary" : "secondary"}
                        location="section"
                      />
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {footnote && <p className="mt-4 text-xs text-foreground-subtle">{footnote}</p>}
    </Section>
  );
}

export { ComparisonTable };
