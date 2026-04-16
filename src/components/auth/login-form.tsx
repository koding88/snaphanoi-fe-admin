"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/features/auth/api/login";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";
import { persistClientSession } from "@/features/auth/utils/auth-storage";
import { ROUTES } from "@/lib/constants/routes";
import { notifyError, notifySuccess } from "@/lib/toast";

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get("passwordChanged") === "1") {
      notifySuccess(
        t("passwordChangedTitle"),
        t("passwordChangedTitle"),
        t("passwordChangedDescription"),
      );
      router.replace(ROUTES.login);
    }
  }, [router, searchParams, t]);

  function validateFields() {
    const nextErrors: LoginFieldErrors = {};

    if (!email.trim()) {
      nextErrors.email = t("errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      nextErrors.email = t("errors.emailInvalid");
    }

    if (!password) {
      nextErrors.password = t("errors.passwordRequired");
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
      const payload = await login({ email, password });
      persistClientSession(payload);
      setAuthenticated(payload);

      const nextPath = searchParams.get("next");
      router.replace(nextPath?.startsWith("/") ? nextPath : "/admin");
    } catch (submissionError) {
      notifyError(getFriendlyAuthError(submissionError, "login"));
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
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/65">
          <Link href="/forgot-password" className="transition-opacity hover:opacity-100">
            {t("forgotPassword")}
          </Link>
          {/*
          <Link href="/register" className="transition-opacity hover:opacity-100">
            Need a new registration request?
          </Link>
          */}
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <AuthField label={t("email")} htmlFor="email" error={fieldErrors.email ?? null}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }}
            placeholder="admin@gmail.com"
            aria-invalid={Boolean(fieldErrors.email)}
          />
        </AuthField>
        <AuthField label={t("password")} htmlFor="password" error={fieldErrors.password ?? null}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setFieldErrors((current) => ({ ...current, password: undefined }));
            }}
            placeholder={t("passwordPlaceholder")}
            aria-invalid={Boolean(fieldErrors.password)}
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>
    </AuthFormShell>
  );
}
