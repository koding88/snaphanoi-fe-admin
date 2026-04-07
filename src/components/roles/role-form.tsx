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
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldError(null);

    if (!name.trim()) {
      setFieldError("Role name is required.");
      return;
    }

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
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}
      {successMessage ? <AuthFeedback variant="success">{successMessage}</AuthFeedback> : null}
      {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
      <label className="block max-w-xl space-y-2">
        <span className="text-sm font-medium text-foreground">Role name</span>
        <Input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setFieldError(null);
          }}
          placeholder="Manager"
          aria-invalid={Boolean(fieldError)}
        />
        {fieldError ? <p className="text-sm text-red-600">{fieldError}</p> : null}
      </label>
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="min-w-40 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
