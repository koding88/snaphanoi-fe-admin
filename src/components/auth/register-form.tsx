"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthPasswordHint } from "@/components/auth/auth-password-hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/features/auth/api/register";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";
import { isStrongPassword } from "@/features/auth/utils/password-policy";

const COUNTRY_OPTIONS = ["VN", "SG", "US", "JP", "KR"];

export function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    countryCode: "VN",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isStrongPassword(form.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await register(form);
      setSuccess(true);
    } catch (submissionError) {
      setError(getFriendlyAuthError(submissionError, "register"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Register"
      title="Request a new admin registration."
      description="Registration is a two-step flow. Submitting this form only creates a pending registration request and sends a confirmation email."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/65">
          <span>Registration does not create a usable account immediately.</span>
          <Link href="/login" className="transition-opacity hover:opacity-100">
            Back to login
          </Link>
        </div>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {success ? (
          <AuthFeedback variant="success">
            Registration requested. Check your email for the confirmation token, then continue on the confirm page.
          </AuthFeedback>
        ) : null}
        {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
        <AuthField label="Full name" htmlFor="name">
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Nguyen Van C"
            required
          />
        </AuthField>
        <AuthField label="Email" htmlFor="register-email">
          <Input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="newuser@gmail.com"
            required
          />
        </AuthField>
        <AuthField label="Password" htmlFor="register-password">
          <Input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Password123A"
            required
          />
          <AuthPasswordHint />
        </AuthField>
        <AuthField label="Country code" htmlFor="countryCode" hint="ISO alpha-2">
          <select
            id="countryCode"
            name="countryCode"
            value={form.countryCode}
            onChange={(event) =>
              setForm((current) => ({ ...current, countryCode: event.target.value }))
            }
            className="flex h-12 w-full rounded-2xl border border-border/80 bg-background/92 px-4 text-sm text-foreground outline-none transition-colors focus:border-[--color-brand]/40 focus:ring-3 focus:ring-[--color-brand]/12"
          >
            {COUNTRY_OPTIONS.map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {countryCode}
              </option>
            ))}
          </select>
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Request registration"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
