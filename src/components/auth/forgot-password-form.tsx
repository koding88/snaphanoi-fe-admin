"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/features/auth/api/forgot-password";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";
import { notifyError, notifySuccess } from "@/lib/toast";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);

    if (!email.trim()) {
      setFieldError(t("errors.emailRequired"));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setFieldError(t("errors.emailInvalid"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await forgotPassword({ email });
      notifySuccess(
        response.message,
        t("successTitle"),
        t("successDescription"),
      );
    } catch (submissionError) {
      notifyError(getFriendlyAuthError(submissionError, "forgotPassword"));
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
        <AuthField label={t("email")} htmlFor="forgot-email" error={fieldError}>
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
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>
    </AuthFormShell>
  );
}
