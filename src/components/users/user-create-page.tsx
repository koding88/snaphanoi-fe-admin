"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { UserForm, type UserFormValues } from "@/components/users/user-form";
import { createUser } from "@/features/users/api/create-user";
import { listRoleOptions } from "@/features/users/api/list-role-options";
import type { RoleOption } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { ROUTES } from "@/lib/constants/routes";

export function UserCreatePage() {
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
      countryCode: values.countryCode,
      roleId: values.roleId,
    });

    router.replace(ROUTES.admin.users.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Create user"
        title="Add a new team member."
        description="Create a new studio account with the right role, location, and a first-time password."
      />
      {isLoading ? (
        <LoadingState
          title="Preparing form"
          description="Loading available role options for user creation."
        />
      ) : error ? (
        <ErrorState title="Unable to prepare user form" description={error} />
      ) : (
        <AdminSurface className="p-6 md:p-8">
          <UserForm
            mode="create"
            roles={roles}
            submitLabel="Create account"
            description="Choose a role and country, then set a first-time password for this account."
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
