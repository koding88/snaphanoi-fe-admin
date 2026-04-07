"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/features/auth/api/forgot-password";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (submissionError) {
      setError(getFriendlyAuthError(submissionError, "forgotPassword"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Forgot password"
      title="Request a password reset link."
      description="The backend intentionally returns a generic success response and does not reveal whether the account exists."
      footer={
        <div className="text-sm text-white/65">
          <Link href="/login" className="transition-opacity hover:opacity-100">
            Return to login
          </Link>
        </div>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {success ? (
          <AuthFeedback variant="success">
            If an account exists for that email, a password reset email has been sent.
          </AuthFeedback>
        ) : null}
        {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
        <AuthField label="Email" htmlFor="forgot-email">
          <Input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@gmail.com"
            required
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Request reset"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
