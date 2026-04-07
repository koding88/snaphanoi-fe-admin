"use client";

import { useState, type FormEvent } from "react";

import { AuthPasswordHint } from "@/components/auth/auth-password-hint";
import { AuthFeedback } from "@/components/auth/auth-feedback";
import { CountrySelect } from "@/components/shared/country-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AppSelect } from "@/components/ui/select";
import { DEFAULT_COUNTRY_CODE } from "@/lib/constants/countries";
import type { RoleOption, UserRecord } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { isStrongPassword } from "@/features/auth/utils/password-policy";

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  countryCode: string;
  roleId: string;
  isActive: boolean;
};

type UserFormProps = {
  mode: "create" | "edit";
  roles: RoleOption[];
  initialValues?: Partial<UserFormValues>;
  submitLabel: string;
  description?: string;
  onSubmit: (values: UserFormValues) => Promise<void>;
  successMessage?: string | null;
};

export function UserForm({
  mode,
  roles,
  initialValues,
  submitLabel,
  description,
  onSubmit,
  successMessage,
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({
    name: initialValues?.name ?? "",
    email: initialValues?.email ?? "",
    password: initialValues?.password ?? "",
    countryCode: initialValues?.countryCode ?? DEFAULT_COUNTRY_CODE,
    roleId: initialValues?.roleId ?? roles[0]?.id ?? "",
    isActive: initialValues?.isActive ?? true,
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const nextFieldErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (!values.name.trim()) {
      nextFieldErrors.name = "Full name is required.";
    }

    if (!values.email.trim()) {
      nextFieldErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(values.email.trim())) {
      nextFieldErrors.email = "Enter a valid email address.";
    }

    if (mode === "create") {
      if (!values.password) {
        nextFieldErrors.password = "Password is required.";
      } else if (!isStrongPassword(values.password)) {
        nextFieldErrors.password =
          "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
      }
    }

    if (mode === "edit" && values.password && !isStrongPassword(values.password)) {
      nextFieldErrors.password =
        "If you provide a new password, it must be at least 8 characters and include uppercase, lowercase, and a number.";
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

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
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}
      {successMessage ? <AuthFeedback variant="success">{successMessage}</AuthFeedback> : null}
      {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Full name</span>
          <Input
            value={values.name}
            onChange={(event) => {
              setValues((current) => ({ ...current, name: event.target.value }));
              setFieldErrors((current) => ({ ...current, name: undefined }));
            }}
            placeholder="Nguyen Van A"
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
            placeholder="user@gmail.com"
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? <p className="text-sm text-red-600">{fieldErrors.email}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            {mode === "create" ? "Password" : "New password"}
          </span>
          <PasswordInput
            value={values.password}
            onChange={(event) =>
              {
                setValues((current) => ({ ...current, password: event.target.value }));
                setFieldErrors((current) => ({ ...current, password: undefined }));
              }
            }
            placeholder={mode === "create" ? "MySecurePass1" : "Leave blank to keep current password"}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          {fieldErrors.password ? <p className="text-sm text-red-600">{fieldErrors.password}</p> : null}
          <AuthPasswordHint tone="light" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Country</span>
          <CountrySelect
            value={values.countryCode}
            onChange={(countryCode) =>
              setValues((current) => ({ ...current, countryCode }))
            }
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Role</span>
          <AppSelect
            value={values.roleId}
            onChange={(roleId) => setValues((current) => ({ ...current, roleId }))}
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
              description: role.isSystem ? "System role" : "Custom role",
            }))}
            placeholder="Choose a role"
          />
        </label>
        {mode === "edit" ? (
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Status</span>
            <AppSelect
              value={String(values.isActive)}
              onChange={(statusValue) =>
                setValues((current) => ({
                  ...current,
                  isActive: statusValue === "true",
                }))
              }
              options={[
                { value: "true", label: "Active", description: "Can sign in and use the app" },
                { value: "false", label: "Inactive", description: "Kept on record but cannot sign in" },
              ]}
            />
          </label>
        ) : null}
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="min-w-44 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function getUserFormInitialValues(user: UserRecord): Partial<UserFormValues> {
  return {
    name: user.name,
    email: user.email,
    countryCode: user.countryCode ?? DEFAULT_COUNTRY_CODE,
    roleId: user.roleId ?? "",
    isActive: user.isActive,
    password: "",
  };
}
