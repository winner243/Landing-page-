"use client";

import * as React from "react";
import { Button, FormField, Input, cn } from "@landing/ui-core";

/**
 * Form destination — a URL or a Server Action (Next.js) passed through
 * from a Server Component. The kit never processes data itself.
 */
export type FormAction = string | ((formData: FormData) => void | Promise<void>);

export interface NewsletterFormProps {
  action?: FormAction;
  method?: "get" | "post";
  /** Field label — visually hidden (placeholder carries the visible hint). */
  label?: string;
  placeholder?: string;
  buttonLabel?: string;
  /** Consent/privacy note — required where consent is (GDPR). */
  consentNote?: React.ReactNode;
  /** Status region — success/error state rendered by the caller. */
  statusMessage?: React.ReactNode;
  className?: string;
}

/**
 * Email capture for newsletter/content funnels. Progressive enhancement:
 * with a string `action` it posts without JS; with a Server Action the
 * parent owns validation and the response (see SignupForm for accounts).
 */
function NewsletterForm({
  action,
  method = "post",
  label = "Email address",
  placeholder = "you@company.com",
  buttonLabel = "Subscribe",
  consentNote,
  statusMessage,
  className,
}: NewsletterFormProps) {
  const id = React.useId();

  return (
    <form
      action={action}
      method={method}
      className={cn("flex w-full max-w-md flex-col gap-2", className)}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <Input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          className="sm:flex-1"
        />
        <Button type="submit" variant="primary">
          {buttonLabel}
        </Button>
      </div>
      {consentNote && (
        <p className="text-xs text-foreground-subtle">{consentNote}</p>
      )}
      {statusMessage && (
        <p role="status" className="text-sm text-foreground-muted">
          {statusMessage}
        </p>
      )}
    </form>
  );
}

export interface SignupField {
  /** Input name — must match what the Server Action reads. */
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "tel";
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  /** Helper text under the field (e.g. password rules). */
  hint?: string;
}

export interface SignupFormProps {
  action?: FormAction;
  method?: "get" | "post";
  /** Fields rendered in order — email first is the convention. */
  fields: SignupField[];
  submitLabel?: string;
  /** Terms + privacy consent line — required for account creation. */
  termsNote?: React.ReactNode;
  /** Link under the form ("Already have an account? Log in"). */
  footerNote?: React.ReactNode;
  /** Server-side error surfaced via useActionState in the parent. */
  errorMessage?: React.ReactNode;
  className?: string;
}

/**
 * Account creation form — labels always visible (never placeholder-only),
 * hint/error wiring via FormField. Ready for a Server Action: pass the
 * imported action as `action` and its state as `errorMessage`.
 */
function SignupForm({
  action,
  method = "post",
  fields,
  submitLabel = "Create account",
  termsNote,
  footerNote,
  errorMessage,
  className,
}: SignupFormProps) {
  const baseId = React.useId();

  return (
    <form
      action={action}
      method={method}
      className={cn("flex w-full flex-col gap-4", className)}
    >
      {errorMessage && (
        <p role="alert" className="rounded-md border border-error px-3 py-2 text-sm text-error-fg">
          {errorMessage}
        </p>
      )}

      {fields.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          htmlFor={`${baseId}-${field.name}`}
          hint={field.hint}
          required={field.required}
        >
          <Input
            name={field.name}
            type={field.type ?? "text"}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
          />
        </FormField>
      ))}

      <Button type="submit" variant="primary" className="w-full">
        {submitLabel}
      </Button>

      {termsNote && <p className="text-xs text-foreground-subtle">{termsNote}</p>}
      {footerNote && (
        <p className="text-center text-sm text-foreground-muted">{footerNote}</p>
      )}
    </form>
  );
}

export { NewsletterForm, SignupForm };
