"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthPasswordHint } from "@/components/auth/auth-password-hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/features/auth/api/reset-password";
import { clearClientSession } from "@/features/auth/utils/auth-storage";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";
import { isStrongPassword } from "@/features/auth/utils/password-policy";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    token: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (tokenFromQuery) {
      setForm((current) => ({ ...current, token: tokenFromQuery }));
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!isStrongPassword(form.newPassword)) {
      setError(
        "New password must be at least 8 characters and include uppercase, lowercase, and a number.",
      );
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(form);
      clearClientSession();
      setSuccess(true);
    } catch (submissionError) {
      setError(getFriendlyAuthError(submissionError, "resetPassword"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Reset password"
      title="Set a new password with the email token."
      description="On success the previous auth state is considered invalid. The correct next step is to sign in again with the new password."
      footer={
        <div className="text-sm text-white/65">
          <Link href="/login" className="transition-opacity hover:opacity-100">
            Back to login
          </Link>
        </div>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {success ? (
          <AuthFeedback variant="success">
            Password reset succeeded. Old sessions should be considered invalid. Continue to login with the new password.
          </AuthFeedback>
        ) : null}
        {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
        <AuthField label="Reset token" htmlFor="reset-token">
          <Input
            id="reset-token"
            name="token"
            value={form.token}
            onChange={(event) => setForm((current) => ({ ...current, token: event.target.value }))}
            placeholder="raw-reset-token"
            required
          />
        </AuthField>
        <AuthField label="New password" htmlFor="new-password">
          <Input
            id="new-password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(event) =>
              setForm((current) => ({ ...current, newPassword: event.target.value }))
            }
            placeholder="NewPassword123A"
            required
          />
          <AuthPasswordHint />
        </AuthField>
        <AuthField label="Confirm new password" htmlFor="confirm-new-password">
          <Input
            id="confirm-new-password"
            name="confirmNewPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmNewPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                confirmNewPassword: event.target.value,
              }))
            }
            placeholder="NewPassword123A"
            required
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
