"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerConfirm } from "@/features/auth/api/register-confirm";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";

export function RegisterConfirmForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (tokenFromQuery) {
      setToken(tokenFromQuery);
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await registerConfirm({ token });
      setSuccess(true);
    } catch (submissionError) {
      setError(getFriendlyAuthError(submissionError, "registerConfirm"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Confirm registration"
      title="Activate the account from the email token."
      description="This step creates the real account. It does not sign the user in automatically, so the next action after success is still login."
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
            Registration confirmed. The account is now created. Continue to login with the registered credentials.
          </AuthFeedback>
        ) : null}
        {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
        <AuthField label="Confirmation token" htmlFor="confirmation-token">
          <Input
            id="confirmation-token"
            name="token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="raw-registration-token"
            required
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Confirming..." : "Confirm registration"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
