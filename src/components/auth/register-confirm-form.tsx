"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerConfirm } from "@/features/auth/api/register-confirm";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";
import { ROUTES } from "@/lib/constants/routes";
import { notifyError, notifySuccess } from "@/lib/toast";

export function RegisterConfirmForm() {
  const t = useTranslations("auth.registerConfirm");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [prefilledFromLink, setPrefilledFromLink] = useState(false);
  const [showManualToken, setShowManualToken] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [didConfirm, setDidConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (tokenFromQuery) {
      setToken(tokenFromQuery);
      setPrefilledFromLink(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!didConfirm) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.replace(ROUTES.login);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [didConfirm, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);

    if (!token.trim()) {
      setFieldError(t("errors.tokenRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerConfirm({ token });
      notifySuccess(
        response.message,
        t("successTitle"),
        t("successDescription"),
      );
      setDidConfirm(true);
    } catch (submissionError) {
      notifyError(getFriendlyAuthError(submissionError, "registerConfirm"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
      <AuthFormShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      footer={
        <div className="text-sm text-white/65">
          <Link href="/login" className="transition-opacity hover:opacity-100">
            {t("returnToLogin")}
          </Link>
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {prefilledFromLink && !showManualToken ? (
          <AuthFeedback variant="info">
            {t("linkDetected")}
          </AuthFeedback>
        ) : (
          <AuthField label={t("token")} htmlFor="confirmation-token" error={fieldError}>
            <Input
              id="confirmation-token"
              name="token"
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
                setFieldError(null);
              }}
              placeholder={t("tokenPlaceholder")}
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
            {showManualToken ? t("useLinkToken") : t("useDifferentToken")}
          </button>
        ) : null}
        {prefilledFromLink && showManualToken ? (
          <AuthField label={t("tokenAlt")} htmlFor="confirmation-token-manual" error={fieldError}>
            <Input
              id="confirmation-token-manual"
              name="token-manual"
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
                setFieldError(null);
              }}
              placeholder={t("tokenPlaceholder")}
              aria-invalid={Boolean(fieldError)}
            />
          </AuthField>
        ) : null}
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>
    </AuthFormShell>
  );
}
