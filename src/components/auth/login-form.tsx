"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

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
        "Password updated successfully.",
        "Password updated successfully.",
        "Please sign in again with your new password.",
      );
      router.replace(ROUTES.login);
    }
  }, [router, searchParams]);

  function validateFields() {
    const nextErrors: LoginFieldErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
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
      eyebrow="Login"
      title="Sign into the studio console."
      description="Sign in to manage clients, team access, and the studio workflow from one calm control room."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/65">
          <Link href="/forgot-password" className="transition-opacity hover:opacity-100">
            Forgot password?
          </Link>
          <Link href="/register" className="transition-opacity hover:opacity-100">
            Need a new registration request?
          </Link>
        </div>
      }
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <AuthField label="Email" htmlFor="email" error={fieldErrors.email ?? null}>
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
        <AuthField label="Password" htmlFor="password" error={fieldErrors.password ?? null}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setFieldErrors((current) => ({ ...current, password: undefined }));
            }}
            placeholder="Enter your password"
            aria-invalid={Boolean(fieldErrors.password)}
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Enter workspace"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
