"use client";

import { useState, type FormEvent } from "react";

import { AuthPasswordHint } from "@/components/auth/auth-password-hint";
import { AuthFeedback } from "@/components/auth/auth-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    countryCode: initialValues?.countryCode ?? "VN",
    roleId: initialValues?.roleId ?? roles[0]?.id ?? "",
    isActive: initialValues?.isActive ?? true,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === "create" && !isStrongPassword(values.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
      );
      return;
    }

    if (mode === "edit" && values.password && !isStrongPassword(values.password)) {
      setError(
        "If you provide a new password, it must be at least 8 characters and include uppercase, lowercase, and a number.",
      );
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}
      {successMessage ? <AuthFeedback variant="success">{successMessage}</AuthFeedback> : null}
      {error ? <AuthFeedback variant="error">{error}</AuthFeedback> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Full name</span>
          <Input
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            placeholder="Nguyen Van A"
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
            placeholder="user@gmail.com"
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            {mode === "create" ? "Password" : "New password"}
          </span>
          <Input
            type="password"
            value={values.password}
            onChange={(event) =>
              setValues((current) => ({ ...current, password: event.target.value }))
            }
            placeholder={mode === "create" ? "MySecurePass1" : "Leave blank to keep current password"}
            required={mode === "create"}
          />
          <AuthPasswordHint />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Country code</span>
          <Input
            value={values.countryCode}
            onChange={(event) =>
              setValues((current) => ({ ...current, countryCode: event.target.value.toUpperCase() }))
            }
            placeholder="VN"
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Role</span>
          <select
            value={values.roleId}
            onChange={(event) =>
              setValues((current) => ({ ...current, roleId: event.target.value }))
            }
            className="flex h-12 w-full rounded-2xl border border-border/80 bg-background/92 px-4 text-sm text-foreground outline-none transition-colors focus:border-[--color-brand]/40 focus:ring-3 focus:ring-[--color-brand]/12"
            required
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </label>
        {mode === "edit" ? (
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Status</span>
            <select
              value={String(values.isActive)}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  isActive: event.target.value === "true",
                }))
              }
              className="flex h-12 w-full rounded-2xl border border-border/80 bg-background/92 px-4 text-sm text-foreground outline-none transition-colors focus:border-[--color-brand]/40 focus:ring-3 focus:ring-[--color-brand]/12"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>
        ) : null}
      </div>
      <div className="flex justify-end">
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
    countryCode: user.countryCode ?? "VN",
    roleId: user.roleId ?? "",
    isActive: user.isActive,
    password: "",
  };
}
