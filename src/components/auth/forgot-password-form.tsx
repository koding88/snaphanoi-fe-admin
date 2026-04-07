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
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setFieldError(null);

    if (!email.trim()) {
      setFieldError("Email is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setFieldError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await forgotPassword({ email });
      setSuccessMessage(
        response.message ?? "If the account exists, a password reset email has been sent.",
      );
    } catch (submissionError) {
      setError(getFriendlyAuthError(submissionError, "forgotPassword"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Forgot password"
      title="Request a fresh password link."
      description="If the email belongs to an account, we will send a reset link without revealing any account details on this screen."
      footer={
        <div className="text-sm text-white/65">
          <Link href="/login" className="transition-opacity hover:opacity-100">
            Return to login
          </Link>
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {successMessage ? <AuthFeedback variant="success">{successMessage}</AuthFeedback> : null}
        {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
        <AuthField label="Email" htmlFor="forgot-email" error={fieldError}>
          <Input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFieldError(null);
            }}
            placeholder="user@gmail.com"
            aria-invalid={Boolean(fieldError)}
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
