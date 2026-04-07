"use client";

import { useState, type FormEvent } from "react";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { AuthPasswordHint } from "@/components/auth/auth-password-hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isStrongPassword } from "@/features/auth/utils/password-policy";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";

type ChangePasswordFormProps = {
  onSubmit: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => Promise<void>;
  successMessage?: string | null;
};

export function ChangePasswordForm({
  onSubmit,
  successMessage,
}: ChangePasswordFormProps) {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isStrongPassword(values.newPassword)) {
      setError(
        "New password must be at least 8 characters and include uppercase, lowercase, and a number.",
      );
      return;
    }

    if (values.newPassword !== values.confirmNewPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
      setValues({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (submissionError) {
      setError(getFriendlyUsersError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {successMessage ? <AuthFeedback variant="success">{successMessage}</AuthFeedback> : null}
      {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
      <label className="space-y-2 block">
        <span className="text-sm font-medium text-foreground">Current password</span>
        <Input
          type="password"
          value={values.currentPassword}
          onChange={(event) =>
            setValues((current) => ({ ...current, currentPassword: event.target.value }))
          }
          required
        />
      </label>
      <label className="space-y-2 block">
        <span className="text-sm font-medium text-foreground">New password</span>
        <Input
          type="password"
          value={values.newPassword}
          onChange={(event) =>
            setValues((current) => ({ ...current, newPassword: event.target.value }))
          }
          required
        />
        <AuthPasswordHint />
      </label>
      <label className="space-y-2 block">
        <span className="text-sm font-medium text-foreground">Confirm new password</span>
        <Input
          type="password"
          value={values.confirmNewPassword}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              confirmNewPassword: event.target.value,
            }))
          }
          required
        />
      </label>
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="min-w-44 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Change password"}
        </Button>
      </div>
    </form>
  );
}
