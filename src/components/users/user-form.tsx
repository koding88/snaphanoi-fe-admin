"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { AuthPasswordHint } from "@/components/auth/auth-password-hint";
import { CountrySelect } from "@/components/shared/country-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AppSelect } from "@/components/ui/select";
import { DEFAULT_COUNTRY_CODE } from "@/lib/constants/countries";
import { normalizePhoneNumber } from "@/lib/phone-number";
import { notifyError } from "@/lib/toast";
import type { RoleOption, UserRecord } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { isStrongPassword } from "@/features/auth/utils/password-policy";

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
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
};

export function UserForm({
  mode,
  roles,
  initialValues,
  submitLabel,
  description,
  onSubmit,
}: UserFormProps) {
  const t = useTranslations("users.form");
  const [values, setValues] = useState<UserFormValues>({
    name: initialValues?.name ?? "",
    email: initialValues?.email ?? "",
    password: initialValues?.password ?? "",
    phoneNumber: initialValues?.phoneNumber ?? "",
    countryCode: initialValues?.countryCode ?? DEFAULT_COUNTRY_CODE,
    roleId: initialValues?.roleId ?? roles[0]?.id ?? "",
    isActive: initialValues?.isActive ?? true,
  });
  const initialPhoneNumber = initialValues?.phoneNumber?.trim() ?? "";
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors: {
      name?: string;
      email?: string;
      password?: string;
      phoneNumber?: string;
    } = {};
    const trimmedPhoneNumber = values.phoneNumber.trim();
    const normalizedPhoneNumber = trimmedPhoneNumber
      ? normalizePhoneNumber(trimmedPhoneNumber, values.countryCode)
      : null;

    if (!values.name.trim()) {
      nextFieldErrors.name = t("errors.nameRequired");
    }

    if (!values.email.trim()) {
      nextFieldErrors.email = t("errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(values.email.trim())) {
      nextFieldErrors.email = t("errors.emailInvalid");
    }

    if (mode === "create") {
      if (!values.password) {
        nextFieldErrors.password = t("errors.passwordRequired");
      } else if (!isStrongPassword(values.password)) {
        nextFieldErrors.password = t("errors.passwordWeak");
      }
    }

    if (mode === "edit" && values.password && !isStrongPassword(values.password)) {
      nextFieldErrors.password = t("errors.passwordWeakEdit");
    }

    if (trimmedPhoneNumber && !normalizedPhoneNumber) {
      nextFieldErrors.phoneNumber = t("errors.phoneNumberInvalid");
    }

    if (mode === "edit" && initialPhoneNumber && !trimmedPhoneNumber) {
      nextFieldErrors.phoneNumber = t("errors.phoneNumberClearUnsupported");
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...values,
        phoneNumber: normalizedPhoneNumber ?? "",
      });
    } catch (submissionError) {
      notifyError(getFriendlyUsersError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">{t("fields.fullName")}</span>
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
          <span className="text-sm font-medium text-foreground">{t("fields.email")}</span>
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
            {mode === "create" ? t("fields.password") : t("fields.newPassword")}
          </span>
          <PasswordInput
            value={values.password}
            onChange={(event) =>
              {
                setValues((current) => ({ ...current, password: event.target.value }));
                setFieldErrors((current) => ({ ...current, password: undefined }));
              }
            }
            placeholder={mode === "create" ? t("fields.passwordPlaceholderCreate") : t("fields.passwordPlaceholderEdit")}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          {fieldErrors.password ? <p className="text-sm text-red-600">{fieldErrors.password}</p> : null}
          <AuthPasswordHint tone="light" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">{t("fields.country")}</span>
          <CountrySelect
            value={values.countryCode}
            onChange={(countryCode) =>
              setValues((current) => ({ ...current, countryCode }))
            }
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">{t("fields.phoneNumber")}</span>
          <Input
            type="tel"
            value={values.phoneNumber}
            onChange={(event) => {
              setValues((current) => ({ ...current, phoneNumber: event.target.value }));
              setFieldErrors((current) => ({ ...current, phoneNumber: undefined }));
            }}
            onBlur={() => {
              const trimmedPhoneNumber = values.phoneNumber.trim();

              if (!trimmedPhoneNumber) {
                return;
              }

              const normalizedPhoneNumber = normalizePhoneNumber(trimmedPhoneNumber, values.countryCode);

              if (!normalizedPhoneNumber) {
                setFieldErrors((current) => ({
                  ...current,
                  phoneNumber: t("errors.phoneNumberInvalid"),
                }));
                return;
              }

              setValues((current) => ({ ...current, phoneNumber: normalizedPhoneNumber }));
            }}
            placeholder="+84901234567"
            aria-invalid={Boolean(fieldErrors.phoneNumber)}
          />
          {fieldErrors.phoneNumber ? <p className="text-sm text-red-600">{fieldErrors.phoneNumber}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">{t("fields.role")}</span>
          <AppSelect
            value={values.roleId}
            onChange={(roleId) => setValues((current) => ({ ...current, roleId }))}
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
               description: role.isSystem ? t("options.systemRole") : t("options.customRole"),
             }))}
            placeholder={t("fields.rolePlaceholder")}
          />
        </label>
        {mode === "edit" ? (
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">{t("fields.status")}</span>
            <AppSelect
              value={String(values.isActive)}
              onChange={(statusValue) =>
                setValues((current) => ({
                  ...current,
                  isActive: statusValue === "true",
                }))
              }
              options={[
                { value: "true", label: t("options.active"), description: t("options.activeDescription") },
                { value: "false", label: t("options.inactive"), description: t("options.inactiveDescription") },
              ]}
            />
          </label>
        ) : null}
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="min-w-44 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? t("actions.saving") : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function getUserFormInitialValues(user: UserRecord): Partial<UserFormValues> {
  return {
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber ?? "",
    countryCode: user.countryCode ?? DEFAULT_COUNTRY_CODE,
    roleId: user.roleId ?? "",
    isActive: user.isActive,
    password: "",
  };
}
