"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthPasswordHint } from "@/components/auth/auth-password-hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword } from "@/features/auth/api/reset-password";
import { clearAuthClientState } from "@/features/auth/utils/auth-client-state";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";
import { isStrongPassword } from "@/features/auth/utils/password-policy";
import { ROUTES } from "@/lib/constants/routes";
import { notifyError, notifySuccess } from "@/lib/toast";

export function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    token: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [prefilledFromLink, setPrefilledFromLink] = useState(false);
  const [showManualToken, setShowManualToken] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    token?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});
  const [didReset, setDidReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (tokenFromQuery) {
      setForm((current) => ({ ...current, token: tokenFromQuery }));
      setPrefilledFromLink(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!didReset) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.replace(ROUTES.login);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [didReset, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors: {
      token?: string;
      newPassword?: string;
      confirmNewPassword?: string;
    } = {};

    if (!form.token.trim()) {
      nextFieldErrors.token = t("errors.tokenRequired");
    }

    if (!form.newPassword) {
      nextFieldErrors.newPassword = t("errors.newPasswordRequired");
    } else if (!isStrongPassword(form.newPassword)) {
      nextFieldErrors.newPassword = t("errors.newPasswordWeak");
    }

    if (!form.confirmNewPassword) {
      nextFieldErrors.confirmNewPassword = t("errors.confirmRequired");
    } else if (form.newPassword !== form.confirmNewPassword) {
      nextFieldErrors.confirmNewPassword = t("errors.confirmMismatch");
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword(form);
      clearAuthClientState({ reason: "reset_password_success" });
      notifySuccess(
        response.message,
        t("successTitle"),
        t("successDescription"),
      );
      setDidReset(true);
    } catch (submissionError) {
      notifyError(getFriendlyAuthError(submissionError, "resetPassword"));
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
            {t("backToLogin")}
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
          <AuthField
            label={t("token")}
            htmlFor="reset-token"
            error={fieldErrors.token ?? null}
          >
            <Input
              id="reset-token"
              name="token"
              value={form.token}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  token: event.target.value,
                }));
                setFieldErrors((current) => ({ ...current, token: undefined }));
              }}
              placeholder={t("tokenPlaceholder")}
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
            {showManualToken
              ? t("useLinkToken")
              : t("useDifferentToken")}
          </button>
        ) : null}
        {prefilledFromLink && showManualToken ? (
          <AuthField
            label={t("differentToken")}
            htmlFor="reset-token-manual"
            error={fieldErrors.token ?? null}
          >
            <Input
              id="reset-token-manual"
              name="token-manual"
              value={form.token}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  token: event.target.value,
                }));
                setFieldErrors((current) => ({ ...current, token: undefined }));
              }}
              placeholder={t("tokenPlaceholder")}
              aria-invalid={Boolean(fieldErrors.token)}
            />
          </AuthField>
        ) : null}
        <AuthField
          label={t("newPassword")}
          htmlFor="new-password"
          error={fieldErrors.newPassword ?? null}
        >
          <PasswordInput
            id="new-password"
            name="newPassword"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                newPassword: event.target.value,
              }));
              setFieldErrors((current) => ({
                ...current,
                newPassword: undefined,
              }));
            }}
            placeholder="NewPassword123A"
            aria-invalid={Boolean(fieldErrors.newPassword)}
          />
          <AuthPasswordHint />
        </AuthField>
        <AuthField
          label={t("confirmPassword")}
          htmlFor="confirm-new-password"
          error={fieldErrors.confirmNewPassword ?? null}
        >
          <PasswordInput
            id="confirm-new-password"
            name="confirmNewPassword"
            autoComplete="new-password"
            value={form.confirmNewPassword}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                confirmNewPassword: event.target.value,
              }));
              setFieldErrors((current) => ({
                ...current,
                confirmNewPassword: undefined,
              }));
            }}
            placeholder="NewPassword123A"
            aria-invalid={Boolean(fieldErrors.confirmNewPassword)}
          />
        </AuthField>
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>
    </AuthFormShell>
  );
}
