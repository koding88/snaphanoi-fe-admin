"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/features/auth/api/login";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getFriendlyAuthError } from "@/features/auth/utils/auth-errors";
import { persistClientSession } from "@/features/auth/utils/auth-storage";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = await login({ email, password });
      persistClientSession(payload.accessToken);
      setAuthenticated(payload);

      const nextPath = searchParams.get("next");
      router.replace(nextPath?.startsWith("/") ? nextPath : "/admin");
    } catch (submissionError) {
      setError(getFriendlyAuthError(submissionError, "login"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Login"
      title="Sign into the studio console."
      description="Use your account credentials to enter the admin workspace. Authentication follows the backend JWT plus refresh flow already handed off."
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
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
        <AuthField label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@gmail.com"
            required
          />
        </AuthField>
        <AuthField label="Password" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </AuthField>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
