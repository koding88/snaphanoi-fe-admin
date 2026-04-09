"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

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
      nextErrors.name = "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (!isStrongPassword(form.password)) {
      nextErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
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
        "Registration request submitted.",
        "Check your email for the confirmation link.",
      );
    } catch (submissionError) {
      notifyError(getFriendlyAuthError(submissionError, "register"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Register"
      title="Request studio access."
      description="We will create a pending registration request and send a confirmation link to your email before the account becomes active."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/65">
          <span>Registration does not create a usable account immediately.</span>
          <Link href="/login" className="transition-opacity hover:opacity-100">
            Back to login
          </Link>
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <AuthField label="Full name" htmlFor="name" error={fieldErrors.name ?? null}>
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
        <AuthField label="Email" htmlFor="register-email" error={fieldErrors.email ?? null}>
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
        <AuthField label="Password" htmlFor="register-password" error={fieldErrors.password ?? null}>
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
        <AuthField label="Country" htmlFor="countryCode" hint="Search by name">
          <CountrySelect
            id="countryCode"
            value={form.countryCode}
            onChange={(countryCode) => setForm((current) => ({ ...current, countryCode }))}
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Send confirmation link"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
