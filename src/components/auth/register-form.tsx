"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthPasswordHint } from "@/components/auth/auth-password-hint";
import { CountrySelect } from "@/components/shared/country-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { register } from "@/features/auth/api/register";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";
import { isStrongPassword } from "@/features/auth/utils/password-policy";
import { DEFAULT_COUNTRY_CODE } from "@/lib/constants/countries";
import { notifyError, notifySuccess } from "@/lib/toast";

type RegisterFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    countryCode: DEFAULT_COUNTRY_CODE,
  });
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateFields() {
    const nextErrors: RegisterFieldErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = t("errors.nameRequired");
    }

    if (!form.email.trim()) {
      nextErrors.email = t("errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      nextErrors.email = t("errors.emailInvalid");
    }

    if (!form.password) {
      nextErrors.password = t("errors.passwordRequired");
    } else if (!isStrongPassword(form.password)) {
      nextErrors.password = t("errors.passwordWeak");
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors = validateFields();
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register(form);
      notifySuccess(
        response.message,
        t("successTitle"),
        t("successDescription"),
      );
    } catch (submissionError) {
      notifyError(getFriendlyAuthError(submissionError, "register"));
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
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/65">
          <span>{t("footer")}</span>
          <Link href="/login" className="transition-opacity hover:opacity-100">
            {t("backToLogin")}
          </Link>
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <AuthField label={t("fullName")} htmlFor="name" error={fieldErrors.name ?? null}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => {
              setForm((current) => ({ ...current, name: event.target.value }));
              setFieldErrors((current) => ({ ...current, name: undefined }));
            }}
            placeholder="Nguyen Van C"
            aria-invalid={Boolean(fieldErrors.name)}
          />
        </AuthField>
        <AuthField label={t("email")} htmlFor="register-email" error={fieldErrors.email ?? null}>
          <Input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => {
              setForm((current) => ({ ...current, email: event.target.value }));
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }}
            placeholder="newuser@gmail.com"
            aria-invalid={Boolean(fieldErrors.email)}
          />
        </AuthField>
        <AuthField label={t("password")} htmlFor="register-password" error={fieldErrors.password ?? null}>
          <PasswordInput
            id="register-password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) =>
              {
                setForm((current) => ({ ...current, password: event.target.value }));
                setFieldErrors((current) => ({ ...current, password: undefined }));
              }
            }
            placeholder="Password123A"
            aria-invalid={Boolean(fieldErrors.password)}
          />
          <AuthPasswordHint />
        </AuthField>
        <AuthField label={t("country")} htmlFor="countryCode" hint={t("countryHint")}>
          <CountrySelect
            id="countryCode"
            value={form.countryCode}
            onChange={(countryCode) => setForm((current) => ({ ...current, countryCode }))}
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>
    </AuthFormShell>
  );
}
