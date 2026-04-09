"use client";

import { useRouter } from "next/navigation";

import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminSurface } from "@/components/admin/admin-surface";
import { BackButton } from "@/components/shared/back-button";
import { PageHeader } from "@/components/shared/page-header";
import { RoleForm } from "@/components/roles/role-form";
import { createRole } from "@/features/roles/api/create-role";
import { ROUTES } from "@/lib/constants/routes";
import { queueNavigationToast } from "@/lib/toast";

export function RoleCreatePage() {
  const router = useRouter();

  async function handleSubmit(payload: { name: string }) {
    const response = await createRole(payload);
    queueNavigationToast({
      intent: "success",
      title: response.message ?? "Role created successfully.",
    });
    router.replace(ROUTES.admin.roles.detail(response.data.id));
  }

  return (
    <AdminPageContainer tone="hero" className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Create role"
        title="Create a new role."
        description="Define a clear role name for your studio team."
        meta={
          <BackButton
            href={ROUTES.admin.roles.root}
            confirm
            confirmTitle="Discard this new role?"
            confirmDescription="The form will be cleared and you will return to the role list."
            confirmLabel="Discard"
          />
        }
      />
      <AdminSurface className="p-6 md:p-8">
        <RoleForm
          submitLabel="Create role"
          description="Use role names that are easy to understand at a glance."
          onSubmit={handleSubmit}
        />
      </AdminSurface>
    </AdminPageContainer>
  );
}
