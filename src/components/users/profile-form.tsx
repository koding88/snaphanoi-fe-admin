"use client";

import { useState, type FormEvent } from "react";

import { CountrySelect } from "@/components/shared/country-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserRecord } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { DEFAULT_COUNTRY_CODE } from "@/lib/constants/countries";
import { notifyError } from "@/lib/toast";

type ProfileFormProps = {
  user: UserRecord;
  onSubmit: (payload: { name: string; email: string; countryCode: string }) => Promise<void>;
};

export function ProfileForm({ user, onSubmit }: ProfileFormProps) {
  const [values, setValues] = useState({
    name: user.name,
    email: user.email,
    countryCode: user.countryCode ?? DEFAULT_COUNTRY_CODE,
  });
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors: { name?: string; email?: string } = {};

    if (!values.name.trim()) {
      nextFieldErrors.name = "Full name is required.";
    }

    if (!values.email.trim()) {
      nextFieldErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(values.email.trim())) {
      nextFieldErrors.email = "Enter a valid email address.";
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (submissionError) {
      notifyError(getFriendlyUsersError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Full name</span>
          <Input
            value={values.name}
            onChange={(event) => {
              setValues((current) => ({ ...current, name: event.target.value }));
              setFieldErrors((current) => ({ ...current, name: undefined }));
            }}
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name ? <p className="text-sm text-red-600">{fieldErrors.name}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Email</span>
          <Input
            type="email"
            value={values.email}
            onChange={(event) => {
              setValues((current) => ({ ...current, email: event.target.value }));
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? <p className="text-sm text-red-600">{fieldErrors.email}</p> : null}
        </label>
      </div>
      <label className="space-y-2 block max-w-xs">
        <span className="text-sm font-medium text-foreground">Country</span>
        <CountrySelect
          value={values.countryCode}
          onChange={(countryCode) =>
            setValues((current) => ({ ...current, countryCode }))
          }
        />
      </label>
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="min-w-44 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
