"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { RoleForm } from "@/components/roles/role-form";
import { getRole } from "@/features/roles/api/get-role";
import { updateRole } from "@/features/roles/api/update-role";
import type { RoleRecord } from "@/features/roles/types/roles.types";
import { getFriendlyRolesError } from "@/features/roles/utils/roles-errors";
import { ROUTES } from "@/lib/constants/routes";

export function RoleEditPage({ id }: { id: string }) {
  const router = useRouter();
  const [role, setRole] = useState<RoleRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      setIsLoading(true);
      try {
        const roleResult = await getRole(id);
        setRole(roleResult);
      } catch (loadError) {
        setError(getFriendlyRolesError(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, [id]);

  async function handleSubmit(payload: { name: string }) {
    const updated = await updateRole(id, payload);
    router.replace(ROUTES.admin.roles.detail(updated.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Edit role"
        title="Update a role definition."
        description="The current backend update-role contract only accepts a role name change."
      />
      {isLoading ? (
        <LoadingState title="Loading role" description="Fetching the current role record." />
      ) : error || !role ? (
        <ErrorState title="Unable to load this role" description={error ?? "Role not found."} />
      ) : (
        <AdminSurface className="p-6 md:p-8">
          <RoleForm
            initialName={role.name}
            submitLabel="Save changes"
            description="Role key and usage counts are backend-managed and shown on the detail page."
            onSubmit={handleSubmit}
          />
        </AdminSurface>
      )}
    </AdminPageContainer>
  );
}
