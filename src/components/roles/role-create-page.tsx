"use client";

import { useRouter } from "next/navigation";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { PageHeader } from "@/components/shared/page-header";
import { RoleForm } from "@/components/roles/role-form";
import { createRole } from "@/features/roles/api/create-role";
import { ROUTES } from "@/lib/constants/routes";

export function RoleCreatePage() {
  const router = useRouter();

  async function handleSubmit(payload: { name: string }) {
    const role = await createRole(payload);
    router.replace(ROUTES.admin.roles.detail(role.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Create role"
        title="Add a new role."
        description="Create-role currently accepts only the role name. The backend generates and returns the role key."
      />
      <AdminSurface className="p-6 md:p-8">
        <RoleForm
          submitLabel="Create role"
          description="Duplicate role names return a backend conflict and are surfaced inline."
          onSubmit={handleSubmit}
        />
      </AdminSurface>
    </AdminPageContainer>
  );
}
