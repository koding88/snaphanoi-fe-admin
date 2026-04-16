"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFriendlyRolesError } from "@/features/roles/utils/roles-errors";
import { notifyError } from "@/lib/toast";

type RoleFormProps = {
  initialName?: string;
  submitLabel: string;
  description?: string;
  onSubmit: (payload: { name: string }) => Promise<void>;
};

export function RoleForm({
  initialName = "",
  submitLabel,
  description,
  onSubmit,
}: RoleFormProps) {
  const t = useTranslations("roles.form");
  const [name, setName] = useState(initialName);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);

    if (!name.trim()) {
      setFieldError(t("errors.nameRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ name });
    } catch (submissionError) {
      notifyError(getFriendlyRolesError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}
      <label className="block max-w-xl space-y-2">
        <span className="text-sm font-medium text-foreground">{t("fields.name")}</span>
        <Input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setFieldError(null);
          }}
          placeholder={t("fields.placeholder")}
          aria-invalid={Boolean(fieldError)}
        />
        {fieldError ? <p className="text-sm text-red-600">{fieldError}</p> : null}
      </label>
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="min-w-40 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? t("actions.saving") : submitLabel}
        </Button>
      </div>
    </form>
  );
}
