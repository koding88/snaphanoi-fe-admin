"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { AuthPasswordHint } from "@/components/auth/auth-password-hint";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { isStrongPassword } from "@/features/auth/utils/password-policy";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { notifyError } from "@/lib/toast";

type ChangePasswordFormProps = {
  onSubmit: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => Promise<void>;
};

export function ChangePasswordForm({
  onSubmit,
}: ChangePasswordFormProps) {
  const t = useTranslations("users.changePassword.form");
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmNewPassword?: string;
    } = {};

    if (!values.currentPassword) {
      nextFieldErrors.currentPassword = t("errors.currentRequired");
    }

    if (!values.newPassword) {
      nextFieldErrors.newPassword = t("errors.newRequired");
    } else if (!isStrongPassword(values.newPassword)) {
      nextFieldErrors.newPassword = t("errors.newWeak");
    }

    if (!values.confirmNewPassword) {
      nextFieldErrors.confirmNewPassword = t("errors.confirmRequired");
    } else if (values.newPassword !== values.confirmNewPassword) {
      nextFieldErrors.confirmNewPassword = t("errors.confirmMismatch");
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
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
      notifyError(getFriendlyUsersError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <label className="space-y-2 block">
        <span className="text-sm font-medium text-foreground">{t("fields.current")}</span>
        <PasswordInput
          value={values.currentPassword}
          onChange={(event) => {
            setValues((current) => ({ ...current, currentPassword: event.target.value }));
            setFieldErrors((current) => ({ ...current, currentPassword: undefined }));
          }}
          aria-invalid={Boolean(fieldErrors.currentPassword)}
        />
        {fieldErrors.currentPassword ? <p className="text-sm text-red-600">{fieldErrors.currentPassword}</p> : null}
      </label>
      <label className="space-y-2 block">
        <span className="text-sm font-medium text-foreground">{t("fields.new")}</span>
        <PasswordInput
          value={values.newPassword}
          onChange={(event) => {
            setValues((current) => ({ ...current, newPassword: event.target.value }));
            setFieldErrors((current) => ({ ...current, newPassword: undefined }));
          }}
          aria-invalid={Boolean(fieldErrors.newPassword)}
        />
        {fieldErrors.newPassword ? <p className="text-sm text-red-600">{fieldErrors.newPassword}</p> : null}
        <AuthPasswordHint tone="light" />
      </label>
      <label className="space-y-2 block">
        <span className="text-sm font-medium text-foreground">{t("fields.confirm")}</span>
        <PasswordInput
          value={values.confirmNewPassword}
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              confirmNewPassword: event.target.value,
            }));
            setFieldErrors((current) => ({ ...current, confirmNewPassword: undefined }));
          }}
          aria-invalid={Boolean(fieldErrors.confirmNewPassword)}
        />
        {fieldErrors.confirmNewPassword ? <p className="text-sm text-red-600">{fieldErrors.confirmNewPassword}</p> : null}
      </label>
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="min-w-44 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? t("actions.updating") : t("actions.submit")}
        </Button>
      </div>
    </form>
  );
}
