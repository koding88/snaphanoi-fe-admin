"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerConfirm } from "@/features/auth/api/register-confirm";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";
import { ROUTES } from "@/lib/constants/routes";

export function RegisterConfirmForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [prefilledFromLink, setPrefilledFromLink] = useState(false);
  const [showManualToken, setShowManualToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (tokenFromQuery) {
      setToken(tokenFromQuery);
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
    setFieldError(null);

    if (!token.trim()) {
      setFieldError("Confirmation token is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerConfirm({ token });
      setSuccessMessage(response.message ?? "Registration confirmed successfully.");
    } catch (submissionError) {
      setError(getFriendlyAuthError(submissionError, "registerConfirm"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Confirm registration"
      title="Finish account activation."
      description="If you opened this page from the email link, the confirmation token is already attached and ready to use."
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
        {prefilledFromLink && !showManualToken ? (
          <AuthFeedback variant="info">
            Confirmation link detected. Continue below, or enter a different token manually.
          </AuthFeedback>
        ) : (
          <AuthField label="Confirmation token" htmlFor="confirmation-token" error={fieldError}>
            <Input
              id="confirmation-token"
              name="token"
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
                setFieldError(null);
              }}
              placeholder="Paste your confirmation token"
              aria-invalid={Boolean(fieldError)}
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
          <AuthField label="Different confirmation token" htmlFor="confirmation-token-manual" error={fieldError}>
            <Input
              id="confirmation-token-manual"
              name="token-manual"
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
                setFieldError(null);
              }}
              placeholder="Paste your confirmation token"
              aria-invalid={Boolean(fieldError)}
            />
          </AuthField>
        ) : null}
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Activating..." : "Activate account"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
