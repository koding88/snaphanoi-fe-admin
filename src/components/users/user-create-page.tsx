"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BackButton } from "@/components/shared/back-button";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { UserForm, type UserFormValues } from "@/components/users/user-form";
import { createUser } from "@/features/users/api/create-user";
import { listRoleOptions } from "@/features/users/api/list-role-options";
import type { RoleOption } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function UserCreatePage() {
  const t = useTranslations("users.create");
  const router = useRouter();
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const roleResult = await listRoleOptions();
        setRoles(roleResult.items);
      } catch (loadError) {
        setError(getFriendlyUsersError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, []);

  async function handleSubmit(values: UserFormValues) {
    const response = await createUser({
      name: values.name,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber || undefined,
      countryCode: values.countryCode,
      roleId: values.roleId,
    });

    queueNavigationToast({
      intent: "success",
      title: response.message ?? t("toasts.created"),
    });
    router.replace(ROUTES.admin.users.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        meta={
          <BackButton
            href={ROUTES.admin.users.root}
            confirm
            confirmTitle={t("confirm.title")}
            confirmDescription={t("confirm.description")}
            confirmLabel={t("confirm.confirmLabel")}
          />
        }
      />
      {isLoading ? (
        <LoadingState
          title={t("loading.title")}
          description={t("loading.description")}
        />
      ) : error ? (
        <ErrorState title={t("errorTitle")} description={error} />
      ) : (
        <AdminSurface className="p-6 md:p-8">
          <UserForm
            mode="create"
            roles={roles}
            submitLabel={t("submitLabel")}
            description={t("formDescription")}
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
