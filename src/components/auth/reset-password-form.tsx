"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthPasswordHint } from "@/components/auth/auth-password-hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword } from "@/features/auth/api/reset-password";
import { clearClientSession } from "@/features/auth/utils/auth-storage";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";
import { isStrongPassword } from "@/features/auth/utils/password-policy";
import { ROUTES } from "@/lib/constants/routes";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    token: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [prefilledFromLink, setPrefilledFromLink] = useState(false);
  const [showManualToken, setShowManualToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    token?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (tokenFromQuery) {
      setForm((current) => ({ ...current, token: tokenFromQuery }));
      setPrefilledFromLink(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.replace(ROUTES.login);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [router, successMessage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    const nextFieldErrors: {
      token?: string;
      newPassword?: string;
      confirmNewPassword?: string;
    } = {};

    if (!form.token.trim()) {
      nextFieldErrors.token = "Reset token is required.";
    }

    if (!form.newPassword) {
      nextFieldErrors.newPassword = "New password is required.";
    } else if (!isStrongPassword(form.newPassword)) {
      nextFieldErrors.newPassword =
        "New password must be at least 8 characters and include uppercase, lowercase, and a number.";
    }

    if (!form.confirmNewPassword) {
      nextFieldErrors.confirmNewPassword = "Password confirmation is required.";
    } else if (form.newPassword !== form.confirmNewPassword) {
      nextFieldErrors.confirmNewPassword = "Password confirmation does not match.";
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword(form);
      clearClientSession();
      setSuccessMessage(response.message ?? "Password reset successfully.");
    } catch (submissionError) {
      setError(getFriendlyAuthError(submissionError, "resetPassword"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Reset password"
      title="Choose a new password."
      description="If you opened this page from the email link, the reset token is already attached. After success, you will sign in again with the new password."
      footer={
        <div className="text-sm text-white/65">
          <Link href="/login" className="transition-opacity hover:opacity-100">
            Back to login
          </Link>
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {successMessage ? <AuthFeedback variant="success">{successMessage}</AuthFeedback> : null}
        {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
        {prefilledFromLink && !showManualToken ? (
          <AuthFeedback variant="info">
            Reset link detected. Continue below, or switch to manual token entry if needed.
          </AuthFeedback>
        ) : (
          <AuthField label="Reset token" htmlFor="reset-token" error={fieldErrors.token ?? null}>
            <Input
              id="reset-token"
              name="token"
              value={form.token}
              onChange={(event) => {
                setForm((current) => ({ ...current, token: event.target.value }));
                setFieldErrors((current) => ({ ...current, token: undefined }));
              }}
              placeholder="Paste your reset token"
              aria-invalid={Boolean(fieldErrors.token)}
            />
          </AuthField>
        )}
        {prefilledFromLink ? (
          <button
            type="button"
            onClick={() => setShowManualToken((current) => !current)}
            className="text-sm text-white/76 transition hover:text-white"
          >
            {showManualToken ? "Use the token from the email link" : "Use a different token instead"}
          </button>
        ) : null}
        {prefilledFromLink && showManualToken ? (
          <AuthField label="Different reset token" htmlFor="reset-token-manual" error={fieldErrors.token ?? null}>
            <Input
              id="reset-token-manual"
              name="token-manual"
              value={form.token}
              onChange={(event) => {
                setForm((current) => ({ ...current, token: event.target.value }));
                setFieldErrors((current) => ({ ...current, token: undefined }));
              }}
              placeholder="Paste your reset token"
              aria-invalid={Boolean(fieldErrors.token)}
            />
          </AuthField>
        ) : null}
        <AuthField label="New password" htmlFor="new-password" error={fieldErrors.newPassword ?? null}>
          <PasswordInput
            id="new-password"
            name="newPassword"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(event) =>
              {
                setForm((current) => ({ ...current, newPassword: event.target.value }));
                setFieldErrors((current) => ({ ...current, newPassword: undefined }));
              }
            }
            placeholder="NewPassword123A"
            aria-invalid={Boolean(fieldErrors.newPassword)}
          />
          <AuthPasswordHint />
        </AuthField>
        <AuthField label="Confirm new password" htmlFor="confirm-new-password" error={fieldErrors.confirmNewPassword ?? null}>
          <PasswordInput
            id="confirm-new-password"
            name="confirmNewPassword"
            autoComplete="new-password"
            value={form.confirmNewPassword}
            onChange={(event) =>
              {
                setForm((current) => ({
                  ...current,
                  confirmNewPassword: event.target.value,
                }));
                setFieldErrors((current) => ({ ...current, confirmNewPassword: undefined }));
              }
            }
            placeholder="NewPassword123A"
            aria-invalid={Boolean(fieldErrors.confirmNewPassword)}
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Save new password"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
