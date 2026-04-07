"use client";

import { useState, type FormEvent } from "react";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserRecord } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";

type ProfileFormProps = {
  user: UserRecord;
  onSubmit: (payload: { name: string; email: string; countryCode: string }) => Promise<void>;
  successMessage?: string | null;
};

export function ProfileForm({ user, onSubmit, successMessage }: ProfileFormProps) {
  const [values, setValues] = useState({
    name: user.name,
    email: user.email,
    countryCode: user.countryCode ?? "VN",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (submissionError) {
      setError(getFriendlyUsersError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {successMessage ? <AuthFeedback variant="success">{successMessage}</AuthFeedback> : null}
      {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Full name</span>
          <Input
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Email</span>
          <Input
            type="email"
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({ ...current, email: event.target.value }))
            }
            required
          />
        </label>
      </div>
      <label className="space-y-2 block max-w-xs">
        <span className="text-sm font-medium text-foreground">Country code</span>
        <Input
          value={values.countryCode}
          onChange={(event) =>
            setValues((current) => ({ ...current, countryCode: event.target.value.toUpperCase() }))
          }
          required
        />
      </label>
      <div className="flex justify-end">
        <Button type="submit" size="lg" className="rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
