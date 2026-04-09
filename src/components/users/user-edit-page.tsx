"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BackButton } from "@/components/shared/back-button";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { UserForm, getUserFormInitialValues, type UserFormValues } from "@/components/users/user-form";
import { getUser } from "@/features/users/api/get-user";
import { listRoleOptions } from "@/features/users/api/list-role-options";
import { updateUser } from "@/features/users/api/update-user";
import type { RoleOption, UserRecord } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function UserEditPage({ id }: { id: string }) {
  const router = useRouter();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      setIsLoading(true);
      try {
        const [userResult, roleResult] = await Promise.all([getUser(id), listRoleOptions()]);
        setUser(userResult);
        setRoles(roleResult.items);
      } catch (loadError) {
        setError(getFriendlyUsersError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, [id]);

  async function handleSubmit(values: UserFormValues) {
    const response = await updateUser(id, {
      name: values.name,
      email: values.email,
      password: values.password || undefined,
      countryCode: values.countryCode,
      roleId: values.roleId,
      isActive: values.isActive,
    });

    queueNavigationToast({
      intent: "success",
      title: response.message ?? "User updated successfully.",
    });
    router.replace(ROUTES.admin.users.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Edit user"
        title="Update account details."
        description="Adjust role, availability, profile details, or replace the password when needed."
        meta={
          <BackButton
            href={ROUTES.admin.users.detail(id)}
            confirm
            confirmTitle="Discard these changes?"
            confirmDescription="Any modifications will be lost."
            confirmLabel="Discard"
          />
        }
      />
      {isLoading ? (
        <LoadingState title="Loading user" description="Fetching the current user record and role options." />
      ) : error || !user ? (
        <ErrorState title="Unable to load this user" description={error ?? "User not found."} />
      ) : (
        <AdminSurface className="p-6 md:p-8">
          <UserForm
            mode="edit"
            roles={roles}
            initialValues={getUserFormInitialValues(user)}
            submitLabel="Save changes"
            description="Leave the password field empty if the current password should stay in place."
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
