"use client";

import { useState, type FormEvent } from "react";

import { AuthFeedback } from "@/components/auth/auth-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFriendlyRolesError } from "@/features/roles/utils/roles-errors";

type RoleFormProps = {
  initialName?: string;
  submitLabel: string;
  description?: string;
  successMessage?: string | null;
  onSubmit: (payload: { name: string }) => Promise<void>;
};

export function RoleForm({
  initialName = "",
  submitLabel,
  description,
  successMessage,
  onSubmit,
}: RoleFormProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({ name });
    } catch (submissionError) {
      setError(getFriendlyRolesError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}
      {successMessage ? <AuthFeedback variant="success">{successMessage}</AuthFeedback> : null}
      {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
      <label className="block max-w-xl space-y-2">
        <span className="text-sm font-medium text-foreground">Role name</span>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Manager"
          required
        />
      </label>
      <div className="flex justify-end">
        <Button type="submit" size="lg" className="rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
